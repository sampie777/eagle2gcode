import {Aperture, ApertureOperation} from "../types/cam";

export namespace Gerber {
    export type GerberConfig = {
        apertures: { [key: string]: Aperture },
        unitFactor: number,
    };

    export const operationCodeToString = (code: number): ApertureOperation => {
        switch (code) {
            case 1:
                return "open";
            case 2:
                return "closed";
            case 3:
                return "flash";
        }
        console.error("Undefined operation", code)
    }

    const apertureToAperture = (shape: string, dimensions: string[]): Aperture =>{
        if (shape == "C") return {
            shape: "circle",
            diameter: +dimensions[0],
            innerDiameter: dimensions.length > 1 ? +dimensions[1] : undefined,
        }
        if (shape == "R" && dimensions.length > 0 && dimensions.length < 3) return {
            shape: "rectangle",
            width: +dimensions[0],
            height: dimensions.length > 1 ? +dimensions[1] : +dimensions[0],
            innerDiameter: dimensions.length > 2 ? +dimensions[2] : undefined,
        }
        if (shape == "P") return {
            shape: "polygon",
            diameter: +dimensions[0],
            vertices: +dimensions[1],
            rotation: dimensions.length > 2 ? +dimensions[2] : 0,
            innerDiameter: dimensions.length > 3 ? +dimensions[3] : undefined,
        }
        if (shape == "O") return {
            shape: "obround",
            width: +dimensions[0],
            height: +dimensions[1],
            innerDiameter: dimensions.length > 2 ? +dimensions[2] : undefined,
        }
        console.error("Undefined aperture", shape, dimensions)
    }

    export const preprocessGerberFile = (content: string): GerberConfig => {
        const apertures: { [key: string]: Aperture } = {};
        let unitFactor = 1; // mm or mil
        let unitDecimalFactor = 1 / 1000;

        const storeUnit = (line: string) => {
            const match = line.match(/^MO(.*)\*/)
            if (match == null) throw new Error(`Could not process line due to unknown structure: '${line}'`)

            const [_, unit] = match;
            if (unit.toLowerCase() == "mm") {
                unitFactor = 1;
            } else {
                unitFactor = 39.3701;
            }
        }

        const storeFactor = (line: string) => {
            const match = line.match(/^FS..X\d(\d)/)
            if (match == null) throw new Error(`Could not process line due to unknown structure: '${line}'`)

            const [_, factor] = match;
            unitDecimalFactor = 1 / Math.pow(10, +factor)
        }

        const storeAperture = (line: string) => {
            const match = line.match(/^ADD(\d+)([A-Z]),(.*)\*/)
            if (match == null) throw new Error(`Could not process line due to unknown structure: '${line}'`)

            const [_, id, shape, _dimensions] = match;
            const dimensions = _dimensions.split("X");

            apertures[id] = apertureToAperture(shape, dimensions);
        };

        content
            .replace(/%/g, "")
            .split("\n")
            .forEach(line => {
                if (line.match(/^MO./)) return storeUnit(line);
                if (line.match(/^FS../)) return storeFactor(line);
                if (line.match(/^ADD\d+/)) return storeAperture(line);
            })

        return {
            apertures: apertures,
            unitFactor: unitFactor * unitDecimalFactor
        }
    }
}