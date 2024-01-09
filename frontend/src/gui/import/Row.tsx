import {Component} from "solid-js";
import {AiFillCheckCircle, AiOutlineCheckCircle} from "solid-icons/ai";
import {capitalize} from "../../logic/utils/utils.ts";
import {Upload} from "../../logic/upload.ts";

type Props = {
    type: string
    upload: Upload.Type | null
}

const Row: Component<Props> = (props) => {
    const upload = props.upload;

    return <div class={`Row ${upload ? "completed" : "missing"}`}
                title={upload ? upload.file.name : ""}>
        <span class={"mark"}>
            {upload ? <AiFillCheckCircle/> : <AiOutlineCheckCircle/>}
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