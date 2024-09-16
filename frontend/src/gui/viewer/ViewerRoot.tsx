import {Component, createSignal} from "solid-js";
import {useProject} from "../ProjectContext.ts";
import createCanvas from "./Canvas.tsx";
import './style.less'
import GcodeSettings from "./flatcam/GcodeSettings.tsx";
import {ScreenProps} from "../../logic/screens.ts";
import { getProjectDimensions, setTracesVisibility } from "../../logic/processors/project.ts";
import {useConfig} from "../ConfigContext.ts";
import Checklist from "../checklist/Checklist.tsx";

type Props = ScreenProps

const ViewerRoot: Component<Props> = (props) => {
    const {config} = useConfig()
    const {project} = useProject();
    const [showProfile, setShowProfile] = createSignal(config.traces.cutoutProfile);
    const [showChecklist, setShowChecklist] = createSignal(false);

    setTracesVisibility(project, config)
    project.isLoaded = true;

    console.log(project)

    const dimensions = getProjectDimensions(project);

    const projectName = () => {
        if (project.path == undefined) return "Unknown project";
        const projectPathSegments = project.path.split("/");
        return projectPathSegments[projectPathSegments.length - 1]
            .replace(/[_.\-]/g, " ")
    }

    const {rerender, Canvas} = createCanvas({showProfile: showProfile});

    return <div class={"Viewer"}>
        {!showChecklist() ? null : <Checklist close={() => setShowChecklist(false)}/>}

        <h2>{projectName()}</h2>
        <small>{dimensions.width.toFixed(1)} x {dimensions.height.toFixed(1)} mm</small>

        <div class={"container"}>
            <Canvas />

            <GcodeSettings showProfile={showProfile}
                           setShowProfile={setShowProfile}
                           onBack={props.onBack}
                           requestRender={rerender}
                           showChecklist={() => setShowChecklist(true)}/>
        </div>
    </div>;
}

export default ViewerRoot;