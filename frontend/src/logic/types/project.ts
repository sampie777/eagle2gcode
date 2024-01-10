import {Drill, GerberCommand, Job} from "./cam.ts";
import {Eagle} from "./eagle.ts";


export type Project = {
    isLoaded: boolean,
    job: Job,
    profile: GerberCommand[],
    copper_top: GerberCommand[],
    copper_bottom: GerberCommand[],
    soldermask_top: GerberCommand[],
    soldermask_bottom: GerberCommand[],
    silkscreen_top: GerberCommand[],
    silkscreen_bottom: GerberCommand[],
    drills: Drill[],
    board: Eagle.Board,
}