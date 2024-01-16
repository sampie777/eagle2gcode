import {Component, createSignal} from "solid-js";
import SettingsContainer from "./../../components/settings/SettingsContainer.tsx";
import SettingCombo from "./../../components/settings/SettingCombo.tsx";
import SettingCheck from "./../../components/settings/SettingCheck.tsx";
import SettingNumber from "./../../components/settings/SettingNumber.tsx";
import './style.less';
import {useProject} from "../../ProjectContext.ts";
import {GcodeConfig, GcodeCopperLayer} from "../../../logic/types/gcode.ts";
import {Gcode} from "../../../logic/generators/gcode.ts";

type Props = {
    onBack?: () => void
}

const GcodeSettigns: Component<Props> = (props) => {
    const project = useProject();
    const [files, setFiles] = createSignal<{[key: string]: string}>({});

    const config: GcodeConfig = {
        traces: {
            copperLayer: GcodeCopperLayer.Top,
            mirror: true,
            cutoutProfile: false,
            offsetX: 34,
            offsetY: 26,
            feedRate: 1400,
            iterations: 40,
            removeGndPads: false,
            usePrinterBedMesh: false,
        },
        silkscreen: {
            top: true,
            bottom: false,
            mirror: false,
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

    const onGenerate = () => {
        const files = Gcode.generateFiles(project, config);
        console.log(files)
        setFiles(files);
    }

    return <div class={"FlatcamSettings"}>
        <SettingsContainer name={"Traces"} visible={true}>
            <SettingCombo label={"Copper layer"}
                          values={Object.values(GcodeCopperLayer)}
                          defaultValue={config.traces.copperLayer}
                          onChange={(value) => onChange("traces.copperLayer", value)}/>
            <SettingCheck label={"Mirror"} defaultValue={config.traces.mirror}
                          onChange={(value) => onChange("traces.mirror", value)}/>
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
            <SettingCheck label={"Remove GND pads"} defaultValue={config.traces.removeGndPads}
                          onChange={(value) => onChange("traces.removeGndPads", value)}/>
            <SettingCheck label={"Use printer bed mesh"} defaultValue={config.traces.usePrinterBedMesh}
                          onChange={(value) => onChange("traces.usePrinterBedMesh", value)}/>
        </SettingsContainer>

        <SettingsContainer name={"Silkscreen"}>
            <SettingCheck label={"Top"} defaultValue={config.silkscreen.top}
                          onChange={(value) => onChange("silkscreen.top", value)}/>
            <SettingCheck label={"Bottom"} defaultValue={config.silkscreen.bottom}
                          onChange={(value) => onChange("silkscreen.bottom", value)}/>
            <SettingCheck label={"Mirror"} defaultValue={config.silkscreen.mirror}
                          onChange={(value) => onChange("silkscreen.mirror", value)}/>
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

        <div class={"actions"}>
            <button onClick={props.onBack}>Back</button>
            <button onClick={onGenerate}>Generate</button>
        </div>

        <div class={"files"}>
            {Object.keys(files()).map(it =>
                <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(files()[it])}`} download={it}>{it}</a>
            )}
        </div>
    </div>;
}

export default GcodeSettigns;