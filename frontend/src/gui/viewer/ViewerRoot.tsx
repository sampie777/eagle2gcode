import { Component, createEffect, createSignal, Show } from "solid-js";
import { useProject } from "../ProjectContext";
import createCanvas from "./Canvas";
import './style.less';
import GcodeSettings from "./flatcam/GcodeSettings";
import { ScreenProps } from "../../logic/screens";
import { getProjectDimensions, setTracesVisibility } from "../../logic/processors/project";
import { useConfig } from "../ConfigContext";
import { TbArrowsMaximize, TbCube, TbFocus2, TbLayoutSidebar, TbLayoutSidebarRight } from "solid-icons/tb";

type Props = ScreenProps;

const ViewerRoot: Component<Props> = (props) => {
  const { config } = useConfig();
  const { project, projectVersion } = useProject();
  const [dimensions, setDimensions] = createSignal(getProjectDimensions(project));
  const [dockSide, setDockSide] = createSignal<"left" | "right">("right");
  const [isSettingsCollapsed, setIsSettingsCollapsed] = createSignal<boolean>(false);

  project.isLoaded = true;

  createEffect(() => {
    projectVersion();
    // Trigger on change of one of the following:
    [
      config.traces.outOfBounds,
      config.silkscreen.outOfBounds,
    ].forEach(() => null);

    setTracesVisibility(project, config);
    setDimensions(getProjectDimensions(project));
  });

  const projectName = () => {
    projectVersion();
    if (project.path == undefined) return "Unknown project";
    const projectPathSegments = project.path.split("/");
    return projectPathSegments[projectPathSegments.length - 1]
      .replace(/[_.\\-]/g, " ");
  };

  const projectAreaCm2 = () => {
    const d = dimensions();
    return ((d.width * d.height) / 100).toFixed(1);
  };

  const { rerender, Canvas, setCameraView } = createCanvas();

  return <div class={`Viewer dock-${dockSide()} ${isSettingsCollapsed() ? "settings-collapsed" : ""}`}>
    {/* Dynamic Top Bar with Metadata & Layout Controls */}
    <div class={"viewer-top-bar"}>
      <div class={"project-meta-pill"}>
        <h2 class={"project-title"}>{projectName()}</h2>
        <span class={"meta-badge dims"}>{dimensions().width.toFixed(1)} × {dimensions().height.toFixed(1)} mm</span>
        <span class={"meta-badge area"}>{projectAreaCm2()} cm²</span>
      </div>

      {/* Camera Presets & Dynamic Layout Controls */}
      <div class={"viewer-action-bar"}>
        <div class={"camera-presets-group"}>
          <button class={"cam-btn"} onClick={() => setCameraView?.("top")} title={"Top View (Look straight down)"}>
            <span>Top</span>
          </button>
          <button class={"cam-btn"} onClick={() => setCameraView?.("bottom")} title={"Bottom View (Inspect bottom traces)"}>
            <span>Bottom</span>
          </button>
          <button class={"cam-btn"} onClick={() => setCameraView?.("isometric")} title={"3D Isometric View"}>
            <TbCube size={14} />
            <span>3D</span>
          </button>
          <button class={"cam-btn"} onClick={() => setCameraView?.("reset")} title={"Reset View & Center Board"}>
            <TbFocus2 size={14} />
            <span>Fit</span>
          </button>
        </div>

        <div class={"bar-separator"} />

        <div class={"layout-actions-group"}>
          <button class={"layout-toggle-btn"}
                  onClick={() => setDockSide(d => d === "right" ? "left" : "right")}
                  title={dockSide() === "right" ? "Move Settings to Left screen edge" : "Move Settings to Right screen edge"}>
            {dockSide() === "right" ? <TbLayoutSidebarRight size={16} /> : <TbLayoutSidebar size={16} />}
            <span>{dockSide() === "right" ? "Dock Left" : "Dock Right"}</span>
          </button>

          <button class={`layout-toggle-btn ${isSettingsCollapsed() ? "active" : ""}`}
                  onClick={() => setIsSettingsCollapsed(c => !c)}
                  title={isSettingsCollapsed() ? "Show Settings Component" : "Maximize 3D Canvas (Hide Settings)"}>
            <TbArrowsMaximize size={16} />
            <span>{isSettingsCollapsed() ? "Show Settings" : "Maximize"}</span>
          </button>
        </div>
      </div>
    </div>

    {/* Dynamic Main Workspace Container */}
    <div class={"container"}>
      <div class={"viewer-canvas-column"}>
        <Canvas />
      </div>

      <Show when={!isSettingsCollapsed()}>
        <div class={"viewer-settings-column"}>
          <GcodeSettings onBack={props.onBack}
                         requestRender={rerender} />
        </div>
      </Show>
    </div>
  </div>;
};

export default ViewerRoot;
