import { createContext, JSX, useContext } from "solid-js";
import { GcodeConfig, OutOfBoundsOption } from "../logic/types/gcode";
import { Persistency } from "../logic/utils/persistency";
import { createStore } from "solid-js/store";
import { SetStoreFunction } from "solid-js/store/types/store";

const defaultBrush = {
  enabled: true,
  posAx: 106.9, posAy: 113.3, posAz: 7.3,
  posBx: 114.2, posBy: 148.9, posBz: 7.0,
  distanceThreshold: 25000
};

export const emptyConfig = (): GcodeConfig => ({
  traces: {
    outOfBounds: OutOfBoundsOption.Hide,
    cutoutProfile: true,
    offsetX: 34,
    offsetY: 26,
    minFeedRate: 600,
    maxFeedRate: 2500,
    acceleration: 500,
    iterations: 40,
    brush: { ...defaultBrush }
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
    outOfBounds: OutOfBoundsOption.Hide,
    offset: [],
    scalingFactor: 1,
    rotationAngle: 0,
    minFeedRate: 1600,
    maxFeedRate: 3000,
    acceleration: 500,
    iterations: 50,
    brush: { ...defaultBrush }
  }
});

export const ConfigContext = createContext<{
  config: GcodeConfig,
  loadConfig: (from: GcodeConfig) => void,
  reloadConfig: () => void,
  updateConfigValue: SetStoreFunction<GcodeConfig>,
}>({
  config: emptyConfig(),
  loadConfig: () => console.error("Function hasn't been loaded properly"),
  reloadConfig: () => console.error("Function hasn't been loaded properly"),
  updateConfigValue: () => console.error("Function hasn't been loaded properly"),
});

export const ConfigProvider = (props: { children: JSX.Element }) => {
  const [config, setConfig] = createStore(Persistency.loadAll()?.config ?? emptyConfig());

  const loadConfig = (from: GcodeConfig | null | undefined) => {
    if (from == null) return;
    setConfig("traces", from.traces)
    setConfig("drills", {
      ...from.drills,
      offset: [...from.drills.offset],
    })
    setConfig("silkscreen", {
      ...from.silkscreen,
      offset: [...from.silkscreen.offset],
    })
  }

  return <ConfigContext.Provider value={{
    config: config,
    loadConfig: (from: GcodeConfig) => loadConfig(from),
    reloadConfig: () => loadConfig(Persistency.loadAll()?.config),
    updateConfigValue: setConfig
  }}>
    {props.children}
  </ConfigContext.Provider>
}

export const useConfig = () => useContext(ConfigContext)
