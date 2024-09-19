import { Component, createEffect, createSignal } from "solid-js";
import {useProject} from "../ProjectContext";
import createCanvas from "./Canvas";
import './style.less'
import GcodeSettings from "./flatcam/GcodeSettings";
import {ScreenProps} from "../../logic/screens";
import { getProjectDimensions, setTracesVisibility } from "../../logic/processors/project";
import {useConfig} from "../ConfigContext";
import Checklist from "../checklist/Checklist";

type Props = ScreenProps

const ViewerRoot: Component<Props> = (props) => {
    const {config} = useConfig()
    const {project} = useProject();
    const [showChecklist, setShowChecklist] = createSignal(false);
    const [dimensions, setDimensions]= createSignal(getProjectDimensions(project));

    project.isLoaded = true;

    createEffect(() => {
        // Trigger on change of one of the following:
        [
            config.traces.outOfBounds,
            config.silkscreen.outOfBounds,
        ].forEach(() => null)

        setTracesVisibility(project, config)
        setDimensions(getProjectDimensions(project));
    });

    const projectName = () => {
        if (project.path == undefined) return "Unknown project";
        const projectPathSegments = project.path.split("/");
        return projectPathSegments[projectPathSegments.length - 1]
            .replace(/[_.\-]/g, " ")
    }

    const {rerender, Canvas} = createCanvas();

    return <div class={"Viewer"}>
        {!showChecklist() ? null : <Checklist close={() => setShowChecklist(false)}/>}

        <h2>{projectName()}</h2>
        <small>{dimensions().width.toFixed(1)} x {dimensions().height.toFixed(1)} mm</small>

        <div class={"container"}>
            <Canvas />

            <GcodeSettings onBack={props.onBack}
                           requestRender={rerender}
                           showChecklist={() => setShowChecklist(true)}/>
        </div>
    </div>;
}

export default ViewerRoot;