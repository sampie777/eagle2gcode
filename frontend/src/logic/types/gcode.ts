export type Location = {
    x: number,
    y: number,
}

export type Trace = Location[]

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
    feedRate: number,
    iterations: number,
} & Alignment;

export type GcodeConfig = {
    traces: TracesConfig
    drills: DrillConfig
    silkscreen: SilkscreenConfig
}