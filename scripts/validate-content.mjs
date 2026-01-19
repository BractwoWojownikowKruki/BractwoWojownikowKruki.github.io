import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_MEMBERS = path.join(ROOT, 'src', 'content', 'members');

function parseOrder(folderName) {
  const m = folderName.match(/^\s*(\d+)\-/);
  return m ? Number(m[1]) : null;
}

async function main() {
  let sections = [];
  try { sections = await fs.readdir(SRC_MEMBERS); } catch { return; }

  let hasError = false;

  for (const section of sections) {
    const sectionAbs = path.join(SRC_MEMBERS, section);
    const st = await fs.stat(sectionAbs).catch(() => null);
    if (!st?.isDirectory()) continue;

    const people = await fs.readdir(sectionAbs);
    const map = new Map();

    for (const folder of people) {
      const o = parseOrder(folder);
      if (o == null) continue;
      const arr = map.get(o) ?? [];
      arr.push(folder);
      map.set(o, arr);
    }

    for (const [order, folders] of map.entries()) {
      if (folders.length > 1) {
        console.warn(`[WARN] Duplikat prefixu ${order} w sekcji "${section}": ${folders.join(', ')}`);
        // Nie blokujemy builda, bo ustaliliśmy: przy remisie sort po nazwie folderu.
        // Ale warto to zauważyć.
      }
    }
  }

  if (hasError) process.exit(1);
}

main();
