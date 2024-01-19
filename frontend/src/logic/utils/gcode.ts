import {Alignment, Location} from "../types/gcode.ts";
import {length} from "./math.ts";

export const calculateRotation = (offset: {
    original: Location,
    actual: Location
}[]): { scalingFactor: number, rotationAngle: number } => {
    if (offset.length < 2) {
        console.error("Need at least two alignment points");
        return {
            scalingFactor: 1,
            rotationAngle: 0,
        };
    }

    const a1 = offset[0].original;
    const a2 = offset[0].actual;
    const b1 = offset[1].original;
    const b2 = offset[1].actual;

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
 * @param alignment
 * @param point
 */
export const calculateOffsetForPoint = (alignment: Alignment, point: Location): Location => {
    const a1 = alignment.offset[0].original;
    const a2 = alignment.offset[0].actual;

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
        angle: offsetVector.angle + alignment.rotationAngle,
    }

    const scaledOffsetRotatedVector = {
        length: offsetRotatedVector.length * alignment.scalingFactor,
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