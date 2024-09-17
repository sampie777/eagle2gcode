import {Component} from "solid-js";
import {AiFillCheckCircle, AiOutlineCheckCircle} from "solid-icons/ai";
import {capitalize} from "../../logic/utils/utils";
import {Upload} from "../../logic/upload";
import LoadingIcon from "../components/LoadingIcon";
import {useProject} from "../ProjectContext";

type Props = {
    type: string
    upload: Upload.Type | undefined
}

const Row: Component<Props> = (props) => {
    const {project} = useProject();
    const upload = props.upload;

    const getStatusMark = () => {
        if (upload && (upload.status == "waiting" || upload.status == "reading")) return <LoadingIcon/>;

        if (project[props.type] && project[props.type].length > 0) return <AiFillCheckCircle/>;
        if (props.type == "drill" && project.drills.length > 0) return <AiFillCheckCircle/>;
        if (props.type == "board" && Upload.isBoardAvailable(project.board)) return <AiFillCheckCircle/>;

        if (!upload) return <AiOutlineCheckCircle/>;
        if (upload.status == "done") return <AiFillCheckCircle/>
        return <LoadingIcon/>
    }

    return <div class={`Row ${upload ? "completed" : "missing"}`}
                title={upload ? upload.file.name : ""}>
        <span class={"mark"}>
            {getStatusMark()}
        </span>

        <span class={"type"}>{capitalize(props.type.replace(/_/gi, " "))}</span>

        {upload == null ? null :
            <span class={"info"}>
                {upload.status == "done" ? null : `${upload.status}...`}
            </span>
        }
    </div>;
}

export default Row;