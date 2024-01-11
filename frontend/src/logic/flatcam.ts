import {FlatcamConfig, FlatcamCopperLayer} from "./types/flatcam.ts";
import {Project} from "./types/project.ts";

export namespace Flatcam {
    // Todo:
    const projectPath = "";
    const projectName = "";
    const projectMinX = 0;
    const projectMinY = 0;

    const TRACES_OUTPUT_FILE = "0_draw_traces.gcode";
    const PRE_DRILLS_OUTPUT_FILE = "1_pre_drill_holes.gcode";
    const DRILLS_CHECK_OUTPUT_FILE = "2_check_holes.gcode";
    const DRILLS_OUTPUT_FILE = "3_drill_holes.gcode";
    const DRILLS_MIRRORED_CHECK_OUTPUT_FILE = "4_check_mirrored_holes_cnc.gcode";
    const SILKSCREEN_OUTPUT_FILE = "5_draw_silkscreen.gcode";
    const SOLDER_MASK_OUTPUT_FILE = "6_cut_solder_mask.gcode";

    const generateSilkscreenCommands = (project: Project, CAMdirectory: string, config: FlatcamConfig): string => {
        if (!config.silkscreen.top && !config.silkscreen.bottom) return "";

        let topOutput = "";
        if (config.silkscreen.top) {
            topOutput = `open_gerber "${CAMdirectory}/GerberFiles/silkscreen_top.gbr" -follow 1 -outname silkscreen_top\n`
                + `follow silkscreen_top -outname silkscreen_top.follow\n`
                + `offset silkscreen_top.follow ${config.traces.offsetX - projectMinX} ${config.traces.offsetY - projectMinY}\n`
                + (config.silkscreen.mirror ? "mirror silkscreen.follow -axis Y -box profile\n" : "")
        }

        let bottomOutput = "";
        if (config.silkscreen.bottom) {
            topOutput = `open_gerber "${CAMdirectory}/GerberFiles/silkscreen_top.gbr" -follow 1 -outname silkscreen_bottom\n`
                + `follow silkscreen_bottom -outname silkscreen_bottom.follow\n`
                + `offset silkscreen_bottom.follow ${config.traces.offsetX - projectMinX} ${config.traces.offsetY - projectMinY}\n`
                + (config.silkscreen.mirror ? "mirror silkscreen.follow -axis Y -box profile\n" : "")
        }

        return "\n\n"
            + `open_excellon "${CAMdirectory}/DrillFiles/drill_1_16.xln" -outname drills_mirrored\n`
            + `offset drills_mirrored ${config.traces.offsetX - projectMinX} ${config.traces.offsetY - projectMinY}\n`
            + (config.silkscreen.mirror ? "mirror drills_mirrored -axis Y -box profile\n" : "")
            + "drillcncjob drills_mirrored -drillz 0.3 -travelz 2.5 -feedrate 1000.0 -tools 1 -outname check_holes_mirrored_cnc\n"
            + `write_gcode check_holes_mirrored_cnc "${CAMdirectory}/flatCAM/${DRILLS_MIRRORED_CHECK_OUTPUT_FILE}"\n`
            + `\n${topOutput}${bottomOutput}`
            + `join_geometries silkscreen_joined ${config.silkscreen.top ? "silkscreen_top.follow" : ""} ${config.silkscreen.bottom ? "silkscreen_bottom.follow" : ""}\n`
            + `cncjob silkscreen_joined -z_cut 0.0 -z_move 2.0 -feedrate ${config.traces.feedrate} -tooldia 0.2032\n`
            + `write_gcode silkscreen_joined_cnc "${CAMdirectory}/flatCAM/${SILKSCREEN_OUTPUT_FILE}"`;
    };

