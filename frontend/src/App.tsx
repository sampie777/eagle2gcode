import {createSignal, ErrorBoundary} from 'solid-js'
import './App.css'
import ErrorBoundaryFallback from "./gui/components/ErrorBoundaryFallback.tsx";
import ImportRoot from "./gui/import/ImportRoot.tsx";

function App() {
  const [count, setCount] = createSignal(0)

  return <div id={"main"}>
      <ErrorBoundary fallback={(err, reset) => <ErrorBoundaryFallback error={err} reset={reset}/>}>
          <ImportRoot />
      </ErrorBoundary>
  </div>
}

export default App
