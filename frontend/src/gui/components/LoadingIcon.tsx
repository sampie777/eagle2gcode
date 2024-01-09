import {Component} from "solid-js";
import './LoadingIcon.less';
import {AiOutlineLoading} from "solid-icons/ai";

type Props = {
    autoCenter?: boolean
}

const LoadingIcon: Component<Props> = (props) => {
    const spinner = <AiOutlineLoading class={"spinner"}/>;
    if (props.autoCenter === false) return spinner;
    return <div style={"text-align: center"}>{spinner}</div>;
}

export default LoadingIcon;