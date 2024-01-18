import {Component, createEffect, createSignal} from "solid-js";
import {AiOutlineCheck} from "solid-icons/ai";
import {CheckItem} from "../../logic/types/checklist.ts";

type Props = {
    item: CheckItem
}

const Item: Component<Props> = (props) => {
    const [checked, setChecked] = createSignal(props.item.checked == true)

    createEffect(() => props.item.checked = checked())

    return <div class={`Item ${checked() ? "checked" : ""}`} onClick={() => setChecked(prev => !prev)}>
        <div class={`counter ${checked() ? "checked" : ""}`}>
            {!checked() ? null : <AiOutlineCheck/>}
        </div>
        {props.item.text.split("\n").map(it => <>{it}<br/></>)}
    </div>;
}

export default Item;