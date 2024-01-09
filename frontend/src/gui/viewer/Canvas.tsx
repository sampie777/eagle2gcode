import {Component, createEffect} from "solid-js";
import {useProject} from "../ProjectContext.ts";
import {Graphics} from "../../logic/graphics/graphics.ts";

type Props = {}

const Canvas: Component<Props> = (props) => {
    const project = useProject();
    const {canvas, update} = Graphics.start();

    createEffect(() => {
        update(project)
    })

    console.log("Render")
    return <div class={"Canvas"}>
        {canvas}
    </div>;
}

export default Canvas;