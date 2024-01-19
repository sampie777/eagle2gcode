export type Location = {
    x: number,
    y: number,
}

export type Trace = Location[]

export type TracesConfig = {
    cutoutProfile: boolean
    offsetX: number
    offsetY: number
    feedRate: number
    iterations: number
};

export type DrillConfig = {
    offset: {
        original: Location,
        actual: Location
    }[],
    scalingFactor: number,
    rotationAngle: number,
    feedRateMove: number,
    feedRateDrill: number,
    feedRateUp: number,
}

export type GcodeConfig = {
    traces: TracesConfig,
    drills: DrillConfig
}