import {Dimension, Project} from "../types/project.ts";
import {Drill} from "../types/cam.ts";
import {DrillConfig, Trace} from "../types/gcode.ts";
import {getProjectDimensions} from "../processors/project.ts";

const drillAlignmentToGcode = (dimensions: Dimension, drill: Drill, config: DrillConfig): string => {
    const x = config.offsetX + ((dimensions.x + dimensions.width) - (drill.x - dimensions.x));
    const y = config.offsetY + drill.y;
    return [
        `G00 X${x.toFixed(4)}Y${y.toFixed(4)}`,
        "G01 Z3.2000",
        "G4 S20 ; Pause",
        "M300 S500 P500 ; Beep",
        `G01 Z0.0000 F${config.feedRateDrill}`,
        `G01 Z3.2000 F${config.feedRateUp}`,
        `G00 Z4.5000 F${config.feedRateMove}`,
    ].join("\n")
}

const drillToGcode = (drill: Drill, config: DrillConfig): string => {
    const x = config.offsetX + drill.x;
    const y = config.offsetY + drill.y;
    return [
        `G00 X${x.toFixed(4)}Y${y.toFixed(4)}`,
        "G01 Z3.2000",
        `G01 Z0.0000 F${config.feedRateDrill}`,
        `G01 Z3.2000 F${config.feedRateUp}`,
        `G00 Z4.5000 F${config.feedRateMove}`,
    ].join("\n")
}

export const generateDrillAlignmentFile = (project: Project, config: DrillConfig): string => {
    if (project.drills.length == 0) return "";

    let leftMostHole: Drill | undefined;
    let rightMostHole: Drill | undefined;
    project.drills
        .filter(it => it.size < 1.5)
        .forEach(it => {
            if (leftMostHole == undefined || it.x < leftMostHole.x) leftMostHole = it;
            if (rightMostHole == undefined || it.x > rightMostHole.x) rightMostHole = it;
        })

    if (leftMostHole == undefined || rightMostHole == undefined) {
        // If there are no small drills, then ignore the size constraint
        project.drills
            .forEach(it => {
                if (leftMostHole == undefined || it.x < leftMostHole.x) leftMostHole = it;
                if (rightMostHole == undefined || it.x > rightMostHole.x) rightMostHole = it;
            })
    }

    if (leftMostHole == undefined) leftMostHole = rightMostHole;
    if (rightMostHole == undefined) rightMostHole = leftMostHole;
    if (leftMostHole == undefined || rightMostHole == undefined) return "";

    const dimensions = getProjectDimensions(project)

    return [
        "G21",
        "G90",
        "G94",
        `G00 Z4.5000 F${config.feedRateMove}`,
        "G28",
        "M300 S500 P500 ; Beep",
        "M117 Set Z-offset to -3.0 mm",
        "G4 S20 ; Insert pause so use can set/check z-offset",
        "M03 ; Empty commands so the printer has time to pause",
        "M03",
        "M03",
        "M03",
        "M03",
        "M03",
        "G00 Z4.5000",
        "M117 Remove Z-stop!",
        "M300 S500 P500 ; Beep",
        "G4 P1",
        drillAlignmentToGcode(dimensions, leftMostHole, config),
        drillAlignmentToGcode(dimensions, rightMostHole, config),
        "G00 X0.0000Y0.0000",
        "M300 S2000 P500 ; Beep end",
        "M05",
    ].join("\n");
}

export const generateDrillFile = (project: Project, config: DrillConfig): string => {
    if (project.drills.length == 0) return "";

    return [
        "G21",
        "G90",
        "G94",
        `G00 Z4.5000 F${config.feedRateMove}`,
        "G28",
        "M300 S500 P500 ; Beep",
        "M117 Set Z-offset to -3.0 mm",
        "G4 S20 ; Insert pause so use can set/check z-offset",
        "M03 ; Empty commands so the printer has time to pause",
        "M03",
        "M03",
        "M03",
        "M03",
        "M03",
        "G00 Z4.5000",
        "M117 Remove Z-stop!",
        "M300 S500 P500 ; Beep",
        "G4 P1",
        project.drills
            .sort((a, b) => a.x - b.x)
            .sort((a, b) => a.y - b.y)
            .map(it => drillToGcode(it, config)),
        "G00 X0.0000Y0.0000",
        "M300 S2000 P500 ; Beep end",
        "M05",
    ].join("\n");
}