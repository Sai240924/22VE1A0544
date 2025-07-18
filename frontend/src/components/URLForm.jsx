import { useState } from "react";
import { shortenUrl } from "../services/api";
import { useLogger } from "../context/LoggerContext";
import { TextField, Button, Box } from "@mui/material";

const MAX_URLS = 5;

const URLForm = ({ onShortened }) => {
  const [urls, setUrls] = useState([{ originalUrl: "", error: null }]);
  const { logEvent } = useLogger();

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index].originalUrl = value;
    newUrls[index].error = null;
    setUrls(newUrls);
  };

  const handleAddUrl = () => {
    if (urls.length < MAX_URLS) {
      setUrls([...urls, { originalUrl: "", error: null }]);
    }
  };

  const handleRemoveUrl = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const validatedUrls = urls.map((urlObj) => {
      const errors = {};
      if (!urlObj.originalUrl || !validateUrl(urlObj.originalUrl)) {
        errors.originalUrl = "Invalid URL format";
        hasError = true;
      }
      return { ...urlObj, error: errors };
    });

    setUrls(validatedUrls);

    if (hasError) {
      logEvent("error", "Validation failed for URL form");
      return;
    }

    const payload = urls.map(({ originalUrl }) => ({
      originalUrl,
    }));

    try {
      const shortenedData = await shortenUrl(payload);
      onShortened(shortenedData);
      logEvent("info", "URLs successfully shortened", { urls: payload });
      setUrls([{ originalUrl: "", error: null }]);
    } catch (error) {
      logEvent("error", "URL shortening failed", { error: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      {urls.map((urlObj, index) => (
        <Box key={index} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
          <TextField
            label="Long URL"
            fullWidth
            value={urlObj.originalUrl}
            onChange={(e) => handleChange(index, e.target.value)}
            error={!!urlObj.error?.originalUrl}
            helperText={urlObj.error?.originalUrl}
          />
          {urls.length > 1 && (
            <Button variant="outlined" color="error" onClick={() => handleRemoveUrl(index)}>
              Remove
            </Button>
          )}
        </Box>
      ))}
      <Box sx={{ display: "flex", gap: 2 }}>
        {urls.length < MAX_URLS && (
          <Button variant="outlined" onClick={handleAddUrl}>
            Add URL
          </Button>
        )}
        <Button type="submit" variant="contained">
          Shorten
        </Button>
      </Box>
    </form>
  );
};

export default URLForm;
