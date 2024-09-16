import {Aperture, GerberCommand} from "../types/cam.ts";
import {Gerber} from "./gerberutils.ts";


export const processGerberFile = (content: string): GerberCommand[] => {
    const config = Gerber.preprocessGerberFile(content);

    const result: GerberCommand[] = [];
    let lastAperture: Aperture | undefined;

    const useNewAperture = (line: string) => {
        const match = line.match(/^D(\d+)\*/);
        if (match == null) throw new Error(`Could not process line due to unknown structure: '${line}'`)

        const [_, id] = match;
        lastAperture = config.apertures[id];
    }

    const useNewLocation = (line: string) => {
        const match = line.match(/^X(-?\d+)Y(-?\d+)D(\d+)\*/)
        if (match == null) throw new Error(`Could not process line due to unknown structure: '${line}'`)

        const [_, x, y, operation] = match;
        const lastLocation = {x: +x * config.unitFactor, y: +y * config.unitFactor};

        if (lastAperture === undefined) {
            console.error("No last aperture defined");
        }

        result.push({
            x: lastLocation.x,
            y: lastLocation.y,
            operation: Gerber.operationCodeToString(+operation),
            aperture: lastAperture!,
        })
    }

    content
        .replace(/%/g, "")
        .split("\n")
        .forEach(line => {
            if (line.match(/^D\d+/)) return useNewAperture(line);
            if (line.match(/^[XY]\d+/)) return useNewLocation(line);
        })

    return result
}