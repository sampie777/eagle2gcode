import {Drill} from "../types.ts";

export const processDrillFile = (content: string): Drill[] => {
    const result: Drill[] = [];
    const toolSizes: { [key: string]: number } = {};
    let unitFactor = 1 / 1000;
    let lastLocation = {x: 0, y: 0};
    let lastTool = "";

    const storeFactor = (line: string) => {
        const [_, unit, tz, factor] = line.match(/(.+),(.+),(.+)$/)
        unitFactor = 1 / Math.pow(10, factor.split(".")[1].length);
        if (unit.toLowerCase() != "metric") {
            unitFactor /= 39.3701;  // mil to mm
        }
    }

    const storeNewTool = (line: string) => {
        const [_, tool, size] = line.match(/T(\d+)C(.*?)$/)
        toolSizes[tool] = +size;
    }

    const useNewLocation = (line: string) => {
        const [_, x, y] = line.match(/X(\d+)Y(\d+)$/)
        lastLocation = {x: +x * unitFactor, y: +y * unitFactor};

        result.push({
            x: lastLocation.x,
            y: lastLocation.y,
            size: toolSizes[lastTool],
        })
    }

    const useNewTool = (line: string) => {
        const [_, tool] = line.match(/T(\d+)$/)
        lastTool = tool;
    }

    content
        .split("\n")
        .forEach(line => {
            if (line.match(/.+,.+,\d+\.\d+/)) return storeFactor(line);
            if (line.match(/T\d+C\d+/)) return storeNewTool(line);
            if (line.match(/[XY]\d+/)) return useNewLocation(line);
            if (line.match(/T\d+$/)) return useNewTool(line);
        })

    return result
}