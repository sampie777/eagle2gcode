import { Component, For, Show } from "solid-js";
import { AiFillCheckCircle, AiOutlineCheckCircle, AiOutlineClose, AiOutlineDelete } from "solid-icons/ai";
import { capitalize } from "../../logic/utils/utils";
import { Upload } from "../../logic/upload";
import LoadingIcon from "../components/LoadingIcon";
import { useProject } from "../ProjectContext";

type Props = {
  type: string
  upload: Upload.Type | undefined
  uploads?: Upload.Type[]
  onRemove?: () => void
  onRemoveFile?: (fileName: string) => void
}

const Row: Component<Props> = (props) => {
  const { project, projectVersion } = useProject();
  const upload = props.upload;

  const isRowDone = () => {
    projectVersion();
    if (props.type === "drill" && project.drills.length > 0) return true;
    if (props.type === "board" && Upload.isBoardAvailable(project.board)) return true;
    const projectItems = project[props.type as keyof typeof project];
    if (Array.isArray(projectItems) && projectItems.length > 0) return true;
    if (props.uploads && props.uploads.length > 0 && props.uploads.every(u => u.status === "done")) return true;
    return upload?.status === "done";
  };

  const getStatusMark = () => {
    projectVersion();
    if (props.uploads && props.uploads.some(u => u.status === "waiting" || u.status === "reading")) {
      return <LoadingIcon />;
    }
    if (upload && (upload.status === "waiting" || upload.status === "reading")) {
      return <LoadingIcon />;
    }

    if (isRowDone()) return <AiFillCheckCircle />;
    if (!upload && (!props.uploads || props.uploads.length === 0)) return <AiOutlineCheckCircle />;
    return <LoadingIcon />;
  };

  const getTooltip = () => {
    if (props.uploads && props.uploads.length > 0) {
      return props.uploads.map(u => u.file.name).join(", ");
    }
    return upload ? upload.file.name : "";
  };

  const getInfoText = () => {
    if (props.uploads && props.uploads.length > 0) {
      const active = props.uploads.find(u => u.status !== "done");
      if (active) return `${active.status}...`;
      if (props.type === "drill" && project.drills.length > 0) {
        return `${project.drills.length} holes`;
      }
      return null;
    }
    if (props.type === "drill" && project.drills.length > 0) {
      return `${project.drills.length} holes`;
    }
    if (upload == null) return null;
    return upload.status === "done" ? null : `${upload.status}...`;
  };

  const isCompleted = () => isRowDone() || (upload && upload.status === "done");
  const hasUploads = () => props.uploads && props.uploads.length > 0;

  return <div class={`Row ${isCompleted() ? "completed" : "missing"}`}
              title={getTooltip()}>
    <div class={"row-left"}>
      <span class={"mark"}>
        {getStatusMark()}
      </span>

      <span class={"type"}>{capitalize(props.type.replace(/_/gi, " "))}</span>

      {getInfoText() ? (
        <span class={"info"}>
          {getInfoText()}
        </span>
      ) : null}
    </div>

    <div class={"row-right"}>
      <Show when={hasUploads()}>
        <div class={"file-tags"}>
          <For each={props.uploads}>
            {(u) => (
              <span class={"file-tag"} title={u.file.name}>
                <span class={"file-name"}>{u.file.name}</span>
                <button
                  type="button"
                  class={"file-remove-btn"}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onRemoveFile?.(u.file.name);
                  }}
                  title={`Remove ${u.file.name}`}
                >
                  <AiOutlineClose size={11} />
                </button>
              </span>
            )}
          </For>
        </div>
      </Show>

      <Show when={!hasUploads() && isCompleted()}>
        <span class={"loaded-badge"}>Loaded</span>
        <button
          type="button"
          class={"row-remove-btn"}
          onClick={(e) => {
            e.stopPropagation();
            props.onRemove?.();
          }}
          title={`Remove ${capitalize(props.type.replace(/_/gi, " "))}`}
        >
          <AiOutlineClose size={14} />
        </button>
      </Show>

      <Show when={hasUploads() && (props.uploads?.length ?? 0) > 1}>
        <button
          type="button"
          class={"row-remove-btn"}
          onClick={(e) => {
            e.stopPropagation();
            props.onRemove?.();
          }}
          title={`Remove all ${capitalize(props.type.replace(/_/gi, " "))} files`}
        >
          <AiOutlineDelete size={14} />
        </button>
      </Show>
    </div>
  </div>;
};

export default Row;
