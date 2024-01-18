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

    if (a1.x == a2.x && a1.y == a2.y && b1.x == b2.x && b1.y == b2.y) {
        return {
            rotationPoint: {x: 0, y: 0},
            rotationAngle: 0,
        };
    }

    const slopeA = (a2.y - a1.y) / (a2.x - a1.x);
    const slopeB = (b2.y - b1.y) / (b2.x - b1.x);

    // Calculate orthogonal lines of the transformations
    const middleA1A2 = {
        x: a1.x + (a2.x - a1.x) / 2,
        y: a1.y + (a2.y - a1.y) / 2,
    }
    const slopeOrthA = -1 / slopeA;
    const offsetOrthA = !isFinite(slopeOrthA) ? 0 : middleA1A2.y - slopeOrthA * middleA1A2.x;

    const middleB1B2 = {
        x: b1.x + (b2.x - b1.x) / 2,
        y: b1.y + (b2.y - b1.y) / 2,
    }
    const slopeOrthB = -1 / slopeB;
    const offsetOrthB = !isFinite(slopeOrthB) ? 0 : middleB1B2.y - slopeOrthB * middleB1B2.x;

    // Calculate rotation point
    const rotationPointX = isNaN(slopeOrthA - slopeOrthB) ? 0 : (offsetOrthB - offsetOrthA) / (slopeOrthA - slopeOrthB);
    const rotationPoint = {
        x: rotationPointX,
        y: (!isFinite(slopeOrthA) ? 0 : slopeOrthA) * rotationPointX + offsetOrthA,
    }

    // Calculate rotation angle
    const slopeA1toRotationPoint = (rotationPoint.y - a1.y) / (rotationPoint.x - a1.x);
    const slopeA2toRotationPoint = (rotationPoint.y - a2.y) / (rotationPoint.x - a2.x);
    const rotationAngle = Math.atan(slopeA2toRotationPoint) - Math.atan(slopeA1toRotationPoint)

    // console.dir({
    //     a1: a1,
    //     a2: a2,
    //     b1: b1,
    //     b2: b2,
    //     slopeA: slopeA,
    //     slopeB: slopeB,
    //     middleA1A2: middleA1A2,
    //     slopeOrthA: slopeOrthA,
    //     offsetOrthA: offsetOrthA,
    //     middleB1B2: middleB1B2,
    //     slopeOrthB: slopeOrthB,
    //     offsetOrthB: offsetOrthB,
    //     rotationPointX: rotationPointX,
    //     rotationPoint: rotationPoint,
    //     slopeA1toRotationPoint: slopeA1toRotationPoint,
    //     slopeA2toRotationPoint: slopeA2toRotationPoint,
    //     rotationAngle: rotationAngle,
    // })

    return {
        rotationPoint: rotationPoint,
        rotationAngle: rotationAngle,
    };
}

function length(offsetPoint: { x: number; y: number }) {
    return Math.sqrt(Math.pow(offsetPoint.x, 2) + Math.pow(offsetPoint.y, 2));
}

const applyScaling = (config: DrillConfig, point: Location): Location => {
    const a1 = config.offset[0].original;
    const a2 = config.offset[0].actual;
    const b1 = config.offset[1].original;
    const b2 = config.offset[1].actual;

    const offsetPoint = {
        x: point.x - a2.x,
        y: point.y - a2.y,
    }
    if (offsetPoint.x == 0) return point;

    const vector = {
        length: length(offsetPoint),
        angle: Math.atan(offsetPoint.y / offsetPoint.x),
    }

    const scalingFactor = length({x: b2.x - a2.x, y: b2.y - a2.y}) / length({x: b1.x - a1.x, y: b1.y - a1.y})
    const scaledVector = {
        length: vector.length * scalingFactor,
        angle: vector.angle,
    }

    const scaledOffsetPoint = {
        x: scaledVector.length * Math.cos(scaledVector.angle),
        y: scaledVector.length * Math.sin(scaledVector.angle),
    }

    const scaledPoint = {
        x: scaledOffsetPoint.x + a2.x,
        y: scaledOffsetPoint.y + a2.y,
    }

    // console.dir({
    //     offsetPoint: offsetPoint,
    //     vector: vector,
    //     scalingFactor: scalingFactor,
    //     scaledVector: scaledVector,
    //     scaledOffsetPoint: scaledOffsetPoint,
    //     scaledPoint: scaledPoint,
    // })

    return scaledPoint
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
    return applyScaling(config, calculateOffsetForPoint(config, drill))
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
    const {rotationPoint, rotationAngle} = calculateRotation(config);
    config.rotationPoint = rotationPoint
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