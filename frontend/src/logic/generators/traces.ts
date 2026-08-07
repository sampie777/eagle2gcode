import { Dimension, Project } from "../types/project";
import { Alignment, BrushConfig, Location, SilkscreenConfig, Trace, TracesConfig } from "../types/gcode";
import { getProjectAlignmentDrills, getProjectDimensions } from "../processors/project";
import { calculateOffsetForPoint } from "../utils/gcode";
import { getConfigWithRotation } from "../utils/utils";

type TraceConfig = {
  iterations: number
  mirror: boolean
  dimensions: Dimension
  offsetX?: number
  offsetY?: number
  alignment?: Alignment
  minFeedRate: number
  maxFeedRate: number
  acceleration: number
  brush: BrushConfig
}

type GenerationState = { distance: number };

const CORNER_ANGLE_THRESHOLD = 5 * (Math.PI / 180); // 5 degrees in radians
const ACCEL_SEGMENT_LENGTH = 1.0; // Break long lines into 1mm chunks

function addBrushCleanPath(commands: string[], config: TraceConfig, currentX: number, currentY: number, strokes: number = 7) {
  commands.push("");
  commands.push("; --- AUTOMATED BRUSH CLEANING ---");
  commands.push("G00 Z12.0000");

  commands.push(`G00 X${config.brush.posAx.toFixed(4)} Y${config.brush.posAy.toFixed(4)} F4000`);
  commands.push(`G01 Z${config.brush.posAz.toFixed(4)}`);
  for (let i = 0; i < strokes; i++) {
    commands.push(`G00 X${config.brush.posAx.toFixed(4)} Y${config.brush.posAy.toFixed(4)} Z${config.brush.posAz.toFixed(4)}`);
    commands.push(`G01 X${config.brush.posBx.toFixed(4)} Y${config.brush.posBy.toFixed(4)} Z${config.brush.posBz.toFixed(4)}`);
  }
  commands.push("G00 Z12.0000");

  commands.push("; --- RESUMING TRACE ---");
  commands.push(`G00 X${currentX.toFixed(4)} Y${currentY.toFixed(4)} F${config.maxFeedRate.toFixed(0)}`);
  commands.push(`G01 Z0.0000 F${config.minFeedRate.toFixed(0)}`);
  commands.push("");
}

const generateAcceleratedTrace = (trace: Trace, config: TraceConfig, state: GenerationState): string[] => {
  // 1. Convert all points in the Trace to physical machine coordinates
  const points = trace.map(p => getOffsetForLocation(p, config));
  if (points.length === 0) return [];

  // 2. Initialize max speeds for each waypoint
  const maxSpeeds = new Array(points.length).fill(config.maxFeedRate);
  maxSpeeds[0] = config.minFeedRate;               // Start slow
  maxSpeeds[points.length - 1] = config.minFeedRate; // End slow

  // 3. Detect sharp corners using vector dot products
  for (let i = 1; i < points.length - 1; i++) {
    const dx1 = points[i].x - points[i - 1].x;
    const dy1 = points[i].y - points[i - 1].y;
    const dist1 = Math.hypot(dx1, dy1);

    const dx2 = points[i + 1].x - points[i].x;
    const dy2 = points[i + 1].y - points[i].y;
    const dist2 = Math.hypot(dx2, dy2);

    if (dist1 < 0.001 || dist2 < 0.001) continue;

    const dot = (dx1 * dx2 + dy1 * dy2) / (dist1 * dist2);
    // Clamp dot product between -1 and 1 to prevent NaN from floating point errors
    const angle = Math.acos(Math.max(-1, Math.min(1, dot)));

    if (angle > CORNER_ANGLE_THRESHOLD) {
      maxSpeeds[i] = config.minFeedRate;
    }
  }

  // 4. Backward Pass: Enforce deceleration limits
  for (let i = points.length - 2; i >= 0; i--) {
    const dist = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
    maxSpeeds[i] = Math.min(maxSpeeds[i], maxSpeeds[i + 1] + (config.acceleration * dist));
  }

  // 5. Forward Pass: Enforce acceleration limits
  for (let i = 1; i < points.length; i++) {
    const dist = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    maxSpeeds[i] = Math.min(maxSpeeds[i], maxSpeeds[i - 1] + (config.acceleration * dist));
  }

  // 6. Generate Subdivided G-code
  const commands: string[] = [];
  commands.push(`G01 X${points[0].x.toFixed(4)} Y${points[0].y.toFixed(4)} F${maxSpeeds[0].toFixed(0)}`);

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const vStart = maxSpeeds[i];
    const vEnd = maxSpeeds[i + 1];

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);

    if (dist <= 0.001) continue;

    let distanceCovered = 0;
    while (dist - distanceCovered > 0.001) {
      const step = Math.min(ACCEL_SEGMENT_LENGTH, dist - distanceCovered);
      distanceCovered += step;
      state.distance += step;

      const progress = distanceCovered / dist;
      const currentX = start.x + dx * progress;
      const currentY = start.y + dy * progress;

      // CORRECTED MATH: Allow speed to ramp up dynamically inside long segments
      const limitFromStart = vStart + (config.acceleration * distanceCovered);
      const limitFromEnd = vEnd + (config.acceleration * (dist - distanceCovered));
      const currentFeedRate = Math.min(config.maxFeedRate, limitFromStart, limitFromEnd);

      commands.push(`G01 X${currentX.toFixed(4)} Y${currentY.toFixed(4)} F${currentFeedRate.toFixed(0)}`);

      // Inject Auto-Cleaning Routine if enabled and threshold is reached
      if (config.brush.enabled && state.distance >= config.brush.distanceThreshold) {
        addBrushCleanPath(commands, config, currentX, currentY);

        state.distance = 0;
      }
    }
  }

  return commands;
}

