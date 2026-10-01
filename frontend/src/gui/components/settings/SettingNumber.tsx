import { Component, createEffect, createSignal } from "solid-js";
import './style.less'

type Props = {
  label: string,
  defaultValue: number,
  onChange: (value: number) => void,
  step?: number,
  min?: number,
  max?: number,
}

const parseValue = (raw: string): number => {
  const normalized = raw.trim().replace(/,/g, ".");
  if (normalized === "" || normalized === "-" || normalized === "." || normalized === "-.") {
    return 0;
  }
  const parsed = Number(normalized);
  return isNaN(parsed) ? 0 : parsed;
};

const SettingNumber: Component<Props> = (props) => {
  const id = "setting-number-" + (Math.random() * 10000000).toFixed(0);

  const [text, setText] = createSignal<string>(
    props.defaultValue !== undefined && props.defaultValue !== null
      ? String(props.defaultValue)
      : ""
  );

  let lastSentValue = props.defaultValue ?? 0;

  createEffect(() => {
    const incoming = props.defaultValue ?? 0;
    if (incoming !== lastSentValue) {
      lastSentValue = incoming;
      setText(String(incoming));
    }
  });

  const onInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const raw = e.currentTarget.value;
    setText(raw);
    const num = parseValue(raw);
    lastSentValue = num;
    props.onChange(num);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      console.log(props)
      const step = props.step ?? 1;
      const current = parseValue(text());
      const delta = e.key === "ArrowUp" ? step : -step;
      let next = current + delta;
      if (props.min !== undefined && next < props.min) next = props.min;
      if (props.max !== undefined && next > props.max) next = props.max;
      const decimals = (String(step).split(".")[1] || "").length;
      next = Number(next.toFixed(Math.max(decimals, 3)));
      const newText = String(next);
      setText(newText);
      lastSentValue = next;
      props.onChange(next);
    }
  };

  return <div class={"setting SettingNumber"}>
    <label for={id}>
      {props.label}
    </label>

    <input id={id}
           type={"text"}
           inputMode={"decimal"}
           step={props.step}
           min={props.min}
           max={props.max}
           value={text()}
           onInput={onInput}
           onKeyDown={onKeyDown} />
  </div>;
}

export default SettingNumber;
