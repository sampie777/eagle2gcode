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
  const [showSilkscreenTop, setShowSilkscreenTop] = createSignal(true);
  const [showSilkscreenBottom, setShowSilkscreenBottom] = createSignal(true);
  const [showSoldermask, setShowSoldermask] = createSignal(false);
  const [showDrills, setShowDrills] = createSignal(true);
  const [showGrid, setShowGrid] = createSignal(false);
  const [showAlignmentHolesDebug, setShowAlignmentHolesDebug] = createSignal(false);
  const [showOffsetDrillHolesDebug, setShowOffsetDrillHolesDebug] = createSignal(false);
  const { project, projectVersion } = useProject();
  const { config } = useConfig();
  const { canvas, update, resize, setCameraView } = Graphics.start({ width: 1100, height: 600 });
  let wrapperRef: HTMLDivElement | undefined;

  const calculateTargetHeight = (width: number) => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 900;
    // Allow the canvas to expand with screen height, optimizing view while retaining space for controls
    const optimalHeight = Math.max(460, Math.min(vh - 200, 850));
    return Math.min(optimalHeight, Math.max(420, Math.round(width * 0.58)));
  };

  onMount(() => {
    if (!wrapperRef) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.floor(entry.contentRect.width);
        if (width > 0) {
          const height = calculateTargetHeight(width);
          resize(width, height);
        }
      }
    });
    observer.observe(wrapperRef);

    const onWindowResize = () => {
      if (!wrapperRef) return;
      const width = Math.floor(wrapperRef.clientWidth);
      if (width > 0) {
        const height = calculateTargetHeight(width);
        resize(width, height);
      }
    };
    window.addEventListener("resize", onWindowResize);

    onCleanup(() => {
      observer.disconnect();
      window.removeEventListener("resize", onWindowResize);
    });
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
      showSilkscreenTop: showSilkscreenTop(),
      showSilkscreenBottom: showSilkscreenBottom(),
      showSoldermask: showSoldermask(),
      showDrills: showDrills(),
      showGrid: showGrid(),
      showAlignmentHolesDebug: showAlignmentHolesDebug(),
      showOffsetDrillHolesDebug: showOffsetDrillHolesDebug(),
    }, config);
  };

  return {
    rerender: renderProject,
    setCameraView,
    Canvas: () => (<div class={"Canvas"}>
      <div ref={wrapperRef} class={"canvas-wrapper"}>
        {canvas}
      </div>

      <div class={"canvas-control"}>
        <div class={"canvas-toolbar-top"}>
          <div class={"toolbar-left"}>
            <button class={"rerender-btn"} onClick={renderProject} title={"Rerender 3D scene"}>
              <AiOutlineReload />
              <span>Redraw</span>
            </button>

            <div class={"cam-quick-presets"}>
              <button class={"cam-mini-btn"} onClick={() => setCameraView("top")} title={"Top View (Look straight down)"}>
                Top
              </button>
              <button class={"cam-mini-btn"} onClick={() => setCameraView("bottom")} title={"Bottom View (Inspect bottom traces)"}>
                Bottom
              </button>
              <button class={"cam-mini-btn"} onClick={() => setCameraView("isometric")} title={"3D Isometric View"}>
                3D
              </button>
              <button class={"cam-mini-btn"} onClick={() => setCameraView("reset")} title={"Reset View & Center Board"}>
                Fit
              </button>
            </div>
          </div>

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
          <ControlOption name={"Silkscreen (top)"}
                         color={"#cbd5e1"}
                         isChecked={showSilkscreenTop()}
                         onChange={setShowSilkscreenTop} />
          <ControlOption name={"Silkscreen (bottom)"}
                         color={"#94a3b8"}
                         isChecked={showSilkscreenBottom()}
                         onChange={setShowSilkscreenBottom} />
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
