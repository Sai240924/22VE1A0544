import { useState } from "react";
import URLForm from "./components/URLForm";
import URLList from "./components/URLList";
import Analytics from "./components/Analytics";
import { LoggerProvider } from "./context/LoggerContext";

function App() {
  const [shortenedUrls, setShortenedUrls] = useState([]);

  const handleNewShortenedUrl = (urlData) => {
    setShortenedUrls((previousUrls) => [...previousUrls, ...urlData]);
  };

  return (
    <LoggerProvider>
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
        <h1>🔗 React URL Shortener</h1>
        <URLForm onShortened={handleNewShortenedUrl} />
        <URLList urls={shortenedUrls} />
        <Analytics />
      </div>
    </LoggerProvider>
  );
}

export default App;
