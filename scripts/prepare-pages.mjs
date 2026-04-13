import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const rootDir = resolve(import.meta.dirname, '..');
const distDir = resolve(rootDir, 'dist');
const indexPath = resolve(distDir, 'index.html');
const notFoundPath = resolve(distDir, '404.html');
const cnameSourcePath = resolve(rootDir, 'CNAME');
const cnameDistPath = resolve(distDir, 'CNAME');

mkdirSync(dirname(notFoundPath), { recursive: true });
copyFileSync(indexPath, notFoundPath);

if (existsSync(cnameSourcePath)) {
  copyFileSync(cnameSourcePath, cnameDistPath);
}