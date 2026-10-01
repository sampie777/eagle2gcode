import { Component, createEffect } from "solid-js";
import SettingsContainer from "./../../components/settings/SettingsContainer";
import SettingCheck from "./../../components/settings/SettingCheck";
import SettingNumber from "./../../components/settings/SettingNumber";
import './style.less';
import { useProject } from "../../ProjectContext";
import { Gcode } from "../../../logic/generators/gcode";
import DownloadButton from "./DownloadButton";
import { generateDrillFile, } from "../../../logic/generators/drills";
import { emptyConfig, useConfig } from "../../ConfigContext";
import { getProjectAlignmentDrills, setTracesVisibility } from "../../../logic/processors/project";
import { generateCopperFile, generateSilkscreenFile } from "../../../logic/generators/traces";
import SettingCombo from "../../components/settings/SettingCombo";
import { OutOfBoundsOption } from "../../../logic/types/gcode";
import {
  getAcidDurationForTraces,
  getGcodeDurationForTraces,
  getLength,
  getTravelLength
} from "../../../logic/utils/gcode";
import { AiOutlineClockCircle } from "solid-icons/ai";

type Props = {
  onBack?: () => void
  requestRender: () => void
}

const GcodeSettings: Component<Props> = (props) => {
  const { config, loadConfig, updateConfigValue } = useConfig()
  const { project } = useProject();

  const onChangeDrills = (value: Object) => updateConfigValue("drills", value)
  const onChangeSilkscreen = (value: Object) => updateConfigValue("silkscreen", value)

  const isNewBoardOrUnset = () => {
    const alignmentHoles = getProjectAlignmentDrills(project)
    if (!config.drills?.offset || config.drills.offset.length !== alignmentHoles.length) return true
    if (!config.silkscreen?.offset || config.silkscreen.offset.length !== alignmentHoles.length) return true
    const holesMismatch = alignmentHoles.some((hole, i) =>
      config.drills.offset[i]?.original?.x !== hole.x ||
      config.drills.offset[i]?.original?.y !== hole.y ||
      config.silkscreen.offset[i]?.original?.x !== hole.x ||
      config.silkscreen.offset[i]?.original?.y !== hole.y
    )
    if (holesMismatch) return true

    // Check if offsets were stored without the traces offset
    const tracesOffsetX = config.traces.offsetX ?? 0
    const tracesOffsetY = config.traces.offsetY ?? 0
    if (tracesOffsetX !== 0 || tracesOffsetY !== 0) {
      const silkscreenMissingTraceOffset = config.silkscreen.offset.some(
        it => it.actual.x === it.original.x && it.actual.y === it.original.y
      )
      const drillsMissingTraceOffset = config.drills.offset.some(
        it => it.actual.x === it.original.x && it.actual.y === it.original.y
      )
      if (silkscreenMissingTraceOffset || drillsMissingTraceOffset) return true
    }

    return false
  }

  const updateOffsets = (tracesOffsetX = config.traces.offsetX, tracesOffsetY = config.traces.offsetY) => {
    const alignmentHoles = getProjectAlignmentDrills(project)
    const drillOffsets = alignmentHoles.map((it) => ({
      original: it,
      actual: { x: it.x + tracesOffsetX, y: it.y + tracesOffsetY },
    }))
    const silkscreenOffset = alignmentHoles.map((it) => ({
      original: it,
      actual: { x: it.x + tracesOffsetX, y: it.y + tracesOffsetY },
    }))
    onChangeDrills({ offset: drillOffsets })
    onChangeSilkscreen({ offset: silkscreenOffset })
    props.requestRender?.()
  }

  const onChangeTraces = (value: { [key: string]: any }) => {
    updateConfigValue("traces", value)
    if ("offsetX" in value || "offsetY" in value) {
      const newOffsetX = "offsetX" in value ? value.offsetX : config.traces.offsetX
      const newOffsetY = "offsetY" in value ? value.offsetY : config.traces.offsetY
      updateOffsets(newOffsetX, newOffsetY)
    }
  }

  if (isNewBoardOrUnset()) {
    updateOffsets()
  }

  createEffect((prev?: { offsetX: number, offsetY: number }) => {
    const offsetX = config.traces.offsetX
    const offsetY = config.traces.offsetY

    if (prev !== undefined && (prev.offsetX !== offsetX || prev.offsetY !== offsetY)) {
      updateOffsets(offsetX, offsetY)
    }

    return { offsetX, offsetY }
  })

  const resetConfig = () => {
    const empty = emptyConfig()
    loadConfig(empty)
    updateOffsets(empty.traces.offsetX, empty.traces.offsetY)
    alert("Please go to the previous page using the Back button and come back for the changes to be visible.");
  }

  const allTopTraces = () => [...(config.traces.cutoutProfile ? project.profile : []), ...project.traces_top];
  const allBottomTraces = () => [...(config.traces.cutoutProfile ? project.profile : []), ...project.traces_bottom];

  return <div class={"FlatcamSettings"}>
    <SettingsContainer name={"Traces"} visible={true}>
      <SettingCheck label={"Cutout profile"} defaultValue={config.traces.cutoutProfile}
                    onChange={(value) => onChangeTraces({ cutoutProfile: value })} />
      <SettingCombo label={"Out of bounds (profile)"}
                    values={Object.values(OutOfBoundsOption)}
                    defaultValue={config.traces.outOfBounds}
                    onChange={(value) => {
                      setTracesVisibility(project, {
                        ...config,
                        traces: { ...config.traces, outOfBounds: value as OutOfBoundsOption }
                      })
                      onChangeTraces({ outOfBounds: value })
                    }} />
      <SettingNumber label={"Offset X"} defaultValue={config.traces.offsetX}
                     onChange={(value) => onChangeTraces({ offsetX: value })} />
      <SettingNumber label={"Offset Y"} defaultValue={config.traces.offsetY}
                     onChange={(value) => onChangeTraces({ offsetY: value })} />
      <SettingNumber label={"Feed rate (min)"} defaultValue={config.traces.minFeedRate}
                     min={1}
                     onChange={(value) => onChangeTraces({ minFeedRate: value })} />
      <SettingNumber label={"Feed rate (max)"} defaultValue={config.traces.maxFeedRate}
                     min={1}
                     onChange={(value) => onChangeTraces({ maxFeedRate: value })} />
      <SettingNumber label={"Acceleration"} defaultValue={config.traces.acceleration}
                     min={1}
                     onChange={(value) => onChangeTraces({ acceleration: value })} />
      <SettingNumber label={"Iterations"} defaultValue={config.traces.iterations}
                     min={1}
                     onChange={(value) => onChangeTraces({ iterations: value })} />

      <SettingsContainer name={"Auto-Cleaning Brush"} visible={true}>
        <SettingCheck label={"Enable Brush Cleaning"} defaultValue={config.traces.brush.enabled}
                      onChange={(value) => updateConfigValue("traces", "brush", "enabled", value)} />
        <SettingNumber label={"Distance Threshold (mm)"} defaultValue={config.traces.brush.distanceThreshold} step={100}
                       onChange={(value) => updateConfigValue("traces", "brush", "distanceThreshold", value)} />
        <SettingNumber label={"Pos A: X"} defaultValue={config.traces.brush.posAx} step={0.1}
                       onChange={(value) => updateConfigValue("traces", "brush", "posAx", value)} />
        <SettingNumber label={"Pos A: Y"} defaultValue={config.traces.brush.posAy} step={0.1}
                       onChange={(value) => updateConfigValue("traces", "brush", "posAy", value)} />
        <SettingNumber label={"Pos A: Z"} defaultValue={config.traces.brush.posAz} step={0.1}
                       onChange={(value) => updateConfigValue("traces", "brush", "posAz", value)} />
        <SettingNumber label={"Pos B: X"} defaultValue={config.traces.brush.posBx} step={0.1}
                       onChange={(value) => updateConfigValue("traces", "brush", "posBx", value)} />
        <SettingNumber label={"Pos B: Y"} defaultValue={config.traces.brush.posBy} step={0.1}
                       onChange={(value) => updateConfigValue("traces", "brush", "posBy", value)} />
        <SettingNumber label={"Pos B: Z"} defaultValue={config.traces.brush.posBz} step={0.1}
                       onChange={(value) => updateConfigValue("traces", "brush", "posBz", value)} />
      </SettingsContainer>
    </SettingsContainer>

    <SettingsContainer name={"Drills"}>
      <SettingsContainer name={"Offset calculation"} visible={true}>
        <p>Insert the actual location of the alignment holes, according to your printer.</p>
        {config.drills.offset.map((it, i) => <>
            <strong>Hole #{i + 1}</strong>
            <SettingNumber label={"Offset X"} defaultValue={+it.actual.x.toFixed(3)} step={0.1}
                           onChange={(value) => updateConfigValue("drills", "offset", i, "actual", { x: value })} />
            <SettingNumber label={"Offset Y"} defaultValue={+it.actual.y.toFixed(3)} step={0.1}
                           onChange={(value) => updateConfigValue("drills", "offset", i, "actual", { y: value })} />
          </>
        )}
      </SettingsContainer>

      <SettingNumber label={"Feed rate Move"} defaultValue={config.drills.feedRateMove}
                     min={1}
                     onChange={(value) => onChangeDrills({ feedRateMove: value })} />
      <SettingNumber label={"Feed rate Drill"} defaultValue={config.drills.feedRateDrill}
                     min={1}
                     onChange={(value) => onChangeDrills({ feedRateDrill: value })} />
      <SettingNumber label={"Feed rate Up"} defaultValue={config.drills.feedRateUp}
                     min={1}
                     onChange={(value) => onChangeDrills({ feedRateUp: value })} />
    </SettingsContainer>

    <SettingsContainer name={"Silkscreen"}>
      <SettingCombo label={"Out of bounds (profile)"}
                    values={Object.values(OutOfBoundsOption)}
                    defaultValue={config.silkscreen.outOfBounds}
                    onChange={(value) => {
                      setTracesVisibility(project, {
                        ...config,
                        silkscreen: { ...config.silkscreen, outOfBounds: value as OutOfBoundsOption }
                      })
                      onChangeSilkscreen({ outOfBounds: value })
                    }} />

      <SettingsContainer name={"Offset calculation"} visible={true}>
        <p>Insert the actual location of the alignment holes, according to your printer.</p>
        {config.silkscreen.offset.map((it, i) => <>
          <strong>Hole #{i + 1}</strong>
          <SettingNumber label={"Offset X"} defaultValue={+it.actual.x.toFixed(3)} step={0.1}
                         onChange={(value) => updateConfigValue("silkscreen", "offset", i, "actual", { x: value })} />
          <SettingNumber label={"Offset Y"} defaultValue={+it.actual.y.toFixed(3)} step={0.1}
                         onChange={(value) => updateConfigValue("silkscreen", "offset", i, "actual", { y: value })} />
        </>)}
      </SettingsContainer>

      <SettingNumber label={"Feed rate (min)"} defaultValue={config.silkscreen.minFeedRate}
                     min={1}
                     onChange={(value) => onChangeSilkscreen({ minFeedRate: value })} />
      <SettingNumber label={"Feed rate (max)"} defaultValue={config.silkscreen.maxFeedRate}
                     min={1}
                     onChange={(value) => onChangeSilkscreen({ maxFeedRate: value })} />
      <SettingNumber label={"Acceleration"} defaultValue={config.silkscreen.acceleration}
                     min={1}
                     onChange={(value) => onChangeSilkscreen({ acceleration: value })} />
      <SettingNumber label={"Iterations"} defaultValue={config.silkscreen.iterations}
                     min={1}
                     onChange={(value) => onChangeSilkscreen({ iterations: value })} />

      <SettingsContainer name={"Auto-Cleaning Brush"} visible={true}>
        <SettingCheck label={"Enable Brush Cleaning"} defaultValue={config.silkscreen.brush.enabled}
                      onChange={(value) => updateConfigValue("silkscreen", "brush", "enabled", value)} />
      </SettingsContainer>
    </SettingsContainer>

    <div class={"files"}>
      <h4>Download the gCode files:</h4>
      <DownloadButton content={() => generateCopperFile(project, "top", config.traces)}
                      fileName={Gcode.outputFileNames.etching_top}
                      text={"Traces top"}>
        {allTopTraces().length == 0 ? null : <>
          <span class={"info"}>
            <AiOutlineClockCircle /> Printer: {getGcodeDurationForTraces(allTopTraces(), {
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
        </>}
      </DownloadButton>
      <DownloadButton content={() => generateCopperFile(project, "bottom", config.traces)}
                      fileName={Gcode.outputFileNames.etching_bottom}
                      text={"Traces bottom"}
                      title={`Traces: ${getLength(allBottomTraces())}, travel: ${getTravelLength(allBottomTraces())}. Save project & reload page to recalculate.`}>
        {allBottomTraces().length == 0 ? null : <>
          <span class={"info"}>
            <AiOutlineClockCircle /> Printer: {getGcodeDurationForTraces(allBottomTraces(), {
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
        </>}
      </DownloadButton>

      <DownloadButton content={() => generateDrillFile(project, config.drills)}
                      fileName={Gcode.outputFileNames.drills_top} text={"Drills top"} />

      <DownloadButton content={() => generateSilkscreenFile(project, "top", config.silkscreen)}
                      fileName={Gcode.outputFileNames.silkscreen_top}
                      text={`Silkcreen top`}
                      title={`Traces: ${getLength(project.silkscreen_top)}, travel: ${getTravelLength(project.silkscreen_top)}. Save project & reload page to recalculate.`}>
        {project.silkscreen_top.length == 0 ? null : <>
          <span class={"info"}>
            <AiOutlineClockCircle /> Printer: {getGcodeDurationForTraces(project.silkscreen_top, {
            iterations: config.silkscreen.iterations,
            feedRate: config.silkscreen.maxFeedRate
          })} - {getGcodeDurationForTraces(project.silkscreen_top, {
            iterations: config.silkscreen.iterations,
            feedRate: config.silkscreen.minFeedRate
          })}
          </span>
        </>}
      </DownloadButton>
      <DownloadButton content={() => generateSilkscreenFile(project, "bottom", config.silkscreen)}
                      fileName={Gcode.outputFileNames.silkscreen_bottom}
                      text={`Silkscreen bottom`}>
        {project.silkscreen_bottom.length == 0 ? null : <>
          <span class={"info"}>
            <AiOutlineClockCircle /> Printer: {getGcodeDurationForTraces(project.silkscreen_bottom, {
            iterations: config.silkscreen.iterations,
            feedRate: config.silkscreen.maxFeedRate
          })} - {getGcodeDurationForTraces(project.silkscreen_bottom, {
            iterations: config.silkscreen.iterations,
            feedRate: config.silkscreen.minFeedRate
          })}
          </span>
        </>}
      </DownloadButton>
    </div>

    <div class={"actions"}>
      <button onClick={props.onBack}>Back</button>
      <button onClick={resetConfig}>Reset</button>
    </div>
  </div>;
}

export default GcodeSettings;
