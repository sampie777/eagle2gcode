import { Component, createEffect, createSignal, JSX } from "solid-js";
import './style.less';

type Props = {
  label: string,
  defaultValue: number,
  onChange: (value: number) => void,
  step?: number,
  min?: number,
  max?: number,
  unit?: string,
  icon?: JSX.Element,
  hint?: string,
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
      const step = props.step ?? 1;
      const current = parseValue(text());
      const delta = e.key === "ArrowUp" ? step : -step;
      let next = current + delta;
      if (props.min !== undefined && next < props.min) next = props.min;
      if (props.max !== undefined && next > props.max) next = props.max;
      const stepDecimals = (String(step).split(".")[1] || "").length;
      const currentDecimals = (text().split(".")[1] || "").length;
      const decimals = Math.max(stepDecimals, currentDecimals);
      next = Number(next.toFixed(decimals));
      const newText = decimals > 0 ? next.toFixed(decimals) : String(next);
      setText(newText);
      lastSentValue = next;
      props.onChange(next);
    }
  };

  return <div class={"setting SettingNumber"} title={props.hint}>
    <label for={id}>
      <span class={"label-title"}>
        {props.icon ? <span class={"setting-icon"}>{props.icon}</span> : null}
        <span class={"label-text"}>{props.label}</span>
      </span>
      {props.hint ? <span class={"setting-hint"}>{props.hint}</span> : null}
    </label>

    <div class={"input-wrapper"} onClick={(e) => {
      const input = (e.currentTarget as HTMLElement).querySelector("input");
      if (input && document.activeElement !== input) input.focus();
    }}>
      <input id={id}
             type={"text"}
             inputMode={"decimal"}
             step={props.step}
             min={props.min}
             max={props.max}
             value={text()}
             onInput={onInput}
             onKeyDown={onKeyDown} />
      {props.unit ? <span class={"unit-badge"}>{props.unit}</span> : null}
    </div>
  </div>;
};

export default SettingNumber;
