import {createSignal, ErrorBoundary} from 'solid-js'
import './App.css'
import ErrorBoundaryFallback from "./gui/components/ErrorBoundaryFallback.tsx";
import ImportRoot from "./gui/import/ImportRoot.tsx";
import ViewerRoot from "./gui/viewer/ViewerRoot.tsx";
import {emptyProject, exampleProject, ProjectContext} from "./gui/ProjectContext.ts";

function App() {
    // const initialProject = emptyProject;
    const initialProject = exampleProject;
    const [screen, setScreen] = createSignal(initialProject.isLoaded ? 1 : 0);

    const onProjectLoaded = () => {
        setScreen(1);
    }

    const getScreenForState = () => {
        switch (screen()) {
            case 1:
                return <ViewerRoot/>
            default:
                return <ImportRoot onSuccess={onProjectLoaded}/>
        }
    }

    return <div id={"main"}>
        <ErrorBoundary fallback={(err, reset) => <ErrorBoundaryFallback error={err} reset={reset}/>}>
            <ProjectContext.Provider value={initialProject}>
                {getScreenForState()}
            </ProjectContext.Provider>
        </ErrorBoundary>
    </div>
}

export default App