const getOffsetForLocation = (location: Location, config: TraceConfig): Location => {
  if (config.alignment != undefined) {
    return calculateOffsetForPoint(config.alignment, location);
  }
  if (config.offsetX != undefined && config.offsetY != undefined) {
    return {
      x: config.offsetX + (config.mirror
        ? ((config.dimensions.x + config.dimensions.width) - (location.x - config.dimensions.x))
        : location.x),
      y: config.offsetY + location.y,
    }
  }
  return location;
}

const gcodeMoveCommand = (location: Location, config: TraceConfig, linear: boolean = true) => {
  const result = getOffsetForLocation(location, config);
  return `G0${linear ? 1 : 0} X${result.x.toFixed(4)}Y${result.y.toFixed(4)}`;
}

const generateBackAndForthTrace = (trace: Trace, config: TraceConfig, state: GenerationState) => {
  return Array.from(Array(config.iterations))
    .flatMap((_, iteration) => {
      const isForward = iteration % 2 === 0;
      // Copy and reverse the trace array for backward passes so it processes correctly
      const sequentialTrace = isForward ? trace : [...trace].reverse();
      return generateAcceleratedTrace(sequentialTrace, config, state);
    });
}

const generateContinuousTrace = (trace: Trace, config: TraceConfig, state: GenerationState) => {
  return Array.from(Array(config.iterations)).flatMap(_ =>
    generateAcceleratedTrace(trace, config, state)
  );
}

const generateTraces = (traces: Trace[], config: TraceConfig, state: GenerationState) => {
  return traces
    .map(trace => trace.filter(it => it.enabled))
    .filter(it => it.length > 1)
    .map(trace => {
      const canBeContinuous = trace[0].x == trace[trace.length - 1].x && trace[0].y == trace[trace.length - 1].y;
      const gcode = canBeContinuous
        ? generateContinuousTrace(trace, config, state)
        : generateBackAndForthTrace(trace, config, state)

      return [
        gcodeMoveCommand(trace[0], config, false),
        `G01 Z0.0000`,
        ...gcode,
        `G00 Z3.0000`]
        .join("\n")
    })
    .join("\n\n");
}

const generateAlignmentDrillsCheckPoints = (project: Project, config: TraceConfig): string => {
  const alignmentDrills = getProjectAlignmentDrills(project);
  return alignmentDrills
    .flatMap(it => [
      gcodeMoveCommand(it, config, false),
      "G00 Z0.0000",
      "G4 S3 ; count down",
      "M03 ; Empty commands so the printer has time to pause",
      "M03 ; Empty commands so the printer has time to pause",
      "M03 ; Empty commands so the printer has time to pause",
      "G00 Z3.0000"
    ])
    .join("\n")
}

export const generateSilkscreenFile = (project: Project, side: "top" | "bottom", config: SilkscreenConfig): string => {
  const configWithRotation = getConfigWithRotation(config);

  const dimensions = getProjectDimensions(project)
  const traceConfig: TraceConfig = {
    dimensions: dimensions,
    iterations: configWithRotation.iterations,
    mirror: side == "bottom",
    alignment: { ...configWithRotation },
    minFeedRate: config.minFeedRate,
    maxFeedRate: config.maxFeedRate,
    acceleration: config.acceleration,
    brush: config.brush
  }

  const state: GenerationState = { distance: 0 };

  return [
    "G21",
    "G90",
    "G94",
    `G0 F${configWithRotation.maxFeedRate.toFixed(0)}`,
    "G00 Z2.0000",
    "M03",
    "G28",
    "G4 P1",
    generateAlignmentDrillsCheckPoints(project, traceConfig),
    "G4 S3 ; count down",
    "M03 ; Empty commands so the printer has time to pause",
    "M03 ; Empty commands so the printer has time to pause",
    "M03 ; Empty commands so the printer has time to pause",
    generateTraces(side == "top" ? project.silkscreen_top : project.silkscreen_bottom, traceConfig, state),
    "G00 X0Y0",
    "M300 S2000 P500 ; Beep end",
    "M05",
  ].join("\n");
}

export const generateCopperFile = (project: Project, side: "top" | "bottom", config: TracesConfig): string => {
  const dimensions = getProjectDimensions(project)
  const traceConfig: TraceConfig = {
    dimensions: dimensions,
    iterations: config.iterations,
    mirror: side == "bottom",
    offsetX: config.offsetX,
    offsetY: config.offsetY,
    minFeedRate: config.minFeedRate,
    maxFeedRate: config.maxFeedRate,
    acceleration: config.acceleration,
    brush: config.brush
  }

  const state: GenerationState = { distance: 0 };

  return [
    "G21",
    "G90",
    "G94",
    `G0 F${config.maxFeedRate.toFixed(0)}`,
    "G00 Z3.0000",
    "M03",
    "G28",
    "G4 P1",
    config.cutoutProfile ? generateTraces(project.profile, traceConfig, state) : "; No profile cutout",
    generateTraces(side == "top" ? project.traces_top : project.traces_bottom, traceConfig, state),
    "G00 X0.0000Y0.0000Z3.0000",
    "M300 S2000 P500 ; Beep end",
    "M05",
  ].join("\n");
}