import {createSignal, ErrorBoundary} from 'solid-js'
import './App.css'
import ErrorBoundaryFallback from "./gui/components/ErrorBoundaryFallback.tsx";
import ViewerRoot from "./gui/viewer/ViewerRoot.tsx";
import {emptyProject, exampleProject, ProjectContext} from "./gui/ProjectContext.ts";
import FlatcamRoot from "./gui/flatcamgenerator/FlatcamRoot.tsx";
import ImportRoot from "./gui/import/ImportRoot.tsx";
import {Screens} from "./logic/screens.ts";
import './gui/default.less';

function App() {
    const initialProject = emptyProject;
    // const initialProject = exampleProject;
    const [screen, setScreen] = createSignal(initialProject.isLoaded ? Screens.Viewer : Screens.FlatcamCommandGeneration);

    const getScreenForState = () => {
        switch (screen()) {
            case Screens.FlatcamCommandGeneration:
                return <FlatcamRoot onNext={() => setScreen(Screens.ProjectFilesImport)}/>
            case Screens.ProjectFilesImport:
                return <ImportRoot onBack={() => setScreen(Screens.FlatcamCommandGeneration)}
                                   onNext={() => setScreen(Screens.Viewer)}/>
            case Screens.Viewer:
                return <ViewerRoot onBack={() => setScreen(Screens.ProjectFilesImport)}/>
        }
        console.error("No screen found with value", screen())
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
