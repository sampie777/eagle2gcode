import {createEffect, createSignal} from "solid-js";
import {useProject} from "../ProjectContext";
import {Graphics} from "../../logic/graphics/graphics";
import {AiOutlineReload} from "solid-icons/ai";
import { useConfig } from "../ConfigContext";

const createCanvas = () => {
    const [boardOpacity, setBoardOpacity] = createSignal(0);
    const [showTopTraces, setShowTopTraces] = createSignal(true);
    const [showBottomTraces, setShowBottomTraces] = createSignal(true);
    const [showSilkscreen, setShowSilkscreen] = createSignal(true);
    const [showSoldermask, setShowSoldermask] = createSignal(true);
    const [showDrills, setShowDrills] = createSignal(true);
    const [showGrid, setShowGrid] = createSignal(true);
    const [showAlignmentHolesDebug, setShowAlignmentHolesDebug] = createSignal(false);
    const [showOffsetDrillHolesDebug, setShowOffsetDrillHolesDebug] = createSignal(false);
    const {project} = useProject();
    const {config} = useConfig();
    const {canvas, update} = Graphics.start({width: 1300, height: 600});

    createEffect(() => {
        // Trigger on change of one of the following:
        [
            config.traces.cutoutProfile,
            ...config.drills.offset.map(it => it.actual.x),
            ...config.drills.offset.map(it => it.actual.y),
            ...config.silkscreen.offset.map(it => it.actual.x),
            ...config.silkscreen.offset.map(it => it.actual.y),
            config.silkscreen.outOfBounds,
        ].forEach(() => null)
        renderProject();
    })

    const renderProject = () => {
        update(project, {
            boardOpacity: boardOpacity(),
            showProfile: true,
            showTopTraces: showTopTraces(),
            showBottomTraces: showBottomTraces(),
            showSilkscreen: showSilkscreen(),
            showSoldermask: showSoldermask(),
            showDrills: showDrills(),
            showGrid: showGrid(),
            showAlignmentHolesDebug: showAlignmentHolesDebug(),
            showOffsetDrillHolesDebug: showOffsetDrillHolesDebug(),
        }, config)
    }

    return {
        rerender: renderProject,
        Canvas: () => (<div class={"Canvas"}>
            {canvas}

            <div class={"canvas-control"}>
                <button onClick={renderProject} title={"Rerender"}>
                    <AiOutlineReload/>
                </button>

                <label for={"boardOpacity"}>Board opacity</label>
                <input type="range"
                       min={0} max={100} value={boardOpacity() * 100}
                       onInput={e => setBoardOpacity(+e.target.value / 100)}
                       id="boardOpacity"/>

                <label>
                    <input type="checkbox"
                           checked={showTopTraces()}
                           onChange={e => setShowTopTraces(e.target.checked)}/>
                    Traces (top)
                </label>

                <label>
                    <input type="checkbox"
                           checked={showBottomTraces()}
                           onChange={e => setShowBottomTraces(e.target.checked)}/>
                    Traces (bottom)
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

                <label
                    title={"Yellow will be the alignment hole itself, pink will be the actual location, white will be the calculated location"}>
                    <input type="checkbox"
                           checked={showAlignmentHolesDebug()}
                           onChange={e => setShowAlignmentHolesDebug(e.target.checked)}/>
                    Debug alignment holes
                </label>

                <label>
                    <input type="checkbox"
                           checked={showOffsetDrillHolesDebug()}
                           onChange={e => setShowOffsetDrillHolesDebug(e.target.checked)}/>
                    Debug offset drill holes
                </label>
            </div>
        </div>)
    }
}

export default createCanvas;