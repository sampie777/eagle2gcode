import {Component, createSignal} from "solid-js";

type Props = {
    content: () => string,
    fileName: string,
    text: string,
}

const DownloadButton: Component<Props> = (props) => {
    const [content, setContent] = createSignal("");

    const onClick = () => {
        setContent(`data:text/plain;charset=utf-8,${encodeURIComponent(props.content())}`)
    }

    return <a href={content()}
              onClick={onClick}
              download={props.fileName}>
        {props.text}
    </a>;
}

export default DownloadButton;