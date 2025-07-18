import { useState } from "react";
import URLForm from "./components/URLForm";
import URLList from "./components/URLList";
import Analytics from "./components/Analytics";
import { LoggerProvider } from "./context/LoggerContext";

function App() {
  const [urls, setUrls] = useState([]);

  const handleShortened = (urlData) => {
    setUrls(prev => [...prev, urlData]);
  };

  return (
    <LoggerProvider>
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
        <h1>🔗 React URL Shortener</h1>
        <URLForm onShortened={handleShortened} />
        <URLList urls={urls} />
        <Analytics />
      </div>
    </LoggerProvider>
  );
}

export default App;
