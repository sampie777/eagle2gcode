import { createContext, JSX, useContext } from "solid-js";
import { GcodeConfig, OutOfBoundsOption } from "../logic/types/gcode";
import { Persistency } from "../logic/utils/persistency";
import { createStore } from "solid-js/store";
import { SetStoreFunction } from "solid-js/store/types/store";

export const emptyConfig = (): GcodeConfig => ({
  traces: {
    outOfBounds: OutOfBoundsOption.Hide,
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
    outOfBounds: OutOfBoundsOption.Hide,
    offset: [],
    scalingFactor: 1,
    rotationAngle: 0,
    feedRate: 2000,
    iterations: 50,
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
