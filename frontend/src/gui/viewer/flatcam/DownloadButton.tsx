import {Component, createSignal} from "solid-js";

type Props = {
    content: () => string,
    fileName: string,
    text: string,
}

const DownloadButton: Component<Props> = (props) => {
    const [content, setContent] = createSignal("#");

    const onClick = (e) => {
        const generatedContent = props.content();
        if (generatedContent.length == 0) {
            e.preventDefault();
            setContent("#");
        } else {
            setContent(`data:text/plain;charset=utf-8,${encodeURIComponent(generatedContent)}`)
        }
    }

    return <a href={content()}
              onClick={onClick}
              download={content().length == 0 ? undefined : props.fileName}>
        {props.text}
    </a>;
}

export default DownloadButton;