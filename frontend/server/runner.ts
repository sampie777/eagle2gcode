import { existsSync, promises as fs } from "fs";
import * as path from "path";
import { spawn } from "child_process";

export interface FlatcamRunOptions {
  files: { filename: string; content: string }[];
  cadType: "eagle" | "altium";
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
}

/**
 * Executes a headless FlatCAM Evo run with the provided files and script.
 */
export async function executeFlatcam(options: FlatcamRunOptions): Promise<FlatcamRunResult> {
  const tmpDir = await fs.mkdtemp(path.join("/tmp", "flatcam-job-"));
  const inputDir = path.join(tmpDir, "inputs");
  const outputDir = path.join(tmpDir, "outputs");

  await fs.mkdir(inputDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });

  try {
    // 1. Write all uploaded files to inputDir
    for (const f of options.files) {
      const sanitizedName = path.basename(f.filename);
      // For Eagle projects, place in GerberFiles subdirectory if applicable
      const targetPath = path.join(inputDir, sanitizedName);
      await fs.writeFile(targetPath, f.content, "utf8");

      // Also create GerberFiles subdirectory symlink or copy for standard Eagle scripts
      const gerberSubdir = path.join(inputDir, "GerberFiles");
      await fs.mkdir(gerberSubdir, { recursive: true });
      await fs.writeFile(path.join(gerberSubdir, sanitizedName), f.content, "utf8");
    }

    // 2. Generate or use custom script
    let script = options.customScript;
    const dia = options.diaWidth ?? 0.20188;
    const pcbPrefix = options.pcbName && options.pcbName.trim()
      ? (options.pcbName.trim().endsWith("_") ? options.pcbName.trim() : `${options.pcbName.trim()}_`)
      : "";

    if (!script) {
      if (options.cadType === "altium") {
        script = `
# Open Profile & Cutout
if {[file exists "${inputDir}/${pcbPrefix}Profile.gbr"]} {
    open_gerber "${inputDir}/${pcbPrefix}Profile.gbr" -outname profile
    cutout profile -dia 0.1 -margin -0.2 -gapsize 0.0 -gaps tb
    cncjob profile_cutout -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode profile_cutout_cnc "${outputDir}/traces_profile.gcode"
}

# Copper Top
if {[file exists "${inputDir}/${pcbPrefix}Copper_Signal_Top.gbr"]} {
    open_gerber "${inputDir}/${pcbPrefix}Copper_Signal_Top.gbr" -outname copper_top
    isolate copper_top -dia ${dia} -passes 1 -overlap 1 -combine 1 -outname copper_top.iso
    cncjob copper_top.iso -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode copper_top.iso_cnc "${outputDir}/traces_top.gcode"
}

# Copper Bottom
if {[file exists "${inputDir}/${pcbPrefix}Copper_Signal_Bot.gbr"]} {
    open_gerber "${inputDir}/${pcbPrefix}Copper_Signal_Bot.gbr" -outname copper_bottom
    isolate copper_bottom -dia ${dia} -passes 1 -overlap 1 -combine 1 -outname copper_bottom.iso
    cncjob copper_bottom.iso -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode copper_bottom.iso_cnc "${outputDir}/traces_bottom.gcode"
}

# Silkscreen Top
if {[file exists "${inputDir}/${pcbPrefix}Legend_Top.gbr"]} {
    open_gerber "${inputDir}/${pcbPrefix}Legend_Top.gbr" -follow 1 -outname silkscreen_top
    follow silkscreen_top -outname silkscreen_top.follow
    cncjob silkscreen_top.follow -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode silkscreen_top.follow_cnc "${outputDir}/silkscreen_top.gcode"
}

# Silkscreen Bottom
if {[file exists "${inputDir}/${pcbPrefix}Legend_Bot.gbr"]} {
    open_gerber "${inputDir}/${pcbPrefix}Legend_Bot.gbr" -follow 1 -outname silkscreen_bottom
    follow silkscreen_bottom -outname silkscreen_bottom.follow
    cncjob silkscreen_bottom.follow -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode silkscreen_bottom.follow_cnc "${outputDir}/silkscreen_bottom.gcode"
}

# Soldermask Top
if {[file exists "${inputDir}/${pcbPrefix}Soldermask_Top.gbr"]} {
    open_gerber "${inputDir}/${pcbPrefix}Soldermask_Top.gbr" -outname soldermask_top
    isolate soldermask_top -dia ${dia} -passes 1 -overlap 1 -combine 1 -outname soldermask_top.iso
    cncjob soldermask_top.iso -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode soldermask_top.iso_cnc "${outputDir}/soldermask_top.gcode"
}

# Soldermask Bottom
if {[file exists "${inputDir}/${pcbPrefix}Soldermask_Bot.gbr"]} {
    open_gerber "${inputDir}/${pcbPrefix}Soldermask_Bot.gbr" -outname soldermask_bottom
    isolate soldermask_bottom -dia ${dia} -passes 1 -overlap 1 -combine 1 -outname soldermask_bottom.iso
    cncjob soldermask_bottom.iso -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode soldermask_bottom.iso_cnc "${outputDir}/soldermask_bottom.gcode"
}
`;
      } else {
        // Eagle format
        script = `
# Profile Cutout
if {[file exists "${inputDir}/GerberFiles/profile.gbr"]} {
    open_gerber "${inputDir}/GerberFiles/profile.gbr" -outname profile
    cutout profile -dia 0.1 -margin -0.2 -gapsize 0.0 -gaps tb
    cncjob profile_cutout -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode profile_cutout_cnc "${outputDir}/traces_profile.gcode"
}

# Copper Top
if {[file exists "${inputDir}/GerberFiles/copper_top.gbr"]} {
    open_gerber "${inputDir}/GerberFiles/copper_top.gbr" -outname copper_top
    isolate copper_top -dia ${dia} -passes 1 -overlap 1 -combine 1 -outname copper_top.iso
    cncjob copper_top.iso -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode copper_top.iso_cnc "${outputDir}/traces_top.gcode"
}

# Copper Bottom
if {[file exists "${inputDir}/GerberFiles/copper_bottom.gbr"]} {
    open_gerber "${inputDir}/GerberFiles/copper_bottom.gbr" -outname copper_bottom
    isolate copper_bottom -dia ${dia} -passes 1 -overlap 1 -combine 1 -outname copper_bottom.iso
    cncjob copper_bottom.iso -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode copper_bottom.iso_cnc "${outputDir}/traces_bottom.gcode"
}

# Silkscreen Top
if {[file exists "${inputDir}/GerberFiles/silkscreen_top.gbr"]} {
    open_gerber "${inputDir}/GerberFiles/silkscreen_top.gbr" -follow 1 -outname silkscreen_top
    follow silkscreen_top -outname silkscreen_top.follow
    cncjob silkscreen_top.follow -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode silkscreen_top.follow_cnc "${outputDir}/silkscreen_top.gcode"
}

# Silkscreen Bottom
if {[file exists "${inputDir}/GerberFiles/silkscreen_bottom.gbr"]} {
    open_gerber "${inputDir}/GerberFiles/silkscreen_bottom.gbr" -follow 1 -outname silkscreen_bottom
    follow silkscreen_bottom -outname silkscreen_bottom.follow
    cncjob silkscreen_bottom.follow -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode silkscreen_bottom.follow_cnc "${outputDir}/silkscreen_bottom.gcode"
}

# Soldermask Top
if {[file exists "${inputDir}/GerberFiles/soldermask_top.gbr"]} {
    open_gerber "${inputDir}/GerberFiles/soldermask_top.gbr" -outname soldermask_top
    isolate soldermask_top -dia ${dia} -passes 1 -overlap 1 -combine 1 -outname soldermask_top.iso
    cncjob soldermask_top.iso -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode soldermask_top.iso_cnc "${outputDir}/soldermask_top.gcode"
}

# Soldermask Bottom
if {[file exists "${inputDir}/GerberFiles/soldermask_bottom.gbr"]} {
    open_gerber "${inputDir}/GerberFiles/soldermask_bottom.gbr" -outname soldermask_bottom
    isolate soldermask_bottom -dia ${dia} -passes 1 -overlap 1 -combine 1 -outname soldermask_bottom.iso
    cncjob soldermask_bottom.iso -z_cut 0.0 -z_move 2.0 -tooldia 0.2032
    write_gcode soldermask_bottom.iso_cnc "${outputDir}/soldermask_bottom.gcode"
}
`;
      }
    } else {
      // If a custom script is provided, adapt any output directory paths to outputDir
      script = script.replace(/["'][^"']*\/(traces_[^"']+\.gcode|silkscreen_[^"']+\.gcode|soldermask_[^"']+\.gcode)["']/g, `"${outputDir}/$1"`);
    }

    const scriptPath = path.join(tmpDir, "job.flatscript");
    await fs.writeFile(scriptPath, script, "utf8");

    // 3. Locate flatcam.py executable
    const flatcamBin = process.env.FLATCAM_BIN || (
      existsSync("/opt/flatcam/flatcam.py")
        ? "/opt/flatcam/flatcam.py"
        : "/Users/samuel/workspace/python/FlatCAM_Evo/flatcam.py"
    );

    const pythonBin = process.env.PYTHON_BIN || (
      existsSync("/opt/flatcam/.venv/bin/python")
        ? "/opt/flatcam/.venv/bin/python"
        : "python3"
    );

    if (!existsSync(flatcamBin)) {
      throw new Error(`FlatCAM binary not found at '${flatcamBin}'`);
    }

    // 4. Run python flatcam.py --shellfile job.flatscript
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
        logs.push(`Process spawn error: ${err.message}`);
        resolve(1);
      });
    });

    const combinedLogs = logs.join("");

    // 5. Read generated G-code files
    const outputFiles = existsSync(outputDir) ? await fs.readdir(outputDir) : [];
    const outputs: FlatcamOutputItem[] = [];

    for (const filename of outputFiles) {
      if (filename.endsWith(".gcode")) {
        const content = await fs.readFile(path.join(outputDir, filename), "utf8");
        outputs.push({ name: filename, content });
      }
    }

    return {
      success: exitCode === 0 && outputs.length > 0,
      outputs,
      logs: combinedLogs,
      error: exitCode !== 0 ? `FlatCAM process exited with code ${exitCode}` : (outputs.length === 0 ? "No G-code files generated" : undefined),
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
