import {Project} from "./types/project.ts";
import {Trace} from "./types/gcode.ts";

export namespace Gcode {
    function generateBackAndForthTraces(traces: Trace[], iterations: number) {
        return traces
            .map(trace => [
                `G00 X${trace[0].x.toFixed(4)}Y${trace[0].y.toFixed(4)}`,
                `G01 Z0.0000`,
                ...Array.from(Array(iterations))
                    .flatMap((_, iteration) =>
                        trace.map((_, i) => {
                            // Use back and forth motion for the iterations
                            const it = trace[iteration % 2 == 0 ? i : trace.length - i - 1];
                            return `G01 X${it.x.toFixed(4)}Y${it.y.toFixed(4)}`
                        })
                    ),
                `G00 Z2.0000`]
                .join("\n")
            )
            .join("\n\n");
    }

    function generateContinuousTraces(traces: Trace[], iterations: number) {
        return traces
            .map(trace => [
                `G00 X${trace[0].x.toFixed(4)}Y${trace[0].y.toFixed(4)}`,
                `G01 Z0.0000`,
                ...Array.from(Array(iterations))
                    .flatMap(_ =>
                        trace.map(it => `G01 X${it.x.toFixed(4)}Y${it.y.toFixed(4)}`)
                    ),
                `G00 Z2.0000`]
                .join("\n")
            )
            .join("\n\n");
    }

    export const generateCopperFile = (project: Project, iterations = 2): string => {
        const header = "";
        const footer = "";

        return [header,
            generateBackAndForthTraces(project.profile, iterations),
            generateContinuousTraces(project.traces_top, iterations),
            footer,
        ].join("\n");
    }

    export const generateSilkscreenFile = (project: Project, iterations = 2): string => {
        const header = "";
        const footer = "";

        return [header,
            generateBackAndForthTraces(project.silkscreen_top, iterations),
            footer,
        ].join("\n");
    }

    export const generateFiles = (project: Project) => {
        return {
            "etching": generateCopperFile(project),
            "silkscreen": generateSilkscreenFile(project),
        }
    }
}