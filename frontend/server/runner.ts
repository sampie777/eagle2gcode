import { existsSync, promises as fs } from "fs";
import * as path from "path";
import { spawn } from "child_process";
import { env } from "./env";

export type GerberLayerKey =
  | "profile"
  | "traces_top"
  | "traces_bottom"
  | "silkscreen_top"
  | "silkscreen_bottom"
  | "soldermask_top"
  | "soldermask_bottom";

export interface GerberLayerRule {
  key: GerberLayerKey;
  label: string;
  outputFile: string;
  mode: "cutout" | "isolate" | "follow";
  pattern: RegExp;
  eagleExact: RegExp;
  examples: string[];
}

export const GERBER_LAYER_RULES: readonly GerberLayerRule[] = [
  {
    key: "profile",
    label: "Profile",
    outputFile: "traces_profile.gcode",
    mode: "cutout",
    pattern: /^(?:.+[_-])?profile\.(gbr|ger|pho)$/i,
    eagleExact: /^profile\.(gbr|ger|pho)$/i,
    examples: ["profile.gbr", "*_Profile.gbr"],
  },
  {
    key: "traces_top",
    label: "Copper Top",
    outputFile: "traces_top.gcode",
    mode: "isolate",
    pattern: /^(?:.+[_-])?copper_(?:signal_)?top\.(gbr|ger|pho)$/i,
    eagleExact: /^copper_top\.(gbr|ger|pho)$/i,
    examples: ["copper_top.gbr", "*_Copper_Signal_Top.gbr"],
  },
  {
    key: "traces_bottom",
    label: "Copper Bottom",
    outputFile: "traces_bottom.gcode",
    mode: "isolate",
    pattern: /^(?:.+[_-])?copper_(?:signal_)?bot(?:tom)?\.(gbr|ger|pho)$/i,
    eagleExact: /^copper_bottom\.(gbr|ger|pho)$/i,
    examples: ["copper_bottom.gbr", "*_Copper_Signal_Bot.gbr"],
  },
  {
    key: "silkscreen_top",
    label: "Silkscreen Top",
    outputFile: "silkscreen_top.gcode",
    mode: "follow",
    pattern: /^(?:.+[_-])?(?:silkscreen|legend)_top\.(gbr|ger|pho)$/i,
    eagleExact: /^silkscreen_top\.(gbr|ger|pho)$/i,
    examples: ["silkscreen_top.gbr", "*_Legend_Top.gbr"],
  },
  {
    key: "silkscreen_bottom",
    label: "Silkscreen Bottom",
    outputFile: "silkscreen_bottom.gcode",
    mode: "follow",
    pattern: /^(?:.+[_-])?(?:silkscreen|legend)_bot(?:tom)?\.(gbr|ger|pho)$/i,
    eagleExact: /^silkscreen_bottom\.(gbr|ger|pho)$/i,
    examples: ["silkscreen_bottom.gbr", "*_Legend_Bot.gbr"],
  },
  {
    key: "soldermask_top",
    label: "Soldermask Top",
    outputFile: "soldermask_top.gcode",
    mode: "isolate",
    pattern: /^(?:.+[_-])?soldermask_top\.(gbr|ger|pho)$/i,
    eagleExact: /^soldermask_top\.(gbr|ger|pho)$/i,
    examples: ["soldermask_top.gbr", "*_Soldermask_Top.gbr"],
  },
  {
    key: "soldermask_bottom",
    label: "Soldermask Bottom",
    outputFile: "soldermask_bottom.gcode",
    mode: "isolate",
    pattern: /^(?:.+[_-])?soldermask_bot(?:tom)?\.(gbr|ger|pho)$/i,
    eagleExact: /^soldermask_bottom\.(gbr|ger|pho)$/i,
    examples: ["soldermask_bottom.gbr", "*_Soldermask_Bot.gbr"],
  },
] as const;

export interface MatchedGerberFile {
  filename: string;
  layer: GerberLayerKey;
  label: string;
  outputFile: string;
  mode: "cutout" | "isolate" | "follow";
  cadFormat: "eagle" | "altium";
}

export interface DuplicateLayerWarning {
  layer: GerberLayerKey;
  label: string;
  chosen: string;
  ignored: string[];
}

export interface FlatcamRunOptions {
  files: { filename: string; content: string }[];
  cadType?: "eagle" | "altium";
  diaWidth?: number;
  pcbName?: string;
  customScript?: string;
}

export interface FlatcamOutputItem {
  name: string;
  content: string;
}

