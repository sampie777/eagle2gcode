import { Component, createEffect, createSignal, For, Show } from "solid-js";
import SettingsContainer from "./../../components/settings/SettingsContainer";
import SettingCheck from "./../../components/settings/SettingCheck";
import SettingNumber from "./../../components/settings/SettingNumber";
import SettingCombo from "../../components/settings/SettingCombo";
import './style.less';
import { useProject } from "../../ProjectContext";
import { Gcode } from "../../../logic/generators/gcode";
import DownloadButton from "./DownloadButton";
import { generateDrillFile } from "../../../logic/generators/drills";
import { emptyConfig, useConfig } from "../../ConfigContext";
import { getProjectAlignmentDrills, setTracesVisibility } from "../../../logic/processors/project";
import { generateCopperFile, generateSilkscreenFile } from "../../../logic/generators/traces";
import { OutOfBoundsOption } from "../../../logic/types/gcode";
import {
  getAcidDurationForTraces,
  getGcodeDurationForTraces,
  getLength,
  getTravelLength
} from "../../../logic/utils/gcode";
import {
  TbActivity,
  TbArrowLeft,
  TbArrowsMove,
  TbBrush,
  TbCheck,
  TbCircleDot,
  TbCpu,
  TbCrop,
  TbFileDownload,
  TbGauge,
  TbLetterT,
  TbRefresh,
  TbRotateClockwise,
  TbScissors,
  TbSparkles,
  TbTarget
} from "solid-icons/tb";
import { AiOutlineClockCircle } from "solid-icons/ai";

type Props = {
  onBack?: () => void
  requestRender: () => void
}

type TabKey = "traces" | "drills" | "silkscreen" | "all";

