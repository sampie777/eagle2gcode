import { Component, JSX } from "solid-js";
import './style.less';

type Props = {
  label: string,
  values: string[],
  defaultValue: string,
  onChange: (value: string) => void,
  icon?: JSX.Element,
  hint?: string,
}

const SettingCombo: Component<Props> = (props) => {
  const id = "setting-combo-" + (Math.random() * 10000000).toFixed(0);

  return <div class={"setting SettingCombo"} title={props.hint}>
    <label for={id}>
      <span class={"label-title"}>
        {props.icon ? <span class={"setting-icon"}>{props.icon}</span> : null}
        <span class={"label-text"}>{props.label}</span>
      </span>
      {props.hint ? <span class={"setting-hint"}>{props.hint}</span> : null}
    </label>

    <select id={id}
            value={props.defaultValue}
            onChange={e => props.onChange(e.target.value)}>
      {props.values.map(it => <option value={it}>{it}</option>)}
    </select>
  </div>;
};

export default SettingCombo;
