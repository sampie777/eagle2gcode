import {Component} from "solid-js";

type Props = {
    label: string,
    defaultValue: boolean,
    onChange: (value: boolean) => void;
}

const SettingCheck: Component<Props> = (props) => {
    const id = "setting-check-" + (Math.random() * 10000000).toFixed(0);

    return <div class={"setting SettingCheck"}>
        <label for={id}>
            {props.label}
        </label>

        <input id={id}
               type={"checkbox"}
               checked={props.defaultValue}
               onChange={e => props.onChange(e.target.checked)}/>
    </div>;
}

export default SettingCheck;