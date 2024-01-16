import {Component} from "solid-js";
import './style.less'

type Props = {
    label: string,
    defaultValue: string,
    onChange: (value: string) => void
}

const SettingString: Component<Props> = (props) => {
    const id = "setting-string-" + (Math.random() * 10000000).toFixed(0);

    return <div class={"setting SettingString"}>
        <label for={id}>
            {props.label}
        </label>

        <input id={id}
               type={"text"}
               value={props.defaultValue}
               onInput={e => props.onChange(e.target.value)}/>
    </div>;
}

export default SettingString;