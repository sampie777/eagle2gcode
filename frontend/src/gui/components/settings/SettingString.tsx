import { Component, createEffect, createSignal } from "solid-js";
import './style.less'

type Props = {
  label: string,
  defaultValue?: string,
  value?: string,
  placeholder?: string,
  onChange: (value: string) => void
}

const SettingString: Component<Props> = (props) => {
  const id = "setting-string-" + (Math.random() * 10000000).toFixed(0);
  const [val, setVal] = createSignal<string>(props.value !== undefined ? props.value : (props.defaultValue ?? ""));

  createEffect(() => {
    const next = props.value !== undefined ? props.value : (props.defaultValue ?? "");
    setVal(next);
  });

  return <div class={"setting SettingString"}>
    <label for={id}>
      {props.label}
    </label>

    <input id={id}
           type={"text"}
           placeholder={props.placeholder}
           value={val()}
           onInput={e => {
             const v = e.currentTarget.value;
             setVal(v);
             props.onChange(v);
           }} />
  </div>;
}

export default SettingString;
