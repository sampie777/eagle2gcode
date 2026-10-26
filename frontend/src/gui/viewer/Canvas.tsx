import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { useProject } from "../ProjectContext";
import { Graphics } from "../../logic/graphics/graphics";
import { AiOutlineReload } from "solid-icons/ai";
import { TbLayersLinked } from "solid-icons/tb";
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
    ].forEach(() => null);
    renderProject();
  });

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
    }, config);
  };

  return {
    rerender: renderProject,
    Canvas: () => (<div class={"Canvas"}>
      <div ref={wrapperRef} class={"canvas-wrapper"}>
        {canvas}
      </div>

      <div class={"canvas-control"}>
        <div class={"canvas-toolbar-top"}>
          <button class={"rerender-btn"} onClick={renderProject} title={"Rerender 3D scene"}>
            <AiOutlineReload />
            <span>Redraw</span>
          </button>

          <div class={"opacity-slider-group"}>
            <TbLayersLinked size={16} class={"opacity-icon"} />
            <label for={"boardOpacity"}>Substrate opacity</label>
            <input type="range"
                   min={0} max={100} value={Math.round(boardOpacity() * 100)}
                   onInput={e => setBoardOpacity(+e.target.value / 100)}
                   id="boardOpacity" />
            <span class={"opacity-val"}>{Math.round(boardOpacity() * 100)}%</span>
          </div>
        </div>

        <div class={"control-checkboxes"}>
          <ControlOption name={"Traces (top)"}
                         color={"#e67e22"}
                         isChecked={showTopTraces()}
                         onChange={setShowTopTraces} />
          <ControlOption name={"Traces (bottom)"}
                         color={"#e74c3c"}
                         isChecked={showBottomTraces()}
                         onChange={setShowBottomTraces} />
          <ControlOption name={"Silkscreen"}
                         color={"#cbd5e1"}
                         isChecked={showSilkscreen()}
                         onChange={setShowSilkscreen} />
          <ControlOption name={"Soldermask"}
                         color={"#2ecc71"}
                         isChecked={showSoldermask()}
                         onChange={setShowSoldermask} />
          <ControlOption name={"Drills"}
                         color={"#d946ef"}
                         isChecked={showDrills()}
                         onChange={setShowDrills} />
          <ControlOption name={"Grid"}
                         color={"#38bdf8"}
                         isChecked={showGrid()}
                         onChange={setShowGrid} />
          <ControlOption name={"Debug alignment holes"}
                         color={"#facc15"}
                         isChecked={showAlignmentHolesDebug()}
                         onChange={setShowAlignmentHolesDebug}
                         title={"Yellow: alignment hole, Pink: actual location, White: calculated location"} />
          <ControlOption name={"Debug offset drill holes"}
                         color={"#94a3b8"}
                         isChecked={showOffsetDrillHolesDebug()}
                         onChange={setShowOffsetDrillHolesDebug} />
        </div>
      </div>
    </div>)
  };
};

export default createCanvas;
