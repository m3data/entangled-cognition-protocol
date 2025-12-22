const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { exec, spawn } = require('child_process');

const app = express();
const PORT = 3141;
const SCRIPTS_DIR = path.join(__dirname, 'scripts');

const PUBLIC_DIR = path.join(__dirname, 'entries/_public');
const PRIVATE_DIR = path.join(__dirname, 'entries/_private');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

app.post('/save-entry', (req, res) => {
  const { path: savePath, content, encoding } = req.body;

  if (!savePath || !content) {
    return res.status(400).send('Missing path or content');
  }

  const fullPath = path.join(__dirname, savePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  // Support base64 encoding for binary files (audio, images)
  if (encoding === 'base64') {
    const buffer = Buffer.from(content, 'base64');
    fs.writeFile(fullPath, buffer, err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Failed to save file');
      }
      res.send(`File saved to ${savePath}`);
    });
  } else {
    fs.writeFile(fullPath, content, 'utf8', err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Failed to save file');
      }
      res.send(`File saved to ${savePath}`);
    });
  }
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

// ============================================================================
// SC Session Analysis API
// ============================================================================

// Path to SC sessions directory (relative to EarthianLabs root)
const SC_SESSIONS_DIR = path.resolve(__dirname, '../../semantic-climate-phase-space/sessions');

/**
 * Find and return SC session data by ECP session ID
 */
app.get('/api/sc-session/:ecpSessionId', (req, res) => {
  const { ecpSessionId } = req.params;

  if (!ecpSessionId) {
    return res.status(400).json({ error: 'Missing ecpSessionId parameter' });
  }

  try {
    // Check if SC sessions directory exists
    if (!fs.existsSync(SC_SESSIONS_DIR)) {
      return res.status(404).json({
        error: 'SC sessions directory not found',
        path: SC_SESSIONS_DIR
      });
    }

    // Scan for JSON files
    const files = fs.readdirSync(SC_SESSIONS_DIR)
      .filter(f => f.endsWith('.json'));

    // Search for matching session
    for (const file of files) {
      const filePath = path.join(SC_SESSIONS_DIR, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const session = JSON.parse(content);

        if (session.metadata?.ecp_session_id === ecpSessionId) {
          return res.json({
            success: true,
            filename: file,
            session: session
          });
        }
      } catch (parseErr) {
        console.warn(`Failed to parse ${file}:`, parseErr.message);
        continue;
      }
    }

    // No matching session found
    return res.status(404).json({
      error: 'No SC session found for this ECP experiment',
      ecpSessionId,
      sessionsScanned: files.length
    });

  } catch (error) {
    console.error('Error finding SC session:', error);
    return res.status(500).json({ error: 'Failed to search SC sessions' });
  }
});

/**
 * List all available SC sessions (for debugging/manual selection)
 */
app.get('/api/sc-sessions', (req, res) => {
  try {
    if (!fs.existsSync(SC_SESSIONS_DIR)) {
      return res.json({ sessions: [] });
    }

    const files = fs.readdirSync(SC_SESSIONS_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const filePath = path.join(SC_SESSIONS_DIR, f);
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const session = JSON.parse(content);
          return {
            filename: f,
            session_id: session.metadata?.session_id,
            ecp_session_id: session.metadata?.ecp_session_id,
            model: session.metadata?.model,
            created_at: session.metadata?.created_at,
            total_turns: session.metadata?.total_turns
          };
        } catch (e) {
          return { filename: f, error: 'Parse failed' };
        }
      })
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

    res.json({ sessions: files });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list SC sessions' });
  }
});

// ============================================================================
// Instrument Control API
// ============================================================================

/**
 * Start instruments (EBS, SC, Ollama)
 */
app.post('/api/instruments/start', (req, res) => {
  const { instrument = 'all' } = req.body;
  const scriptPath = path.join(SCRIPTS_DIR, 'start-instruments.sh');

  if (!fs.existsSync(scriptPath)) {
    return res.status(500).json({
      success: false,
      error: 'Instrument launcher script not found'
    });
  }

  exec(`"${scriptPath}" ${instrument}`, { timeout: 30000 }, (error, stdout, stderr) => {
    if (error) {
      console.error('Instrument start error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
        stderr
      });
    }

    res.json({
      success: true,
      message: `Instruments started: ${instrument}`,
      output: stdout
    });
  });
});

/**
 * Get instrument status
 */
app.get('/api/instruments/status', (req, res) => {
  const scriptPath = path.join(SCRIPTS_DIR, 'start-instruments.sh');

  if (!fs.existsSync(scriptPath)) {
    return res.status(500).json({
      success: false,
      error: 'Instrument launcher script not found'
    });
  }

  exec(`"${scriptPath}" status`, { timeout: 10000 }, (error, stdout, stderr) => {
    // Parse output to determine status
    const ebsRunning = stdout.includes('EarthianBioSense already running') ||
                       stdout.includes('EarthianBioSense: running');
    const scRunning = stdout.includes('Semantic Climate already running') ||
                      stdout.includes('Semantic Climate: running');
    const ollamaRunning = stdout.includes('Ollama: running') ||
                          stdout.includes('Ollama already running');

    res.json({
      success: true,
      instruments: {
        ebs: { running: ebsRunning },
        sc: { running: scRunning },
        ollama: { running: ollamaRunning }
      },
      output: stdout
    });
  });
});

/**
 * Stop instruments
 */
app.post('/api/instruments/stop', (req, res) => {
  const scriptPath = path.join(SCRIPTS_DIR, 'start-instruments.sh');

  if (!fs.existsSync(scriptPath)) {
    return res.status(500).json({
      success: false,
      error: 'Instrument launcher script not found'
    });
  }

  exec(`"${scriptPath}" stop`, { timeout: 10000 }, (error, stdout, stderr) => {
    if (error) {
      console.error('Instrument stop error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
        stderr
      });
    }

    res.json({
      success: true,
      message: 'Instruments stopped',
      output: stdout
    });
  });
});

app.listen(PORT, () => {
  console.log(`🌱 ECP Field Journal server sprouted at http://localhost:${PORT}
✨ Enter the entangled grove — weave, sense, log, and reflect.
🌀 Let the field remember you.`);
});