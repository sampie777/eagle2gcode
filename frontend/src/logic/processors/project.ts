import {Dimension, Project} from "../types/project.ts";
import {Trace} from "../types/gcode.ts";
import {Drill} from "../types/cam.ts";

export const getProjectDimensions = (project: Project): Dimension => {
    let minX = 10000;
    let maxX = -10000;
    let minY = 10000;
    let maxY = -10000;

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