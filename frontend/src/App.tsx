import { ErrorBoundary } from 'solid-js'
import './App.css'
import ErrorBoundaryFallback from "./gui/components/ErrorBoundaryFallback";
import ViewerRoot from "./gui/viewer/ViewerRoot";
import { useProject } from "./gui/ProjectContext";
import FlatcamRoot from "./gui/flatcamgenerator/FlatcamRoot";
import ImportRoot from "./gui/import/ImportRoot";
import './gui/default.less';
import { ConfigProvider } from "./gui/ConfigContext";
import Header from "./gui/components/Header";

function App() {
  const { loadProject } = useProject()
  loadProject();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return <div id={"main"}>
    <ErrorBoundary fallback={(err, reset) => <ErrorBoundaryFallback error={err} reset={reset} />}>
      <ConfigProvider>
        <Header onResetProject={() => scrollToSection("step-flatcam")}
                onNavigateToStep={(id) => scrollToSection(id)} />

        <div class={"workflow-container"}>
          <section id={"step-flatcam"} class={"workflow-step"}>
            <div class={"step-header"}>
              <span class={"step-badge"}>Step 1</span>
              <span class={"step-subtitle"}>FlatCAM Command Generation</span>
            </div>
            <FlatcamRoot onNext={() => scrollToSection("step-import")}
                         onExampleLoaded={() => scrollToSection("step-viewer")} />
          </section>

          <div class={"step-divider"} />

          <section id={"step-import"} class={"workflow-step"}>
            <div class={"step-header"}>
              <span class={"step-badge"}>Step 2</span>
              <span class={"step-subtitle"}>Import EAGLE & FlatCAM Files</span>
            </div>
            <ImportRoot onBack={() => scrollToSection("step-flatcam")}
                        onNext={() => scrollToSection("step-viewer")} />
          </section>

          <div class={"step-divider"} />

          <section id={"step-viewer"} class={"workflow-step"}>
            <div class={"step-header"}>
              <span class={"step-badge"}>Step 3</span>
              <span class={"step-subtitle"}>PCB Viewer & G-code Generator</span>
            </div>
            <ViewerRoot onBack={() => scrollToSection("step-import")} />
          </section>
        </div>
      </ConfigProvider>
    </ErrorBoundary>
  </div>
}

export default App
