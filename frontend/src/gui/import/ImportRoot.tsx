import { Component, createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import './style.less';
import Row from "./Row";
import { Upload } from "../../logic/upload";
import { ScreenProps } from "../../logic/screens";
import { useProject } from "../ProjectContext";
import { useChecklist } from "../ChecklistContext";
import { getCookie } from "../../logic/cookies";
import { AiOutlineCloudUpload } from "solid-icons/ai";
import LoadingIcon from "../components/LoadingIcon";

type Props = ScreenProps;

const ImportRoot: Component<Props> = (props) => {
  const { project, touchProject, projectVersion } = useProject();
  const { activeCad } = useChecklist();
  const [uploads, setUploads] = createSignal<Upload.Type[]>([]);
  const [isDraggingOver, setIsDraggingOver] = createSignal(false);
  const [isGeneratingGcode, setIsGeneratingGcode] = createSignal(false);
  const [backendAvailable, setBackendAvailable] = createSignal(false);
  const [statusMessage, setStatusMessage] = createSignal<string>("");
  let isProcessing = false;

  // Check backend FlatCAM API availability
  onMount(async () => {
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        setBackendAvailable(true);
      }
    } catch {
      setBackendAvailable(false);
    }
  });

  createEffect(() => {
    if (!project.path) {
      const storedPath = localStorage.getItem("project.lastPath")
        || localStorage.getItem("project.eagle.path")
        || localStorage.getItem("project.altium.path")
        || getCookie("project.camDirectory");
      project.path = storedPath || undefined;
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

  // Detect whether uploaded files contain Gerber (.gbr) files that can be processed with FlatCAM
  const uploadedGerberFiles = () => {
    return uploads().filter(u => u.file.name.match(/\.(gbr|ger|pho)$/i) && u.content);
  };

  const generateGcodeWithFlatcam = async () => {
    const gerbers = uploadedGerberFiles();
    if (gerbers.length === 0) {
      alert("Please upload at least one Gerber file (.gbr) to run FlatCAM.");
      return;
    }

    setIsGeneratingGcode(true);
    setStatusMessage("Running FlatCAM in container to generate G-code...");

    try {
      const cad = activeCad();
      const pcbName = localStorage.getItem("project.altium.pcbName") || "PCB1";
      const diaWidth = 0.20188;

      const payload = {
        cadType: cad,
        pcbName,
        diaWidth,
        files: gerbers.map(g => ({
          filename: g.file.name,
          content: g.content!,
        })),
      };

      const response = await fetch("/api/flatcam/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.logs || "FlatCAM failed to generate G-code.");
      }

      // Ingest the generated G-code files directly into project
      const generatedOutputs: { name: string; content: string }[] = data.outputs || [];
      for (const out of generatedOutputs) {
        Upload.processFile(project, out.name, out.content);

        // Also add or update the file in uploads list so the user sees it marked completed
        const fakeFile = new File([out.content], out.name, { type: "text/plain" });
        setUploads(prev => [
          ...prev.filter(u => u.file.name !== out.name),
          { file: fakeFile, content: out.content, status: "done" },
        ]);
      }

      touchProject();
      setStatusMessage(`Successfully generated ${generatedOutputs.length} G-code file(s) with FlatCAM!`);
      setTimeout(() => setStatusMessage(""), 5000);
    } catch (err: any) {
      alert(`FlatCAM Generation Error:\n\n${err.message || String(err)}`);
      setStatusMessage("");
    } finally {
      setIsGeneratingGcode(false);
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
          <p>Drop {activeCad() === "altium" ? "Altium (.gbr, .PcbDoc)" : "EAGLE (.brd)"} or FlatCAM (.gcode, .xln) files here</p>
        </div>
      </div>
    )}

    <h1>Import {activeCad() === "altium" ? "Altium" : "EAGLE"} & FlatCAM files</h1>

    <input type={"file"}
           name={"files"}
           onChange={onFilesChange}
           multiple={true} />

    <Show when={backendAvailable() && uploadedGerberFiles().length > 0}>
      <div class={"flatcam-generate-box"}>
        <button
          type={"button"}
          class={"flatcam-run-btn"}
          disabled={isGeneratingGcode()}
          onClick={generateGcodeWithFlatcam}
        >
          {isGeneratingGcode() ? (
            <>
              <LoadingIcon /> Generating G-code with FlatCAM...
            </>
          ) : (
            `Generate G-code from ${uploadedGerberFiles().length} Gerber file(s)`
          )}
        </button>
        <Show when={statusMessage()}>
          <span class={"status-message"}>{statusMessage()}</span>
        </Show>
      </div>
    </Show>

    <div class={"result"}>
      <div>
        {Object.keys(Upload.fileMatchers).map(key => {
            const matcher = (Upload.fileMatchers as any)[key];
            const matchingUploads = uploads().filter(it => it.file.name.match(matcher));
            const singleUpload = matchingUploads[0];
            return <Row type={key} upload={singleUpload} uploads={matchingUploads} />;
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
};

export default ImportRoot;
