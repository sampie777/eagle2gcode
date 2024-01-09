import {Component} from "solid-js";

type Props = {
    error: any;
    reset?: () => void;
}

const ErrorBoundaryFallback: Component<Props> = (props) => {
    console.error("ErrorBoundary has caught an error", {
        error: props.error
    });

    return <div class={"container"}>
        <h2><i>*@&#!</i></h2>
        <p>
            Something broke.<br/>
            Our apologies.
        </p>

        {!props.error ? null : <p><code>{props.error}</code></p>}

        {!props.reset ? null :
            <p>
                <button class={"btn"} onClick={props.reset}>
                    Try again
                </button>
            </p>
        }
    </div>;
}

export default ErrorBoundaryFallback;