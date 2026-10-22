export type CadType = "eagle" | "altium";

export namespace Flatcam {
  export const TRACES_PROFILE_OUTPUT_FILE = "traces_profile.gcode";
  export const TRACES_TOP_OUTPUT_FILE = "traces_top.gcode";
  export const TRACES_BOTTOM_OUTPUT_FILE = "traces_bottom.gcode";
  export const SILKSCREEN_TOP_OUTPUT_FILE = "silkscreen_top.gcode";
  export const SILKSCREEN_BOTTOM_OUTPUT_FILE = "silkscreen_bottom.gcode";
  export const SOLDERMASK_TOP_OUTPUT_FILE = "soldermask_top.gcode";
  export const SOLDERMASK_BOTTOM_OUTPUT_FILE = "soldermask_bottom.gcode";

  export const resolveEagleCamDirectory = (projectDirectory: string): string => {
    const clean = projectDirectory
      .replace(/\\/g, "/")
      .replace(/\/+$/g, "")
      .replace(/\/CAMOutputs$/gi, "");
    return clean ? `${clean}/CAMOutputs` : "";
  };

  export const resolveAltiumCamDirectory = (projectDirectory: string): string => {
    const clean = projectDirectory
      .replace(/\\/g, "/")
      .replace(/\/+$/g, "");
    if (!clean) return "";
    if (/Project Outputs for /i.test(clean)) {
      return clean;
    }
    const parts = clean.split("/").filter(Boolean);
    const projectName = parts[parts.length - 1] ?? "";
    return projectName ? `${clean}/Project Outputs for ${projectName}` : clean;
  };

  const generateCncJob = (camDirectory: string, diaWidth: number, inputFile: string, outputFile: string): string =>
    `open_gerber "${camDirectory}/GerberFiles/${inputFile}" -outname ${inputFile}\n`
    + `isolate ${inputFile} -dia ${diaWidth} -passes 1 -overlap 1 -combine 1 -outname ${inputFile}.iso\n`
    + `cncjob ${inputFile}.iso -z_cut 0.0 -z_move 2.0 -tooldia 0.2032\n`
    + `write_gcode ${inputFile}.iso_cnc "${camDirectory}/${outputFile}"\n\n`;

  const generateSilkscreenCommands = (camDirectory: string, diaWidth: number): string => {
    return `open_gerber "${camDirectory}/GerberFiles/silkscreen_top.gbr" -follow 1 -outname silkscreen_top\n`
      + `follow silkscreen_top -outname silkscreen_top.follow\n`
      + `cncjob silkscreen_top.follow -z_cut 0.0 -z_move 2.0 -tooldia 0.2032\n`
      + `write_gcode silkscreen_top.follow_cnc "${camDirectory}/${SILKSCREEN_TOP_OUTPUT_FILE}"\n\n`

      + `open_gerber "${camDirectory}/GerberFiles/silkscreen_bottom.gbr" -follow 1 -outname silkscreen_bottom\n`
      + `follow silkscreen_bottom -outname silkscreen_bottom.follow\n`
      + `cncjob silkscreen_bottom.follow -z_cut 0.0 -z_move 2.0 -tooldia 0.2032\n`
      + `write_gcode silkscreen_bottom.follow_cnc "${camDirectory}/${SILKSCREEN_BOTTOM_OUTPUT_FILE}"\n\n`;
  };

  const generateSoldermaskCommands = (camDirectory: string, diaWidth: number): string => {
    return generateCncJob(camDirectory, diaWidth, "soldermask_top.gbr", SOLDERMASK_TOP_OUTPUT_FILE)
      + generateCncJob(camDirectory, diaWidth, "soldermask_bottom.gbr", SOLDERMASK_BOTTOM_OUTPUT_FILE);
  };

  export const generateEagleCommands = (projectDirectory: string, diaWidth: number): string => {
    const camDirectory = resolveEagleCamDirectory(projectDirectory);
    const silkscreenCommands = generateSilkscreenCommands(camDirectory, diaWidth);
    const soldermaskCommands = generateSoldermaskCommands(camDirectory, diaWidth);

    return `open_gerber "${camDirectory}/GerberFiles/profile.gbr" -outname profile\n`
      + "cutout profile -dia 0.1 -margin -0.2 -gapsize 0.0 -gaps tb\n"
      + `cncjob profile_cutout -z_cut 0.0 -z_move 2.0 -tooldia 0.2032\n`
      + `write_gcode profile_cutout_cnc "${camDirectory}/${TRACES_PROFILE_OUTPUT_FILE}"\n`
      + "\n"
      + generateCncJob(camDirectory, diaWidth, "copper_top.gbr", TRACES_TOP_OUTPUT_FILE)
      + generateCncJob(camDirectory, diaWidth, "copper_bottom.gbr", TRACES_BOTTOM_OUTPUT_FILE)
      + silkscreenCommands
      + soldermaskCommands;
  };

