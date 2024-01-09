export type Point = {
    x: number,
    y: number,
}

export type Drill = {
    x: number,
    y: number,
    size: number,
}

export type Profile = Point[];

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

export type Project = {
    isLoaded: boolean,
    job: Job,
    profile: Profile,
    copper_top: GerberCommand[],
    copper_bottom: GerberCommand[],
    soldermask_top: GerberCommand[],
    soldermask_bottom: GerberCommand[],
    silkscreen_top: GerberCommand[],
    silkscreen_bottom: GerberCommand[],
    drills: Drill[],
}