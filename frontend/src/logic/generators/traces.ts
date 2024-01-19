import {Dimension, Project} from "../types/project.ts";
import {Trace, TracesConfig, Location, SilkscreenConfig, Alignment} from "../types/gcode.ts";
import {getProjectAlignmentDrills, getProjectDimensions} from "../processors/project.ts";
import {calculateOffsetForPoint, calculateRotation} from "../utils/gcode.ts";

type TraceConfig = {
    iterations: number
    mirror: boolean
    dimensions: Dimension
    offsetX?: number
    offsetY?: number
    alignment?: Alignment
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

const generateBackAndForthTrace = (trace: Trace, config: TraceConfig) => {
    return Array.from(Array(config.iterations))
        .flatMap((_, iteration) =>
            trace.map((_, i) => {
                // Use back and forth motion for the iterations
                const it = trace[iteration % 2 == 0 ? i : trace.length - i - 1];
                return gcodeMoveCommand(it, config, true)
            })
        )
}

const generateContinuousTrace = (trace: Trace, config: TraceConfig) => {
    return Array.from(Array(config.iterations)).flatMap(_ =>
        trace.map(it => gcodeMoveCommand(it, config, true))
    )
}

const generateTraces = (traces: Trace[], config: TraceConfig) => {
    return traces
        .filter(it => it.length > 0)
        .map(trace => {
            const canBeContinuous = trace[0].x == trace[trace.length - 1].x && trace[0].y == trace[trace.length - 1].y;
            const gcode = canBeContinuous
                ? generateContinuousTrace(trace, config)
                : generateBackAndForthTrace(trace, config)

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

const precalculateRotation = (config: SilkscreenConfig) => {
    const {scalingFactor, rotationAngle} = calculateRotation(config.offset);
    config.scalingFactor = scalingFactor
    config.rotationAngle = rotationAngle
}

export const generateSilkscreenFile = (project: Project, side: "top" | "bottom", config: SilkscreenConfig): string => {
    const dimensions = getProjectDimensions(project)
    const traceConfig: TraceConfig = {
        dimensions: dimensions,
        iterations: config.iterations,
        mirror: side == "bottom",
        alignment: {...config}
    }

    precalculateRotation(config);

    return [
        "G21",
        "G90",
        "G94",
        `G0 F${config.feedRate.toFixed(0)}`,
        "G00 Z2.0000",
        "M03",
        "G28",
        "G4 P1",
        generateAlignmentDrillsCheckPoints(project, traceConfig),
        "G4 S3 ; count down",
        "M03 ; Empty commands so the printer has time to pause",
        "M03 ; Empty commands so the printer has time to pause",
        "M03 ; Empty commands so the printer has time to pause",
        generateTraces(side == "top" ? project.silkscreen_top : project.silkscreen_bottom, traceConfig),
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
        offsetY: config.offsetY
    }

    return [
        "G21",
        "G90",
        "G94",
        `G0 F${config.feedRate.toFixed(0)}`,
        "G00 Z3.0000",
        "M03",
        "G28",
        "G4 P1",
        config.cutoutProfile ? generateTraces(project.profile, traceConfig) : "; No profile cutout",
        generateTraces(side == "top" ? project.traces_top : project.traces_bottom, traceConfig),
        "G00 X0.0000Y0.0000Z3.0000",
        "M300 S2000 P500 ; Beep end",
        "M05",
    ].join("\n");
}