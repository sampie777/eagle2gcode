import {Drill} from "./cam";
import {Eagle} from "./eagle";
import {Trace} from "./gcode";


export type Project = {
    path?: string,
    isLoaded: boolean,
    profile: Trace[],
    traces_top: Trace[],
    traces_bottom: Trace[],
    silkscreen_top: Trace[],
    silkscreen_bottom: Trace[],
    soldermask_top: Trace[],
    soldermask_bottom: Trace[],
    drills: Drill[],
    board: Eagle.Board,
}

export type Dimension = {
    x: number,
    y: number,
    width: number,
    height: number
}