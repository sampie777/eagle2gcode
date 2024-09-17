import {Project} from "../types/project";
import {Drill} from "../types/cam";
import {DrillConfig} from "../types/gcode";
import {getProjectAlignmentDrills} from "../processors/project";
import {calculateOffsetForPoint} from "../utils/gcode";
import { getConfigWithRotation } from "../utils/utils";

export const getLocationForDrill = (config: DrillConfig, drill: Drill) => {
    return calculateOffsetForPoint(config, drill)
}

const drillToGcode = (drill: Drill, config: DrillConfig): string => {
    const {x, y} = getLocationForDrill(config, drill);
    return [
        `G00 X${x.toFixed(4)}Y${y.toFixed(4)}`,
        "G01 Z3.2000",
        `G01 Z0.0000 F${config.feedRateDrill}`,
        `G01 Z3.2000 F${config.feedRateUp}`,
        `G00 Z4.5000 F${config.feedRateMove}`,
    ].join("\n")
}

export const generateDrillFile = (project: Project, config: DrillConfig): string => {
    if (project.drills.length == 0) return "";

    const configWithRotation = getConfigWithRotation(config);

    const alignmentDrills = getProjectAlignmentDrills(project);
    return [
        "G21",
        "G90",
        "G94",
        `G00 Z4.5000 F${configWithRotation.feedRateMove}`,
        "G28",
        "G00 Z0.0000",
        "M300 S500 P500 ; Beep",
        "M117 Set Z-offset to -3.0 mm",
        "G4 S15 ; Insert pause so use can set/check z-offset",
        "M300 S500 P200 ; Beep",
        "G4 S1 ; count down",
        "M300 S500 P200 ; Beep",
        "G4 S1 ; count down",
        "M300 S500 P200 ; Beep",
        "G4 S1 ; count down",
        "M300 S500 P200 ; Beep",
        "G4 S1 ; count down",
        "M300 S500 P100 ; Beep",
        "G4 P100 ; count down",
        "M300 S500 P100 ; Beep",
        "G4 P100 ; count down",
        "M300 S500 P100 ; Beep",
        "G4 P100 ; count down",
        "M03 ; Empty commands so the printer has time to pause",
        "M03",
        "M03",
        "M03",
        "M03",
        "M03",
        "G00 Z10.0000",
        "M117 Remove Z-stop!",
        "M300 S500 P500 ; Beep",
        "G4 P1",
        ...alignmentDrills
            .map(it => drillToGcode(it, configWithRotation)),
        ...project.drills
            .filter(it => !alignmentDrills.includes(it))
            .sort((a, b) => a.y - b.y)
            .sort((a, b) => a.x - b.x)
            .map(it => drillToGcode(it, configWithRotation)),
        `G00 Z10.0000 F${configWithRotation.feedRateMove}`,
        "G00 X0.0000Y0.0000",
        "M300 S2000 P500 ; Beep end",
        "M05",
    ].join("\n");
}