import { Location, Trace } from "../types/gcode.ts";

export const processTraces = (content: string): Trace[] => {
    const result: Trace[] = [];
    let lastLocation: Location | undefined

    const mergeTracesIfPossible = () => {
        if (lastLocation == undefined || result.length < 2 || result[result.length - 1].length != 1) return;

        const previousTrace = result[result.length - 2]
        if (previousTrace.length == 0) return;

        const previousTraceLastLocation = previousTrace[previousTrace.length - 1];
        if (!(previousTraceLastLocation.x == lastLocation.x && previousTraceLastLocation.y == lastLocation.y)) return;

        result.pop();
        result[result.length - 1].push({
            enabled: true,
            x: lastLocation.x,
            y: lastLocation.y,
        })
    }

    const processMoveCommand = (line: string) => {
        if (result.length > 0 && lastLocation != undefined) {
            result[result.length - 1].push({
                enabled: true,
                x: lastLocation.x,
                y: lastLocation.y,
            })

            mergeTracesIfPossible();
        }

        const match = line.match(/^G0[01] X(-?[0-9.]+)Y(-?[0-9.]+)$/)
        if (match == null) throw new Error(`Could not process line due to unknown structure: '${line}'`)

        const [_, x, y] = match;
        lastLocation = { x: +x, y: +y };
    }

    const useNewTrace = (line: string) => {
        result.push([]);
    }

    content
        .split("\n")
        .forEach(line => {
            if (line.match(/^G0[01] Z0/)) return useNewTrace(line);
            if (line.match(/^G0[01] X/)) return processMoveCommand(line);
        })
    return result;
}