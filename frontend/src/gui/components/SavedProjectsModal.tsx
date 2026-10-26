import { Component, createEffect, createSignal, For, onCleanup, onMount } from "solid-js";
import './SavedProjectsModal.less';
import { Persistency } from "../../logic/utils/persistency";
import { useProject } from "../ProjectContext";
import { useConfig } from "../ConfigContext";
import { useChecklist } from "../ChecklistContext";
import { AiOutlineClose, AiOutlineDelete, AiOutlineFolderOpen, AiOutlineSave } from "solid-icons/ai";

type Props = {
  close: () => void;
  onProjectLoaded?: () => void;
}

const SavedProjectsModal: Component<Props> = (props) => {
  const { project, loadProject, touchProject, projectVersion } = useProject();
  const { config, loadConfig } = useConfig();
  const { checklist, activeCad, restoreChecklist } = useChecklist();

  const [savedList, setSavedList] = createSignal<Persistency.SavedProject[]>(Persistency.getSavedProjects());
  const [currentPathInput, setCurrentPathInput] = createSignal(project.path || "");
  const [notification, setNotification] = createSignal<string | null>(null);

  // Sync currentPathInput with project.path reactively
  createEffect(() => {
    projectVersion();
    setCurrentPathInput(project.path || "");
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

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

  const isCurrentActive = (p: Persistency.SavedProject) => {
    projectVersion();
    return !!(project.path && Persistency.normalizePath(project.path) === Persistency.normalizePath(p.path));
  };

  const handleSaveCurrent = () => {
    const path = currentPathInput().trim() || project.path?.trim();
    if (!path) {
      alert("Please specify a project path to save.");
      return;
    }

    project.path = path;
    touchProject();
    Persistency.saveProject(project, config, checklist(), activeCad());
    setSavedList(Persistency.getSavedProjects());
    showNotification(`Saved project '${Persistency.getProjectName(path)}'`);
  };

  const handleLoad = (entry: Persistency.SavedProject) => {
    // 1. Load project structure
    loadProject(entry.project);
    project.path = entry.path;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("project.lastPath", entry.path);
      if (entry.cadType === "altium") {
        localStorage.setItem("project.altium.path", entry.path);
      } else {
        localStorage.setItem("project.eagle.path", entry.path);
      }
    }

    // 2. Load configuration
    loadConfig(entry.config);

    // 3. Restore checklist state and CAD type
    restoreChecklist(entry.checklist, entry.cadType);

    touchProject();
    props.onProjectLoaded?.();
    props.close();
  };

  const handleDelete = (entry: Persistency.SavedProject, e: MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Remove '${entry.name}' from saved projects?`)) {
      const updated = Persistency.deleteProject(entry.path);
      setSavedList(updated);
      showNotification(`Deleted '${entry.name}'`);
    }
  };

  const getChecklistSummary = (entry: Persistency.SavedProject) => {
    if (!entry.checklist) return "Checklist: 0 checked";
    let checkedCount = 0;
    let totalCount = 0;
    for (const group of entry.checklist) {
      for (const item of group.items) {
        totalCount++;
        if (item.checked) checkedCount++;
      }
    }
    return `Checklist: ${checkedCount}/${totalCount} checked`;
  };

  const formatDate = (timestamp: number) => {
    try {
      const d = new Date(timestamp);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "";
    }
  };

  return <div class={"SavedProjectsModal"} onClick={e => e.target === e.currentTarget ? props.close() : null}>
    <div class={"modal-content"}>
      <button class={"modal-close-btn"} onClick={props.close} title={"Close (Esc)"}>
        <AiOutlineClose />
      </button>

      <div class={"modal-header"}>
        <h2>Saved Projects</h2>
        <span class={"modal-subtitle"}>
          Manage up to {Persistency.MAX_PROJECTS} saved projects. Each project is unique by path.
        </span>
      </div>

      {notification() && (
        <div class={"modal-notification"}>
          {notification()}
        </div>
      )}

      <div class={"save-current-section"}>
        <div class={"input-group"}>
          <label>Current Project Path:</label>
          <input
            type="text"
            placeholder="/path/to/project"
            value={currentPathInput()}
            onInput={e => setCurrentPathInput(e.currentTarget.value)}
          />
        </div>
        <button class={"save-btn"} onClick={handleSaveCurrent}>
          <AiOutlineSave /> Save Current
        </button>
      </div>

      <div class={"saved-list-container"}>
        <div class={"list-header"}>
          <span>Saved Projects ({savedList().length}/{Persistency.MAX_PROJECTS})</span>
        </div>

        {savedList().length === 0 ? (
          <div class={"empty-state"}>
            <AiOutlineFolderOpen class={"empty-icon"} />
            <p>No saved projects found yet.</p>
            <span>Click 'Save Current' above to save this project with its settings and checklist.</span>
          </div>
        ) : (
          <div class={"projects-list"}>
            <For each={savedList()}>
              {(entry) => {
                const active = isCurrentActive(entry);
                return <div class={`project-card ${active ? "active" : ""}`}>
                  <div class={"card-main"}>
                    <div class={"card-header-row"}>
                      <span class={"project-name"}>{entry.name}</span>
                      {entry.cadType && (
                        <span class={`cad-badge ${entry.cadType}`}>
                          {entry.cadType === "altium" ? "Altium" : "Eagle"}
                        </span>
                      )}
                      {active && <span class={"active-badge"}>Active</span>}
                    </div>

                    <div class={"project-path"} title={entry.path}>
                      {entry.path}
                    </div>

                    <div class={"project-meta"}>
                      <span class={"meta-time"}>Saved {formatDate(entry.savedAt)}</span>
                      <span class={"meta-divider"}>•</span>
                      <span class={"meta-checklist"}>{getChecklistSummary(entry)}</span>
                    </div>
                  </div>

                  <div class={"card-actions"}>
                    <button
                      class={`load-btn ${active ? "active-btn" : ""}`}
                      onClick={() => handleLoad(entry)}
                      title={active ? "Reload project settings" : "Load this project"}
                    >
                      {active ? "Reload" : "Load"}
                    </button>
                    <button
                      class={"delete-btn"}
                      onClick={(e) => handleDelete(entry, e)}
                      title={"Delete from saved projects"}
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                </div>;
              }}
            </For>
          </div>
        )}
      </div>
    </div>
  </div>;
};

export default SavedProjectsModal;
