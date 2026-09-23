import { cp, mkdir, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(appDir, '..');
const englishDir = resolve(appDir, 'dist/en');
const resumeDir = resolve(appDir, 'dist/assets/resume');

await mkdir(englishDir, { recursive: true });
await mkdir(resumeDir, { recursive: true });
await cp(resolve(rootDir, 'assets/resume'), resumeDir, { recursive: true });
await copyFile(resolve(rootDir, 'en/index.html'), resolve(englishDir, 'index.html'));
await copyFile(resolve(rootDir, 'articles.js'), resolve(englishDir, 'articles.js'));
await copyFile(resolve(rootDir, 'studio.css'), resolve(englishDir, 'studio.css'));
await copyFile(resolve(rootDir, 'studio.js'), resolve(englishDir, 'studio.js'));
await cp(resolve(rootDir, 'design-system'), resolve(englishDir, 'design-system'), {
  recursive: true,
});
await cp(resolve(rootDir, 'assets'), resolve(englishDir, 'assets'), {
  recursive: true,
});
