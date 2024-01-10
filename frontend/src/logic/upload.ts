import {processDrillFile} from "./processors/drill.ts";
import {processJobFile} from "./processors/job.ts";
import {processGerberFile} from "./processors/gerber.ts";
import {useProject} from "../gui/ProjectContext.ts";
import {processBoardFile} from "./processors/board.ts";

export namespace Upload {
    export type Type = {
        file: File
        content?: string
        status: "waiting" | "reading" | "done"
    }

    export const fileMatchers = {
        board: /^.+\.brd/,
        // job: /^gerber_job\.gbrjob/,
        // profile: /^profile\.gbr/,
        // copper_top: /^copper_top\.gbr/,
        // copper_bottom: /^copper_bottom\.gbr/,
        // soldermask_top: /^soldermask_top\.gbr/,
        // soldermask_bottom: /^soldermask_bottom\.gbr/,
        // silkscreen_top: /^silkscreen_top\.gbr/,
        // silkscreen_bottom: /^silkscreen_bottom\.gbr/,
        // drill: /^drill_1_16\.xln/,
    }

    export const allFilesUploaded = (uploads: Type[]) => Object.values(fileMatchers)
        .every(matcher => uploads.some(it => it.file.name.match(matcher)))

    export const processFile = (name: string, content: string) => {
        const project = useProject();

        if (name.match(fileMatchers.board)) return project.board = processBoardFile(content)
        // if (name.match(fileMatchers.job)) return project.job = processJobFile(content)
        // if (name.match(fileMatchers.profile)) return project.profile = processGerberFile(content)
        // if (name.match(fileMatchers.copper_top)) return project.copper_top = processGerberFile(content)
        // if (name.match(fileMatchers.copper_bottom)) return project.copper_bottom = processGerberFile(content)
        // if (name.match(fileMatchers.soldermask_top)) return project.soldermask_top = processGerberFile(content)
        // if (name.match(fileMatchers.soldermask_bottom)) return project.soldermask_bottom = processGerberFile(content)
        // if (name.match(fileMatchers.silkscreen_top)) return project.silkscreen_top = processGerberFile(content)
        // if (name.match(fileMatchers.silkscreen_bottom)) return project.silkscreen_bottom = processGerberFile(content)
        // if (name.match(fileMatchers.drill)) return project.drills = processDrillFile(content)
    }
}