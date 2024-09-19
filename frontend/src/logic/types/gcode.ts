export type Location = {
    x: number,
    y: number,
}

export type Trace = ({ enabled: boolean } & Location)[]

export enum OutOfBoundsOption {
    Ignore = "Ignore",
    Hide = "Hide",
    Crop = "Crop",
}

export type Alignment = {
    offset: {
        original: Location,
        actual: Location
    }[],
    scalingFactor: number,
    rotationAngle: number,
}

export type TracesConfig = {
    cutoutProfile: boolean
    outOfBounds: OutOfBoundsOption
    offsetX: number
    offsetY: number
    feedRate: number
    iterations: number
};

export type DrillConfig = {
    feedRateMove: number,
    feedRateDrill: number,
    feedRateUp: number,
} & Alignment;

export type SilkscreenConfig = {
    outOfBounds: OutOfBoundsOption
    feedRate: number
    iterations: number
} & Alignment;

export type GcodeConfig = {
    traces: TracesConfig
    drills: DrillConfig
    silkscreen: SilkscreenConfig
}