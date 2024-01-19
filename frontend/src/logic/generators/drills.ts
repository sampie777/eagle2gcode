import {Project} from "../types/project.ts";
import {Drill} from "../types/cam.ts";
import {DrillConfig, Location} from "../types/gcode.ts";
import {getProjectAlignmentDrills} from "../processors/project.ts";
import {length} from "../utils/math.ts";

const calculateRotation = (config: DrillConfig): { scalingFactor: number, rotationAngle: number } => {
    if (config.offset.length < 2) {
        console.error("Need at least two alignment points");
        return {
            scalingFactor: 1,
            rotationAngle: 0,
        };
    }

    const a1 = config.offset[0].original;
    const a2 = config.offset[0].actual;
    const b1 = config.offset[1].original;
    const b2 = config.offset[1].actual;

    // Calculate rotation angle
    // Math.atan2(slopeABActual)- Math.atan2(slopeABOriginal)
    const rotationAngle = Math.atan2(b2.y - a2.y, b2.x - a2.x) - Math.atan2(b1.y - a1.y, b1.x - a1.x)

    const scalingFactor = length({x: b2.x - a2.x, y: b2.y - a2.y}) / length({x: b1.x - a1.x, y: b1.y - a1.y})

    return {
        scalingFactor: scalingFactor,
        rotationAngle: rotationAngle,
    };
}

/**
 * We will rotate the whole thing about A original, and then move it to A actual
 * @param config
 * @param point
 */
export const calculateOffsetForPoint = (config: DrillConfig, point: Location): Location => {
    const a1 = config.offset[0].original;
    const a2 = config.offset[0].actual;

    // Calculate offset point at the origin
    const offsetPoint = {
        x: point.x - a1.x,
        y: point.y - a1.y,
    }

    const offsetVector = {
        length: length(offsetPoint),
        angle: Math.atan2(offsetPoint.y, offsetPoint.x),
    }

    // Calculate rotated offset point
    const offsetRotatedVector = {
        length: offsetVector.length,
        angle: offsetVector.angle + config.rotationAngle,
    }

    const scaledOffsetRotatedVector = {
        length: offsetRotatedVector.length * config.scalingFactor,
        angle: offsetRotatedVector.angle,
    }

    const scaledOffsetPoint = {
        x: scaledOffsetRotatedVector.length * Math.cos(scaledOffsetRotatedVector.angle),
        y: scaledOffsetRotatedVector.length * Math.sin(scaledOffsetRotatedVector.angle),
    }

    return {
        x: scaledOffsetPoint.x + a2.x,
        y: scaledOffsetPoint.y + a2.y,
    }
}

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

export const precalculateRotation = (config: DrillConfig) => {
    const {scalingFactor, rotationAngle} = calculateRotation(config);
    config.scalingFactor = scalingFactor
    config.rotationAngle = rotationAngle
}

export const generateDrillFile = (project: Project, config: DrillConfig): string => {
    if (project.drills.length == 0) return "";

    precalculateRotation(config);

    const alignmentDrills = getProjectAlignmentDrills(project);
    return [
        "G21",
        "G90",
        "G94",
        `G00 Z4.5000 F${config.feedRateMove}`,
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
        "G00 Z4.5000",
        "M117 Remove Z-stop!",
        "M300 S500 P500 ; Beep",
        "G4 P1",
        ...alignmentDrills
            .map(it => drillToGcode(it, config)),
        ...project.drills
            .filter(it => !alignmentDrills.includes(it))
            .sort((a, b) => a.y - b.y)
            .sort((a, b) => a.x - b.x)
            .map(it => drillToGcode(it, config)),
        "G00 X0.0000Y0.0000",
        "M300 S2000 P500 ; Beep end",
        "M05",
    ].join("\n");
}