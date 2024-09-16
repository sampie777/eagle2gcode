import {Component, createEffect, createSignal} from "solid-js";
import './style.less';
import Row from "./Row.tsx";
import {Upload} from "../../logic/upload.ts";
import {ScreenProps} from "../../logic/screens.ts";
import {useProject} from "../ProjectContext.ts";
import {getCookie} from "../../logic/cookies.ts";

type Props = ScreenProps

const ImportRoot: Component<Props> = (props) => {
    const {project} = useProject();
    const [uploads, setUploads] = createSignal<Upload.Type[]>([]);

    createEffect(() => {
        if (!project.path) {
            project.path = getCookie("project.camDirectory") ?? undefined;
        }
    })

    const onFilesChange = async (e: Event) => {
        const files = Array.from((e.target as HTMLInputElement).files);
        setUploads(prev => [...prev, ...files.map(it => ({
            file: it,
            status: "waiting",
        } as Upload.Type))
        ]);

        processUploads();
    }

    const processUploads = async () => {
        for (const upload of uploads()) {
            if (upload.status == "done") continue;
            upload.status = "reading";
            setUploads(prev => [...prev])

            try {
                upload.content = (await upload.file.text()).replace(/\r/g, "")

                try {
                    const result = Upload.processFile(project, upload.file.name, upload.content);
                    console.log("result", upload.file.name, result)
                } catch (error) {
                    alert(`Error during processing of file '${upload.file.name}':\n\n${error}`)
                }
            } catch (error) {
                alert(`Error during reading of file '${upload.file.name}':\n\n${error}`)
            }

            upload.status = "done"
            setUploads(prev => [...prev])
        }
    };

    return <div class={"Import"}>
        <h1>Import EAGLE files</h1>

        <input type={"file"}
               name={"files"}
               onChange={onFilesChange}
               multiple={true}/>

        <div class={"result"}>
            <div>
                {Object.keys(Upload.fileMatchers).map(key => {
                        const upload: Upload.Type | undefined = uploads().find(it => it.file.name.match(Upload.fileMatchers[key]))
                        return <Row type={key} upload={upload}/>
                    }
                )}
            </div>
        </div>
        <br/>

        <div class={"actions"}>
            <button onClick={props.onBack}>
                Back
            </button>
            <button disabled={!(Upload.isProjectAvailable(project) || uploads().length > 0 /* to trigger the project */)}
                    onClick={props.onNext}>
                Next
            </button>
        </div>
    </div>;
}

export default ImportRoot;