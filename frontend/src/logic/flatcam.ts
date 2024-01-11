import {FlatcamConfig} from "./types/flatcam.ts";

export namespace Flatcam {
    export const generateCommands = (config: FlatcamConfig): string => {
        return JSON.stringify(config);
    }
}