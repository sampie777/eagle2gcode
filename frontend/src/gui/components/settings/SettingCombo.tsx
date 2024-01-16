import {Component} from "solid-js";
import './style.less'

type Props = {
    label: string,
    values: string[],
    defaultValue: string,
    onChange: (value: string) => void
}

const SettingCombo: Component<Props> = (props) => {
    const id = "setting-combo-" + (Math.random() * 10000000).toFixed(0);

    return <div class={"setting SettingCombo"}>
        <label for={id}>
            {props.label}
        </label>

        <select id={id}
                value={props.defaultValue}
                onChange={e => props.onChange(e.target.value)}>
            {props.values.map(it => <option>{it}</option>)}
        </select>
    </div>;
}

export default SettingCombo;