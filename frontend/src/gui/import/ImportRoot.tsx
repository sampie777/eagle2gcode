import { Component, createEffect, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import './style.less';
import Row from "./Row";
import { Upload } from "../../logic/upload";
import { ScreenProps } from "../../logic/screens";
import { useProject } from "../ProjectContext";
import { getCookie } from "../../logic/cookies";
import {
  AiOutlineClose,
  AiOutlineCloudUpload,
  AiOutlineCode,
  AiOutlineDelete,
  AiOutlineInfoCircle
} from "solid-icons/ai";
import LoadingIcon from "../components/LoadingIcon";

type Props = ScreenProps & {
  showManualFlatcam?: boolean;
  onToggleManualFlatcam?: () => void;
};

const ImportRoot: Component<Props> = (props) => {
  const { project, touchProject, projectVersion, clearProject, clearFileType } = useProject();
  const [uploads, setUploads] = createSignal<Upload.Type[]>([]);
  const [isDraggingOver, setIsDraggingOver] = createSignal(false);
  const [isGeneratingGcode, setIsGeneratingGcode] = createSignal(false);
  const [backendAvailable, setBackendAvailable] = createSignal(false);
  const [statusMessage, setStatusMessage] = createSignal<string>("");
  const [errorMessage, setErrorMessage] = createSignal<string>("");
  let isProcessing = false;
  let fileInputRef: HTMLInputElement | undefined;

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
    setErrorMessage("");
    const incomingNames = new Set(files.map(f => f.name));
    setUploads(prev => [
      ...prev.filter(u => !incomingNames.has(u.file.name)),
      ...files.map(it => ({
        file: it,
        status: "waiting",
      } as Upload.Type)),
    ]);
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

  const removeUploadedFile = (fileName: string) => {
    const remaining = uploads().filter(u => u.file.name !== fileName);
    setUploads(remaining);
    Upload.removeFile(project, fileName, remaining);
    touchProject();
  };

  const removeRowCategory = (key: string) => {
    const matcher = (Upload.fileMatchers as any)[key];
    if (matcher) {
      setUploads(prev => prev.filter(u => !u.file.name.match(matcher)));
    }
    clearFileType(key);
  };

  const resetAllUploads = () => {
    if (!confirm("Are you sure you want to remove all uploaded files and reset project data?")) return;
    setUploads([]);
    clearProject();
    if (fileInputRef) {
      fileInputRef.value = "";
    }
    setErrorMessage("");
    setStatusMessage("All uploaded files have been reset.");
    setTimeout(() => setStatusMessage(""), 4000);
  };

  const hasAnyFiles = () => {
    projectVersion();
    return uploads().length > 0 || Upload.isProjectAvailable(project);
  };

  const totalActiveFilesCount = () => {
    projectVersion();
    if (uploads().length > 0) return uploads().length;
    let count = 0;
    if (project.profile?.length > 0) count++;
    if (project.traces_top?.length > 0) count++;
    if (project.traces_bottom?.length > 0) count++;
    if (project.silkscreen_top?.length > 0) count++;
    if (project.silkscreen_bottom?.length > 0) count++;
    if (project.soldermask_top?.length > 0) count++;
    if (project.soldermask_bottom?.length > 0) count++;
    if (project.drills?.length > 0) count++;
    if (Upload.isBoardAvailable(project.board)) count++;
    return count;
  };

  const unassignedUploads = () => {
    projectVersion();
    return uploads().filter(u => {
      return !Object.keys(Upload.fileMatchers).some(key => {
        const matcher = (Upload.fileMatchers as any)[key];
        return u.file.name.match(matcher);
      });
    });
  };

  // Detect whether uploaded files contain Gerber (.gbr) files that can be processed with FlatCAM
  // (exclude drill .gbr files which are already parsed directly by the drill processor)
  const uploadedGerberFiles = () => {
    return uploads().filter(
      u => u.file.name.match(/\.(gbr|ger|pho)$/i) && !u.file.name.match(Upload.fileMatchers.drill) && u.content
    );
  };

  const generateGcodeWithFlatcam = async () => {
    const gerbers = uploadedGerberFiles();
    if (gerbers.length === 0) {
      alert("Please upload at least one Gerber file (.gbr) to run FlatCAM.");
      return;
    }

    setIsGeneratingGcode(true);
    setErrorMessage("");
    setStatusMessage("Running FlatCAM in container to generate G-code...");

    try {
      const diaWidth = 0.20188;

      const payload = {
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
        if (data.logs) {
          console.error("FlatCAM raw logs:\n", data.logs);
        }
        const primaryError = data.error || "FlatCAM failed to generate G-code.";
        const includeLogs =
          data.logs &&
          !primaryError.includes("FlatCAM details:") &&
          !primaryError.includes("FlatCAM output:");
        const fullError = includeLogs ? `${primaryError}\n\nLogs:\n${data.logs}` : primaryError;
        throw new Error(fullError);
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
      const warningSuffix =
        Array.isArray(data.warnings) && data.warnings.length > 0
          ? ` (${data.warnings.join("; ")})`
          : "";
      setStatusMessage(
        `Successfully generated ${generatedOutputs.length} G-code file(s) with FlatCAM!${warningSuffix}`
      );
      if (!warningSuffix) {
        setTimeout(() => setStatusMessage(""), 5000);
      }
    } catch (err: any) {
      const details = err.message || String(err);
      console.error(`FlatCAM Generation Error:\n\n${details}`);
      setErrorMessage(details);
      setStatusMessage("");
      alert(
        `FlatCAM Generation Error:\n\n${details}\n\nYou can also manually generate the necessary files using the 'Manual G-code File Generation' option.`
      );
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
          <p>Drop EAGLE and/or Altium Gerber (.gbr), drill (.xln, *_Drill.gbr), board (.brd, .PcbDoc), or FlatCAM (.gcode) files here</p>
        </div>
      </div>
    )}

    <div class={"direct-upload-info-box"}>
      <div class={"info-box-header"}>
        <span class={"info-box-title"}>
          <AiOutlineInfoCircle size={18} />
          Direct Gerber Upload
        </span>
        {props.onToggleManualFlatcam && (
          <button
            type="button"
            class={`manual-gen-toggle-btn ${props.showManualFlatcam ? "active" : ""}`}
            onClick={props.onToggleManualFlatcam}
            title={"Toggle manual FlatCAM command generation"}
          >
            <AiOutlineCode size={16} />
            <span>{props.showManualFlatcam ? "Hide Manual FlatCAM Generation" : "Manual G-code File Generation"}</span>
          </button>
        )}
      </div>
      <p class={"info-box-description"}>
        You can upload your EAGLE and/or Altium Gerber files (<code>.gbr</code>), drill files (<code>.xln</code> / <code>*_Drill.gbr</code>),
        and board file (<code>.brd</code> / <code>.PcbDoc</code>) directly — even mixed together.
        If automatic processing does not work, you can choose to manually generate the necessary files for upload in
        FlatCAM.
      </p>
    </div>

    <div class={"import-toolbar"}>
      <div class={"toolbar-left"}>
        <Show when={hasAnyFiles()}>
          <span class={"active-count-label"}>
            {totalActiveFilesCount()} active file{totalActiveFilesCount() === 1 ? "" : "s"}
          </span>
        </Show>
      </div>

      <div class={"toolbar-right"}>
        <Show when={hasAnyFiles()}>
          <button
            type="button"
            class={"reset-files-btn"}
            onClick={resetAllUploads}
            title={"Remove all uploaded files and reset project"}
          >
            <AiOutlineDelete size={15} />
            <span>Reset all files</span>
          </button>
        </Show>
      </div>
    </div>

    <input ref={fileInputRef}
           type={"file"}
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

    <Show when={errorMessage()}>
      <div class={"flatcam-error-box"} role="alert">
        <div class={"error-box-header"}>
          <strong>FlatCAM Generation Error</strong>
          <button
            type="button"
            class={"error-dismiss-btn"}
            onClick={() => setErrorMessage("")}
            title={"Dismiss error"}
          >
            <AiOutlineClose size={14} />
          </button>
        </div>
        <pre class={"error-box-details"}>{errorMessage()}</pre>
      </div>
    </Show>

    <Show when={!backendAvailable() && uploadedGerberFiles().length > 0}>
      <div class={"flatcam-unavailable-box"}>
        <span>Automatic FlatCAM processing is unavailable (backend server is not running).</span>
        {props.onToggleManualFlatcam && (
          <button
            type="button"
            class={"manual-flatcam-inline-btn"}
            onClick={props.onToggleManualFlatcam}
          >
            Generate FlatCAM Commands Manually
          </button>
        )}
      </div>
    </Show>

    <div class={"result"}>
      <div class={"result-list"}>
        {Object.keys(Upload.fileMatchers).map(key => {
            const matcher = (Upload.fileMatchers as any)[key];
            const matchingUploads = uploads().filter(it => it.file.name.match(matcher));
            const singleUpload = matchingUploads[0];
            return <Row
              type={key}
              upload={singleUpload}
              uploads={matchingUploads}
              onRemove={() => removeRowCategory(key)}
              onRemoveFile={removeUploadedFile}
            />;
          }
        )}
      </div>
    </div>

    <Show when={unassignedUploads().length > 0}>
      <div class={"unassigned-files-card"}>
        <div class={"unassigned-header"}>
          <span>Other Uploaded Files ({unassignedUploads().length})</span>
        </div>
        <div class={"unassigned-chips"}>
          <For each={unassignedUploads()}>
            {(u) => (
              <span class={"unassigned-chip"} title={u.file.name}>
                <span class={"chip-name"}>{u.file.name}</span>
                <button
                  type="button"
                  class={"chip-remove-btn"}
                  onClick={() => removeUploadedFile(u.file.name)}
                  title={`Remove ${u.file.name}`}
                >
                  <AiOutlineClose size={12} />
                </button>
              </span>
            )}
          </For>
        </div>
      </div>
    </Show>

    <Show when={statusMessage() && (!backendAvailable() || uploadedGerberFiles().length === 0)}>
      <div class={"import-status-banner"}>
        <span>{statusMessage()}</span>
      </div>
    </Show>

    <br />

    <div class={"actions"}>
      <Show when={props.showManualFlatcam && props.onBack}>
        <button onClick={props.onBack}>
          Back to Manual FlatCAM
        </button>
      </Show>
      <button disabled={!isAvailable()}
              onClick={props.onNext}>
        Next
      </button>
    </div>
  </div>;
};

export default ImportRoot;
