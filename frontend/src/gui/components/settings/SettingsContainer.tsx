import {Component, createSignal} from "solid-js";
import './style.less'

type Props = {
    name: string
    visible?: boolean
}

const SettingsContainer: Component<Props> = (props) => {
    const [visible, setVisible] = createSignal<boolean>(props.visible == true);

    const toggle = () => {
        setVisible(prev => !prev);
    }

    return <div class={"SettingsContainer"}>
        <h3 onClick={toggle}>{props.name}</h3>
        <div class={`children ${visible() ? "" : "hidden"}`}>
            {props.children}
        </div>
    </div>;
}

export default SettingsContainer;