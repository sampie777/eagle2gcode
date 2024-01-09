import {Component, createSignal} from "solid-js";
import './style.less';
import Row from "./Row.tsx";
import {Upload} from "../../logic/upload.ts";

type Props = {
    onSuccess: () => void
}

const ImportRoot: Component<Props> = (props) => {
    const [uploads, setUploads] = createSignal<Upload.Type[]>([]);

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

            upload.content = await upload.file.text();
            console.log("result", upload.file.name, Upload.processFile(upload.file.name, upload.content))

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
                        const upload: Upload.Type | null = uploads().find(it => it.file.name.match(Upload.fileMatchers[key]))
                        return <Row type={key} upload={upload}/>
                    }
                )}
            </div>
        </div>
        <br/>

        <button disabled={!Upload.allFilesUploaded(uploads())}
                onClick={props.onSuccess}>
            Next
        </button>
    </div>;
}

export default ImportRoot;