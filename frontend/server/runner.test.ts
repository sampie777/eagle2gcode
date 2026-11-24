import { describe, expect, it } from "bun:test";
import {
  buildFlatcamScript,
  executeFlatcam,
  extractMeaningfulLogs,
  matchGerberFiles,
  parseLayerErrors,
} from "./runner";
import { env, isEnvSet } from "./env";
import * as fs from "fs";
import * as path from "path";

const hasFlatcamAvailable =
  fs.existsSync("/opt/flatcam/flatcam.py") ||
  (isEnvSet("FLATCAM_BIN") && fs.existsSync(env.FLATCAM_BIN));

describe("FlatCAM Runner Backend", () => {
  it("auto-matches Altium Gerber files even when cadType is 'eagle' or omitted", () => {
    const files = [
      { filename: "PCB1_Copper_Signal_Top.gbr" },
      { filename: "PCB1_Copper_Signal_Bot.gbr" },
      { filename: "PCB1_Profile.gbr" },
      { filename: "PCB1_Legend_Top.gbr" },
      { filename: "PCB1_Legend_Bot.gbr" },
      { filename: "PCB1_Soldermask_Top.gbr" },
      { filename: "PCB1_Soldermask_Bot.gbr" },
      { filename: "PCB1_Mechanical_1.gbr" },
      { filename: "PCB1_PTH_Drill.gbr" },
    ];

    const { matched, unmatched } = matchGerberFiles(files, { cadType: "eagle" });

    expect(matched.map((m) => [m.filename, m.outputFile])).toEqual([
      ["PCB1_Profile.gbr", "traces_profile.gcode"],
      ["PCB1_Copper_Signal_Top.gbr", "traces_top.gcode"],
      ["PCB1_Copper_Signal_Bot.gbr", "traces_bottom.gcode"],
      ["PCB1_Legend_Top.gbr", "silkscreen_top.gcode"],
      ["PCB1_Legend_Bot.gbr", "silkscreen_bottom.gcode"],
      ["PCB1_Soldermask_Top.gbr", "soldermask_top.gcode"],
      ["PCB1_Soldermask_Bot.gbr", "soldermask_bottom.gcode"],
    ]);
    expect(unmatched).toEqual(["PCB1_Mechanical_1.gbr", "PCB1_PTH_Drill.gbr"]);
  });

  it("auto-matches Eagle Gerber files even when cadType is 'altium' and handles arbitrary Altium prefixes", () => {
    const eagleResult = matchGerberFiles(
      [
        { filename: "copper_top.gbr" },
        { filename: "profile.gbr" },
        { filename: "silkscreen_bottom.gbr" },
        { filename: "solderpaste_top.gbr" },
      ],
      { cadType: "altium" }
    );

    expect(eagleResult.matched.map((m) => [m.filename, m.outputFile])).toEqual([
      ["profile.gbr", "traces_profile.gcode"],
      ["copper_top.gbr", "traces_top.gcode"],
      ["silkscreen_bottom.gbr", "silkscreen_bottom.gcode"],
    ]);
    expect(eagleResult.unmatched).toEqual(["solderpaste_top.gbr"]);

    const customPrefix = matchGerberFiles([{ filename: "HomeSensorV2_Copper_Signal_Top.gbr" }]);
    expect(customPrefix.matched).toHaveLength(1);
    expect(customPrefix.matched[0].outputFile).toBe("traces_top.gcode");
  });

  it("supports mixing Eagle and Altium Gerber files in the same upload batch", () => {
    const { matched, unmatched, duplicates } = matchGerberFiles([
      { filename: "copper_top.gbr" },
      { filename: "PCB1_Copper_Signal_Bot.gbr" },
      { filename: "profile.gbr" },
      { filename: "PCB1_Legend_Top.gbr" },
      { filename: "silkscreen_bottom.gbr" },
      { filename: "PCB1_Soldermask_Top.gbr" },
      { filename: "soldermask_bottom.gbr" },
    ]);

    expect(matched.map((m) => [m.filename, m.outputFile, m.cadFormat])).toEqual([
      ["profile.gbr", "traces_profile.gcode", "eagle"],
      ["copper_top.gbr", "traces_top.gcode", "eagle"],
      ["PCB1_Copper_Signal_Bot.gbr", "traces_bottom.gcode", "altium"],
      ["PCB1_Legend_Top.gbr", "silkscreen_top.gcode", "altium"],
      ["silkscreen_bottom.gbr", "silkscreen_bottom.gcode", "eagle"],
      ["PCB1_Soldermask_Top.gbr", "soldermask_top.gcode", "altium"],
      ["soldermask_bottom.gbr", "soldermask_bottom.gcode", "eagle"],
    ]);
    expect(unmatched).toEqual([]);
    expect(duplicates).toEqual([]);
  });

  it("uses the latest uploaded file when Eagle and Altium files both target the same layer without a bias", () => {
    const { matched, unmatched, duplicates } = matchGerberFiles([
      { filename: "copper_top.gbr" },
      { filename: "PCB1_Copper_Signal_Top.gbr" },
    ]);

    expect(matched).toHaveLength(1);
    expect(matched[0].filename).toBe("PCB1_Copper_Signal_Top.gbr");
    expect(matched[0].cadFormat).toBe("altium");
    expect(unmatched).toEqual([]);
    expect(duplicates).toEqual([
      {
        layer: "traces_top",
        label: "Copper Top",
        chosen: "PCB1_Copper_Signal_Top.gbr",
        ignored: ["copper_top.gbr"],
      },
    ]);
  });

  it("prefers pcbName prefix when multiple files match the same layer", () => {
    const { matched, unmatched, duplicates } = matchGerberFiles(
      [
        { filename: "Other_Copper_Signal_Top.gbr" },
        { filename: "Board2_Copper_Signal_Top.gbr" },
      ],
      { pcbName: "Board2" }
    );

    expect(matched).toHaveLength(1);
    expect(matched[0].filename).toBe("Board2_Copper_Signal_Top.gbr");
    expect(unmatched).toEqual([]);
    expect(duplicates).toHaveLength(1);
    expect(duplicates[0].ignored).toEqual(["Other_Copper_Signal_Top.gbr"]);
  });

  it("builds FlatCAM script commands wrapped in per-layer catch blocks for cutout, isolate, and follow modes", () => {
    const { matched } = matchGerberFiles([
      { filename: "PCB1_Profile.gbr" },
      { filename: "PCB1_Copper_Signal_Top.gbr" },
      { filename: "PCB1_Legend_Top.gbr" },
    ]);

    const script = buildFlatcamScript(matched, "/tmp/in", "/tmp/out", 0.20188);
    expect(script).toContain("if {[catch {");
    expect(script).toContain('open_gerber "/tmp/in/PCB1_Profile.gbr" -outname profile');
    expect(script).toContain('write_gcode profile_cutout_cnc "/tmp/out/traces_profile.gcode"');
    expect(script).toContain('puts "LAYER_ERROR: PCB1_Profile.gbr: $err"');
    expect(script).toContain('open_gerber "/tmp/in/PCB1_Copper_Signal_Top.gbr" -outname traces_top');
    expect(script).toContain("isolate traces_top -dia 0.20188");
    expect(script).toContain('write_gcode traces_top.iso_cnc "/tmp/out/traces_top.gcode"');
    expect(script).toContain('open_gerber "/tmp/in/PCB1_Legend_Top.gbr" -follow 1 -outname silkscreen_top');
    expect(script).toContain('write_gcode silkscreen_top.follow_cnc "/tmp/out/silkscreen_top.gcode"');
  });

  it("parses per-layer LAYER_ERROR entries from FlatCAM logs", () => {
    const logs = [
      "[ERROR_NOTCL] Failed to open file: silkscreen_bottom.gbr",
      "LAYER_ERROR: silkscreen_bottom.gbr: Command failed: open_gerber",
      "Python traceback: <class '_tkinter.TclError'>",
      "[success] CNCjob created: traces_top.iso_cnc",
    ].join("\n");

    const parsed = parseLayerErrors(logs);
    expect(parsed.get("silkscreen_bottom.gbr")).toBe("Command failed: open_gerber");
    expect(parsed.size).toBe(1);
  });

  it("strips Python resource_tracker noise and extracts meaningful error lines", () => {
    const noisyLogs = [
      "Gerber processing. Parsing 10 lines.",
      "[ERROR] Empty geometry after isolation.",
      "/usr/lib/python3.12/multiprocessing/resource_tracker.py:254: UserWarning: resource_tracker: There appear to be 6 leaked semaphore objects to clean up at shutdown",
      "  warnings.warn('resource_tracker: ...')",
    ].join("\n");

    const extracted = extractMeaningfulLogs(noisyLogs);
    expect(extracted).toContain("[ERROR] Empty geometry after isolation.");
    expect(extracted).not.toContain("resource_tracker");
  });

  it("returns an actionable error immediately when uploaded files match no supported layer", async () => {
    const result = await executeFlatcam({
      files: [
        { filename: "unknown_layer.gbr", content: "G04 test*\nM02*\n" },
        { filename: "PCB1_Mechanical_1.gbr", content: "G04 test*\nM02*\n" },
      ],
      cadType: "eagle",
    });

    expect(result.success).toBe(false);
    expect(result.outputs).toEqual([]);
    expect(result.matchedFiles).toEqual([]);
    expect(result.unmatchedFiles).toEqual(["unknown_layer.gbr", "PCB1_Mechanical_1.gbr"]);
    expect(result.error).toContain("unknown_layer.gbr");
    expect(result.error).toContain("PCB1_Mechanical_1.gbr");
    expect(result.error).toContain("*_Copper_Signal_Top.gbr");
    expect(result.error).toContain("copper_top.gbr");
  });

  it.skipIf(!hasFlatcamAvailable)("processes Gerber profile and generates G-code via executeFlatcam", async () => {
    const profilePath = path.resolve(__dirname, "../../data/tutorial1/Project Outputs for tutorial1/PCB1_Profile.gbr");
    const profileContent = fs.readFileSync(profilePath, "utf-8");

    const result = await executeFlatcam({
      files: [
        { filename: "PCB1_Profile.gbr", content: profileContent }
      ],
      cadType: "altium",
      pcbName: "PCB1",
      diaWidth: 0.20188
    });

    expect(result.success).toBe(true);
    expect(result.outputs.length).toBeGreaterThan(0);
    const profileOutput = result.outputs.find(o => o.name === "traces_profile.gcode");
    expect(profileOutput).toBeDefined();
    expect(profileOutput!.content).toContain("G00");
  });
});
