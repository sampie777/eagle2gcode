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
  const [content, setContent] = createSignal("#");
  const [isLoading, setIsLoading] = createSignal(false);

  const onClick = (e: MouseEvent) => {
    setIsLoading(true);

    const downloadTextareaId = "download-textarea";
    document.getElementById(downloadTextareaId)?.remove();
    if (e.ctrlKey) e.preventDefault();

    runAsync(() => {
      const generatedContent = props.content();
      setTimeout(() => setIsLoading(false), 100);

      if (generatedContent.length == 0) {
        e.preventDefault();
        setContent("#");
      } else if (e.ctrlKey) {
        e.preventDefault();
        const it = document.createElement("textarea");
        it.id = downloadTextareaId;
        it.value = generatedContent;

        setTimeout(() => document.body.appendChild(it), 50);
      } else {
        setContent(`data:text/plain;charset=utf-8,${encodeURIComponent(generatedContent)}`)
      }
    })
  }

  return <a href={content()}
            class={"DownloadButton"}
            onClick={onClick}
            download={content().length == 0 ? undefined : props.fileName}
            title={props.title ?? "Click to download, or Ctrl+Click to view"}>
    <TbFileDownload />
    <div class={"content"}>
      <span class={"text"}>{isLoading() ? <AiOutlineLoading class={"spinner"} /> : null} {props.text}</span>
      {props.children}
    </div>
  </a>;
}

export default DownloadButton;