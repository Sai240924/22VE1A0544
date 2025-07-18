import { useState } from "react";
import { shortenUrl } from "../services/api";
import { useLogger } from "../context/LoggerContext";
import { TextField, Button } from "@mui/material";

const URLForm = ({ onShortened }) => {
  const [url, setUrl] = useState("");
  const { logEvent } = useLogger();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await shortenUrl(url);
      onShortened(result);
      logEvent("info", "URL shortened", { original: url, shortened: result.shortUrl });
    } catch (err) {
      logEvent("error", "Failed to shorten URL", { error: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
      <TextField label="Paste long URL" fullWidth value={url} onChange={e => setUrl(e.target.value)} />
      <Button type="submit" variant="contained">Shorten</Button>
    </form>
  );
};

export default URLForm;
