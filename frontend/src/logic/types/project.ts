import {Drill, GerberCommand, Job} from "./cam.ts";
import {Eagle} from "./eagle.ts";
import {Trace} from "./gcode.ts";


export type Project = {
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