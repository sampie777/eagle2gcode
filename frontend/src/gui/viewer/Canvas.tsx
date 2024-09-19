import { createEffect, createSignal } from "solid-js";
import { useProject } from "../ProjectContext";
import { Graphics } from "../../logic/graphics/graphics";
import { AiOutlineReload } from "solid-icons/ai";
import { useConfig } from "../ConfigContext";
import ControlOption from "./menu/ControlOption";

const createCanvas = () => {
  const [boardOpacity, setBoardOpacity] = createSignal(0);
  const [showTopTraces, setShowTopTraces] = createSignal(true);
  const [showBottomTraces, setShowBottomTraces] = createSignal(true);
  const [showSilkscreen, setShowSilkscreen] = createSignal(true);
  const [showSoldermask, setShowSoldermask] = createSignal(false);
  const [showDrills, setShowDrills] = createSignal(true);
  const [showGrid, setShowGrid] = createSignal(true);
  const [showAlignmentHolesDebug, setShowAlignmentHolesDebug] = createSignal(false);
  const [showOffsetDrillHolesDebug, setShowOffsetDrillHolesDebug] = createSignal(false);
  const { project } = useProject();
  const { config } = useConfig();
  const { canvas, update } = Graphics.start({ width: 1300, height: 600 });

  createEffect(() => {
    // Trigger on change of one of the following:
    [
      config.traces.cutoutProfile,
      config.traces.outOfBounds,
      ...config.drills.offset.map(it => it.actual.x),
      ...config.drills.offset.map(it => it.actual.y),
      ...config.silkscreen.offset.map(it => it.actual.x),
      ...config.silkscreen.offset.map(it => it.actual.y),
      config.silkscreen.outOfBounds,
    ].forEach(() => null)
    renderProject();
  })

  const renderProject = () => {
    update(project, {
      boardOpacity: boardOpacity(),
      showProfile: true,
      showTopTraces: showTopTraces(),
      showBottomTraces: showBottomTraces(),
      showSilkscreen: showSilkscreen(),
      showSoldermask: showSoldermask(),
      showDrills: showDrills(),
      showGrid: showGrid(),
      showAlignmentHolesDebug: showAlignmentHolesDebug(),
      showOffsetDrillHolesDebug: showOffsetDrillHolesDebug(),
    }, config)
  }

  return {
    rerender: renderProject,
    Canvas: () => (<div class={"Canvas"}>
      {canvas}

      <div class={"canvas-control"}>
        <button onClick={renderProject} title={"Rerender"}>
          <AiOutlineReload />
        </button>

        <label for={"boardOpacity"}>Board opacity</label>
        <input type="range"
               min={0} max={100} value={boardOpacity() * 100}
               onInput={e => setBoardOpacity(+e.target.value / 100)}
               id="boardOpacity" />

        <div class={"control-checkboxes"}>
        <ControlOption name={"Traces (top)"} isChecked={showTopTraces()} onChange={setShowTopTraces} />
        <ControlOption name={"Traces (bottom)"} isChecked={showBottomTraces()} onChange={setShowBottomTraces} />
        <ControlOption name={"Silkscreen"} isChecked={showSilkscreen()} onChange={setShowSilkscreen} />
        <ControlOption name={"Soldermask"} isChecked={showSoldermask()} onChange={setShowSoldermask} />
        <ControlOption name={"Drills"} isChecked={showDrills()} onChange={setShowDrills} />
        <ControlOption name={"Grid"} isChecked={showGrid()} onChange={setShowGrid} />
        <ControlOption name={"Debug alignment holes"} isChecked={showAlignmentHolesDebug()}
                       onChange={setShowAlignmentHolesDebug}
                       title={"Yellow will be the alignment hole itself, pink will be the actual location, white will be the calculated location"} />
        <ControlOption name={"Debug offset drill holes"} isChecked={showOffsetDrillHolesDebug()}
                       onChange={setShowOffsetDrillHolesDebug} />
        </div>
      </div>
    </div>)
  }
}

export default createCanvas;