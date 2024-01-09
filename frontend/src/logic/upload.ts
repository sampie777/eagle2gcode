import {processDrillFile} from "./processors/drill.ts";

export namespace Upload {
    export type Type = {
        file: File
        content?: string
        status: "waiting" | "reading" | "done"
    }

    export const fileMatchers = {
        board: /.+\.brd/,
        profile: /profile\.gbr/,
        job: /gerber_job\.gbrjob/,
        copper_top: /copper_top\.gbr/,
        copper_bottom: /copper_bottom\.gbr/,
        soldermask_top: /soldermask_top\.gbr/,
        soldermask_bottom: /soldermask_bottom\.gbr/,
        silkscreen_top: /silkscreen_top\.gbr/,
        silkscreen_bottom: /silkscreen_bottom\.gbr/,
        drill: /drill_1_16\.xln/,
    }

    export const allFilesUploaded = (uploads: Type[]) => Object.values(fileMatchers)
        .every(matcher => uploads.some(it => it.file.name.match(matcher)))

    export const processFile = (name: string, content: string) => {
        if (name.match(fileMatchers.drill)) {
            return processDrillFile(content)
        }
    }

}