const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');

const app = express();
const port = process.env.PORT || 5000;

// Add CORS middleware with options to allow frontend origin
app.use(cors({
  origin: 'http://localhost:5173', // frontend dev server URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

const urlDatabase = {};
const analyticsData = {};

app.post('/shorten', (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }
  const shortId = nanoid(7);
  urlDatabase[shortId] = originalUrl;
  analyticsData[shortId] = 0;
  const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;
  res.json({ shortUrl, originalUrl });
});

app.get('/analytics', (req, res) => {
  const analytics = Object.entries(analyticsData).map(([shortId, clicks]) => ({
    shortUrl: `${req.protocol}://${req.get('host')}/${shortId}`,
    clicks,
  }));
  res.json(analytics);
});

app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  const originalUrl = urlDatabase[shortId];
  if (originalUrl) {
    analyticsData[shortId] += 1;
    return res.redirect(originalUrl);
  }
  res.status(404).json({ error: 'Short URL not found' });
});

app.listen(port, () => {
  console.log(`URL shortener backend listening at http://localhost:${port}`);
});
