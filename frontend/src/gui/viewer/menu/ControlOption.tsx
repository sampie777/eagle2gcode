import { Component, JSX } from "solid-js";

type Props = {
  name: string
  isChecked: boolean
  onChange: (value: boolean) => void
  title?: string
  color?: string
  icon?: JSX.Element
}

const ControlOption: Component<Props> = (props) => {
  return <label class={`ControlOption ${props.isChecked ? "checked" : ""}`}
                title={props.title}
                style={props.isChecked && props.color ? { "border-color": props.color } : {}}>
    <input type="checkbox"
           checked={props.isChecked}
           onChange={e => props.onChange(e.target.checked)} />
    {props.color ? (
      <span class="color-dot"
            style={{
              "background-color": props.color,
              "box-shadow": props.isChecked ? `0 0 6px ${props.color}` : "none",
              opacity: props.isChecked ? 1 : 0.4
            }} />
    ) : null}
    {props.icon ? <span class="control-icon">{props.icon}</span> : null}
    <span class="control-name">{props.name}</span>
  </label>;
};

export default ControlOption;
