import { Component, createSignal } from "solid-js";
import { emptyProject, useProject } from "../ProjectContext";
import { useConfig } from "../ConfigContext";
import { Persistency } from "../../logic/utils/persistency";
import './Header.less';
import { AiOutlineLoading, AiOutlineReload, AiOutlineSave } from "solid-icons/ai";
import { useChecklist } from "../ChecklistContext";
// @ts-ignore
import { version } from "../../../package.json";

type Props = {
  onResetProject: () => void
}

const Header: Component<Props> = (props) => {
  const { project, loadProject } = useProject();
  const { config } = useConfig();
  const { resetChecklist } = useChecklist()
  const [isSaving, setIsSaving] = createSignal(false);

  const resetProject = () => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    loadProject(emptyProject())

    if (import.meta.env["PROD"]) {
      Persistency.saveAll(project, config)
    } else {
      console.log("Not saving to localstorage in development")
    }

    resetChecklist();

    props.onResetProject();
  };

  const saveProject = () => {
    setIsSaving(true);
    Persistency.saveAll(project, config)
    setTimeout(() => setIsSaving(false), 200);
  }

  return <div class={"Header"}>
    <button onClick={resetProject}
            title={"Create a new project, but keep config"}>
      <AiOutlineReload /> New project
    </button>
    <button onClick={saveProject}
            disabled={isSaving()}
            title={"Save project and config"}>
      {isSaving() ? <AiOutlineLoading class={"spinner"} /> : <AiOutlineSave />} {isSaving() ? "Saving..." : "Save"}
    </button>

    <span class={"version"}>v{version} {import.meta.env["DEV"] ? "(development)" : null}</span>
  </div>;
}

export default Header;