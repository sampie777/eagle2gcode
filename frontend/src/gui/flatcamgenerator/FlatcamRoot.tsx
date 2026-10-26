import { Component, createEffect, createSignal, onMount, Show } from "solid-js";
import SettingsContainer from "../components/settings/SettingsContainer";
import SettingNumber from "../components/settings/SettingNumber";
import { CadType, Flatcam } from "../../logic/flatcam";
import SettingString from "../components/settings/SettingString";
import './style.less';
import { ScreenProps } from "../../logic/screens";
import { getCookie, setCookie } from "../../logic/cookies";
import { useProject } from "../ProjectContext";
import { useChecklist } from "../ChecklistContext";
import { exampleProject } from "../../logic/example/project";

type Props = ScreenProps;

const FlatcamRoot: Component<Props> = (props) => {
  const { loadProject, project, touchProject, projectVersion } = useProject();
  const { activeCad, setCad } = useChecklist();

  // Active CAD tab ('eagle' or 'altium')
  const [activeTab, setActiveTab] = createSignal<CadType>(activeCad());

  // Project paths stored per CAD system
  const savedEaglePath = localStorage.getItem("project.eagle.path")
    || localStorage.getItem("project.camDirectory")
    || getCookie("project.camDirectory")
    || "";
  const [eaglePath, setEaglePath] = createSignal<string>(savedEaglePath);

  const savedAltiumPath = localStorage.getItem("project.altium.path") || "";
  const [altiumPath, setAltiumPath] = createSignal<string>(savedAltiumPath);

  // Altium PCB name (file prefix, e.g. PCB1)
  const savedPcbName = localStorage.getItem("project.altium.pcbName") || "PCB1";
  const [pcbName, setPcbName] = createSignal<string>(savedPcbName);

  // Milling trace isolation diameter width
  const [diaWidth, setDiaWidth] = createSignal<number>(0.20188);

  // Generated Flatcam commands
  const [commands, setCommands] = createSignal<string>("");
  const [copied, setCopied] = createSignal(false);
  let textareaRef: HTMLTextAreaElement | undefined;

  onMount(() => {
    if (!project.path) {
      const initialPath = activeTab() === "eagle" ? eaglePath() : altiumPath();
      if (initialPath) {
        project.path = initialPath;
        touchProject();
      }
    }
  });

  createEffect(() => {
    setActiveTab(activeCad());
  });

  // Keep eaglePath/altiumPath synchronized when project.path is loaded or modified externally
  createEffect(() => {
    projectVersion();
    const curPath = project.path ?? "";
    if (activeTab() === "eagle") {
      if (curPath !== eaglePath()) {
        setEaglePath(curPath);
      }
    } else {
      if (curPath !== altiumPath()) {
        setAltiumPath(curPath);
      }
    }
  });

  createEffect(() => {
    const tab = activeTab();
    const width = diaWidth();
    if (tab === "eagle") {
      setCommands(Flatcam.generateEagleCommands(eaglePath(), width));
    } else {
      setCommands(Flatcam.generateAltiumCommands(altiumPath(), width, pcbName()));
    }
  });

  const onTabChange = (tab: CadType) => {
    setActiveTab(tab);
    setCad(tab);
    localStorage.setItem("project.selectedCad", tab);
    const newPath = tab === "eagle" ? eaglePath() : altiumPath();
    project.path = newPath;
    localStorage.setItem("project.lastPath", newPath);
    touchProject();
  };

  const onEaglePathChange = (value: string) => {
    setEaglePath(value);
    localStorage.setItem("project.eagle.path", value);
    localStorage.setItem("project.camDirectory", value);
    setCookie("project.camDirectory", value, 365);
    if (activeTab() === "eagle") {
      project.path = value;
      localStorage.setItem("project.lastPath", value);
      touchProject();
    }
  };

  const onAltiumPathChange = (value: string) => {
    setAltiumPath(value);
    localStorage.setItem("project.altium.path", value);
    if (activeTab() === "altium") {
      project.path = value;
      localStorage.setItem("project.lastPath", value);
      touchProject();
    }
  };

  const onPcbNameChange = (value: string) => {
    setPcbName(value);
    localStorage.setItem("project.altium.pcbName", value);
  };

  const onDiaWidthChange = (value: number) => {
    setDiaWidth(value);
  };

  const copy = async () => {
    const text = commands();

    // Try modern Clipboard API if supported and in secure context
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (e) {
        console.warn("navigator.clipboard.writeText failed, falling back to execCommand", e);
      }
    }

    // Fallback: select the textarea or use a temporary textarea with document.execCommand('copy')
    try {
      if (textareaRef) {
        textareaRef.focus();
        textareaRef.select();
      } else {
        const temp = document.createElement("textarea");
        temp.value = text;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.focus();
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy text:", e);
      if (textareaRef) {
        textareaRef.select();
      }
    }
  };

  const nextScreen = () => {
    const currentPath = activeTab() === "eagle" ? eaglePath() : altiumPath();
    project.path = currentPath;
    localStorage.setItem("project.lastPath", currentPath);
    if (activeTab() === "eagle") {
      setCookie("project.camDirectory", eaglePath(), 365);
    }
    touchProject();
    props.onNext?.();
  };

  const loadExampleProject = () => {
    loadProject(exampleProject);
    const currentPath = activeTab() === "eagle" ? eaglePath() : altiumPath();
    project.path = currentPath;
    if (activeTab() === "eagle") {
      setCookie("project.camDirectory", eaglePath(), 365);
    }
    touchProject();
    if (props.onExampleLoaded) {
      props.onExampleLoaded();
    } else {
      props.onNext?.();
    }
  };

  return <div class={"FlatcamRoot"}>
    <div class={"cad-tabs"} role={"tablist"}>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab() === "eagle"}
        class={`cad-tab ${activeTab() === "eagle" ? "active" : ""}`}
        onClick={() => onTabChange("eagle")}
      >
        Eagle
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab() === "altium"}
        class={`cad-tab ${activeTab() === "altium" ? "active" : ""}`}
        onClick={() => onTabChange("altium")}
      >
        Altium
      </button>
    </div>

    <p>
      In this step you need to enter the project path of your {activeTab() === "eagle" ? "EAGLE" : "Altium"} project.
      The FlatCAM commands will be generated for you below.
    </p>

    <ol style={{ "text-align": "left" }}>
      <li>
        {activeTab() === "eagle" ? (
          <>Open EAGLE, load the board file, and run the CAM processor to export Gerber and Excellon drill files.</>
        ) : (
          <>Open Altium Designer, ensure units are set to <strong>Millimeters (mm)</strong>, and generate Gerber & NC Drill outputs.</>
        )}
      </li>
      <li>Open a new <a href="http://flatcam.org/" target={"_blank"}>FlatCAM</a> project.
      </li>
      <li>Copy the generated commands below and paste them into the Flatcam command line interface.</li>
      <li>Press <code>Enter</code> to execute the commands.</li>
      <li>
        Wait until FlatCAM has finished processing. The output files will be in your project
        folder under <code>{activeTab() === "eagle" ? "CAMOutputs/" : "Project Outputs for <Project>/"}</code> as <code>*.gcode</code> files.
      </li>
    </ol>

    <SettingsContainer name={"Config"} visible={true}>
      <Show when={activeTab() === "eagle"}>
        <SettingString label={"Project path"}
                       value={eaglePath()}
                       placeholder={"e.g. /path/to/eagle/project"}
                       onChange={onEaglePathChange} />
      </Show>

      <Show when={activeTab() === "altium"}>
        <SettingString label={"Project path"}
                       value={altiumPath()}
                       placeholder={"e.g. /path/to/altium/project"}
                       onChange={onAltiumPathChange} />
        <SettingString label={"PCB name"}
                       value={pcbName()}
                       placeholder={"e.g. PCB1"}
                       onChange={onPcbNameChange} />
      </Show>

      <SettingNumber label={"Dia width"}
                     defaultValue={diaWidth()}
                     step={0.0001}
                     onChange={onDiaWidthChange} />
    </SettingsContainer>

    <textarea ref={textareaRef}
              class={"result"}
              title={"Double click to select all"}
              onDblClick={(e) => e.currentTarget.select()}>{commands()}</textarea>

    <div class={"actions"}>
      <button onClick={copy}>{copied() ? "Copied!" : "Copy"}</button>
      <button onClick={nextScreen}>Next</button>
      <button class={"load-example"} onClick={loadExampleProject}>Load Example Project</button>
    </div>
  </div>;
};

export default FlatcamRoot;
