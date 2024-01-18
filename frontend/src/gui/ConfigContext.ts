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
        offsetX: 12.6,
        offsetY: 6.9,
        feedRateMove: 1400,
        feedRateDrill: 10,
        feedRateUp: 50,
    }
});

const loadConfig = (to: GcodeConfig, from: GcodeConfig | null | undefined) => {
    if (from == null) return;
    to.traces.cutoutProfile = from.traces.cutoutProfile
    to.traces.offsetX = from.traces.offsetX
    to.traces.offsetY = from.traces.offsetY
    to.traces.feedRate = from.traces.feedRate
    to.traces.iterations = from.traces.iterations
    to.drills.offsetX = from.drills.offsetX
    to.drills.offsetY = from.drills.offsetY
    to.drills.feedRateMove = from.drills.feedRateMove
    to.drills.feedRateDrill = from.drills.feedRateDrill
    to.drills.feedRateUp = from.drills.feedRateUp
}

const defaultValue = emptyConfig();
export const ConfigContext = createContext<{ config: GcodeConfig, loadConfig: (from?: GcodeConfig) => void }>({
    config: defaultValue,
    loadConfig: (from = Persistency.loadAll()?.config) => loadConfig(defaultValue, from)
});

export const useConfig = () => useContext(ConfigContext)