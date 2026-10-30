import { spawn } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const DB_FILE = process.env.DB_FILE || 'db.json';

// Ensure db.json exists with the default structure if missing
if (!existsSync(DB_FILE)) {
  const initialData = {
    jobs: [],
    candidates: [],
    applications: [],
  };
  writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
}

console.log(`Starting CareerConnect JSON Server backend on ${HOST}:${PORT}...`);
console.log(`Serving database file: ${DB_FILE}`);

const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['json-server', DB_FILE, '--host', HOST, '--port', String(PORT)];

const serverProcess = spawn(cmd, args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: String(PORT),
    HOST,
  },
});

serverProcess.on('error', (err) => {
  console.error('Failed to start JSON Server process:', err);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  process.exit(code ?? 0);
});
