import { Component, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import './style.less';
import Row from "./Row";
import { Upload } from "../../logic/upload";
import { ScreenProps } from "../../logic/screens";
import { useProject } from "../ProjectContext";
import { getCookie } from "../../logic/cookies";
import { AiOutlineCloudUpload } from "solid-icons/ai";

type Props = ScreenProps

const ImportRoot: Component<Props> = (props) => {
  const { project, touchProject, projectVersion } = useProject();
  const [uploads, setUploads] = createSignal<Upload.Type[]>([]);
  const [isDraggingOver, setIsDraggingOver] = createSignal(false);
  let isProcessing = false;

  createEffect(() => {
    if (!project.path) {
      project.path = getCookie("project.camDirectory") ?? undefined;
    }
  });

  const handleFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    setUploads(prev => [...prev, ...files.map(it => ({
      file: it,
      status: "waiting",
    } as Upload.Type))]);
    processUploads();
  };

  const onFilesChange = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    handleFiles(files);
    input.value = "";
  };

  const processUploads = async () => {
    if (isProcessing) return;
    isProcessing = true;
    try {
      while (true) {
        const nextUpload = uploads().find(it => it.status === "waiting");
        if (!nextUpload) break;

        nextUpload.status = "reading";
        setUploads(prev => [...prev]);

        try {
          nextUpload.content = (await nextUpload.file.text()).replace(/\r/g, "");

          try {
            Upload.processFile(project, nextUpload.file.name, nextUpload.content);
          } catch (error) {
            alert(`Error during processing of file '${nextUpload.file.name}':\n\n${error}`);
          }
        } catch (error) {
          alert(`Error during reading of file '${nextUpload.file.name}':\n\n${error}`);
        }

        nextUpload.status = "done";
        setUploads(prev => [...prev]);
        touchProject();
      }
    } finally {
      isProcessing = false;
    }
  };

  onMount(() => {
    let dragCounter = 0;

    const onDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types?.includes("Files")) {
        dragCounter++;
        setIsDraggingOver(true);
      }
    };

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy";
      }
    };

    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        dragCounter = 0;
        setIsDraggingOver(false);
      }
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDraggingOver(false);

      const files = Array.from(e.dataTransfer?.files ?? []);
      if (files.length > 0) {
        handleFiles(files);
      }
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);

    onCleanup(() => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    });
  });

  const isAvailable = () => {
    projectVersion();
    return Upload.isProjectAvailable(project) || uploads().length > 0;
  };

  return <div class={"Import"}>
    {isDraggingOver() && (
      <div class={"global-dropzone-overlay"}>
        <div class={"dropzone-content"}>
          <AiOutlineCloudUpload class={"dropzone-icon"} />
          <h2>Drop files anywhere to upload</h2>
          <p>Drop EAGLE (.brd) or FlatCAM (.gcode, .xln) files here</p>
        </div>
      </div>
    )}

    <h1>Import EAGLE files</h1>

    <input type={"file"}
           name={"files"}
           onChange={onFilesChange}
           multiple={true} />

    <div class={"result"}>
      <div>
        {Object.keys(Upload.fileMatchers).map(key => {
            const upload: Upload.Type | undefined = uploads().find(it => it.file.name.match(Upload.fileMatchers[key]))
            return <Row type={key} upload={upload} />
          }
        )}
      </div>
    </div>
    <br />

    <div class={"actions"}>
      <button onClick={props.onBack}>
        Back
      </button>
      <button disabled={!isAvailable()}
              onClick={props.onNext}>
        Next
      </button>
    </div>
  </div>;
}

export default ImportRoot;
