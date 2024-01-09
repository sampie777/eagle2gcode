import {processDrillFile} from "./processors/drill.ts";
import {processProfileFile} from "./processors/profile.ts";
import {processJobFile} from "./processors/job.ts";
import {processGerberFile} from "./processors/gerber.ts";

export namespace Upload {
    export type Type = {
        file: File
        content?: string
        status: "waiting" | "reading" | "done"
    }

    export const fileMatchers = {
        board: /^.+\.brd/,
        profile: /^profile\.gbr/,
        job: /^gerber_job\.gbrjob/,
        copper_top: /^copper_top\.gbr/,
        copper_bottom: /^copper_bottom\.gbr/,
        soldermask_top: /^soldermask_top\.gbr/,
        soldermask_bottom: /^soldermask_bottom\.gbr/,
        silkscreen_top: /^silkscreen_top\.gbr/,
        silkscreen_bottom: /^silkscreen_bottom\.gbr/,
        drill: /^drill_1_16\.xln/,
    }

    export const allFilesUploaded = (uploads: Type[]) => Object.values(fileMatchers)
        .every(matcher => uploads.some(it => it.file.name.match(matcher)))

    export const processFile = (name: string, content: string) => {
        if (name.match(fileMatchers.drill)) return processDrillFile(content)
        if (name.match(fileMatchers.profile)) return processProfileFile(content)
        if (name.match(fileMatchers.job)) return processJobFile(content)
        if (name.match(fileMatchers.copper_top)) return processGerberFile(content)
        if (name.match(fileMatchers.copper_bottom)) return processGerberFile(content)
        if (name.match(fileMatchers.soldermask_top)) return processGerberFile(content)
        if (name.match(fileMatchers.soldermask_bottom)) return processGerberFile(content)
        if (name.match(fileMatchers.silkscreen_top)) return processGerberFile(content)
        if (name.match(fileMatchers.silkscreen_bottom)) return processGerberFile(content)
    }
}