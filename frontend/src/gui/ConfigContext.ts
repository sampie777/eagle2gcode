import {createContext, useContext} from "solid-js";
import {GcodeConfig} from "../logic/types/gcode.ts";
import {Persistency} from "../logic/utils/persistency.ts";

export const emptyConfig = (): GcodeConfig => ({
    traces: {
        cutoutProfile: true,
        offsetX: 34,
        offsetY: 26,
        feedRate: 1400,
        iterations: 40,
    },
    drills: {
        offset: [],
        scalingFactor: 1,
        rotationAngle: 0,
        feedRateMove: 2000,
        feedRateDrill: 10,
        feedRateUp: 50,
    },
    silkscreen: {
        offset: [],
        scalingFactor: 1,
        rotationAngle: 0,
        feedRate: 2000,
        iterations: 50,
    }
});

const loadConfig = (to: GcodeConfig, from: GcodeConfig | null | undefined) => {
    if (from == null) return;
    to.traces.cutoutProfile = from.traces.cutoutProfile
    to.traces.offsetX = from.traces.offsetX
    to.traces.offsetY = from.traces.offsetY
    to.traces.feedRate = from.traces.feedRate
    to.traces.iterations = from.traces.iterations

    to.drills.offset = [...from.drills.offset]
    to.drills.scalingFactor = from.drills.scalingFactor
    to.drills.rotationAngle = from.drills.rotationAngle
    to.drills.feedRateMove = from.drills.feedRateMove
    to.drills.feedRateDrill = from.drills.feedRateDrill
    to.drills.feedRateUp = from.drills.feedRateUp

    to.silkscreen.offset = [...from.silkscreen.offset]
    to.silkscreen.scalingFactor = from.silkscreen.scalingFactor
    to.silkscreen.rotationAngle = from.silkscreen.rotationAngle
    to.silkscreen.feedRate = from.silkscreen.feedRate
    to.silkscreen.iterations = from.silkscreen.iterations
}

const defaultValue = emptyConfig();
export const ConfigContext = createContext<{ config: GcodeConfig, loadConfig: (from?: GcodeConfig) => void }>({
    config: defaultValue,
    loadConfig: (from = Persistency.loadAll()?.config) => loadConfig(defaultValue, from)
});

export const useConfig = () => useContext(ConfigContext)