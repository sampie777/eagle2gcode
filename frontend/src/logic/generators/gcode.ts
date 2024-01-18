import {Dimension, Project} from "../types/project.ts";
import {Trace, TracesConfig, Location} from "../types/gcode.ts";
import {getProjectDimensions} from "../processors/project.ts";

export namespace Gcode {
    type TraceConfig = {
        dimensions: Dimension
        mirror: boolean
        offsetX: number
        offsetY: number
        iterations: number
    }

    export const outputFileNames = {
        etching_top: "1_etching_top.gcode",
        etching_bottom: "1_etching_bottom.gcode",
        drills_alignment_top: "2_drills_alignment_top.gcode",
        drills_top: "3_drills_top.gcode",
        silkscreen_top: "34silkscreen_top.gcode",
        silkscreen_bottom: "4_silkscreen_bottom.gcode",
    }

    function gcodeMoveCommand(location: Location, config: TraceConfig, linear: boolean = true) {
        const x = config.offsetX + (config.mirror
            ? ((config.dimensions.x + config.dimensions.width) - (location.x - config.dimensions.x))
            : location.x);
        const y = config.offsetY + location.y;
        return `G0${linear ? 1 : 0} X${x.toFixed(4)}Y${y.toFixed(4)}`;
    }

    function generateBackAndForthTraces(traces: Trace[], config: TraceConfig) {
        return traces
            .map(trace => [
                gcodeMoveCommand(trace[0], config, false),
                `G01 Z0.0000`,
                ...Array.from(Array(config.iterations))
                    .flatMap((_, iteration) =>
                        trace.map((_, i) => {
                            // Use back and forth motion for the iterations
                            const it = trace[iteration % 2 == 0 ? i : trace.length - i - 1];
                            return gcodeMoveCommand(it, config, true)
                        })
                    ),
                `G00 Z2.0000`]
                .join("\n")
            )
            .join("\n\n");
    }

    function generateContinuousTraces(traces: Trace[], config: TraceConfig) {
        return traces
            .map(trace => [
                gcodeMoveCommand(trace[0], config, false),
                `G01 Z0.0000`,
                ...Array.from(Array(config.iterations))
                    .flatMap(_ =>
                        trace.map(it => gcodeMoveCommand(it, config, true))
                    ),
                `G00 Z3.0000`]
                .join("\n")
            )
            .join("\n\n");
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
            config.cutoutProfile ? generateBackAndForthTraces(project.profile, traceConfig) : "; No profile cutout",
            generateContinuousTraces(side == "top" ? project.traces_top : project.traces_bottom, traceConfig),
            "G00 X0.0000Y0.0000Z3.0000",
            "M300 S2000 P500 ; Beep end",
            "M05",
        ].join("\n");
    }

    export const generateSilkscreenFile = (project: Project, side: "top" | "bottom", config: TracesConfig): string => {
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
            "G00 Z2.0000",
            "M03",
            "G28",
            "G4 P1",
            generateBackAndForthTraces(side == "top" ? project.silkscreen_top : project.silkscreen_bottom, traceConfig),
            "G00 X0Y0",
            "M300 S2000 P500 ; Beep end",
            "M05",
        ].join("\n");
    }
}