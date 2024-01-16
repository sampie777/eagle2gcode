export namespace Flatcam {
    export const TRACES_PROFILE_OUTPUT_FILE = "traces_profile.gcode";
    export const TRACES_TOP_OUTPUT_FILE = "traces_top.gcode";
    export const TRACES_BOTTOM_OUTPUT_FILE = "traces_bottom.gcode";
    export const SILKSCREEN_TOP_OUTPUT_FILE = "silkscreen_top.gcode";
    export const SILKSCREEN_BOTTOM_OUTPUT_FILE = "silkscreen_bottom.gcode";
    export const SOLDERMASK_TOP_OUTPUT_FILE = "soldermask_top.gcode";
    export const SOLDERMASK_BOTTOM_OUTPUT_FILE = "soldermask_bottom.gcode";

    const generateCncJob = (camDirectory: string, diaWidth: number, inputFile: string, outputFile: string): string =>
        `open_gerber "${camDirectory}/GerberFiles/${inputFile}" -outname ${inputFile}\n`
        + `isolate ${inputFile} -dia ${diaWidth} -passes 1 -overlap 1 -combine 1 -outname ${inputFile}.iso\n`
        + `cncjob ${inputFile}.iso -z_cut 0.0 -z_move 2.0 -tooldia 0.2032\n`
        + `write_gcode ${inputFile}.iso_cnc "${camDirectory}/flatCAM/${outputFile}"\n\n`;

    const generateSilkscreenCommands = (camDirectory: string, diaWidth: number): string => {
        return `open_gerber "${camDirectory}/GerberFiles/silkscreen_top.gbr" -follow 1 -outname silkscreen_top\n`
            + `follow silkscreen_top -outname silkscreen_top.follow\n`
            + `cncjob silkscreen_top.follow -z_cut 0.0 -z_move 2.0 -tooldia 0.2032\n`
            + `write_gcode silkscreen_top.follow_cnc "${camDirectory}/flatCAM/${SILKSCREEN_TOP_OUTPUT_FILE}"\n\n`

            + `open_gerber "${camDirectory}/GerberFiles/silkscreen_bottom.gbr" -follow 1 -outname silkscreen_bottom\n`
            + `follow silkscreen_bottom -outname silkscreen_bottom.follow\n`
            + `cncjob silkscreen_bottom.follow -z_cut 0.0 -z_move 2.0 -tooldia 0.2032\n`
            + `write_gcode silkscreen_bottom.follow_cnc "${camDirectory}/flatCAM/${SILKSCREEN_BOTTOM_OUTPUT_FILE}"\n\n`;
    };

    const generateSoldermaskCommands = (camDirectory: string, diaWidth: number): string => {
        return generateCncJob(camDirectory, diaWidth, "soldermask_top.gbr", SOLDERMASK_TOP_OUTPUT_FILE)
            + generateCncJob(camDirectory, diaWidth, "soldermask_bottom.gbr", SOLDERMASK_BOTTOM_OUTPUT_FILE)
    }

    export const generateCommands = (projectDirectory: string, diaWidth: number): string => {
        const camDirectory = projectDirectory
            .replace(/\\/g, "/")
            .replace(/\/+$/g, "")
            .replace(/\/flatCAM$/gi, "")
            .replace(/CAMOutputs$/gi, "")
            + "/CAMOutputs";
        const silkscreenCommands = generateSilkscreenCommands(camDirectory, diaWidth);
        const soldermaskCommands = generateSoldermaskCommands(camDirectory, diaWidth);

        return `open_gerber "${camDirectory}/GerberFiles/profile.gbr" -outname profile\n`
            + "cutout profile -dia 0.1 -margin -0.2 -gapsize 0.0 -gaps tb\n"
            + `cncjob profile_cutout -z_cut 0.0 -z_move 2.0 -tooldia 0.2032\n`
            + `write_gcode profile_cutout_cnc "${camDirectory}/flatCAM/${TRACES_PROFILE_OUTPUT_FILE}"\n`
            + "\n"
            + generateCncJob(camDirectory, diaWidth, "copper_top.gbr", TRACES_TOP_OUTPUT_FILE)
            + generateCncJob(camDirectory, diaWidth, "copper_bottom.gbr", TRACES_BOTTOM_OUTPUT_FILE)
            + silkscreenCommands
            + soldermaskCommands
    }
}