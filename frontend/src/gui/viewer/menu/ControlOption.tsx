import { Component } from "solid-js";

type Props = {
  name: string
  isChecked: boolean
  onChange: (value: boolean) => void
  title?: string
}

const ControlOption: Component<Props> = (props) => {
  return <label class={`ControlOption ${props.isChecked ? "checked" : ""}`} title={props.title}>
    <input type="checkbox"
           checked={props.isChecked}
           onChange={e => props.onChange(e.target.checked)} />
    {props.name}
  </label>;
}

export default ControlOption;