const GcodeSettings: Component<Props> = (props) => {
  const { config, loadConfig, updateConfigValue } = useConfig();
  const { project, projectVersion } = useProject();
  const [activeTab, setActiveTab] = createSignal<TabKey>("traces");
  const [feedback, setFeedback] = createSignal<string | null>(null);

  const onChangeDrills = (value: Object) => updateConfigValue("drills", value);
  const onChangeSilkscreen = (value: Object) => updateConfigValue("silkscreen", value);

  const isNewBoardOrUnset = () => {
    const alignmentHoles = getProjectAlignmentDrills(project);
    if (!config.drills?.offset || config.drills.offset.length !== alignmentHoles.length) return true;
    if (!config.silkscreen?.offset || config.silkscreen.offset.length !== alignmentHoles.length) return true;
    const holesMismatch = alignmentHoles.some((hole, i) =>
      config.drills.offset[i]?.original?.x !== hole.x ||
      config.drills.offset[i]?.original?.y !== hole.y ||
      config.silkscreen.offset[i]?.original?.x !== hole.x ||
      config.silkscreen.offset[i]?.original?.y !== hole.y
    );
    if (holesMismatch) return true;

    const tracesOffsetX = config.traces.offsetX ?? 0;
    const tracesOffsetY = config.traces.offsetY ?? 0;
    if (tracesOffsetX !== 0 || tracesOffsetY !== 0) {
      const silkscreenMissingTraceOffset = config.silkscreen.offset.some(
        it => it.actual.x === it.original.x && it.actual.y === it.original.y
      );
      const drillsMissingTraceOffset = config.drills.offset.some(
        it => it.actual.x === it.original.x && it.actual.y === it.original.y
      );
      if (silkscreenMissingTraceOffset || drillsMissingTraceOffset) return true;
    }

    return false;
  };

  const updateOffsets = (tracesOffsetX = config.traces.offsetX, tracesOffsetY = config.traces.offsetY) => {
    const alignmentHoles = getProjectAlignmentDrills(project);
    const drillOffsets = alignmentHoles.map((it) => ({
      original: it,
      actual: { x: it.x + tracesOffsetX, y: it.y + tracesOffsetY },
    }));
    const silkscreenOffset = alignmentHoles.map((it) => ({
      original: it,
      actual: { x: it.x + tracesOffsetX, y: it.y + tracesOffsetY },
    }));
    onChangeDrills({ offset: drillOffsets });
    onChangeSilkscreen({ offset: silkscreenOffset });
    props.requestRender?.();
  };

  const onChangeTraces = (value: { [key: string]: any }) => {
    updateConfigValue("traces", value);
    if ("offsetX" in value || "offsetY" in value) {
      const newOffsetX = "offsetX" in value ? value.offsetX : config.traces.offsetX;
      const newOffsetY = "offsetY" in value ? value.offsetY : config.traces.offsetY;
      updateOffsets(newOffsetX, newOffsetY);
    }
  };

  if (isNewBoardOrUnset()) {
    updateOffsets();
  }

  createEffect(() => {
    projectVersion();
    if (isNewBoardOrUnset()) {
      updateOffsets();
    }
  });

  createEffect((prev?: { offsetX: number, offsetY: number }) => {
    const offsetX = config.traces.offsetX;
    const offsetY = config.traces.offsetY;

    if (prev !== undefined && (prev.offsetX !== offsetX || prev.offsetY !== offsetY)) {
      updateOffsets(offsetX, offsetY);
    }

    return { offsetX, offsetY };
  });

  const resetConfig = () => {
    const empty = emptyConfig();
    loadConfig(empty);
    updateOffsets(empty.traces.offsetX, empty.traces.offsetY);
    props.requestRender?.();
    setFeedback("Settings restored to defaults");
    setTimeout(() => setFeedback(null), 2500);
  };

  const allTopTraces = () => {
    projectVersion();
    return [...(config.traces.cutoutProfile ? project.profile : []), ...project.traces_top];
  };

  const allBottomTraces = () => {
    projectVersion();
    return [...(config.traces.cutoutProfile ? project.profile : []), ...project.traces_bottom];
  };

  const hasTopTraces = () => allTopTraces().length > 0;
  const hasBottomTraces = () => allBottomTraces().length > 0;
  const hasDrills = () => (project.drills?.length ?? 0) > 0;
  const hasSilkscreenTop = () => (project.silkscreen_top?.length ?? 0) > 0;
  const hasSilkscreenBottom = () => (project.silkscreen_bottom?.length ?? 0) > 0;

  return <div class={"FlatcamSettings"}>
    {/* Tab Navigation Bar */}
    <div class={"settings-tab-nav"}>
      <button class={`tab-btn ${activeTab() === "traces" ? "active" : ""}`}
              onClick={() => setActiveTab("traces")}
              title={"Copper Traces Configuration"}>
        <span class={"tab-icon"}><TbCpu /></span>
        <span>Traces</span>
      </button>

      <button class={`tab-btn ${activeTab() === "drills" ? "active" : ""}`}
              onClick={() => setActiveTab("drills")}
              title={"Drill Calibration & Speed"}>
        <span class={"tab-icon"}><TbCircleDot /></span>
        <span>Drills</span>
      </button>

      <button class={`tab-btn ${activeTab() === "silkscreen" ? "active" : ""}`}
              onClick={() => setActiveTab("silkscreen")}
              title={"Silkscreen Configuration"}>
        <span class={"tab-icon"}><TbLetterT /></span>
        <span>Silkscreen</span>
      </button>

      <button class={`tab-btn ${activeTab() === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
              title={"Download All G-Code Files"}>
        <span class={"tab-icon"}><TbFileDownload /></span>
        <span>All Files</span>
      </button>
    </div>

    {/* Reset Feedback Notification */}
    <Show when={feedback()}>
      <div class={"reset-toast"}>
        <TbCheck size={16} />
        <span>{feedback()}</span>
      </div>
    </Show>

    {/* TRACES TAB */}
    <Show when={activeTab() === "traces"}>
      <SettingsContainer name={"Traces Configuration"} icon={<TbCpu />} visible={true}>
        <div class={"setting-section-title"}>
          <span class={"section-icon"}><TbArrowsMove size={14} /></span>
          <span>Position & Cutout</span>
        </div>

        <SettingNumber label={"Offset X"}
                       defaultValue={config.traces.offsetX}
                       unit={"mm"}
                       step={0.1}
                       icon={<TbArrowsMove />}
                       hint={"Horizontal CNC machine offset relative to origin"}
                       onChange={(value) => onChangeTraces({ offsetX: value })} />

        <SettingNumber label={"Offset Y"}
                       defaultValue={config.traces.offsetY}
                       unit={"mm"}
                       step={0.1}
                       icon={<TbArrowsMove />}
                       hint={"Vertical CNC machine offset relative to origin"}
                       onChange={(value) => onChangeTraces({ offsetY: value })} />

        <SettingCheck label={"Cutout Profile"}
                      defaultValue={config.traces.cutoutProfile}
                      icon={<TbScissors />}
                      hint={"Include outer PCB perimeter cutout toolpath"}
                      onChange={(value) => onChangeTraces({ cutoutProfile: value })} />

        <SettingCombo label={"Out of Bounds (Profile)"}
                      values={Object.values(OutOfBoundsOption)}
                      defaultValue={config.traces.outOfBounds}
                      icon={<TbCrop />}
                      hint={"Behavior when traces exceed outer cutout boundary"}
                      onChange={(value) => {
                        setTracesVisibility(project, {
                          ...config,
                          traces: { ...config.traces, outOfBounds: value as OutOfBoundsOption }
                        });
                        onChangeTraces({ outOfBounds: value });
                      }} />

        <div class={"setting-section-title"}>
          <span class={"section-icon"}><TbGauge size={14} /></span>
          <span>Speeds & Passes</span>
        </div>

        <SettingNumber label={"Feed rate (min)"}
                       defaultValue={config.traces.minFeedRate}
                       min={1}
                       step={100}
                       unit={"mm/min"}
                       icon={<TbGauge />}
                       hint={"Speed when plunging and rounding sharp corners"}
                       onChange={(value) => onChangeTraces({ minFeedRate: value })} />

        <SettingNumber label={"Feed rate (max)"}
                       defaultValue={config.traces.maxFeedRate}
                       min={1}
                       step={100}
                       unit={"mm/min"}
                       icon={<TbGauge />}
                       hint={"Maximum speed along straight line segments"}
                       onChange={(value) => onChangeTraces({ maxFeedRate: value })} />

        <SettingNumber label={"Acceleration"}
                       defaultValue={config.traces.acceleration}
                       min={1}
                       step={50}
                       unit={"mm/s²"}
                       icon={<TbActivity />}
                       hint={"Rate of acceleration and deceleration along paths"}
                       onChange={(value) => onChangeTraces({ acceleration: value })} />

        <SettingNumber label={"Iterations"}
                       defaultValue={config.traces.iterations}
                       min={1}
                       step={1}
                       unit={"passes"}
                       icon={<TbRefresh />}
                       hint={"Number of engraving passes per trace"}
                       onChange={(value) => onChangeTraces({ iterations: value })} />

        <SettingsContainer name={"Auto-Cleaning Brush"}
                           icon={<TbBrush />}
                           visible={config.traces.brush.enabled}
                           badge={config.traces.brush.enabled ? "Active" : "Off"}>
          <SettingCheck label={"Enable Brush Cleaning"}
                        defaultValue={config.traces.brush.enabled}
                        icon={<TbSparkles />}
                        onChange={(value) => updateConfigValue("traces", "brush", "enabled", value)} />

          <SettingNumber label={"Distance Threshold"}
                         defaultValue={config.traces.brush.distanceThreshold}
                         step={1000}
                         unit={"mm"}
                         hint={"Total cutting distance traveled before pausing to brush"}
                         onChange={(value) => updateConfigValue("traces", "brush", "distanceThreshold", value)} />

          <div class={"brush-coords-grid"}>
            <span class={"coord-row-title"}>Brush Start (Position A)</span>
            <div class={"coord-inputs"}>
              <SettingNumber label={"X"}
                             defaultValue={config.traces.brush.posAx}
                             step={0.1}
                             onChange={(value) => updateConfigValue("traces", "brush", "posAx", value)} />
              <SettingNumber label={"Y"}
                             defaultValue={config.traces.brush.posAy}
                             step={0.1}
                             onChange={(value) => updateConfigValue("traces", "brush", "posAy", value)} />
              <SettingNumber label={"Z"}
                             defaultValue={config.traces.brush.posAz}
                             step={0.1}
                             onChange={(value) => updateConfigValue("traces", "brush", "posAz", value)} />
            </div>

            <span class={"coord-row-title"}>Brush End (Position B)</span>
            <div class={"coord-inputs"}>
              <SettingNumber label={"X"}
                             defaultValue={config.traces.brush.posBx}
                             step={0.1}
                             onChange={(value) => updateConfigValue("traces", "brush", "posBx", value)} />
              <SettingNumber label={"Y"}
                             defaultValue={config.traces.brush.posBy}
                             step={0.1}
                             onChange={(value) => updateConfigValue("traces", "brush", "posBy", value)} />
              <SettingNumber label={"Z"}
                             defaultValue={config.traces.brush.posBz}
                             step={0.1}
                             onChange={(value) => updateConfigValue("traces", "brush", "posBz", value)} />
            </div>
          </div>
        </SettingsContainer>

        {/* Quick Downloads for Traces */}
        <div class={"tab-downloads-section"}>
          <div class={"section-header"}>
            <TbFileDownload size={14} />
            <span>Generate Traces G-Code</span>
          </div>

          <DownloadButton content={() => generateCopperFile(project, "top", config.traces)}
                          fileName={Gcode.outputFileNames.etching_top}
                          text={"Traces Top"}
                          badge={"TOP"}
                          badgeColor={"#e67e22"}
                          disabled={!hasTopTraces()}>
            <Show when={hasTopTraces()}>
              <span class={"info"}>
                <AiOutlineClockCircle /> CNC: {getGcodeDurationForTraces(allTopTraces(), {
                  iterations: config.traces.iterations,
                  feedRate: config.traces.maxFeedRate
                })} - {getGcodeDurationForTraces(allTopTraces(), {
                  iterations: config.traces.iterations,
                  feedRate: config.traces.minFeedRate
                })}
              </span>
              <span class={"info"}>
                <AiOutlineClockCircle /> Acid: {getAcidDurationForTraces(allTopTraces())}
              </span>
            </Show>
          </DownloadButton>

          <DownloadButton content={() => generateCopperFile(project, "bottom", config.traces)}
                          fileName={Gcode.outputFileNames.etching_bottom}
                          text={"Traces Bottom"}
                          badge={"BOTTOM"}
                          badgeColor={"#e74c3c"}
                          disabled={!hasBottomTraces()}
                          title={`Traces: ${getLength(allBottomTraces())}, travel: ${getTravelLength(allBottomTraces())}`}>
            <Show when={hasBottomTraces()}>
              <span class={"info"}>
                <AiOutlineClockCircle /> CNC: {getGcodeDurationForTraces(allBottomTraces(), {
                  iterations: config.traces.iterations,
                  feedRate: config.traces.maxFeedRate
                })} - {getGcodeDurationForTraces(allBottomTraces(), {
                  iterations: config.traces.iterations,
                  feedRate: config.traces.minFeedRate
                })}
              </span>
              <span class={"info"}>
                <AiOutlineClockCircle /> Acid: {getAcidDurationForTraces(allBottomTraces())}
              </span>
            </Show>
          </DownloadButton>
        </div>
      </SettingsContainer>
    </Show>

    {/* DRILLS TAB */}
    <Show when={activeTab() === "drills"}>
      <SettingsContainer name={"Drills Configuration"} icon={<TbCircleDot />} visible={true}>
        <div class={"setting-section-title"}>
          <span class={"section-icon"}><TbTarget size={14} /></span>
          <span>Alignment Holes Calibration</span>
        </div>

        <p class={"settings-description"}>
          Specify the actual calibrated machine coordinates of the alignment holes on your CNC.
        </p>

        <For each={config.drills.offset}>
          {(it, i) => (
            <div class={"hole-calibration-card"}>
              <div class={"hole-card-header"}>
                <span class={"hole-badge"}>Hole #{i() + 1}</span>
                <span class={"hole-cad-coords"}>
                  CAD: ({it.original.x.toFixed(2)}, {it.original.y.toFixed(2)}) mm
                </span>
              </div>
              <SettingNumber label={"Actual X"}
                             defaultValue={+it.actual.x.toFixed(3)}
                             step={0.1}
                             unit={"mm"}
                             icon={<TbArrowsMove />}
                             onChange={(value) => updateConfigValue("drills", "offset", i(), "actual", { x: value })} />
              <SettingNumber label={"Actual Y"}
                             defaultValue={+it.actual.y.toFixed(3)}
                             step={0.1}
                             unit={"mm"}
                             icon={<TbArrowsMove />}
                             onChange={(value) => updateConfigValue("drills", "offset", i(), "actual", { y: value })} />
            </div>
          )}
        </For>

        <div class={"setting-section-title"}>
          <span class={"section-icon"}><TbGauge size={14} /></span>
          <span>Feed Rates</span>
        </div>

        <SettingNumber label={"Feed rate Move"}
                       defaultValue={config.drills.feedRateMove}
                       min={1}
                       step={100}
                       unit={"mm/min"}
                       icon={<TbArrowsMove />}
                       hint={"Traverse speed moving between drill holes"}
                       onChange={(value) => onChangeDrills({ feedRateMove: value })} />

        <SettingNumber label={"Feed rate Drill"}
                       defaultValue={config.drills.feedRateDrill}
                       min={1}
                       step={5}
                       unit={"mm/min"}
                       icon={<TbGauge />}
                       hint={"Plunge feed rate down into PCB substrate"}
                       onChange={(value) => onChangeDrills({ feedRateDrill: value })} />

        <SettingNumber label={"Feed rate Up"}
                       defaultValue={config.drills.feedRateUp}
                       min={1}
                       step={10}
                       unit={"mm/min"}
                       icon={<TbGauge />}
                       hint={"Retraction speed rising out of drilled hole"}
                       onChange={(value) => onChangeDrills({ feedRateUp: value })} />

        {/* Quick Download for Drills */}
        <div class={"tab-downloads-section"}>
          <div class={"section-header"}>
            <TbFileDownload size={14} />
            <span>Generate Drills G-Code</span>
          </div>

          <DownloadButton content={() => generateDrillFile(project, config.drills)}
                          fileName={Gcode.outputFileNames.drills_top}
                          text={"Drills"}
                          badge={"DRILLS"}
                          badgeColor={"#a855f7"}
                          disabled={!hasDrills()} />
        </div>
      </SettingsContainer>
    </Show>

    {/* SILKSCREEN TAB */}
    <Show when={activeTab() === "silkscreen"}>
      <SettingsContainer name={"Silkscreen Configuration"} icon={<TbLetterT />} visible={true}>
        <div class={"setting-section-title"}>
          <span class={"section-icon"}><TbCrop size={14} /></span>
          <span>Position & Calibration</span>
        </div>

        <SettingCombo label={"Out of Bounds"}
                      values={Object.values(OutOfBoundsOption)}
                      defaultValue={config.silkscreen.outOfBounds}
                      icon={<TbCrop />}
                      onChange={(value) => {
                        setTracesVisibility(project, {
                          ...config,
                          silkscreen: { ...config.silkscreen, outOfBounds: value as OutOfBoundsOption }
                        });
                        onChangeSilkscreen({ outOfBounds: value });
                      }} />

        <div class={"setting-section-title"}>
          <span class={"section-icon"}><TbTarget size={14} /></span>
          <span>Alignment Holes Calibration</span>
        </div>

        <For each={config.silkscreen.offset}>
          {(it, i) => (
            <div class={"hole-calibration-card"}>
              <div class={"hole-card-header"}>
                <span class={"hole-badge"}>Hole #{i() + 1}</span>
                <span class={"hole-cad-coords"}>
                  CAD: ({it.original.x.toFixed(2)}, {it.original.y.toFixed(2)}) mm
                </span>
              </div>
              <SettingNumber label={"Actual X"}
                             defaultValue={+it.actual.x.toFixed(3)}
                             step={0.1}
                             unit={"mm"}
                             icon={<TbArrowsMove />}
                             onChange={(value) => updateConfigValue("silkscreen", "offset", i(), "actual", { x: value })} />
              <SettingNumber label={"Actual Y"}
                             defaultValue={+it.actual.y.toFixed(3)}
                             step={0.1}
                             unit={"mm"}
                             icon={<TbArrowsMove />}
                             onChange={(value) => updateConfigValue("silkscreen", "offset", i(), "actual", { y: value })} />
            </div>
          )}
        </For>

        <div class={"setting-section-title"}>
          <span class={"section-icon"}><TbGauge size={14} /></span>
          <span>Speeds & Passes</span>
        </div>

        <SettingNumber label={"Feed rate (min)"}
                       defaultValue={config.silkscreen.minFeedRate}
                       min={1}
                       step={100}
                       unit={"mm/min"}
                       icon={<TbGauge />}
                       onChange={(value) => onChangeSilkscreen({ minFeedRate: value })} />

        <SettingNumber label={"Feed rate (max)"}
                       defaultValue={config.silkscreen.maxFeedRate}
                       min={1}
                       step={100}
                       unit={"mm/min"}
                       icon={<TbGauge />}
                       onChange={(value) => onChangeSilkscreen({ maxFeedRate: value })} />

        <SettingNumber label={"Acceleration"}
                       defaultValue={config.silkscreen.acceleration}
                       min={1}
                       step={10}
                       unit={"mm/s²"}
                       icon={<TbActivity />}
                       onChange={(value) => onChangeSilkscreen({ acceleration: value })} />

        <SettingNumber label={"Iterations"}
                       defaultValue={config.silkscreen.iterations}
                       min={1}
                       unit={"passes"}
                       icon={<TbRefresh />}
                       onChange={(value) => onChangeSilkscreen({ iterations: value })} />

        <SettingsContainer name={"Auto-Cleaning Brush"}
                           icon={<TbBrush />}
                           visible={config.silkscreen.brush.enabled}
                           badge={config.silkscreen.brush.enabled ? "Active" : "Off"}>
          <SettingCheck label={"Enable Brush Cleaning"}
                        defaultValue={config.silkscreen.brush.enabled}
                        icon={<TbSparkles />}
                        onChange={(value) => updateConfigValue("silkscreen", "brush", "enabled", value)} />
        </SettingsContainer>

        {/* Quick Downloads for Silkscreen */}
        <div class={"tab-downloads-section"}>
          <div class={"section-header"}>
            <TbFileDownload size={14} />
            <span>Generate Silkscreen G-Code</span>
          </div>

          <DownloadButton content={() => generateSilkscreenFile(project, "top", config.silkscreen)}
                          fileName={Gcode.outputFileNames.silkscreen_top}
                          text={"Silkscreen Top"}
                          badge={"TOP"}
                          badgeColor={"#94a3b8"}
                          disabled={!hasSilkscreenTop()}
                          title={`Traces: ${getLength(project.silkscreen_top)}, travel: ${getTravelLength(project.silkscreen_top)}`}>
            <Show when={hasSilkscreenTop()}>
              <span class={"info"}>
                <AiOutlineClockCircle /> CNC: {getGcodeDurationForTraces(project.silkscreen_top, {
                  iterations: config.silkscreen.iterations,
                  feedRate: config.silkscreen.maxFeedRate
                })} - {getGcodeDurationForTraces(project.silkscreen_top, {
                  iterations: config.silkscreen.iterations,
                  feedRate: config.silkscreen.minFeedRate
                })}
              </span>
            </Show>
          </DownloadButton>

          <DownloadButton content={() => generateSilkscreenFile(project, "bottom", config.silkscreen)}
                          fileName={Gcode.outputFileNames.silkscreen_bottom}
                          text={"Silkscreen Bottom"}
                          badge={"BOTTOM"}
                          badgeColor={"#64748b"}
                          disabled={!hasSilkscreenBottom()}>
            <Show when={hasSilkscreenBottom()}>
              <span class={"info"}>
                <AiOutlineClockCircle /> CNC: {getGcodeDurationForTraces(project.silkscreen_bottom, {
                  iterations: config.silkscreen.iterations,
                  feedRate: config.silkscreen.maxFeedRate
                })} - {getGcodeDurationForTraces(project.silkscreen_bottom, {
                  iterations: config.silkscreen.iterations,
                  feedRate: config.silkscreen.minFeedRate
                })}
              </span>
            </Show>
          </DownloadButton>
        </div>
      </SettingsContainer>
    </Show>

    {/* ALL FILES TAB */}
    <Show when={activeTab() === "all"}>
      <div class={"all-files-view"}>
        <div class={"files-category"}>
          <div class={"category-header"}>
            <span class={"cat-icon"}><TbCpu size={18} /></span>
            <span>Copper Traces G-Code</span>
          </div>

          <DownloadButton content={() => generateCopperFile(project, "top", config.traces)}
                          fileName={Gcode.outputFileNames.etching_top}
                          text={"Traces Top"}
                          badge={"TOP"}
                          badgeColor={"#e67e22"}
                          disabled={!hasTopTraces()}>
            <Show when={hasTopTraces()}>
              <span class={"info"}>
                <AiOutlineClockCircle /> CNC: {getGcodeDurationForTraces(allTopTraces(), {
                  iterations: config.traces.iterations,
                  feedRate: config.traces.maxFeedRate
                })} - {getGcodeDurationForTraces(allTopTraces(), {
                  iterations: config.traces.iterations,
                  feedRate: config.traces.minFeedRate
                })}
              </span>
              <span class={"info"}>
                <AiOutlineClockCircle /> Acid: {getAcidDurationForTraces(allTopTraces())}
              </span>
            </Show>
          </DownloadButton>

          <DownloadButton content={() => generateCopperFile(project, "bottom", config.traces)}
                          fileName={Gcode.outputFileNames.etching_bottom}
                          text={"Traces Bottom"}
                          badge={"BOTTOM"}
                          badgeColor={"#e74c3c"}
                          disabled={!hasBottomTraces()}
                          title={`Traces: ${getLength(allBottomTraces())}, travel: ${getTravelLength(allBottomTraces())}`}>
            <Show when={hasBottomTraces()}>
              <span class={"info"}>
                <AiOutlineClockCircle /> CNC: {getGcodeDurationForTraces(allBottomTraces(), {
                  iterations: config.traces.iterations,
                  feedRate: config.traces.maxFeedRate
                })} - {getGcodeDurationForTraces(allBottomTraces(), {
                  iterations: config.traces.iterations,
                  feedRate: config.traces.minFeedRate
                })}
              </span>
              <span class={"info"}>
                <AiOutlineClockCircle /> Acid: {getAcidDurationForTraces(allBottomTraces())}
              </span>
            </Show>
          </DownloadButton>
        </div>

        <div class={"files-category"}>
          <div class={"category-header"}>
            <span class={"cat-icon"}><TbCircleDot size={18} /></span>
            <span>CNC Drills</span>
          </div>

          <DownloadButton content={() => generateDrillFile(project, config.drills)}
                          fileName={Gcode.outputFileNames.drills_top}
                          text={"Drills"}
                          badge={"DRILLS"}
                          badgeColor={"#a855f7"}
                          disabled={!hasDrills()} />
        </div>

        <div class={"files-category"}>
          <div class={"category-header"}>
            <span class={"cat-icon"}><TbLetterT size={18} /></span>
            <span>Silkscreen Legend</span>
          </div>

          <DownloadButton content={() => generateSilkscreenFile(project, "top", config.silkscreen)}
                          fileName={Gcode.outputFileNames.silkscreen_top}
                          text={"Silkscreen Top"}
                          badge={"TOP"}
                          badgeColor={"#94a3b8"}
                          disabled={!hasSilkscreenTop()}
                          title={`Traces: ${getLength(project.silkscreen_top)}, travel: ${getTravelLength(project.silkscreen_top)}`}>
            <Show when={hasSilkscreenTop()}>
              <span class={"info"}>
                <AiOutlineClockCircle /> CNC: {getGcodeDurationForTraces(project.silkscreen_top, {
                  iterations: config.silkscreen.iterations,
                  feedRate: config.silkscreen.maxFeedRate
                })} - {getGcodeDurationForTraces(project.silkscreen_top, {
                  iterations: config.silkscreen.iterations,
                  feedRate: config.silkscreen.minFeedRate
                })}
              </span>
            </Show>
          </DownloadButton>

          <DownloadButton content={() => generateSilkscreenFile(project, "bottom", config.silkscreen)}
                          fileName={Gcode.outputFileNames.silkscreen_bottom}
                          text={"Silkscreen Bottom"}
                          badge={"BOTTOM"}
                          badgeColor={"#64748b"}
                          disabled={!hasSilkscreenBottom()}>
            <Show when={hasSilkscreenBottom()}>
              <span class={"info"}>
                <AiOutlineClockCircle /> CNC: {getGcodeDurationForTraces(project.silkscreen_bottom, {
                  iterations: config.silkscreen.iterations,
                  feedRate: config.silkscreen.maxFeedRate
                })} - {getGcodeDurationForTraces(project.silkscreen_bottom, {
                  iterations: config.silkscreen.iterations,
                  feedRate: config.silkscreen.minFeedRate
                })}
              </span>
            </Show>
          </DownloadButton>
        </div>
      </div>
    </Show>

    {/* Actions Footer */}
    <div class={"actions"}>
      <button class={"back-btn"} onClick={props.onBack} title={"Return to FlatCAM generator"}>
        <TbArrowLeft size={16} />
        <span>Back to CAM</span>
      </button>

      <button class={"reset-btn"} onClick={resetConfig} title={"Reset all configurations to default values"}>
        <TbRotateClockwise size={16} />
        <span>Reset Defaults</span>
      </button>
    </div>
  </div>;
};

export default GcodeSettings;
