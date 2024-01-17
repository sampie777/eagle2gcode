import {Dimension, Project} from "../types/project.ts";
import {Trace, Location} from "../types/gcode.ts";
import {Drill} from "../types/cam.ts";

export const getProjectDimensions = (project: Project): Dimension => {
    let minX: number | undefined;
    let maxX: number | undefined;
    let minY: number | undefined;
    let maxY: number | undefined;

    const checkForBoundaries = (it: Location) => {
        if (minX == undefined || it.x < minX) minX = it.x;
        if (maxX == undefined || it.x > maxX) maxX = it.x;
        if (minY == undefined || it.y < minY) minY = it.y;
        if (maxY == undefined || it.y > maxY) maxY = it.y;
    }

    const checkTracesForBoundaries = (trace: Trace) =>
        trace.forEach(it => {
            checkForBoundaries(it);
        });

    project.profile.forEach(trace => checkTracesForBoundaries(trace))
    project.traces_top.forEach(trace => checkTracesForBoundaries(trace))
    project.traces_bottom.forEach(trace => checkTracesForBoundaries(trace))
    project.silkscreen_top.forEach(trace => checkTracesForBoundaries(trace))
    project.silkscreen_bottom.forEach(trace => checkTracesForBoundaries(trace))
    project.soldermask_top.forEach(trace => checkTracesForBoundaries(trace))
    project.soldermask_bottom.forEach(trace => checkTracesForBoundaries(trace))

    if (minX == undefined && minY == undefined) {
        project.drills.forEach(drill => checkForBoundaries(drill))
    }

    return {
        x: minX ?? 0,
        y: minY ?? 0,
        width: maxX != undefined ? maxX - minX : 0,
        height: maxY != undefined ? maxY - minY : 0
    }
}

export const getProjectAlignmentDrills = (project: Project): Drill[] => {
    let leftMostHole: Drill | undefined;
    let rightMostHole: Drill | undefined;
    project.drills
        .filter(it => it.size < 1.5)
        .forEach(it => {
            if (leftMostHole == undefined || it.x < leftMostHole.x) leftMostHole = it;
            if (rightMostHole == undefined || it.x > rightMostHole.x) rightMostHole = it;
        })

    if (leftMostHole == undefined || rightMostHole == undefined) {
        // If there are no small drills, then ignore the size constraint
        project.drills
            .forEach(it => {
                if (leftMostHole == undefined || it.x < leftMostHole.x) leftMostHole = it;
                if (rightMostHole == undefined || it.x > rightMostHole.x) rightMostHole = it;
            })
    }

    if (leftMostHole == undefined) leftMostHole = rightMostHole;
    if (rightMostHole == undefined) rightMostHole = leftMostHole;
    if (leftMostHole == undefined || rightMostHole == undefined) return [];

    return [leftMostHole, rightMostHole];
}