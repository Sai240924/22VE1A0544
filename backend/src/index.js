const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

const urlStore = {};
const clickAnalytics = {};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidShortCode = (code) => /^[a-zA-Z0-9_-]{3,20}$/.test(code);

setInterval(() => {
  const now = Date.now();
  for (const [shortCode, data] of Object.entries(urlStore)) {
    if (data.expiresAt && data.expiresAt < now) {
      delete urlStore[shortCode];
      delete clickAnalytics[shortCode];
    }
  }
}, 10 * 60 * 1000);

app.post('/shorten', (req, res) => {
  const { urls } = req.body;
  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'The urls field must be a non-empty array.' });
  }
  if (urls.length > 5) {
    return res.status(400).json({ error: 'Cannot shorten more than 5 URLs at once.' });
  }

  const now = Date.now();
  const results = [];

  for (const urlObj of urls) {
    const { originalUrl, validityMinutes, preferredShortCode } = urlObj;

    if (!originalUrl || !isValidUrl(originalUrl)) {
      results.push({ error: 'Invalid or missing originalUrl.', originalUrl });
      continue;
    }

    let shortCode = preferredShortCode;

    if (shortCode) {
      if (!isValidShortCode(shortCode)) {
        results.push({ error: 'Invalid preferredShortCode format.', originalUrl });
        continue;
      }
      if (urlStore[shortCode]) {
        results.push({ error: 'Preferred shortcode already in use.', originalUrl });
        continue;
      }
    } else {
      do {
        shortCode = nanoid(7);
      } while (urlStore[shortCode]);
    }

    const createdAt = now;
    let expiresAt = null;
    if (validityMinutes && Number.isInteger(validityMinutes) && validityMinutes > 0) {
      expiresAt = createdAt + validityMinutes * 60 * 1000;
    }

    urlStore[shortCode] = { originalUrl, createdAt, expiresAt };
    clickAnalytics[shortCode] = { totalClicks: 0, clicks: [] };

    const shortenedUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
    results.push({ shortUrl: shortenedUrl, originalUrl, createdAt, expiresAt });
  }

  res.json(results);
});

app.get('/analytics', (req, res) => {
  const analyticsReport = Object.entries(clickAnalytics).map(([shortCode, data]) => {
    const urlData = urlStore[shortCode];
    if (!urlData) return null;
    return {
      shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
      originalUrl: urlData.originalUrl,
      createdAt: new Date(urlData.createdAt).toISOString(),
      expiresAt: urlData.expiresAt ? new Date(urlData.expiresAt).toISOString() : null,
      totalClicks: data.totalClicks,
      clicks: data.clicks,
    };
  }).filter(Boolean);

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(analyticsReport));
});

app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const urlData = urlStore[shortCode];
  if (urlData) {
    const now = Date.now();
    if (urlData.expiresAt && urlData.expiresAt < now) {
      delete urlStore[shortCode];
      delete clickAnalytics[shortCode];
      return res.status(410).json({ error: 'Short URL has expired.' });
    }

    const source = req.get('referer') || 'direct';
    const location = req.get('x-forwarded-for') || req.ip || 'unknown';
    const timestamp = new Date().toISOString();

    if (!clickAnalytics[shortCode]) {
      clickAnalytics[shortCode] = { totalClicks: 0, clicks: [] };
    }
    clickAnalytics[shortCode].totalClicks += 1;
    clickAnalytics[shortCode].clicks.push({ timestamp, source, location });

    return res.redirect(urlData.originalUrl);
  }
  res.status(404).json({ error: 'Short URL not found.' });
});

app.listen(port, () => {
  console.log(`URL shortener backend is running at http://localhost:${port}`);
});
