import {Component, createSignal} from "solid-js";
import SettingsContainer from "./../../components/settings/SettingsContainer.tsx";
import SettingCombo from "./../../components/settings/SettingCombo.tsx";
import SettingCheck from "./../../components/settings/SettingCheck.tsx";
import SettingNumber from "./../../components/settings/SettingNumber.tsx";
import './style.less';
import {FlatcamConfig, FlatcamCopperLayer} from "../../../logic/types/flatcam.ts";
import {Flatcam} from "../../../logic/flatcam.ts";
import {useProject} from "../../ProjectContext.ts";
import {Gcode, generateFiles, generateSilkscreenFile} from "../../../logic/gcode.ts";

type Props = {
    onBack?: () => void
}

const GcodeSettigns: Component<Props> = (props) => {
    const project = useProject();
    const [commands, setCommands] = createSignal<string | undefined>();

    const config: FlatcamConfig = {
        traces: {
            copperLayer: FlatcamCopperLayer.Top,
            mirror: true,
            cutoutProfile: false,
            offsetX: 34,
            offsetY: 26,
            feedrate: 1400,
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
        }
    }

    const onChange = (key: string, value: any) => {
        const path = key.split(".");
        config[path[0]][path[1]] = value;
    }

    const onGenerate = () => {
        console.log(Gcode.generateFiles(project))
        alert("File generation not supported yet")
    }

    return <div class={"FlatcamSettings"}>
        <SettingsContainer name={"Traces"} visible={true}>
            <SettingCombo label={"Copper layer"}
                          values={Object.values(FlatcamCopperLayer)}
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
            <SettingNumber label={"Feedrate"} defaultValue={config.traces.feedrate}
                           onChange={(value) => onChange("traces.feedrate", value)}/>
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
        </SettingsContainer>

        <div class={"actions"}>
            <button onClick={props.onBack}>Back</button>
            <button onClick={onGenerate}>Generate</button>
        </div>

        {commands() == null ? null :
            <textarea class={"result"} autofocus={true}>
                {commands()}
            </textarea>
        }
    </div>;
}

export default GcodeSettigns;