export interface FlatcamRunResult {
  success: boolean;
  outputs: FlatcamOutputItem[];
  logs: string;
  error?: string;
  matchedFiles?: MatchedGerberFile[];
  unmatchedFiles?: string[];
  warnings?: string[];
}

function escapeTclDoubleQuoted(value: string): string {
  return value.replace(/[\\"$[\]]/g, "\\$&");
}

/**
 * Matches each uploaded Gerber filename independently to its PCB layer so Eagle
 * files (e.g. `copper_top.gbr`) and Altium files (e.g. `PCB1_Copper_Signal_Bot.gbr`)
 * can be freely mixed in the same upload batch.
 *
 * When multiple files match the same layer, defaults to the most recently uploaded
 * file unless `pcbName` or `cadType` is explicitly provided to disambiguate.
 */
export function matchGerberFiles(
  files: { filename: string }[],
  options?: Pick<FlatcamRunOptions, "cadType" | "pcbName">
): {
  matched: MatchedGerberFile[];
  unmatched: string[];
  duplicates: DuplicateLayerWarning[];
} {
  const sanitizedNames = files.map((f) => path.basename(f.filename));
  const pcbPrefix =
    options?.pcbName && options.pcbName.trim()
      ? (options.pcbName.trim().endsWith("_") ? options.pcbName.trim() : `${options.pcbName.trim()}_`).toLowerCase()
      : "";

  const matched: MatchedGerberFile[] = [];
  const duplicates: DuplicateLayerWarning[] = [];
  const usedNames = new Set<string>();
  const ignoredDuplicateNames = new Set<string>();

  for (const rule of GERBER_LAYER_RULES) {
    const candidates = sanitizedNames.filter((name) => rule.pattern.test(name));
    if (candidates.length === 0) continue;

    // Default to the latest uploaded candidate so newly dropped files supersede older ones
    let chosen = candidates[candidates.length - 1];
    if (candidates.length > 1) {
      if (pcbPrefix) {
        const prefixMatches = candidates.filter((name) => name.toLowerCase().startsWith(pcbPrefix));
        if (prefixMatches.length > 0) chosen = prefixMatches[prefixMatches.length - 1];
      } else if (options?.cadType === "eagle") {
        const eagleMatches = candidates.filter((name) => rule.eagleExact.test(name));
        if (eagleMatches.length > 0) chosen = eagleMatches[eagleMatches.length - 1];
      } else if (options?.cadType === "altium") {
        const altiumMatches = candidates.filter((name) => !rule.eagleExact.test(name));
        if (altiumMatches.length > 0) chosen = altiumMatches[altiumMatches.length - 1];
      }

      const ignored = candidates.filter((name) => name !== chosen);
      if (ignored.length > 0) {
        for (const name of ignored) ignoredDuplicateNames.add(name);
        duplicates.push({
          layer: rule.key,
          label: rule.label,
          chosen,
          ignored,
        });
      }
    }

    usedNames.add(chosen);
    matched.push({
      filename: chosen,
      layer: rule.key,
      label: rule.label,
      outputFile: rule.outputFile,
      mode: rule.mode,
      cadFormat: rule.eagleExact.test(chosen) ? "eagle" : "altium",
    });
  }

  const unmatched = sanitizedNames.filter(
    (name) => !usedNames.has(name) && !ignoredDuplicateNames.has(name)
  );
  return { matched, unmatched, duplicates };
}

export function buildFlatcamScript(
  matchedFiles: MatchedGerberFile[],
  inputDir: string,
  outputDir: string,
  diaWidth: number
): string {
  const sections = matchedFiles.map((item) => {
    const inputPath = escapeTclDoubleQuoted(path.join(inputDir, item.filename));
    const outputPath = escapeTclDoubleQuoted(path.join(outputDir, item.outputFile));
    const safeName = escapeTclDoubleQuoted(item.filename);
    const objName = item.layer;

    let body: string;
    if (item.mode === "cutout") {
      body = `    open_gerber "${inputPath}" -outname ${objName}
    cutout ${objName} -dia 0.1 -margin -0.2 -gapsize 0.0 -gaps tb
    cncjob ${objName}_cutout -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode ${objName}_cutout_cnc "${outputPath}"`;
    } else if (item.mode === "follow") {
      body = `    open_gerber "${inputPath}" -follow 1 -outname ${objName}
    follow ${objName} -outname ${objName}.follow
    cncjob ${objName}.follow -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode ${objName}.follow_cnc "${outputPath}"`;
    } else {
      body = `    open_gerber "${inputPath}" -outname ${objName}
    isolate ${objName} -dia ${diaWidth} -passes 1 -overlap 1 -combine 1 -outname ${objName}.iso
    cncjob ${objName}.iso -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode ${objName}.iso_cnc "${outputPath}"`;
    }

    return `# ${item.label} (${item.filename}, ${item.cadFormat})
if {[catch {
${body}
} err]} {
    puts "LAYER_ERROR: ${safeName}: $err"
}`;
  });

  return sections.join("\n\n") + "\n";
}

export function parseLayerErrors(rawLogs: string): Map<string, string> {
  const errors = new Map<string, string>();
  for (const line of rawLogs.split(/\r?\n/)) {
    const match = line.match(/^LAYER_ERROR:\s*([^:]+):\s*(.+)$/);
    if (match) {
      errors.set(match[1].trim(), match[2].trim());
    }
  }
  return errors;
}

export function formatSupportedPatternsHint(): string {
  return GERBER_LAYER_RULES.map((rule) => `  - ${rule.label}: ${rule.examples.join(", ")}`).join("\n");
}

/**
 * Strips Python multiprocessing resource_tracker noise and extracts relevant
 * error or diagnostic lines from FlatCAM logs.
 */
export function extractMeaningfulLogs(rawLogs: string, maxLines = 12): string {
  const rawLines = rawLogs.split(/\r?\n/);
  const filtered: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (line.includes("multiprocessing/resource_tracker.py") && line.includes("leaked semaphore")) {
      // Skip this warning line and the immediate `warnings.warn(` line that follows it
      if (rawLines[i + 1]?.trim().startsWith("warnings.warn(")) {
        i++;
      }
      continue;
    }
    if (line.trim().length > 0) {
      filtered.push(line);
    }
  }

  if (filtered.length === 0) return "";

  const tracebackIdx = filtered.findIndex((line) => line.includes("Traceback (most recent call last)"));
  if (tracebackIdx !== -1) {
    return filtered.slice(tracebackIdx, tracebackIdx + maxLines).join("\n");
  }

  const errorLines = filtered.filter((line) =>
    /(\[ERROR\]|\[ERROR_NOTCL\]|LAYER_ERROR:|error:|exception:|failed|cannot|not found|invalid)/i.test(line)
  );
  if (errorLines.length > 0) {
    return errorLines.slice(-maxLines).join("\n");
  }

  return filtered.slice(-maxLines).join("\n");
}

/**
 * Executes a headless FlatCAM Evo run with the provided files and script.
 */
export async function executeFlatcam(options: FlatcamRunOptions): Promise<FlatcamRunResult> {
  if (!options.files || options.files.length === 0) {
    return {
      success: false,
      outputs: [],
      logs: "",
      matchedFiles: [],
      unmatchedFiles: [],
      error: "No Gerber files were provided for FlatCAM processing.",
    };
  }

  const dia = options.diaWidth ?? 0.20188;
  const { matched, unmatched, duplicates } = matchGerberFiles(options.files, {
    cadType: options.cadType,
    pcbName: options.pcbName,
  });

  if (!options.customScript && matched.length === 0) {
    return {
      success: false,
      outputs: [],
      logs: "",
      matchedFiles: [],
      unmatchedFiles: unmatched,
      error:
        `None of the uploaded file(s) matched a supported Gerber layer: ${unmatched.join(", ")}.\n` +
        `Expected filename patterns (Eagle or Altium):\n${formatSupportedPatternsHint()}`,
    };
  }

  const tmpDir = await fs.mkdtemp(path.join("/tmp", "flatcam-job-"));
  const inputDir = path.join(tmpDir, "inputs");
  const outputDir = path.join(tmpDir, "outputs");

  await fs.mkdir(inputDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });

  try {
    // 1. Write all uploaded files to inputDir
    const gerberSubdir = path.join(inputDir, "GerberFiles");
    if (options.customScript) {
      await fs.mkdir(gerberSubdir, { recursive: true });
    }

    for (const f of options.files) {
      const sanitizedName = path.basename(f.filename);
      await fs.writeFile(path.join(inputDir, sanitizedName), f.content, "utf8");

      // Also populate GerberFiles subdirectory for custom Eagle scripts
      if (options.customScript) {
        await fs.writeFile(path.join(gerberSubdir, sanitizedName), f.content, "utf8");
      }
    }

    // 2. Generate or use custom script
    let script = options.customScript;
    if (!script) {
      script = buildFlatcamScript(matched, inputDir, outputDir, dia);
    } else {
      // If a custom script is provided, adapt any output directory paths to outputDir
      script = script.replace(
        /["'][^"']*\/(traces_[^"']+\.gcode|silkscreen_[^"']+\.gcode|soldermask_[^"']+\.gcode)["']/g,
        `"${outputDir}/$1"`
      );
    }

    const scriptPath = path.join(tmpDir, "job.flatscript");
    await fs.writeFile(scriptPath, script, "utf8");

    // 3. Locate flatcam.py executable
    const flatcamBin = env.FLATCAM_BIN;
    const pythonBin = env.PYTHON_BIN;

    console.info(
      `flatcamBin: ${flatcamBin}, pythonBin: ${pythonBin}, matched: [${matched.map((m) => `${m.filename} (${m.cadFormat})->${m.outputFile}`).join(", ")}], unmatched: [${unmatched.join(", ")}], tmpDir: ${tmpDir}`
    );

    if (!existsSync(flatcamBin)) {
      return {
        success: false,
        outputs: [],
        logs: "",
        matchedFiles: matched,
        unmatchedFiles: unmatched,
        error: `FlatCAM binary not found at '${flatcamBin}'. Check the FLATCAM_BIN environment variable.`,
      };
    }

    // 4. Run python flatcam.py --shellfile job.flatscript
    console.info(`Running FlatCAM command: ${pythonBin} ${flatcamBin} --shellfile ${scriptPath}`);
    console.info(`FlatCAM script (${scriptPath}):\n${script.trimEnd()}`);

    const logs: string[] = [];
    const exitCode = await new Promise<number>((resolve) => {
      const proc = spawn(pythonBin, [flatcamBin, "--shellfile", scriptPath], {
        cwd: tmpDir,
        env: {
          ...process.env,
          PYTHONUNBUFFERED: "1",
        },
      });

      proc.stdout.on("data", (data) => logs.push(data.toString()));
      proc.stderr.on("data", (data) => logs.push(data.toString()));
      proc.on("close", (code) => resolve(code ?? 0));
      proc.on("error", (err) => {
        logs.push(`Process spawn error (${pythonBin}): ${err.message}`);
        resolve(1);
      });
    });

    const combinedLogs = logs.join("");
    const meaningfulLogs = extractMeaningfulLogs(combinedLogs);
    const layerErrors = parseLayerErrors(combinedLogs);

    // 5. Read generated G-code files
    const outputFiles = existsSync(outputDir) ? await fs.readdir(outputDir) : [];
    const outputs: FlatcamOutputItem[] = [];

    for (const filename of outputFiles) {
      if (filename.endsWith(".gcode")) {
        const content = await fs.readFile(path.join(outputDir, filename), "utf8");
        outputs.push({ name: filename, content });
      }
    }

    const generatedOutputNames = new Set(outputs.map((o) => o.name));
    const missingExpected = matched.filter((m) => !generatedOutputNames.has(m.outputFile));
    const warnings: string[] = [];

    for (const dup of duplicates) {
      warnings.push(
        `Multiple files matched ${dup.label}; used ${dup.chosen} (ignored ${dup.ignored.join(", ")})`
      );
    }

    if (outputs.length > 0 && missingExpected.length > 0) {
      for (const m of missingExpected) {
        const reason = layerErrors.get(m.filename);
        warnings.push(
          reason
            ? `Skipped ${m.filename} (${reason})`
            : `No G-code was generated for ${m.filename} (expected ${m.outputFile})`
        );
      }
    }

    if (warnings.length > 0) {
      console.warn(`FlatCAM completed with warnings:\n  ${warnings.join("\n  ")}`);
    }

    let error: string | undefined;
    if (exitCode !== 0 && outputs.length === 0) {
      const targetList = matched.map((m) => m.filename).join(", ");
      error = `FlatCAM exited with code ${exitCode}${targetList ? ` while processing: ${targetList}` : ""}.`;
      if (meaningfulLogs) {
        error += `\n\nFlatCAM details:\n${meaningfulLogs}`;
      }
    } else if (outputs.length === 0) {
      const targetList = matched.map((m) => `${m.filename} -> ${m.outputFile}`).join(", ");
      error =
        `FlatCAM finished (exit code 0) but produced no G-code files` +
        (targetList ? ` for: ${targetList}` : "") +
        `. The Gerber layer may be empty or could not be isolated with diaWidth=${dia}.`;
      if (meaningfulLogs) {
        error += `\n\nFlatCAM output:\n${meaningfulLogs}`;
      }
    }

    return {
      success: outputs.length > 0,
      outputs,
      logs: combinedLogs,
      matchedFiles: matched,
      unmatchedFiles: unmatched,
      warnings: warnings.length > 0 ? warnings : undefined,
      error,
    };
  } finally {
    // Clean up temporary workspace
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  }
}
