import { Alignment, Location, Trace } from "../types/gcode";
import { length } from "./math";

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

  const scalingFactor = length({ x: b2.x - a2.x, y: b2.y - a2.y }) / length({ x: b1.x - a1.x, y: b1.y - a1.y })

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
  if (alignment.offset.length == 0) return {
    x: point.x,
    y: point.y,
  }

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

export const getLength = (traces: Trace[]) => traces.reduce((tracesTotal, currentTrace) =>
  tracesTotal + currentTrace.reduce((total, current, index) => {
    if (index == 0) return 0;
    const previous = currentTrace[index - 1];
    const length = Math.sqrt(Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2))
    return total + length;
  }, 0), 0);

const getTravelLength = (traces: Trace[]) => traces
  .filter(it => it.length > 0)
  .reduce((total, current, index) => {
    const currentLocation = current[0];

    let lastLocation: Location = { x: 0, y: 0 }
    if (index > 0) {
      const previous = traces[index - 1];
      lastLocation = previous[previous.length - 1]
    }

    const length = Math.sqrt(Math.pow(currentLocation.x - lastLocation.x, 2) + Math.pow(currentLocation.y - lastLocation.y, 2))
    return total + length;
  }, 0);

export const getGcodeDurationForTraces = (traces: Trace[], config: {
  feedRate: number,
  iterations: number,
}) => {
  // Constant calculated based on real data (41 minutes for 40 iterations of a 1026.8 mm length project) with a feed rate of 1400
  const SECONDS_PER_MM = (41 * 60) / (40 * 1026.8 + 183.0);
  // const SECONDS_PER_MM = (62 * 60) / (40 * 1743.5 + 263.1);
  const FEED_RATE_FACTOR = 1400 / Math.max(1, config.feedRate);

  const tracesLength = getLength(traces);
  const travelLength = getTravelLength(traces);

  const totalDuration = SECONDS_PER_MM * FEED_RATE_FACTOR * (tracesLength * config.iterations + travelLength);

  const hours = Math.floor(totalDuration / 3600)
  const minutes = Math.ceil((totalDuration - hours * 3600) / 60)

  return `${hours}:${minutes.toString().padStart(2, "0")}h`;
};

export const getAcidDurationForTraces = (traces: Trace[]) => {
  const BASE_TIME_SECONDS = 3600;
  // Constant calculated based on real data (2h30 minutes for a 1986.3 mm length project)
  const SECONDS_PER_MM = (150 * 60 - BASE_TIME_SECONDS) / 1986.3;

  const tracesLength = getLength(traces);

  const totalDuration = BASE_TIME_SECONDS + SECONDS_PER_MM * tracesLength;

  const hours = Math.floor(totalDuration / 3600)
  const minutes = Math.ceil((totalDuration - hours * 3600) / 60)

  return `${hours}:${minutes.toString().padStart(2, "0")}h`;
};