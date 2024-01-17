import {Component} from "solid-js";
import {emptyProject, useProject} from "../ProjectContext.ts";
import {useConfig} from "../ConfigContext.ts";
import {Persistency} from "../../logic/utils/persistency.ts";
import './Header.less';
import {AiOutlineReload, AiOutlineSave} from "solid-icons/ai";

type Props = {
    onResetProject: () => void
}

const Header: Component<Props> = (props) => {
    const {project, loadProject} = useProject();
    const {config} = useConfig();

    const resetProject = () => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        loadProject(emptyProject())

        if (import.meta.env["PROD"]) {
            Persistency.saveAll(project, config)
        } else {
            console.log("Not saving to localstorage in development")
        }

        props.onResetProject();
    };

    const saveProject = () => {
        Persistency.saveAll(project, config)
    }

    return <div class={"Header"}>
        <button onClick={resetProject}
                title={"Create a new project, but keep config"}>
            <AiOutlineReload/> New project
        </button>
        <button onClick={saveProject}
                title={"Save project and config"}>
            <AiOutlineSave/> Save
        </button>
    </div>;
}

export default Header;