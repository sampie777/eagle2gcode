import {createSignal, ErrorBoundary} from 'solid-js'
import './App.css'
import ErrorBoundaryFallback from "./gui/components/ErrorBoundaryFallback.tsx";
import ViewerRoot from "./gui/viewer/ViewerRoot.tsx";
import {useProject} from "./gui/ProjectContext.ts";
import FlatcamRoot from "./gui/flatcamgenerator/FlatcamRoot.tsx";
import ImportRoot from "./gui/import/ImportRoot.tsx";
import {Screens} from "./logic/screens.ts";
import './gui/default.less';
import {useConfig} from "./gui/ConfigContext.ts";
import Header from "./gui/components/Header.tsx";

function App() {
    const {loadConfig} = useConfig()
    const {project, loadProject} = useProject()
    loadConfig();
    loadProject();

    const [screen, setScreen] = createSignal(project.isLoaded ? Screens.Viewer : Screens.FlatcamCommandGeneration);

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
            <Header onResetProject={() => setScreen(Screens.FlatcamCommandGeneration)}/>
            {getScreenForState()}
        </ErrorBoundary>
    </div>
}

export default App
