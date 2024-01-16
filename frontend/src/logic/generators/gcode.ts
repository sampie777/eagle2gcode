import {Dimension, Project} from "../types/project.ts";
import {GcodeConfig, Trace, TracesConfig, Location} from "../types/gcode.ts";
import {generateDrillAlignmentFile, generateDrillFile} from "./drills.ts";
import {getProjectDimensions} from "../processors/project.ts";

export namespace Gcode {
    type TraceConfig = {
        dimensions: Dimension
        mirror: boolean
        offsetX: number
        offsetY: number
        iterations: number
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
            generateBackAndForthTraces(project.profile, traceConfig),
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

    export const generateFiles = (project: Project, config: GcodeConfig) => {
        return {
            "1_etching_top.gcode": generateCopperFile(project, "top", config.traces),
            "1_etching_bottom.gcode": generateCopperFile(project, "bottom", config.traces),
            "2_drill_alignment_bottom.gcode": generateDrillAlignmentFile(project, config.drills),
            "3_silkscreen_top.gcode": generateSilkscreenFile(project, "top", config.traces),
            "3_silkscreen_bottom.gcode": generateSilkscreenFile(project, "bottom", config.traces),
            "4_drills_top.gcode": generateDrillFile(project, config.drills),
        }
    }
}