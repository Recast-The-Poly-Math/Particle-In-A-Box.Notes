const express = require('express');
const { execFile } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const BIN = path.join(ROOT, 'greek_keys');

app.use(express.json({ limit: '64kb', type: 'application/json' }));
app.use(express.static(path.join(ROOT, 'public'), {
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
  }
}));

app.post('/api/save', (req, res) => {
  const entries = Array.isArray(req.body.entries) ? req.body.entries : [];

  if (entries.length !== 48) {
    return res.status(400).json({
      ok: false,
      error: 'Exactly 48 keys are required.'
    });
  }

  let text = 'GREEK KEYS\n==========\n\n';

  entries.forEach((entry, index) => {
    const letter = String(entry.letter || '').slice(0, 8);
    const name = String(entry.name || '').slice(0, 30);
    const letterCase = String(entry.case || '').slice(0, 12);
    const association = String(entry.association || '').slice(0, 500);

    text += `Key: ${index + 1}\n`;
    text += `Letter: ${letter}\n`;
    text += `Name: ${name}\n`;
    text += `Case: ${letterCase}\n`;
    text += `Association: ${association}\n`;
    text += '-------------------------\n';
  });

  const child = execFile(
    BIN,
    [],
    {
      timeout: 3000,
      maxBuffer: 128 * 1024,
      encoding: 'utf8'
    },
    (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({
          ok: false,
          error: stderr || error.message
        });
      }

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.json({
        ok: true,
        encoding: 'UTF-8',
        text: stdout
      });
    }
  );

  child.stdin.setDefaultEncoding('utf8');
  child.stdin.end(text, 'utf8');
});

execFile(
  'g++',
  ['-std=c++17', '-O2', 'greek_keys.cpp', '-o', 'greek_keys'],
  { cwd: ROOT },
  (error, stdout, stderr) => {
    if (error) {
      console.error(stderr || error.message);
    }

    app.listen(PORT, () => {
      console.log(`Greek Keys on ${PORT}`);
    });
  }
);
