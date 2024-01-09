import {Profile} from "../types.ts";

export const processProfileFile = (content: string): Profile => {
    const result: Profile = [];
    let unitFactor = 1 / 10000;

    const useNewLocation = (line: string) => {
        const [_, x, y] = line.match(/^X(\d+)Y(\d+)D/)
        const lastLocation = {x: +x * unitFactor, y: +y * unitFactor};

        result.push({
            x: lastLocation.x,
            y: lastLocation.y,
        })
    }

    content
        .split("\n")
        .forEach(line => {
            if (line.match(/^[XY]\d+/)) return useNewLocation(line);
        })

    return result
}