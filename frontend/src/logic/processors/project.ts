import {Project} from "../types/project.ts";
import {Trace} from "../types/gcode.ts";

export const getProjectDimensions = (project: Project): { x: number, y: number, width: number, height: number } => {
    let minX = 100;
    let maxX = 0;
    let minY = 100;
    let maxY = 0;

    const checkForBoundaries = (trace: Trace) => {
        trace.forEach(it => {
            if (it.x < minX) minX = it.x;
            if (it.x > maxX) maxX = it.x;
            if (it.y < minY) minY = it.y;
            if (it.y > maxY) maxY = it.y;
        });
    }

    project.profile.forEach(trace => checkForBoundaries(trace))
    project.traces_top.forEach(trace => checkForBoundaries(trace))
    project.traces_bottom.forEach(trace => checkForBoundaries(trace))
    project.silkscreen_top.forEach(trace => checkForBoundaries(trace))
    project.silkscreen_bottom.forEach(trace => checkForBoundaries(trace))
    project.soldermask_top.forEach(trace => checkForBoundaries(trace))
    project.soldermask_bottom.forEach(trace => checkForBoundaries(trace))

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    }
}