const express = require('express');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const SOURCE = path.join(ROOT, 'guess_game.cpp');
const PROGRAM = path.join(ROOT, 'guess_game');

app.use(express.json({ limit: '4kb' }));
app.use(express.static(path.join(ROOT, 'public')));

function compileGame(callback) {
  execFile('g++', ['-std=c++17', '-O2', SOURCE, '-o', PROGRAM],
    { timeout: 10000, maxBuffer: 1024 * 1024 },
    (error, stdout, stderr) => callback(error, stdout, stderr));
}

app.post('/api/compile', (req, res) => {
  compileGame((error, stdout, stderr) => {
    if (error) return res.status(500).json({ ok: false, output: stderr || error.message });
    res.json({ ok: true, output: 'Compilation successful. guess_game is ready.' });
  });
});

app.post('/api/run', (req, res) => {
  const input = typeof req.body.input === 'string' ? req.body.input : '';

  // Only numeric game input is accepted; source code cannot be submitted here.
  if (!/^\s*[0-9\s]*$/.test(input) || input.length > 100) {
    return res.status(400).json({ ok: false, output: 'Only short numeric game input is allowed.' });
  }

  if (!fs.existsSync(PROGRAM)) {
    return compileGame((compileError, stdout, stderr) => {
      if (compileError) return res.status(500).json({ ok: false, output: stderr || compileError.message });
      runProgram(input, res);
    });
  }

  runProgram(input, res);
});

function runProgram(input, res) {
  const child = execFile(PROGRAM, [], {
    timeout: 2000,
    maxBuffer: 64 * 1024,
    windowsHide: true
  }, (error, stdout, stderr) => {
    if (error && error.killed) return res.status(408).json({ ok: false, output: 'Program stopped after the 2 second limit.\n' + stdout });
    if (error && !stdout) return res.status(500).json({ ok: false, output: stderr || error.message });
    res.json({ ok: true, output: stdout + (stderr || '') });
  });

  child.stdin.end(input);
}

compileGame((error, stdout, stderr) => {
  if (error) console.error('Initial C++ compilation failed:', stderr || error.message);
  else console.log('C++ game compiled successfully.');

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});
