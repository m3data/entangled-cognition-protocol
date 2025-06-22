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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.listen(PORT, () => {
  console.log(`🌱 ECP Field Journal server sprouted at http://localhost:${PORT}
✨ Enter the entangled grove — weave, sense, log, and reflect.
🌀 Let the field remember you.`);
});