import {Component, createSignal} from "solid-js";
import {useProject} from "../ProjectContext.ts";
import Canvas from "./Canvas.tsx";
import './style.less'
import GcodeSettings from "./flatcam/GcodeSettings.tsx";
import {ScreenProps} from "../../logic/screens.ts";
import {getProjectDimensions} from "../../logic/processors/project.ts";
import {useConfig} from "../ConfigContext.ts";

type Props = ScreenProps

const ViewerRoot: Component<Props> = (props) => {
    const {config} = useConfig()
    const {project} = useProject();
    const [showProfile, setShowProfile] = createSignal(config.traces.cutoutProfile);
    project.isLoaded = true;

    console.log(project)

    const dimensions = getProjectDimensions(project);

    const projectName = () => {
        if (project.path == undefined) return "Unknown project";
        const projectPathSegments = project.path.split("/");
        return projectPathSegments[projectPathSegments.length - 1]
            .replace(/[_.\-]/g, " ")
    }

    return <div class={"Viewer"}>
        <h2>{projectName()}</h2>
        <small>{dimensions.width.toFixed(1)} x {dimensions.height.toFixed(1)} mm</small>

        <div class={"container"}>
            <Canvas showProfile={showProfile}/>

            {/*<div>*/}
            {/*    <img src={example_board} />*/}
            {/*</div>*/}
            <GcodeSettings showProfile={showProfile}
                           setShowProfile={setShowProfile}
                           onBack={props.onBack}/>
        </div>
    </div>;
}

export default ViewerRoot;