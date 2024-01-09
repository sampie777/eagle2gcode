export namespace Upload {
    export type Type = {
        file: File
        content?: string
        status: "waiting" | "reading" | "done"
    }

    export const fileMatchers = {
        "board": /.+\.brd/,
        "profile": /profile\.gbr/,
        "job": /gerber_job\.gbrjob/,
        "copper top": /copper_top\.gbr/,
        "copper bottom": /copper_bottom\.gbr/,
        "soldermask top": /soldermask_top\.gbr/,
        "soldermask bottom": /soldermask_bottom\.gbr/,
        "silkscreen top": /silkscreen_top\.gbr/,
        "silkscreen bottom": /silkscreen_bottom\.gbr/,
        "drill": /drill_1_16\.xln/,
    }

    export const allFilesUploaded = (uploads: Type[]) => Object.values(fileMatchers)
        .every(matcher => uploads.some(it => it.file.name.match(matcher)))
}