// One-time split: moves the game code out of index.html into small files in src/.
// Run once from anywhere:  node lost-traveler/firstperson/split.mjs
// Undo (before committing): git checkout -- index.html && rm -rf src game.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(dir, 'index.html');
const srcDir = path.join(dir, 'src');

if (fs.existsSync(srcDir)) {
  console.error('src/ already exists, so the split was already done. Nothing changed.');
  process.exit(1);
}

const lines = fs.readFileSync(htmlPath, 'utf8').split('\n');
const open = lines.findIndex(l => l.trim() === '<script type="module">');
const close = lines.findIndex((l, i) => i > open && l.trim() === '</script>');
if (open < 0 || close < 0) {
  console.error('Could not find the inline <script type="module"> ... </script> block in index.html.');
  process.exit(1);
}

const code = lines.slice(open + 1, close);
// a new file starts at every top-level section line:  // ====...  name   or   // ----...  name
const marker = /^\/\/ (?:={8,}|-{8,}) (.+)$/;

const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-')
  .replace(/^(the|a)-/, '').replace(/^-+|-+$/g, '')
  .split('-').reduce((a, w) => (a.done || a.s.length + w.length > 28 ? { s: a.s, done: !!a.s }
    : { s: a.s ? a.s + '-' + w : w }), { s: '' }).s;

const parts = [{ name: 'imports', lines: [] }];
for (const l of code) {
  const m = l.match(marker);
  if (m) parts.push({ name: slug(m[1]) || 'part', lines: [] });
  parts.at(-1).lines.push(l);
}
if (parts[0].lines.length === 0) parts.shift();

fs.mkdirSync(srcDir);
const used = new Set();
parts.forEach((p, i) => {
  let file = `${String((i + 1) * 10).padStart(3, '0')}-${p.name}.js`;
  while (used.has(file)) file = file.replace(/\.js$/, '-2.js');
  used.add(file);
  fs.writeFileSync(path.join(srcDir, file), p.lines.join('\n') + '\n');
  console.log(`${file.padEnd(52)} ${p.lines.length} lines`);
});

const html = [...lines.slice(0, open), '<script type="module" src="./game.js"></script>', ...lines.slice(close + 1)];
fs.writeFileSync(htmlPath, html.join('\n'));

const { build } = await import('./build.mjs');
build();
console.log(`\nDone: ${parts.length} files in src/, index.html now loads game.js.`);
