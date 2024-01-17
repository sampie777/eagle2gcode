import {Component, createSignal} from "solid-js";
import {useProject} from "../ProjectContext.ts";
import Canvas from "./Canvas.tsx";
import './style.less'
import GcodeSettings from "./flatcam/GcodeSettings.tsx";
import {ScreenProps} from "../../logic/screens.ts";
import {getProjectDimensions} from "../../logic/processors/project.ts";

type Props = ScreenProps

const ViewerRoot: Component<Props> = (props) => {
    const [showProfile, setShowProfile] = createSignal(true);
    const project = useProject();
    project.isLoaded = true;

    console.log(project)

    const dimensions = getProjectDimensions(project);

    return <div class={"Viewer"}>
        <small>{dimensions.width.toFixed(1)} x {dimensions.height.toFixed(1)} mm</small>

        <div style={{display: "flex", "flex-direction": 'row', "align-items": "center"}}>
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