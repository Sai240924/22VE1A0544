import { Typography } from "@mui/material";

const URLList = ({ urls }) => {
  return (
    <section>
      <Typography variant="h5" gutterBottom>
        Shortened URLs
      </Typography>
      <ul>
        {urls.map((urlItem, index) => (
          <li key={index} style={{ marginBottom: "1rem" }}>
            <a href={urlItem.shortUrl} target="_blank" rel="noreferrer">
              {urlItem.shortUrl}
            </a>{" "}
            &rarr; {urlItem.originalUrl}
            <br />
            <small>
              Created: {new Date(urlItem.createdAt).toLocaleString()}{" "}
              {urlItem.expiresAt
                ? `| Expires: ${new Date(urlItem.expiresAt).toLocaleString()}`
                : "| No expiry"}
            </small>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default URLList;
