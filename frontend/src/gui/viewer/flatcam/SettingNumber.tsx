import {Component} from "solid-js";

type Props = {
    label: string,
    defaultValue: number,
}

const SettingNumber: Component<Props> = (props) => {
    const id = "setting-number-" + (Math.random() * 10000000).toFixed(0);

    return <div class={"setting SettingNumber"}>
        <label for={id}>
            {props.label}
        </label>

        <input id={id}
               type={"number"}
               value={props.defaultValue} />
    </div>;
}

export default SettingNumber;