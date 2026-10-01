import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
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
  const { project, projectVersion } = useProject();
  const { config } = useConfig();
  const { canvas, update, resize } = Graphics.start({ width: 1100, height: 600 });
  let wrapperRef: HTMLDivElement | undefined;

  onMount(() => {
    if (!wrapperRef) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.floor(entry.contentRect.width);
        if (width > 0) {
          const height = Math.min(650, Math.max(400, Math.round(width * 0.58)));
          resize(width, height);
        }
      }
    });
    observer.observe(wrapperRef);
    onCleanup(() => observer.disconnect());
  });

  createEffect(() => {
    projectVersion();
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
      <div ref={wrapperRef} class={"canvas-wrapper"}>
        {canvas}
      </div>

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
