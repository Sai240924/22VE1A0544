const URLList = ({ urls }) => (
  <div>
    <h3>Shortened URLs</h3>
    <ul>
      {urls.map((u, idx) => (
        <li key={idx}>
          <a href={u.shortUrl} target="_blank" rel="noreferrer">{u.shortUrl}</a> ➜ {u.originalUrl}
        </li>
      ))}
    </ul>
  </div>
);

export default URLList;
