import {Component} from "solid-js";
import SettingsContainer from "./../../components/settings/SettingsContainer.tsx";
import SettingCheck from "./../../components/settings/SettingCheck.tsx";
import SettingNumber from "./../../components/settings/SettingNumber.tsx";
import './style.less';
import {useProject} from "../../ProjectContext.ts";
import {Gcode} from "../../../logic/generators/gcode.ts";
import DownloadButton from "./DownloadButton.tsx";
import {
    generateDrillFile,
} from "../../../logic/generators/drills.ts";
import {Accessor, Setter} from "solid-js/types/reactive/signal";
import {emptyConfig, useConfig} from "../../ConfigContext.ts";
import {getProjectAlignmentDrills} from "../../../logic/processors/project.ts";

type Props = {
    onBack?: () => void
    showProfile: Accessor<boolean>
    setShowProfile: Setter<boolean>
    showChecklist: () => void
}

const GcodeSettings: Component<Props> = (props) => {
    const {config, loadConfig} = useConfig()
    const {project} = useProject();

    const alignmentHoles = getProjectAlignmentDrills(project)
    if (config.drills.offset.length != alignmentHoles.length) {
        config.drills.offset = alignmentHoles.map(it => ({
            original: it,
            actual: {x: it.x, y: it.y},
        }));
    }

    const onChange = (key: string, value: any) => {
        const path = key.split(".");
        config[path[0]][path[1]] = value;

        props.setShowProfile(config.traces.cutoutProfile)
    }

    const onAlignmentHoleOffsetChangeX = (index: number, value: number) => {
        config.drills.offset[index].actual.x = value
    }

    const onAlignmentHoleOffsetChangeY = (index: number, value: number) => {
        config.drills.offset[index].actual.y = value
    }

    const resetConfig = () => {
        loadConfig(emptyConfig())
        alert("Please go to the previous page using the Back button and come back for the changes to be visible.");
    }

    return <div class={"FlatcamSettings"}>
        <button onClick={props.showChecklist}>Checklist</button>
        <br/>
        <br/>

        <SettingsContainer name={"Traces"} visible={true}>
            <SettingCheck label={"Cutout profile"} defaultValue={config.traces.cutoutProfile}
                          onChange={(value) => onChange("traces.cutoutProfile", value)}/>
            <SettingNumber label={"Offset X"} defaultValue={config.traces.offsetX}
                           onChange={(value) => onChange("traces.offsetX", value)}/>
            <SettingNumber label={"Offset Y"} defaultValue={config.traces.offsetY}
                           onChange={(value) => onChange("traces.offsetY", value)}/>
            <SettingNumber label={"Feed rate"} defaultValue={config.traces.feedRate}
                           onChange={(value) => onChange("traces.feedRate", value)}/>
            <SettingNumber label={"Iterations"} defaultValue={config.traces.iterations}
                           onChange={(value) => onChange("traces.iterations", value)}/>
        </SettingsContainer>

        <SettingsContainer name={"Drills"}>
            <SettingsContainer name={"Offset calculation"} visible={true}>
                <p>Insert the actual location of the alignment holes, according to your printer.</p>
                {config.drills.offset.map((it, i) => <>
                    <strong>Hole #{i + 1}</strong>
                    <SettingNumber label={"Offset X"} defaultValue={it.actual.x} step={0.1}
                                   onChange={(value) => onAlignmentHoleOffsetChangeX(i, value)}/>
                    <SettingNumber label={"Offset Y"} defaultValue={it.actual.y} step={0.1}
                                   onChange={(value) => onAlignmentHoleOffsetChangeY(i, value)}/>
                </>)}
            </SettingsContainer>

            <SettingNumber label={"Feed rate Move"} defaultValue={config.drills.feedRateMove}
                           onChange={(value) => onChange("drills.feedRateMove", value)}/>
            <SettingNumber label={"Feed rate Drill"} defaultValue={config.drills.feedRateDrill}
                           onChange={(value) => onChange("drills.feedRateDrill", value)}/>
            <SettingNumber label={"Feed rate Up"} defaultValue={config.drills.feedRateUp}
                           onChange={(value) => onChange("drills.feedRateUp", value)}/>
        </SettingsContainer>

        <div class={"files"}>
            <h4>Download the gCode files:</h4>
            <DownloadButton content={() => Gcode.generateCopperFile(project, "top", config.traces)}
                            fileName={Gcode.outputFileNames.etching_top} text={"Traces top"}/>
            <DownloadButton content={() => Gcode.generateCopperFile(project, "bottom", config.traces)}
                            fileName={Gcode.outputFileNames.etching_bottom} text={"Traces bottom"}/>
            <DownloadButton content={() => generateDrillFile(project, config.drills)}
                            fileName={Gcode.outputFileNames.drills_top} text={"Drills top"}/>
            <DownloadButton content={() => Gcode.generateSilkscreenFile(project, "top", config.traces)}
                            fileName={Gcode.outputFileNames.silkscreen_top} text={"Silkcreen top"}/>
            <DownloadButton content={() => Gcode.generateSilkscreenFile(project, "bottom", config.traces)}
                            fileName={Gcode.outputFileNames.silkscreen_bottom} text={"Silkscreen bottom"}/>
        </div>

        <div class={"actions"}>
            <button onClick={props.onBack}>Back</button>
            <button onClick={resetConfig}>Reset</button>
        </div>
    </div>;
}

export default GcodeSettings;