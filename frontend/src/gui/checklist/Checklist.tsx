import { Component, createSignal } from "solid-js";
import './style.less';
import Item from "./Item";
import { useChecklist } from "../ChecklistContext";
import { getProjectDimensions } from "../../logic/processors/project";
import { useProject } from "../ProjectContext";

type Props = {
  close: () => void
}

const Checklist: Component<Props> = (props) => {
  const { project } = useProject();
  const [dimensions] = createSignal(getProjectDimensions(project));
  const { checklist } = useChecklist();

  return <div class={"Checklist"} onClick={e => e.target === e.currentTarget ? props.close() : null}>
    <div class={"content"}>
      {checklist.map(group => <>
        <h3>{group.title}</h3>
        <ol>
          {group.items.map(item => {
            if (item.text.startsWith("Saw the board")) {
              const width = Math.ceil(dimensions().width) + 2;
              const height = Math.ceil(dimensions().height) + 2;

              item.text = item.text.replaceAll(/Saw the board.*?\./g, `Saw the board to ${width} x ${height} mm.`)
            }
            return <Item item={item} />
          })}
        </ol>
      </>)}

      <button onClick={props.close}>Close</button>
    </div>
  </div>;
}

export default Checklist;