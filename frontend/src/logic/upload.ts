import {processDrillFile} from "./processors/drill.ts";
import {processJobFile} from "./processors/job.ts";
import {processGerberFile} from "./processors/gerber.ts";
import {useProject} from "../gui/ProjectContext.ts";
import {processBoardFile} from "./processors/board.ts";
import {Flatcam} from "./flatcam.ts";
import {processTraces} from "./processors/traces.ts";
import {Project} from "./types/project.ts";

export namespace Upload {
    export type Type = {
        file: File
        content?: string
        status: "waiting" | "reading" | "done"
    }

    export const fileMatchers = {
        profile: RegExp(`^${Flatcam.TRACES_PROFILE_OUTPUT_FILE}$`),
        traces_top: RegExp(`^${Flatcam.TRACES_TOP_OUTPUT_FILE}$`),
        traces_bottom: RegExp(`^${Flatcam.TRACES_BOTTOM_OUTPUT_FILE}$`),
        silkscreen_top: RegExp(`^${Flatcam.SILKSCREEN_TOP_OUTPUT_FILE}$`),
        silkscreen_bottom: RegExp(`^${Flatcam.SILKSCREEN_BOTTOM_OUTPUT_FILE}$`),
        soldermask_top: RegExp(`^${Flatcam.SOLDERMASK_TOP_OUTPUT_FILE}$`),
        soldermask_bottom: RegExp(`^${Flatcam.SOLDERMASK_BOTTOM_OUTPUT_FILE}$`),
        drill: /^drill_1_16\.xln/,
        board: /^.+\.brd/,
    }

    export const allFilesUploaded = (uploads: Type[]) => Object.values(fileMatchers)
        .every(matcher => uploads.some(it => it.file.name.match(matcher)))

    export const processFile = (project: Project, name: string, content: string) => {
        if (name.match(fileMatchers.board)) return project.board = processBoardFile(content)
        if (name.match(fileMatchers.profile)) return project.profile = processTraces(content)
        if (name.match(fileMatchers.traces_top)) return project.traces_top = processTraces(content)
        if (name.match(fileMatchers.traces_bottom)) return project.traces_bottom = processTraces(content)
        if (name.match(fileMatchers.silkscreen_top)) return project.silkscreen_top = processTraces(content)
        if (name.match(fileMatchers.silkscreen_bottom)) return project.silkscreen_bottom = processTraces(content)
        if (name.match(fileMatchers.soldermask_top)) return project.soldermask_top = processTraces(content)
        if (name.match(fileMatchers.soldermask_bottom)) return project.soldermask_bottom = processTraces(content)
        if (name.match(fileMatchers.drill)) return project.drills = processDrillFile(content)
    }
}