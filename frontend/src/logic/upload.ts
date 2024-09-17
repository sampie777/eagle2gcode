import {processDrillFile} from "./processors/drill";
import {processBoardFile} from "./processors/board";
import {Flatcam} from "./flatcam";
import {processTraces} from "./processors/traces";
import {Project} from "./types/project";
import {Eagle} from "./types/eagle";

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

    export const isProjectAvailable = (project: Project): boolean => {
        if (project.profile.length > 0) return true;
        if (project.traces_top.length > 0) return true;
        if (project.traces_bottom.length > 0) return true;
        if (project.silkscreen_top.length > 0) return true;
        if (project.silkscreen_bottom.length > 0) return true;
        if (project.soldermask_top.length > 0) return true;
        if (project.soldermask_bottom.length > 0) return true;
        if (project.drills.length > 0) return true;
        if (isBoardAvailable(project.board)) return true;
        return false;
    }

    export const isBoardAvailable = (board: Eagle.Board): boolean => {
        if (board.layers.length > 0) return true;
        if (board.libraries.length > 0) return true;
        if (board.plain.length > 0) return true;
        if (board.components.length > 0) return true;
        if (board.signals.length > 0) return true;
        return false;
    }

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