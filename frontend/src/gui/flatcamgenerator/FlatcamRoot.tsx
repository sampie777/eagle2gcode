import {Component, createEffect, createSignal} from "solid-js";
import SettingsContainer from "../components/settings/SettingsContainer";
import SettingNumber from "../components/settings/SettingNumber";
import {Flatcam} from "../../logic/flatcam";
import SettingString from "../components/settings/SettingString";
import './style.less';
import {ScreenProps} from "../../logic/screens";
import {getCookie, setCookie} from "../../logic/cookies";
import {useProject} from "../ProjectContext";
import {exampleProject} from "../../logic/example/project";

type Props = ScreenProps

const FlatcamRoot: Component<Props> = (props) => {
    const [commands, setCommands] = createSignal<string>("");
    const {loadProject} = useProject();

    const config = {
        project: {
            camDirectory: getCookie("project.camDirectory") ?? "",
        },
        traces: {
            diaWidth: 0.20188,
        }
    }

    createEffect(() => generate());

    const onChange = (key: string, value: any) => {
        const path = key.split(".");
        config[path[0]][path[1]] = value;
        generate();
    }

    const generate = () => {
        const result = Flatcam.generateCommands(config.project.camDirectory, config.traces.diaWidth);
        setCommands(result);
    }

    const copy = () => navigator.clipboard.writeText(commands());

    const nextScreen = () => {
        setCookie("project.camDirectory", config.project.camDirectory, 365);
        props.onNext?.();
    };

    const loadExampleProject = () => {
        loadProject(exampleProject);
        nextScreen();
    }

    return <div class={"FlatcamRoot"}>
        <h1>FlatCAM command generation</h1>
        <ol style={{"text-align": "left"}}>
            <li>Edit the configuration below and copy the generated commands.</li>
            <li>Open a new <a href="http://flatcam.org/" target={"_blank"}>FlatCAM</a> project and paste these commands
                in the command window.
            </li>
            <li>Upload the generated files in the next screen. The generated files can be found in the specified project
                folder under <code>CAMOutputs/</code> as <code>*.gcode</code> files.
            </li>
        </ol>

        <SettingsContainer name={"Config"} visible={true}>
            <SettingString label={"Project path"}
                           defaultValue={config.project.camDirectory}
                           onChange={(value) => onChange("project.camDirectory", value)}/>
            <SettingNumber label={"Dia width"}
                           defaultValue={config.traces.diaWidth}
                           step={0.0001}
                           onChange={(value) => onChange("traces.diaWidth", value)}/>
        </SettingsContainer>

        <textarea class={"result"}
                  title={"Double click to select all"}
                  onDblClick="this.select()">{commands()}</textarea>

        <div class={"actions"}>
            <button onClick={copy}>Copy</button>
            <button onClick={nextScreen}>Next</button>
        </div>
        <div class={"actions"}>
            <button onClick={loadExampleProject}>Example project</button>
        </div>
    </div>;
}

export default FlatcamRoot;