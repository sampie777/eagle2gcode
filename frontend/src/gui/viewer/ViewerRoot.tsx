import {Component} from "solid-js";
import {useProject} from "../ProjectContext.ts";

type Props = {}

const ViewerRoot: Component<Props> = (props) => {
    const project = useProject();

    return <div class={"Viewer"}>
        <h3>{project.job.title}</h3>
        <small>{project.job.width} x {project.job.height} mm</small>
    </div>;
}

export default ViewerRoot;