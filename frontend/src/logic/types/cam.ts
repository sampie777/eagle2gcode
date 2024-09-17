import {Location} from "./gcode";

export type Point = {
    x: number,
    y: number,
}

export type Drill = {
    size: number,
} & Location

export type Job = {
    title: string
    width: number,
    height: number,
}

export type ApertureOperation = "open" | "closed" | "flash";
export type Aperture = ApertureCircle | ApertureRectangle | AperturePolygon | ApertureObround;

export type ApertureCircle = {
    shape: "circle",
    diameter: number,
    innerDiameter?: number,
}
export type ApertureRectangle = {
    shape: "rectangle",
    width: number,
    height: number,
    innerDiameter?: number,
}
export type AperturePolygon = {
    shape: "polygon",
    vertices: number,
    diameter: number,   // outer diameter, so all the vertices should fit inside
    rotation: number,   // in degrees
    innerDiameter?: number,
}
export type ApertureObround = {
    shape: "obround",
    width: number,
    height: number,
    innerDiameter?: number,
}

export type GerberCommand = {
    x: number,
    y: number,
    operation: ApertureOperation,
    aperture: Aperture,
}