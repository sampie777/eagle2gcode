export enum FlatcamCopperLayer {
    Top = "Top",
    Bottom = "Bottom",
}

export type FlatcamConfig = {
    traces: {
        copperLayer: FlatcamCopperLayer
        mirror: boolean
        cutoutProfile: boolean
        offsetX: number
        offsetY: number
        diaWidth: number
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
    drills: {
        offsetX: number
        offsetY: number
    }
}