import { Dimension, Project } from "../types/project";
import { Trace, Location, OutOfBoundsOption, GcodeConfig } from "../types/gcode";
import { Drill } from "../types/cam";
import { length } from "../utils/math";

export const getBoundaries = (locations: Location[]): Dimension & { minimumPointWasUndefined: boolean } => {
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

  locations.forEach(checkForBoundaries)

  return {
    x: minX ?? 0,
    y: minY ?? 0,
    width: maxX != undefined ? maxX - (minX ?? 0) : 0,
    height: maxY != undefined ? maxY - (minY ?? 0) : 0,
    minimumPointWasUndefined: minX == undefined && minY == undefined,
  }
}

export const getProjectDimensions = (project: Project): Dimension => {
  const allTraces: Trace = [
    project.profile,
    project.traces_top,
    project.traces_bottom,
    project.silkscreen_top,
    project.silkscreen_bottom,
    project.soldermask_top,
    project.soldermask_bottom
  ]
    .flatMap(traces => traces.flatMap(trace => trace.filter(it => it.enabled)))
  const dimension = getBoundaries(allTraces)

  if (dimension.minimumPointWasUndefined) {
    const drillDimension = getBoundaries(project.drills)

    if (dimension.x == undefined || drillDimension.x < dimension.x) dimension.x = drillDimension.x;
    if (dimension.y == undefined || drillDimension.y < dimension.y) dimension.y = drillDimension.y;
    if (dimension.width == undefined || drillDimension.x + drillDimension.width > dimension.x + dimension.width) dimension.width = drillDimension.width;
    if (dimension.height == undefined || drillDimension.y + drillDimension.height > dimension.y + dimension.height) dimension.height = drillDimension.height;
  }

  return dimension;
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
  const profileDimensions = getBoundaries(project.profile.flatMap(it => it))

  const process = (traces: Trace[], outOfBounds: OutOfBoundsOption) => traces.forEach(trace => {
    const checkIfOutOfBounds = (it: Location) =>
      it.x < profileDimensions.x
      || it.y < profileDimensions.y
      || it.x > profileDimensions.x + profileDimensions.width
      || it.y > profileDimensions.y + profileDimensions.height

    if (outOfBounds == OutOfBoundsOption.Ignore) {
      trace.forEach(it => it.enabled = true)
    } else if (outOfBounds == OutOfBoundsOption.Hide) {
      const isOutOfBounds = trace.some(checkIfOutOfBounds)
      trace.forEach(it => it.enabled = !isOutOfBounds)
    } else if (outOfBounds == OutOfBoundsOption.Crop) {
      trace.forEach(it => it.enabled = !checkIfOutOfBounds(it))
    }
  })

  process(project.traces_top, config.traces.outOfBounds)
  process(project.traces_bottom, config.traces.outOfBounds)
  process(project.soldermask_top, config.traces.outOfBounds)
  process(project.soldermask_bottom, config.traces.outOfBounds)
  process(project.silkscreen_top, config.silkscreen.outOfBounds)
  process(project.silkscreen_bottom, config.silkscreen.outOfBounds)
}