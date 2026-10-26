import { Component, createSignal } from "solid-js";
import { emptyProject, useProject } from "../ProjectContext";
import { useConfig } from "../ConfigContext";
import { Persistency } from "../../logic/utils/persistency";
import './Header.less';
import { AiOutlineFolderOpen, AiOutlineLoading, AiOutlineReload, AiOutlineSave } from "solid-icons/ai";
import { useChecklist } from "../ChecklistContext";
// @ts-ignore
import { version } from "../../../package.json";
import Checklist from "../checklist/Checklist";
import SavedProjectsModal from "./SavedProjectsModal";

type Props = {
  onResetProject: () => void
  onNavigateToStep?: (id: string) => void
}

const Header: Component<Props> = (props) => {
  const { project, loadProject } = useProject();
  const { config } = useConfig();
  const { checklist, activeCad, resetChecklist } = useChecklist();
  const [isSaving, setIsSaving] = createSignal(false);
  const [saveSuccess, setSaveSuccess] = createSignal(false);
  const [showChecklist, setShowChecklist] = createSignal(false);
  const [showProjects, setShowProjects] = createSignal(false);
  const [savedCount, setSavedCount] = createSignal(Persistency.getSavedProjects().length);

  const updateSavedCount = () => {
    setSavedCount(Persistency.getSavedProjects().length);
  };

  const resetProject = () => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    loadProject(emptyProject());
    resetChecklist();
    props.onResetProject();
  };

  const saveProject = () => {
    setIsSaving(true);
    let path = project.path?.trim();
    if (!path) {
      const entered = prompt("Enter a project path or name to save this project:", "Untitled Project");
      if (!entered || !entered.trim()) {
        setIsSaving(false);
        return;
      }
      path = entered.trim();
      project.path = path;
    }

    Persistency.saveProject(project, config, checklist(), activeCad());
    updateSavedCount();
    setSaveSuccess(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(false);
    }, 800);
  };

  return <div class={"Header"}>
    {!showChecklist() ? null : <Checklist close={() => setShowChecklist(false)} />}
    {!showProjects() ? null : (
      <SavedProjectsModal
        close={() => {
          setShowProjects(false);
          updateSavedCount();
        }}
        onProjectLoaded={updateSavedCount}
      />
    )}

    <div class={"header-actions"}>
      <button onClick={resetProject}
              title={"Create a new project, but keep config"}>
        <AiOutlineReload /> New project
      </button>
      <button onClick={saveProject}
              disabled={isSaving()}
              title={"Save current project, config, and checklist"}>
        {isSaving() ? <AiOutlineLoading class={"spinner"} /> : <AiOutlineSave />} {saveSuccess() ? "Saved!" : isSaving() ? "Saving..." : "Save"}
      </button>
      <button onClick={() => setShowProjects(true)}
              title={"View and load saved projects"}>
        <AiOutlineFolderOpen /> Projects ({savedCount()})
      </button>
      <button onClick={() => setShowChecklist(true)}>Checklist</button>
    </div>

    {props.onNavigateToStep && (
      <div class={"header-steps"}>
        <button class={"step-nav-btn"} onClick={() => props.onNavigateToStep?.("step-flatcam")}>
          1. Prepare
        </button>
        <button class={"step-nav-btn"} onClick={() => props.onNavigateToStep?.("step-import")}>
          2. Upload
        </button>
        <button class={"step-nav-btn"} onClick={() => props.onNavigateToStep?.("step-viewer")}>
          3. Execute
        </button>
      </div>
    )}

    <span class={"version"}>v{version} {import.meta.env["DEV"] ? "(development)" : null}</span>
  </div>;
};

export default Header;
