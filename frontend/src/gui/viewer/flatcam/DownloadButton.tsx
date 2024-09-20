import { Component, createSignal } from "solid-js";
import { AiOutlineLoading } from "solid-icons/ai";
import { runAsync } from "../../../logic/utils/utils";

type Props = {
  content: () => string,
  fileName: string,
  text: string,
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
            onClick={onClick}
            download={content().length == 0 ? undefined : props.fileName}>
    {isLoading() ? <AiOutlineLoading class={"spinner"} /> : null} {props.text}
  </a>;
}

export default DownloadButton;