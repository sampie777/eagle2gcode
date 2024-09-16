import {Drill} from "../types/cam.ts";

export const processDrillFile = (content: string): Drill[] => {
    const result: Drill[] = [];
    const toolSizes: { [key: string]: number } = {};
    let unitFactor = 1 / 1000;
    let lastLocation = {x: 0, y: 0};
    let lastTool = "";

    const storeFactor = (line: string) => {
        const match = line.match(/^(.+),(.+),(.+)$/)
        if (match == null) throw new Error(`Could not process line due to unknown structure: '${line}'`)

        const [_, unit, tz, factor] = match;
        unitFactor = 1 / Math.pow(10, factor.split(".")[1].length);
        if (unit.toLowerCase() != "metric") {
            unitFactor /= 39.3701;  // mil to mm
        }
    }

    const storeNewTool = (line: string) => {
        const match = line.match(/^T(\d+)C(.*?)$/)
        if (match == null) throw new Error(`Could not process line due to unknown structure: '${line}'`)

        const [_, tool, size] = match;
        toolSizes[tool] = +size;
    }

    const useNewLocation = (line: string) => {
        const match = line.match(/^X(-?\d+)Y(-?\d+)$/)
        if (match == null) throw new Error(`Could not process line due to unknown structure: '${line}'`)

        const [_, x, y] = match;
        lastLocation = {x: +x * unitFactor, y: +y * unitFactor};

        result.push({
            x: lastLocation.x,
            y: lastLocation.y,
            size: toolSizes[lastTool],
        })
    }

    const useNewTool = (line: string) => {
        const match = line.match(/^T(\d+)$/)
        if (match == null) throw new Error(`Could not process line due to unknown structure: '${line}'`)

        const [_, tool] = match;
        lastTool = tool;
    }

    content
        .split("\n")
        .forEach(line => {
            if (line.match(/^.+,.+,\d+\.\d+/)) return storeFactor(line);
            if (line.match(/^T\d+C\d+/)) return storeNewTool(line);
            if (line.match(/^[XY]\d+/)) return useNewLocation(line);
            if (line.match(/^T\d+$/)) return useNewTool(line);
        })

    return result
}