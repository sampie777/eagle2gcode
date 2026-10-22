import { Component } from "solid-js";
import { AiFillCheckCircle, AiOutlineCheckCircle } from "solid-icons/ai";
import { capitalize } from "../../logic/utils/utils";
import { Upload } from "../../logic/upload";
import LoadingIcon from "../components/LoadingIcon";
import { useProject } from "../ProjectContext";

type Props = {
  type: string
  upload: Upload.Type | undefined
  uploads?: Upload.Type[]
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
        return `${project.drills.length} holes (${props.uploads.length} file${props.uploads.length > 1 ? "s" : ""})`;
      }
      return `${props.uploads.length} file${props.uploads.length > 1 ? "s" : ""}`;
    }
    if (upload == null) return null;
    return upload.status === "done" ? null : `${upload.status}...`;
  };

  const isCompleted = () => isRowDone() || (upload && upload.status === "done");

  return <div class={`Row ${isCompleted() ? "completed" : "missing"}`}
              title={getTooltip()}>
        <span class={"mark"}>
            {getStatusMark()}
        </span>

    <span class={"type"}>{capitalize(props.type.replace(/_/gi, " "))}</span>

    {getInfoText() ? (
      <span class={"info"}>
        {getInfoText()}
      </span>
    ) : null}
  </div>;
}

export default Row;