  const generateAltiumCncJob = (outputDirectory: string, diaWidth: number, inputFile: string, outname: string, outputFile: string): string =>
    `open_gerber "${outputDirectory}/${inputFile}" -outname ${outname}\n`
    + `isolate ${outname} -dia ${diaWidth} -passes 1 -overlap 1 -combine 1 -outname ${outname}.iso\n`
    + `cncjob ${outname}.iso -z_cut 0.0 -z_move 2.0 -tooldia 0.2032\n`
    + `write_gcode ${outname}.iso_cnc "${outputDirectory}/${outputFile}"\n\n`;

  const generateAltiumSilkscreenCommands = (outputDirectory: string, prefix: string): string => {
    return `open_gerber "${outputDirectory}/${prefix}Legend_Top.gbr" -follow 1 -outname silkscreen_top\n`
      + `follow silkscreen_top -outname silkscreen_top.follow\n`
      + `cncjob silkscreen_top.follow -z_cut 0.0 -z_move 2.0 -tooldia 0.2032\n`
      + `write_gcode silkscreen_top.follow_cnc "${outputDirectory}/${SILKSCREEN_TOP_OUTPUT_FILE}"\n\n`

      + `open_gerber "${outputDirectory}/${prefix}Legend_Bot.gbr" -follow 1 -outname silkscreen_bottom\n`
      + `follow silkscreen_bottom -outname silkscreen_bottom.follow\n`
      + `cncjob silkscreen_bottom.follow -z_cut 0.0 -z_move 2.0 -tooldia 0.2032\n`
      + `write_gcode silkscreen_bottom.follow_cnc "${outputDirectory}/${SILKSCREEN_BOTTOM_OUTPUT_FILE}"\n\n`;
  };

  const generateAltiumSoldermaskCommands = (outputDirectory: string, diaWidth: number, prefix: string): string => {
    return generateAltiumCncJob(outputDirectory, diaWidth, `${prefix}Soldermask_Top.gbr`, "soldermask_top", SOLDERMASK_TOP_OUTPUT_FILE)
      + generateAltiumCncJob(outputDirectory, diaWidth, `${prefix}Soldermask_Bot.gbr`, "soldermask_bottom", SOLDERMASK_BOTTOM_OUTPUT_FILE);
  };

  export const generateAltiumCommands = (projectDirectory: string, diaWidth: number, pcbName: string = "PCB1"): string => {
    const outputDirectory = resolveAltiumCamDirectory(projectDirectory);
    const prefix = pcbName.trim() ? (pcbName.trim().endsWith("_") ? pcbName.trim() : `${pcbName.trim()}_`) : "";
    const silkscreenCommands = generateAltiumSilkscreenCommands(outputDirectory, prefix);
    const soldermaskCommands = generateAltiumSoldermaskCommands(outputDirectory, diaWidth, prefix);

    return `open_gerber "${outputDirectory}/${prefix}Profile.gbr" -outname profile\n`
      + "cutout profile -dia 0.1 -margin -0.2 -gapsize 0.0 -gaps tb\n"
      + `cncjob profile_cutout -z_cut 0.0 -z_move 2.0 -tooldia 0.2032\n`
      + `write_gcode profile_cutout_cnc "${outputDirectory}/${TRACES_PROFILE_OUTPUT_FILE}"\n`
      + "\n"
      + generateAltiumCncJob(outputDirectory, diaWidth, `${prefix}Copper_Signal_Top.gbr`, "copper_top", TRACES_TOP_OUTPUT_FILE)
      + generateAltiumCncJob(outputDirectory, diaWidth, `${prefix}Copper_Signal_Bot.gbr`, "copper_bottom", TRACES_BOTTOM_OUTPUT_FILE)
      + silkscreenCommands
      + soldermaskCommands;
  };

  export function generateCommands(projectDirectory: string, diaWidth: number): string;
  export function generateCommands(cadType: CadType, projectDirectory: string, diaWidth: number, pcbName?: string): string;
  export function generateCommands(
    cadTypeOrProjectDirectory: string,
    diaWidthOrProjectDirectory: number | string,
    diaWidth?: number,
    pcbName?: string
  ): string {
    if (cadTypeOrProjectDirectory === "altium") {
      return generateAltiumCommands(String(diaWidthOrProjectDirectory), diaWidth ?? 0.20188, pcbName ?? "PCB1");
    }
    if (cadTypeOrProjectDirectory === "eagle") {
      return generateEagleCommands(String(diaWidthOrProjectDirectory), diaWidth ?? 0.20188);
    }
    return generateEagleCommands(cadTypeOrProjectDirectory, Number(diaWidthOrProjectDirectory));
  }
}
