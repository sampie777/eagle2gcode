import {Component} from "solid-js";
import {useProject} from "../ProjectContext.ts";
import Canvas from "./Canvas.tsx";
import './style.less'

type Props = {
    onReset: () => void;
}

const ViewerRoot: Component<Props> = (props) => {
    const project = useProject();
    project.isLoaded = true;

    return <div class={"Viewer"}>
        <h3>{project.job.title}</h3>
        <small>{project.job.width} x {project.job.height} mm</small>

        <div>
            <button onClick={props.onReset}>New project</button>
        </div>

        <Canvas />
    </div>;
}

export default ViewerRoot;