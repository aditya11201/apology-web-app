import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(projectRoot, 'assets', 'styles.css');
const binaryName = process.platform === 'win32' ? 'tailwindcss.cmd' : 'tailwindcss';
const tailwindBinary = path.join(projectRoot, 'node_modules', '.bin', binaryName);

mkdirSync(path.dirname(outputPath), { recursive: true });

const result = spawnSync(
  tailwindBinary,
  ['-c', 'tailwind.config.js', '-i', 'src/styles.css', '-o', 'assets/styles.css', '--minify'],
  { cwd: projectRoot, shell: process.platform === 'win32', stdio: 'inherit' }
);

if (result.error) {
  process.stderr.write(`Tailwind build failed: ${result.error.message}\n`);
  process.exitCode = 1;
} else if (result.status !== 0) {
  process.exitCode = result.status ?? 1;
} else {
  process.stdout.write('assets/styles.css\n');
}
