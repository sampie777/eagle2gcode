import { Component, createSignal, JSX } from "solid-js";
import { AiOutlineDownload, AiOutlineLoading } from "solid-icons/ai";
import { runAsync } from "../../../logic/utils/utils";
import { TbFileDownload } from "solid-icons/tb";

type Props = {
  content: () => string,
  fileName: string,
  text?: string,
  children?: JSX.Element
}

const DownloadButton: Component<Props> = (props) => {
  const [content, setContent] = createSignal("#");
  const [isLoading, setIsLoading] = createSignal(false);

  const onClick = (e: MouseEvent) => {
    setIsLoading(true);
    runAsync(() => {
      const generatedContent = props.content();
      setTimeout(() => setIsLoading(false), 100);

      if (generatedContent.length == 0) {
        e.preventDefault();
        setContent("#");
      } else {
        setContent(`data:text/plain;charset=utf-8,${encodeURIComponent(generatedContent)}`)
      }
    })
  }

  return <a href={content()}
            class={"DownloadButton"}
            onClick={onClick}
            download={content().length == 0 ? undefined : props.fileName}>
    <TbFileDownload />
    <div class={"content"}>
      <span class={"text"}>{isLoading() ? <AiOutlineLoading class={"spinner"} /> : null} {props.text}</span>
      {props.children}
    </div>
  </a>;
}

export default DownloadButton;