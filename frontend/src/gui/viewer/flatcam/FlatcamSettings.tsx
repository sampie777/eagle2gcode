import {Component} from "solid-js";
import SettingsContainer from "./SettingsContainer.tsx";
import SettingCombo from "./SettingCombo.tsx";
import SettingCheck from "./SettingCheck.tsx";
import SettingNumber from "./SettingNumber.tsx";
import './style.less';

type Props = {}

const FlatcamSettings: Component<Props> = (props) => {
    return <div class={"FlatcamSettings"}>
        <SettingsContainer name={"Traces"} visible={true}>
            <SettingCombo label={"Copper layer"} values={["Top", "Bottom"]} defaultValue={"Top"}/>
            <SettingCheck label={"Mirror"} defaultValue={true}/>
            <SettingCheck label={"Cutout profile"} defaultValue={false}/>
            <SettingNumber label={"Offset X"} defaultValue={34}/>
            <SettingNumber label={"Offset Y"} defaultValue={26}/>
            <SettingNumber label={"Dia width"} defaultValue={0.20188}/>
            <SettingNumber label={"Feedrate"} defaultValue={1400}/>
            <SettingNumber label={"Iterations"} defaultValue={40}/>
            <SettingCheck label={"Remove GND pads"} defaultValue={false}/>
            <SettingCheck label={"Use printer bed mesh"} defaultValue={false}/>
        </SettingsContainer>

        <SettingsContainer name={"Silkscreen"}>
            <SettingCheck label={"Top"} defaultValue={true}/>
            <SettingCheck label={"Bottom"} defaultValue={false}/>
            <SettingCheck label={"Mirror"} defaultValue={false}/>
        </SettingsContainer>

        <SettingsContainer name={"Drills"}>
            <SettingNumber label={"Offset X"} defaultValue={12}/>
            <SettingNumber label={"Offset Y"} defaultValue={27.5}/>
        </SettingsContainer>

        <div class={"actions"}>
            <button>Generate</button>
        </div>
    </div>;
}

export default FlatcamSettings;