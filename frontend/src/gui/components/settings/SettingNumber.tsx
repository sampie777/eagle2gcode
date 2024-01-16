import {Component} from "solid-js";
import './style.less'

type Props = {
    label: string,
    defaultValue: number,
    onChange: (value: number) => void,
    step?: number,
    min?: number,
    max?: number,
}

const SettingNumber: Component<Props> = (props) => {
    const id = "setting-number-" + (Math.random() * 10000000).toFixed(0);

    return <div class={"setting SettingNumber"}>
        <label for={id}>
            {props.label}
        </label>

        <input id={id}
               type={"number"}
               step={props.step}
               min={props.min}
               max={props.max}
               value={props.defaultValue}
               onInput={e => props.onChange(+e.target.value)}/>
    </div>;
}

export default SettingNumber;