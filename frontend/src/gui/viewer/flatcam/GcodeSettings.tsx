import { Component } from "solid-js";
import SettingsContainer from "./../../components/settings/SettingsContainer";
import SettingCheck from "./../../components/settings/SettingCheck";
import SettingNumber from "./../../components/settings/SettingNumber";
import './style.less';
import { useProject } from "../../ProjectContext";
import { Gcode } from "../../../logic/generators/gcode";
import DownloadButton from "./DownloadButton";
import {
  generateDrillFile,
} from "../../../logic/generators/drills";
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
  showChecklist: () => void
  requestRender: () => void
}

const GcodeSettings: Component<Props> = (props) => {
  const { config, loadConfig, updateConfigValue } = useConfig()
  const { project } = useProject();

  const onChangeTraces = (value: Object) => updateConfigValue("traces", value)
  const onChangeDrills = (value: Object) => updateConfigValue("drills", value)
  const onChangeSilkscreen = (value: Object) => updateConfigValue("silkscreen", value)

  const updateOffsets = () => {
    const alignmentHoles = getProjectAlignmentDrills(project)
    const drillOffsets = alignmentHoles.map((it, i) => ({
      original: it,
      actual: (config.drills?.offset[i]) ? config.drills.offset[i].actual : { x: it.x, y: it.y },
    }));
    const silkscreenOffset = alignmentHoles.map((it, i) => ({
      original: it,
      actual: (config.silkscreen?.offset[i]) ? config.silkscreen.offset[i].actual : { x: it.x, y: it.y },
    }));
    onChangeDrills({ offset: drillOffsets })
    onChangeSilkscreen({ offset: silkscreenOffset })
  };

  const resetConfig = () => {
    loadConfig(emptyConfig())
    alert("Please go to the previous page using the Back button and come back for the changes to be visible.");
  }

  updateOffsets();

  const allTopTraces = () => [...(config.traces.cutoutProfile ? project.profile : []), ...project.traces_top];
  const allBottomTraces = () => [...(config.traces.cutoutProfile ? project.profile : []), ...project.traces_bottom];

  return <div class={"FlatcamSettings"}>
    <button onClick={props.showChecklist}>Checklist</button>
    <br />
    <br />

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
      <SettingNumber label={"Feed rate"} defaultValue={config.traces.feedRate}
                     min={1}
                     onChange={(value) => onChangeTraces({ feedRate: value })} />
      <SettingNumber label={"Iterations"} defaultValue={config.traces.iterations}
                     min={1}
                     onChange={(value) => onChangeTraces({ iterations: value })} />
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

      <SettingNumber label={"Feed rate"} defaultValue={config.silkscreen.feedRate}
                     min={1}
                     onChange={(value) => onChangeSilkscreen({ feedRate: value })} />
      <SettingNumber label={"Iterations"} defaultValue={config.silkscreen.iterations}
                     min={1}
                     onChange={(value) => onChangeSilkscreen({ iterations: value })} />
    </SettingsContainer>

    <div class={"files"}>
      <h4>Download the gCode files:</h4>
      <DownloadButton content={() => generateCopperFile(project, "top", config.traces)}
                      fileName={Gcode.outputFileNames.etching_top}
                      text={"Traces top"}>
        {allTopTraces().length == 0 ? null : <>
          <span class={"info"}>
            <AiOutlineClockCircle /> Printer: {getGcodeDurationForTraces(allTopTraces(), { ...config.traces } /* Use spread operator to trigger rerender on object update */)}
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
            <AiOutlineClockCircle /> Printer: {getGcodeDurationForTraces(allBottomTraces(), { ...config.traces })}
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
            <AiOutlineClockCircle /> Printer: {getGcodeDurationForTraces(project.silkscreen_top, { ...config.silkscreen })}
          </span>
        </>}
      </DownloadButton>
      <DownloadButton content={() => generateSilkscreenFile(project, "bottom", config.silkscreen)}
                      fileName={Gcode.outputFileNames.silkscreen_bottom}
                      text={`Silkscreen bottom`}>
        {project.silkscreen_bottom.length == 0 ? null : <>
          <span class={"info"}>
            <AiOutlineClockCircle /> Printer: {getGcodeDurationForTraces(project.silkscreen_bottom, { ...config.silkscreen })}
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