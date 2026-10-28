import { Alignment, BrushConfig, Location, Trace } from "../types/gcode";
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
  tracesTotal + currentTrace
    .filter(it => it.enabled)
    .reduce((total, current, index) => {
      if (index == 0) return 0;
      const previous = currentTrace[index - 1];
      const length = Math.sqrt(Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2))
      return total + length;
    }, 0), 0);

export const getTravelLength = (traces: Trace[]) => traces
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

export type GcodeDurationConfig = {
  iterations: number
  minFeedRate?: number
  maxFeedRate?: number
  feedRate?: number
  acceleration?: number
  brush?: BrushConfig
};

const CORNER_ANGLE_THRESHOLD = 5 * (Math.PI / 180);
const ACCEL_SEGMENT_LENGTH = 1.0;

export const getGcodeDurationForTraces = (traces: Trace[], config: GcodeDurationConfig): string => {
  const iterations = config.iterations ?? 1;
  if (iterations <= 0 || !traces || traces.length === 0) {
    return "0:00h";
  }

  const minFeedRate = config.minFeedRate ?? config.feedRate ?? 600;
  const maxFeedRate = config.maxFeedRate ?? config.feedRate ?? 2500;
  const acceleration = config.acceleration ?? 500;
  const brush = config.brush;

  // Single brush cleaning routine duration based on machine movements:
  // - G00 Z12.0000 retract at maxFeedRate
  // - G00 rapid traverse to brush pad (posA) at 4000 mm/min
  // - G01 ZposAz plunge
  // - 7 back-and-forth strokes (14 travels) between posA and posB at 4000 mm/min
  // - G00 Z12.0000 retract
  // - G00 rapid traverse back to workpiece at maxFeedRate
  // - G01 Z0.0000 plunge at minFeedRate
  let brushDuration = 0;
  if (brush?.enabled) {
    const strokeDist = Math.hypot(
      (brush.posBx ?? 0) - (brush.posAx ?? 0),
      (brush.posBy ?? 0) - (brush.posAy ?? 0),
      (brush.posBz ?? 0) - (brush.posAz ?? 0)
    );
    const brushStrokesTime = (14 * strokeDist) / (4000 / 60);
    const travelTime = 100 / (4000 / 60) + 100 / (maxFeedRate / 60);
    const plungeTime = 12 / (minFeedRate / 60) + 12 / (maxFeedRate / 60);
    brushDuration = brushStrokesTime + travelTime + plungeTime;
  }

  let totalDuration = 0;
  let accumulatedCuttingDist = 0;
  let lastPos: Location = { x: 0, y: 0 };
  let hasValidTraces = false;

  for (const rawTrace of traces) {
    const trace = rawTrace.filter(it => it.enabled !== false);
    if (trace.length < 2) continue;
    hasValidTraces = true;

    // Rapid travel to trace start point + plunge
    const travelDist = Math.hypot(trace[0].x - lastPos.x, trace[0].y - lastPos.y);
    totalDuration += travelDist / (maxFeedRate / 60);
    totalDuration += 3 / (minFeedRate / 60);

    // Compute dynamic speed profile along waypoints (matching generateAcceleratedTrace)
    const points = trace;
    const maxSpeeds = new Array(points.length).fill(maxFeedRate);
    maxSpeeds[0] = minFeedRate;
    maxSpeeds[points.length - 1] = minFeedRate;

    for (let i = 1; i < points.length - 1; i++) {
      const dx1 = points[i].x - points[i - 1].x;
      const dy1 = points[i].y - points[i - 1].y;
      const dist1 = Math.hypot(dx1, dy1);
      const dx2 = points[i + 1].x - points[i].x;
      const dy2 = points[i + 1].y - points[i].y;
      const dist2 = Math.hypot(dx2, dy2);
      if (dist1 < 0.001 || dist2 < 0.001) continue;
      const dot = (dx1 * dx2 + dy1 * dy2) / (dist1 * dist2);
      const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
      if (angle > CORNER_ANGLE_THRESHOLD) {
        maxSpeeds[i] = minFeedRate;
      }
    }

    // Backward pass (deceleration limits)
    for (let i = points.length - 2; i >= 0; i--) {
      const dist = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
      maxSpeeds[i] = Math.min(maxSpeeds[i], maxSpeeds[i + 1] + (acceleration * dist));
    }

    // Forward pass (acceleration limits)
    for (let i = 1; i < points.length; i++) {
      const dist = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
      maxSpeeds[i] = Math.min(maxSpeeds[i], maxSpeeds[i - 1] + (acceleration * dist));
    }

    // Duration for 1 pass of this trace
    let singlePassDuration = 0;
    let singlePassDist = 0;

    for (let i = 0; i < points.length - 1; i++) {
      const vStart = maxSpeeds[i];
      const vEnd = maxSpeeds[i + 1];
      const dist = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
      if (dist <= 0.001) continue;

      let distanceCovered = 0;
      while (dist - distanceCovered > 0.001) {
        const step = Math.min(ACCEL_SEGMENT_LENGTH, dist - distanceCovered);
        distanceCovered += step;
        singlePassDist += step;

        const limitFromStart = vStart + (acceleration * distanceCovered);
        const limitFromEnd = vEnd + (acceleration * (dist - distanceCovered));
        const currentFeedRate = Math.min(maxFeedRate, limitFromStart, limitFromEnd);

        singlePassDuration += step / (currentFeedRate / 60);
      }
    }

    totalDuration += singlePassDuration * iterations;
    accumulatedCuttingDist += singlePassDist * iterations;

    // Retract at maxFeedRate
    totalDuration += 3 / (maxFeedRate / 60);

    const isContinuous = Math.hypot(trace[0].x - trace[trace.length - 1].x, trace[0].y - trace[trace.length - 1].y) < 0.001;
    if (isContinuous || iterations % 2 === 1) {
      lastPos = { x: trace[trace.length - 1].x, y: trace[trace.length - 1].y };
    } else {
      lastPos = { x: trace[0].x, y: trace[0].y };
    }
  }

  if (!hasValidTraces) {
    return "0:00h";
  }

  // Account for brush cleaning cycles
  if (brush?.enabled && brush.distanceThreshold > 0) {
    const numCleanings = Math.floor(accumulatedCuttingDist / brush.distanceThreshold);
    totalDuration += numCleanings * brushDuration;
  }

  // Initial startup, homing and spindle/position pauses (G28, pauses ~ 15s)
  totalDuration += 15;

  let hours = Math.floor(totalDuration / 3600);
  let minutes = Math.round((totalDuration - hours * 3600) / 60);
  if (minutes === 60) {
    hours += 1;
    minutes = 0;
  }

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
