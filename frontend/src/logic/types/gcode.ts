export type Location = {
    x: number,
    y: number,
}

export type Trace = Location[]

export enum GcodeCopperLayer {
    Top = "Top",
    Bottom = "Bottom",
}

export type DrillConfig = {
    offsetX: number,
    offsetY: number,
    feedRateMove: number,
    feedRateDrill: number,
    feedRateUp: number,
}

export type GcodeConfig = {
    traces: {
        copperLayer: GcodeCopperLayer
        mirror: boolean
        cutoutProfile: boolean
        offsetX: number
        offsetY: number
        feedrate: number
        iterations: number
        removeGndPads: boolean
        usePrinterBedMesh: boolean
    },
    silkscreen: {
        top: boolean
        bottom: boolean
        mirror: boolean
    },
    drills: DrillConfig
}