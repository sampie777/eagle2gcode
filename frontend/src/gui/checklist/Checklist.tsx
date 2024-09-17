import {Component} from "solid-js";
import './style.less';
import Item from "./Item";
import {useChecklist} from "../ChecklistContext";

type Props = {
    close: () => void
}

const Checklist: Component<Props> = (props) => {
    const {checklist} = useChecklist();

    return <div class={"Checklist"} onClick={e => e.target === e.currentTarget ? props.close() : null}>
        <div class={"content"}>
            {checklist.map(group => <>
                <h3>{group.title}</h3>
                <ol>
                    {group.items.map(item => <Item item={item}/>)}
                </ol>
            </>)}

            <button onClick={props.close}>Close</button>
        </div>
    </div>;
}

export default Checklist;