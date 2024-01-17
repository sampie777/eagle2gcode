import {Component} from "solid-js";
import SettingsContainer from "./../../components/settings/SettingsContainer.tsx";
import SettingCheck from "./../../components/settings/SettingCheck.tsx";
import SettingNumber from "./../../components/settings/SettingNumber.tsx";
import './style.less';
import {useProject} from "../../ProjectContext.ts";
import {GcodeConfig} from "../../../logic/types/gcode.ts";
import {Gcode} from "../../../logic/generators/gcode.ts";
import DownloadButton from "./DownloadButton.tsx";
import {generateDrillAlignmentFile, generateDrillFile} from "../../../logic/generators/drills.ts";

type Props = {
    onBack?: () => void
}

const GcodeSettings: Component<Props> = (props) => {
    const project = useProject();

    const config: GcodeConfig = {
        traces: {
            cutoutProfile: true,
            offsetX: 34,
            offsetY: 26,
            feedRate: 1400,
            iterations: 40,
        },
        drills: {
            offsetX: 12,
            offsetY: 27.5,
            feedRateMove: 1400,
            feedRateDrill: 10,
            feedRateUp: 50,
        }
    }

    const onChange = (key: string, value: any) => {
        const path = key.split(".");
        config[path[0]][path[1]] = value;
    }

    return <div class={"FlatcamSettings"}>
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

        <div class={"files"}>
            <h4>Download the gCode files:</h4>
            <DownloadButton content={() => Gcode.generateCopperFile(project, "top", config.traces)} fileName={"1_etching_top.gcode"} text={"Traces top"} />
            <DownloadButton content={() => Gcode.generateCopperFile(project, "bottom", config.traces)} fileName={"1_etching_bottom.gcode"} text={"Traces bottom"} />
            <DownloadButton content={() => generateDrillAlignmentFile(project, config.drills)} fileName={"2_drill_alignment_bottom.gcode"} text={"Drill alignment bottom"} />
            <DownloadButton content={() => Gcode.generateSilkscreenFile(project, "top", config.traces)} fileName={"3_silkscreen_top.gcode"} text={"Silkcreen top"} />
            <DownloadButton content={() => Gcode.generateSilkscreenFile(project, "bottom", config.traces)} fileName={"3_silkscreen_bottom.gcode"} text={"Silkscreen bottom"} />
            <DownloadButton content={() => generateDrillFile(project, config.drills)} fileName={"4_drills_top.gcode"} text={"Drills top"} />
        </div>

        <div class={"actions"}>
            <button onClick={props.onBack}>Back</button>
        </div>
    </div>;
}

export default GcodeSettings;