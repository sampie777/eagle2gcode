import {Component, createEffect, createSignal} from "solid-js";
import {useProject} from "../ProjectContext.ts";
import {Graphics} from "../../logic/graphics/graphics.ts";
import {Accessor} from "solid-js/types/reactive/signal";

type Props = {
    showProfile: Accessor<boolean>
}

const Canvas: Component<Props> = (props) => {
    const [boardOpacity, setBoardOpacity] = createSignal(0);
    const [showTraces, setShowTraces] = createSignal(true);
    const [showSilkscreen, setShowSilkscreen] = createSignal(true);
    const [showSoldermask, setShowSoldermask] = createSignal(true);
    const [showDrills, setShowDrills] = createSignal(true);
    const [showGrid, setShowGrid] = createSignal(true);
    const {project} = useProject();
    const {canvas, update} = Graphics.start({width: 1000, height: 600});

    createEffect(() => {
        update(project, {
            boardOpacity: boardOpacity(),
            showProfile: props.showProfile(),
            showTraces: showTraces(),
            showSilkscreen: showSilkscreen(),
            showSoldermask: showSoldermask(),
            showDrills: showDrills(),
            showGrid: showGrid(),
        })
    })

    return <div class={"Canvas"}>
        {canvas}

        <div class={"canvas-control"}>
            <label for={"boardOpacity"}>Board opacity</label>
            <input type="range"
                   min={0} max={100} value={boardOpacity() * 100}
                   onInput={e => setBoardOpacity(+e.target.value / 100)}
                   id="boardOpacity"/>

            <label>
                <input type="checkbox"
                       checked={showTraces()}
                       onChange={e => setShowTraces(e.target.checked)}/>
                Traces
            </label>

            <label>
                <input type="checkbox"
                       checked={showSilkscreen()}
                       onChange={e => setShowSilkscreen(e.target.checked)}/>
                Silkscreen
            </label>

            <label>
                <input type="checkbox"
                       checked={showSoldermask()}
                       onChange={e => setShowSoldermask(e.target.checked)}/>
                Soldermask
            </label>

            <label>
                <input type="checkbox"
                       checked={showDrills()}
                       onChange={e => setShowDrills(e.target.checked)}/>
                Drills
            </label>

            <label>
                <input type="checkbox"
                       checked={showGrid()}
                       onChange={e => setShowGrid(e.target.checked)}/>
                Grid
            </label>
        </div>
    </div>;
}

export default Canvas;