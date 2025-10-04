const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3141;

const PUBLIC_DIR = path.join(__dirname, 'entries/_public');
const PRIVATE_DIR = path.join(__dirname, 'entries/_private');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.post('/save-entry', (req, res) => {
  const { path: savePath, content } = req.body;

  if (!savePath || !content) {
    return res.status(400).send('Missing path or content');
  }

  const fullPath = path.join(__dirname, savePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  fs.writeFile(fullPath, content, 'utf8', err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to save file');
    }
    res.send(`File saved to ${savePath}`);
  });
});

// Measurement framework API endpoints
app.get('/api/measurements', (req, res) => {
  try {
    const { limit = '50', offset = '0', days, startDate, endDate } = req.query;
    
    // This endpoint would normally query a database
    // For now, we return a structure that the frontend can work with
    // The actual data loading happens client-side via localStorage
    
    res.json({
      success: true,
      message: 'Measurement data loading handled client-side',
      params: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        days: days ? parseInt(days) : undefined,
        startDate,
        endDate
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve measurement data' });
  }
});

app.get('/api/measurements/trends/:scalePath', (req, res) => {
  try {
    const { scalePath } = req.params;
    const { days = '30' } = req.query;
    
    // Decode the scale path (dots were likely encoded as %2E)
    const decodedPath = decodeURIComponent(scalePath);
    
    res.json({
      success: true,
      message: 'Trend analysis handled client-side',
      scalePath: decodedPath,
      days: parseInt(days)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate trends' });
  }
});

app.get('/api/measurements/correlations', (req, res) => {
  try {
    const { scale1, scale2, days = '30' } = req.query;
    
    if (!scale1 || !scale2) {
      return res.status(400).json({ error: 'Both scale1 and scale2 parameters are required' });
    }
    
    res.json({
      success: true,
      message: 'Correlation analysis handled client-side',
      scale1: decodeURIComponent(scale1),
      scale2: decodeURIComponent(scale2),
      days: parseInt(days)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate correlations' });
  }
});

// Export measurement data endpoint
app.get('/api/measurements/export', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Data export handled client-side',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to export measurement data' });
  }
});

// Measurement dashboard endpoint
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'measurement-dashboard.html'));
});

// Community dashboard endpoint
app.get('/community', (req, res) => {
  res.sendFile(path.join(__dirname, 'community-dashboard.html'));
});

// Journal archive entries listing endpoint
app.get('/api/entries/:type/:privacy', (req, res) => {
  try {
    const { type, privacy } = req.params;
    const dirPath = path.join(__dirname, 'entries', type, privacy);

    // Check if directory exists
    if (!fs.existsSync(dirPath)) {
      return res.json({ files: [] });
    }

    // Read directory and filter JSON files
    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.json'))
      .sort()
      .reverse(); // Newest first

    res.json({ files });
  } catch (error) {
    console.error('Error listing entries:', error);
    res.status(500).json({ error: 'Failed to list entries' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.listen(PORT, () => {
  console.log(`🌱 ECP Field Journal server sprouted at http://localhost:${PORT}
✨ Enter the entangled grove — weave, sense, log, and reflect.
🌀 Let the field remember you.`);
});