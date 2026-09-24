import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(appDir, '..');
const englishDir = resolve(appDir, 'dist/en');
const resumeDir = resolve(appDir, 'dist/assets/resume');

await mkdir(englishDir, { recursive: true });
await mkdir(resumeDir, { recursive: true });
await cp(resolve(rootDir, 'assets/resume'), resumeDir, { recursive: true });

// /en/ serves the same React app; it switches copy by pathname (src/i18n.ts).
// Patch the static head so crawlers and link previews see English too.
const html = await readFile(resolve(appDir, 'dist/index.html'), 'utf8');
const english = html
  .replace('<html lang="zh-CN">', '<html lang="en">')
  .replace(/<title>[^<]*<\/title>/, '<title>Yue (Cassie) Liang — AI student &amp; indie builder</title>')
  .replace(
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="Yue (Cassie) Liang: AI student in San Jose building 1Day, Tabspace, and other small products.">',
  );
await writeFile(resolve(englishDir, 'index.html'), english);
