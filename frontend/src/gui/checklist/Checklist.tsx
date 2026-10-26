import { Component, createSignal, For, onCleanup, onMount } from "solid-js";
import './style.less';
import Item from "./Item";
import { useChecklist } from "../ChecklistContext";
import { getProjectDimensions } from "../../logic/processors/project";
import { useProject } from "../ProjectContext";
import { CadType } from "../../logic/flatcam";
import { AiOutlineClose } from "solid-icons/ai";

type Props = {
  close: () => void
}

const Checklist: Component<Props> = (props) => {
  const { project } = useProject();
  const [dimensions] = createSignal(getProjectDimensions(project));
  const { checklist, activeCad, setCad } = useChecklist();

  onMount(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        props.close();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    onCleanup(() => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    });
  });

  const onCadChange = (cad: CadType) => {
    setCad(cad);
    localStorage.setItem("project.selectedCad", cad);
  };

  return <div class={"Checklist"} onClick={e => e.target === e.currentTarget ? props.close() : null}>
    <div class={"content"}>
      <button class={"checklist-close-btn"} onClick={props.close} title={"Close (Esc)"}>
        <AiOutlineClose />
      </button>

      <div class={"checklist-header"}>
        <h2>PCB Fabrication Checklist</h2>
        <div class={"checklist-cad-tabs"}>
          <button
            type="button"
            class={`checklist-cad-tab ${activeCad() === "eagle" ? "active" : ""}`}
            onClick={() => onCadChange("eagle")}
          >
            Eagle
          </button>
          <button
            type="button"
            class={`checklist-cad-tab ${activeCad() === "altium" ? "active" : ""}`}
            onClick={() => onCadChange("altium")}
          >
            Altium
          </button>
        </div>
      </div>

      <For each={checklist()}>
        {(group) => (
          <>
            <h3>{group.title}</h3>
            <ol>
              <For each={group.items}>
                {(item) => {
                  let text = item.text;
                  if (text.startsWith("Saw the board")) {
                    const width = Math.ceil(dimensions().width) + 2;
                    const height = Math.ceil(dimensions().height) + 2;
                    text = text.replaceAll(/Saw the board.*?\./g, `Saw the board to ${width} x ${height} mm.`);
                  }
                  return <Item item={item} displayText={text} />;
                }}
              </For>
            </ol>
          </>
        )}
      </For>

      <div class={"actions"}>
        <button onClick={props.close}>Close</button>
      </div>
    </div>
  </div>;
}

export default Checklist;
