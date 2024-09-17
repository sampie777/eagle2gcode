import { createSignal, ErrorBoundary } from 'solid-js'
import './App.css'
import ErrorBoundaryFallback from "./gui/components/ErrorBoundaryFallback";
import ViewerRoot from "./gui/viewer/ViewerRoot";
import { useProject } from "./gui/ProjectContext";
import FlatcamRoot from "./gui/flatcamgenerator/FlatcamRoot";
import ImportRoot from "./gui/import/ImportRoot";
import { Screens } from "./logic/screens";
import './gui/default.less';
import { ConfigProvider } from "./gui/ConfigContext";
import Header from "./gui/components/Header";

function App() {
  const { project, loadProject } = useProject()
  loadProject();

  const [screen, setScreen] = createSignal(project.isLoaded ? Screens.Viewer : Screens.FlatcamCommandGeneration);

  const getScreenForState = () => {
    switch (screen()) {
      case Screens.FlatcamCommandGeneration:
        return <FlatcamRoot onNext={() => setScreen(Screens.ProjectFilesImport)} />
      case Screens.ProjectFilesImport:
        return <ImportRoot onBack={() => setScreen(Screens.FlatcamCommandGeneration)}
                           onNext={() => setScreen(Screens.Viewer)} />
      case Screens.Viewer:
        return <ViewerRoot onBack={() => setScreen(Screens.ProjectFilesImport)} />
    }
    console.error("No screen found with value", screen())
  }

  return <div id={"main"}>
    <ErrorBoundary fallback={(err, reset) => <ErrorBoundaryFallback error={err} reset={reset} />}>
      <ConfigProvider>
        <Header onResetProject={() => setScreen(Screens.FlatcamCommandGeneration)} />
        {getScreenForState()}
      </ConfigProvider>
    </ErrorBoundary>
  </div>
}

export default App
