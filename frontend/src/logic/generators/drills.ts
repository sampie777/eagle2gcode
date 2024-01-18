import {Project} from "../types/project.ts";
import {Drill} from "../types/cam.ts";
import {DrillConfig, Location} from "../types/gcode.ts";
import {getProjectAlignmentDrills} from "../processors/project.ts";

const calculateRotation = (config: DrillConfig): { rotationPoint: Location, rotationAngle: number } => {
    if (config.offset.length < 2) {
        console.error("Need at least two alignment points");
        return {
            rotationPoint: {x: 0, y: 0},
            rotationAngle: 0,
        };
    }

    const a1 = config.offset[0].original;
    const a2 = config.offset[0].actual;
    const b1 = config.offset[1].original;
    const b2 = config.offset[1].actual;

    const slopeA = (a2.y - a1.y) / (a2.x - a1.x);
    const offsetA = a1.y - slopeA * a1.x;

    const slopeB = (b2.y - b1.y) / (b2.x - b1.x);
    const offsetB = b1.y - slopeB * b1.x;

    // Calculate orthogonal lines of the transformations
    const middleA1A2 = {
        x: a1.x + (a2.x - a1.x) / 2,
        y: a1.y + (a2.y - a1.y) / 2,
    }
    const slopeOrthA = -1 / slopeA;
    const offsetOrthA = middleA1A2.y - slopeOrthA * middleA1A2.x;

    const middleB1B2 = {
        x: b1.x + (b2.x - b1.x) / 2,
        y: b1.y + (b2.y - b1.y) / 2,
    }
    const slopeOrthB = -1 / slopeB;
    const offsetOrthB = middleB1B2.y - slopeOrthB * middleB1B2.x;

    // Calculate rotation point
    const rotationPointX = (offsetOrthB - offsetOrthA) / (slopeOrthA - slopeOrthB);
    const rotationPoint = {
        x: rotationPointX,
        y: slopeOrthA * rotationPointX + offsetOrthA,
    }

    // Calculate rotation angle
    const slopeA1toRotationPoint = (rotationPoint.y - a1.y) / (rotationPoint.x - a1.x);
    const slopeA2toRotationPoint = (rotationPoint.y - a2.y) / (rotationPoint.x - a2.x);
    const rotationAngle = Math.atan(slopeA2toRotationPoint) - Math.atan(slopeA1toRotationPoint)

    return {
        rotationPoint: rotationPoint,
        rotationAngle: rotationAngle,
    };
}

export const calculateOffsetForPoint = (config: DrillConfig, point: Location): Location => {
    // Calculate offset point
    const offsetPoint = {
        x: point.x - config.rotationPoint.x,
        y: point.y - config.rotationPoint.y,
    }

    // Calculate rotated offset point
    const rotatedOffsetPoint = {
        x: offsetPoint.x * Math.cos(config.rotationAngle) - offsetPoint.y * Math.sin(config.rotationAngle),
        y: offsetPoint.x * Math.sin(config.rotationAngle) + offsetPoint.y * Math.cos(config.rotationAngle)
    };

    return {
        x: rotatedOffsetPoint.x + config.rotationPoint.x,
        y: rotatedOffsetPoint.y + config.rotationPoint.y,
    }
}

export const getLocationForDrill = (config: DrillConfig, drill: Drill) => {
    return calculateOffsetForPoint(config, drill);
}

const drillToGcode = (drill: Drill, config: DrillConfig): string => {
    const {rotationPoint, rotationAngle} = calculateRotation(config);
    config.rotationPoint = rotationPoint
    config.rotationAngle = rotationAngle

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

    const alignmentDrills = getProjectAlignmentDrills(project);
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