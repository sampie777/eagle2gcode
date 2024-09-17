import {Dimension, Project} from "../types/project";
import { Trace, Location, OutOfBoundsOption, GcodeConfig } from "../types/gcode";
import {Drill} from "../types/cam";
import {length} from "../utils/math";

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
        width: maxX != undefined ? maxX - (minX ?? 0) : 0,
        height: maxY != undefined ? maxY - (minY ?? 0) : 0
    }
}

export const getProjectAlignmentDrills = (project: Project): Drill[] => {
    let leftMostHole: Drill | undefined;
    let rightMostHole: Drill | undefined;

    project.drills
        .filter(it => it.size < 1.5)
        .forEach(it => {
            if (leftMostHole == undefined || length(it) < length(leftMostHole)) leftMostHole = it;
            if (rightMostHole == undefined || length(it) > length(rightMostHole)) rightMostHole = it;
        })

    if (leftMostHole == undefined || rightMostHole == undefined) {
        // If there are no small drills, then ignore the size constraint
        project.drills
            .forEach(it => {
                if (leftMostHole == undefined || length(it) < length(leftMostHole)) leftMostHole = it;
                if (rightMostHole == undefined || length(it) > length(rightMostHole)) rightMostHole = it;
            })
    }

    if (leftMostHole == undefined) leftMostHole = rightMostHole;
    if (rightMostHole == undefined) rightMostHole = leftMostHole;
    if (leftMostHole == undefined || rightMostHole == undefined) return [];

    return [leftMostHole, rightMostHole];
}

export const setTracesVisibility = (project: Project, config: GcodeConfig) => {
    const process = (traces: Trace[]) => traces.forEach(trace => {
        if (config.silkscreen.outOfBounds == OutOfBoundsOption.Ignore) {
            trace.forEach(it => it.enabled = true)
        } else if (config.silkscreen.outOfBounds == OutOfBoundsOption.Hide) {
            const isOutOfBounds = trace.some(it => it.x < 0 || it.y < 0)
            trace.forEach(it => it.enabled = !isOutOfBounds)
        } else if (config.silkscreen.outOfBounds == OutOfBoundsOption.Crop) {
            trace.forEach(it => it.enabled = it.x >= 0 && it.y >= 0)
        }
    })

    process(project.silkscreen_top)
    process(project.silkscreen_bottom)
}