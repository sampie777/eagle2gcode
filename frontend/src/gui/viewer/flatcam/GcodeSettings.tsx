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
    getLocationForDrill
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

    const onChange = (key: string, value: any) => {
        const path = key.split(".");
        config[path[0]][path[1]] = value;

        props.setShowProfile(config.traces.cutoutProfile)
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
            <SettingNumber label={"Offset X"} defaultValue={config.drills.offsetX}
                           onChange={(value) => onChange("drills.offsetX", value)}/>
            <SettingNumber label={"Offset Y"} defaultValue={config.drills.offsetY}
                           onChange={(value) => onChange("drills.offsetY", value)}/>
            <SettingNumber label={"Feed rate Move"} defaultValue={config.drills.feedRateMove}
                           onChange={(value) => onChange("drills.feedRateMove", value)}/>
            <SettingNumber label={"Feed rate Drill"} defaultValue={config.drills.feedRateDrill}
                           onChange={(value) => onChange("drills.feedRateDrill", value)}/>
            <SettingNumber label={"Feed rate Up"} defaultValue={config.drills.feedRateUp}
                           onChange={(value) => onChange("drills.feedRateUp", value)}/>
        </SettingsContainer>

        <div class={"alignment-drills"}>
            Drill alignment holes (after manual drilling) should match these locations. If not, adjust Drilling -> Offset, adjust the endstops, or move the board.
            <ol>
                {getProjectAlignmentDrills(project).map((it, i) => {
                    const {x, y} = getLocationForDrill(config.drills, it)
                    return <li title={`Alignment hole #${i + 1}, mirrored and with drill offset`}>
                        <code>{x.toFixed(2)}, {y.toFixed(2)}</code>
                    </li>
                })}
            </ol>
        </div>

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