import { Component, JSX } from "solid-js";
import './style.less';

type Props = {
  label: string,
  defaultValue: boolean,
  onChange: (value: boolean) => void;
  icon?: JSX.Element;
  hint?: string;
}

const SettingCheck: Component<Props> = (props) => {
  const id = "setting-check-" + (Math.random() * 10000000).toFixed(0);

  return <div class={"setting SettingCheck"} title={props.hint}>
    <label for={id}>
      <span class={"label-title"}>
        {props.icon ? <span class={"setting-icon"}>{props.icon}</span> : null}
        <span class={"label-text"}>{props.label}</span>
      </span>
      {props.hint ? <span class={"setting-hint"}>{props.hint}</span> : null}
    </label>

    <input id={id}
           type={"checkbox"}
           checked={props.defaultValue}
           onChange={e => props.onChange(e.target.checked)} />
  </div>;
};

export default SettingCheck;
