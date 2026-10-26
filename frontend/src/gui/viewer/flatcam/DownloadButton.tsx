import { Component, createSignal, JSX } from "solid-js";
import { AiOutlineLoading } from "solid-icons/ai";
import { runAsync } from "../../../logic/utils/utils";
import { TbFileDownload } from "solid-icons/tb";

type Props = {
  content: () => string,
  fileName: string,
  text?: string,
  title?: string,
  badge?: string,
  badgeColor?: string,
  disabled?: boolean,
  children?: JSX.Element
}

const DownloadButton: Component<Props> = (props) => {
  const [isLoading, setIsLoading] = createSignal(false);

  const onClick = (e: MouseEvent) => {
    if (props.disabled) return;
    setIsLoading(true);

    const downloadTextareaId = "download-textarea";
    document.getElementById(downloadTextareaId)?.remove();

    runAsync(() => {
      const generatedContent = props.content();
      setTimeout(() => setIsLoading(false), 100);

      if (generatedContent.length === 0) {
        alert("No GCode generated");
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        const it = document.createElement("textarea");
        it.id = downloadTextareaId;
        it.value = generatedContent;

        setTimeout(() => document.body.appendChild(it), 50);
        return;
      }

      const blob = new Blob([generatedContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const downloadElement = document.createElement("a");
      downloadElement.href = url;
      downloadElement.download = props.fileName;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      downloadElement.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  };

  return <button class={`DownloadButton ${props.disabled ? "disabled" : ""}`}
                 onClick={onClick}
                 disabled={props.disabled}
                 title={props.disabled ? "No traces or features loaded for this file" : (props.title ?? "Click to download, or Ctrl+Click to preview in textarea")}>
    <div class={"btn-icon"}>
      {isLoading() ? <AiOutlineLoading class={"spinner"} size={20} /> : <TbFileDownload size={22} />}
    </div>

    <div class={"content"}>
      <div class={"header-row"}>
        <span class={"text"}>{props.text}</span>
        {props.badge ? (
          <span class={"side-badge"}
                style={props.badgeColor ? { "background-color": props.badgeColor, color: "#fff" } : {}}>
            {props.badge}
          </span>
        ) : null}
      </div>
      <span class={"filename-label"}>{props.fileName}</span>
      {props.children ? (
        <div class={"meta-info"}>
          {props.children}
        </div>
      ) : null}
    </div>
  </button>;
};

export default DownloadButton;
