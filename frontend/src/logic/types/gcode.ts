export type Location = {
    x: number,
    y: number,
}

export type Trace = Location[]

export enum GcodeCopperLayer {
    Top = "Top",
    Bottom = "Bottom",
}

export type TracesConfig = {
    copperLayer: GcodeCopperLayer
    mirror: boolean
    cutoutProfile: boolean
    offsetX: number
    offsetY: number
    feedRate: number
    iterations: number
    removeGndPads: boolean
    usePrinterBedMesh: boolean
};

export type DrillConfig = {
    offsetX: number,
    offsetY: number,
    feedRateMove: number,
    feedRateDrill: number,
    feedRateUp: number,
}

export type GcodeConfig = {
    traces: TracesConfig,
    silkscreen: {
        top: boolean
        bottom: boolean
        mirror: boolean
    },
    drills: DrillConfig
}