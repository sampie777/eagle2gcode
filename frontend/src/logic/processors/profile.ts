import {Profile} from "../types.ts";
import {Gerber} from "./gerberutils.ts";

export const processProfileFile = (content: string): Profile => {
    const config = Gerber.preprocessGerberFile(content);

    const result: Profile = [];

    const useNewLocation = (line: string) => {
        const [_, x, y] = line.match(/^X(\d+)Y(\d+)D/)
        const lastLocation = {x: +x * config.unitFactor, y: +y * config.unitFactor};

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