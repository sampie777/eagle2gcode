import { Component, createSignal, JSX } from "solid-js";
import { AiOutlineLoading } from "solid-icons/ai";
import { runAsync } from "../../../logic/utils/utils";
import { TbFileDownload } from "solid-icons/tb";

type Props = {
  content: () => string,
  fileName: string,
  text?: string,
  title?: string,
  children?: JSX.Element
}

const DownloadButton: Component<Props> = (props) => {
  const [isLoading, setIsLoading] = createSignal(false);

  const onClick = (e: MouseEvent) => {
    setIsLoading(true);

    const downloadTextareaId = "download-textarea";
    document.getElementById(downloadTextareaId)?.remove();

    runAsync(() => {
      const generatedContent = props.content();
      setTimeout(() => setIsLoading(false), 100);

      if (generatedContent.length == 0) {
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
    })
  }

  return <button class={"DownloadButton"}
                 onClick={onClick}
                 title={props.title ?? "Click to download, or Ctrl+Click to view"}>
    <TbFileDownload />
    <div class={"content"}>
      <span class={"text"}>{isLoading() ? <AiOutlineLoading class={"spinner"} /> : null} {props.text}</span>
      {props.children}
    </div>
  </button>;
}

export default DownloadButton;
