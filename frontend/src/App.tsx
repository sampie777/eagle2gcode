import { createSignal, ErrorBoundary, Show } from "solid-js"
import "./App.css"
import ErrorBoundaryFallback from "./gui/components/ErrorBoundaryFallback";
import ViewerRoot from "./gui/viewer/ViewerRoot";
import { useProject } from "./gui/ProjectContext";
import FlatcamRoot from "./gui/flatcamgenerator/FlatcamRoot";
import ImportRoot from "./gui/import/ImportRoot";
import "./gui/default.less";
import { ConfigProvider } from "./gui/ConfigContext";
import Header from "./gui/components/Header";

function App() {
  const { loadProject } = useProject();
  loadProject();

  const [showManualFlatcam, setShowManualFlatcam] = createSignal(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleManualFlatcam = () => {
    const nextState = !showManualFlatcam();
    setShowManualFlatcam(nextState);
    if (nextState) {
      setTimeout(() => scrollToSection("step-flatcam"), 60);
    }
  };

  return <div id={"main"}>
    <ErrorBoundary fallback={(err, reset) => <ErrorBoundaryFallback error={err} reset={reset} />}>
      <ConfigProvider>
        <Header onResetProject={() => scrollToSection("step-import")}
                onNavigateToStep={(id) => scrollToSection(id)}
                showManualFlatcam={showManualFlatcam()}
                onToggleManualFlatcam={toggleManualFlatcam} />

        <div class={"workflow-container"}>
          <Show when={showManualFlatcam()}>
            <section id={"step-flatcam"} class={"workflow-step manual-flatcam-step"}>
              <div class={"step-header"}>
                <span class={"step-badge manual-badge"}>Optional</span>
                <span class={"step-subtitle"}>Manual G-code File Generation (FlatCAM)</span>
                <button
                  type="button"
                  class={"close-manual-step-btn"}
                  onClick={() => setShowManualFlatcam(false)}
                  title={"Close manual FlatCAM generation"}
                >
                  ✕ Close Manual Step
                </button>
              </div>
              <FlatcamRoot onNext={() => scrollToSection("step-import")}
                           onExampleLoaded={() => scrollToSection("step-viewer")} />
            </section>

            <div class={"step-divider"} />
          </Show>

          <section id={"step-import"} class={"workflow-step"}>
            <div class={"step-header"}>
              <span class={"step-badge"}>Step 1</span>
              <span class={"step-subtitle"}>Import Gerber & CAD Files</span>
            </div>
            <ImportRoot
              showManualFlatcam={showManualFlatcam()}
              onToggleManualFlatcam={toggleManualFlatcam}
              onBack={showManualFlatcam() ? () => scrollToSection("step-flatcam") : undefined}
              onNext={() => scrollToSection("step-viewer")} />
          </section>

          <div class={"step-divider"} />

          <section id={"step-viewer"} class={"workflow-step viewer-step"}>
            <div class={"step-header"}>
              <span class={"step-badge"}>Step 2</span>
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
