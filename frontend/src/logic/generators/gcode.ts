import {Dimension, Project} from "../types/project.ts";
import {GcodeConfig, Trace, TracesConfig, Location} from "../types/gcode.ts";
import {generateDrillAlignmentFile, generateDrillFile} from "./drills.ts";
import {getProjectDimensions} from "../processors/project.ts";

export namespace Gcode {
    function gcodeMoveCommand(location: Location, dimensions: Dimension, config: TracesConfig, linear: boolean = true) {
        const x = config.offsetX + location.x; // ((dimensions.x + dimensions.width) - (location.x - dimensions.x));
        const y = config.offsetY + location.y;
        return `G0${linear ? 1 : 0} X${x.toFixed(4)}Y${y.toFixed(4)}`;
    }

    function generateBackAndForthTraces(traces: Trace[], dimensions: Dimension, config: TracesConfig) {
        return traces
            .map(trace => [
                gcodeMoveCommand(trace[0], dimensions, config, false),
                `G01 Z0.0000`,
                ...Array.from(Array(config.iterations))
                    .flatMap((_, iteration) =>
                        trace.map((_, i) => {
                            // Use back and forth motion for the iterations
                            const it = trace[iteration % 2 == 0 ? i : trace.length - i - 1];
                            return gcodeMoveCommand(it, dimensions, config, true)
                        })
                    ),
                `G00 Z2.0000`]
                .join("\n")
            )
            .join("\n\n");
    }

    function generateContinuousTraces(traces: Trace[], dimensions: Dimension, config: TracesConfig) {
        return traces
            .map(trace => [
                gcodeMoveCommand(trace[0], dimensions, config, false),
                `G01 Z0.0000`,
                ...Array.from(Array(config.iterations))
                    .flatMap(_ =>
                        trace.map(it => gcodeMoveCommand(it, dimensions, config, true))
                    ),
                `G00 Z3.0000`]
                .join("\n")
            )
            .join("\n\n");
    }

    export const generateCopperFile = (project: Project, config: TracesConfig): string => {
        const dimensions = getProjectDimensions(project)
        return [
            "G21",
            "G90",
            "G94",
            `G0 F${config.feedRate.toFixed(0)}`,
            "G00 Z3.0000",
            "M03",
            "G28",
            "G4 P1",
            generateBackAndForthTraces(project.profile, dimensions, config),
            generateContinuousTraces(project.traces_top, dimensions, config),
            "G00 X0.0000Y0.0000Z3.0000",
            "M300 S2000 P500 ; Beep end",
            "M05",
        ].join("\n");
    }

    export const generateSilkscreenFile = (project: Project, config: TracesConfig): string => {
        const dimensions = getProjectDimensions(project)
        return [
            "G21",
            "G90",
            "G94",
            "G0 F1400.00",
            "G00 Z2.0000",
            "M03",
            "G28",
            "G4 P1",
            generateBackAndForthTraces(project.silkscreen_top, dimensions, config),
            "G00 X0Y0",
            "M300 S2000 P500 ; Beep end",
            "M05",
        ].join("\n");
    }

    export const generateFiles = (project: Project, config: GcodeConfig) => {
        return {
            "1_etching.gcode": generateCopperFile(project, config.traces),
            "2_drill_alignment.gcode": generateDrillAlignmentFile(project, config.drills),
            "3_silkscreen.gcode": generateSilkscreenFile(project, config.traces),
            "4_drills.gcode": generateDrillFile(project, config.drills),
        }
    }
}