import {Component} from "solid-js";

type Props = {
    label: string,
    defaultValue: number,
    onChange: (value: number) => void
}

const SettingNumber: Component<Props> = (props) => {
    const id = "setting-number-" + (Math.random() * 10000000).toFixed(0);

    return <div class={"setting SettingNumber"}>
        <label for={id}>
            {props.label}
        </label>

        <input id={id}
               type={"number"}
               value={props.defaultValue}
               onChange={e => props.onChange(+e.target.value)}/>
    </div>;
}

export default SettingNumber;