    const generateSoldermaskCommands = (project: Project, CAMdirectory: string, config: FlatcamConfig): string => {
        const tracesFile = config.traces.copperLayer == FlatcamCopperLayer.Bottom ? "soldermask_bottom" : "soldermask_top";

        return "\n\n"
            + `open_gerber "${CAMdirectory}/GerberFiles/${tracesFile}.gbr" -outname soldermask\n`
            + `offset soldermask ${config.traces.offsetX - projectMinX} ${config.traces.offsetY - projectMinY}\n`
            + (config.traces.mirror ? "mirror soldermask -axis Y -box profile\n" : "")
            + `isolate soldermask -dia ${config.traces.diaWidth} -passes ${config.traces.iterations} -overlap 1 -combine 1 -outname soldermask.iso\n`
            + "\n"
            + `cncjob soldermask.iso -z_cut 0.0 -z_move 2.0 -feedrate ${config.traces.feedrate} -tooldia 0.2032`
            + `write_gcode soldermask.iso_cnc "${CAMdirectory}/flatCAM/${SOLDER_MASK_OUTPUT_FILE}"`;
    }

    export const generateCommands = (project: Project, config: FlatcamConfig): string => {
        const CAMdirectory = `${projectPath}/${projectName}/CAMOutputs`;
        const tracesFile = config.traces.copperLayer == FlatcamCopperLayer.Bottom ? "copper_bottom" : "copper_top";

        const silkscreenCommands = generateSilkscreenCommands(project, CAMdirectory, config);
        const soldermaskCommands = generateSoldermaskCommands(project, CAMdirectory, config);

        return `open_gerber "${CAMdirectory}/GerberFiles/profile.gbr" -outname profile\n`
            + `offset profile ${config.traces.offsetX - projectMinX} ${config.traces.offsetY - projectMinY}\n`
            + (config.traces.mirror ? "mirror profile -axis Y -box profile\n" : "")
            + "cutout profile -dia 0.1 -margin -0.2 -gapsize 0.0 -gaps tb\n"
            + "\n"
            + `open_gerber "${CAMdirectory}/GerberFiles/${tracesFile}.gbr" -outname traces\n`
            + `offset traces ${config.traces.offsetX - projectMinX} ${config.traces.offsetY - projectMinY}\n`
            + (config.traces.mirror ? "mirror traces -axis Y -box profile\n" : "")
            + `isolate traces -dia ${config.traces.diaWidth} -passes ${config.traces.iterations} -overlap 1 -combine 1 -outname traces.iso\n`
            + "\n"
            + `join_geometries joined ${config.traces.cutoutProfile ? "profile_cutout" : ""} traces.iso\n`
            + `cncjob joined -z_cut 0.0 -z_move 2.0 -feedrate ${config.traces.feedrate} -tooldia 0.2032\n`
            + `write_gcode joined_cnc "${CAMdirectory}/flatCAM/${TRACES_OUTPUT_FILE}"\n`
            + "\n"
            + `open_excellon "${CAMdirectory}/DrillFiles/drill_1_16.xln" -outname drills\n`
            + `offset drills ${config.drills.offsetX - projectMinX} ${config.drills.offsetY - projectMinY}\n`
            + (config.traces.mirror ? "mirror drills -axis Y -box profile\n" : "")
            + "drillcncjob drills -drillz 0.0 -travelz 2.0 -feedrate 1000.0 -tools 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20 -outname pre_drill_holes_cnc\n"
            + "drillcncjob drills -drillz 0.3 -travelz 2.5 -feedrate 1000.0 -tools 1 -outname check_holes_cnc\n"
            + "drillcncjob drills -drillz -3.0 -travelz 1.5 -feedrate 1000.0 -tools 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20 -outname drill_holes_cnc\n"
            + `write_gcode pre_drill_holes_cnc "${CAMdirectory}/flatCAM/${PRE_DRILLS_OUTPUT_FILE}"\n`
            + `write_gcode check_holes_cnc "${CAMdirectory}/flatCAM/${DRILLS_CHECK_OUTPUT_FILE}"\n`
            + `write_gcode drill_holes_cnc "${CAMdirectory}/flatCAM/${DRILLS_OUTPUT_FILE}"`
            + silkscreenCommands
            + soldermaskCommands
            + (config.traces.mirror ? "" : "\nplot");
    }
}