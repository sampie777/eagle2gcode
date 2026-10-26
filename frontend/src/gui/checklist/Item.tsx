import { Component, createEffect, createSignal } from "solid-js";
import { AiOutlineCheck } from "solid-icons/ai";
import { CheckItem } from "../../logic/types/checklist";

type Props = {
  item: CheckItem,
  displayText?: string,
  onToggle?: (checked: boolean) => void
}

const Item: Component<Props> = (props) => {
  const [checked, setChecked] = createSignal(props.item.checked === true);

  createEffect(() => {
    setChecked(props.item.checked === true);
  });

  const onClick = () => {
    const next = !checked();
    setChecked(next);
    props.item.checked = next;
    props.onToggle?.(next);
  };

  return <div class={`Item ${checked() ? "checked" : ""}`} onClick={onClick}>
    <div class={`counter ${checked() ? "checked" : ""}`}>
      {!checked() ? null : <AiOutlineCheck />}
    </div>
    {(props.displayText ?? props.item.text).split("\n").map(it => <>{it}<br /></>)}
  </div>;
};

export default Item;
