import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SRC_HERO = path.join(ROOT, 'src', 'content', 'hero');
const SRC_MEMBERS = path.join(ROOT, 'src', 'content', 'members');
const OUT = path.join(ROOT, 'public', 'generated');

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function rmDir(p) {
  await fs.rm(p, { recursive: true, force: true });
}

function isImage(name) {
  const n = name.toLowerCase();
  return n.endsWith('.jpg') || n.endsWith('.jpeg') || n.endsWith('.png') || n.endsWith('.webp');
}

async function processHero() {
  const outHero = path.join(OUT, 'hero');
  await ensureDir(outHero);

  let entries = [];
  try { entries = await fs.readdir(SRC_HERO); } catch { return; }
  entries = entries.filter(isImage).sort();

  for (const file of entries) {
    const abs = path.join(SRC_HERO, file);
    const base = file.replace(/\.[^.]+$/, '');
    const img = sharp(abs);

    const targets = [
      { w: 640, out: `${base}-640.webp` },
      { w: 1024, out: `${base}-1024.webp` },
      { w: 1600, out: `${base}-1600.webp` }
    ];

    for (const t of targets) {
      await img
        .clone()
        .resize({ width: t.w, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(path.join(outHero, t.out));
    }
  }
}

async function processMemberFolder(section, folderName, folderAbs) {
  const outBase = path.join(OUT, 'members', section, folderName);
  await ensureDir(outBase);

  const files = (await fs.readdir(folderAbs)).filter(isImage);
  for (const f of files) {
    const abs = path.join(folderAbs, f);
    const stem = f.replace(/\.[^.]+$/, '');

    // square thumb for grid
    await sharp(abs)
      .resize({ width: 600, height: 600, fit: 'cover', position: 'entropy' })
      .webp({ quality: 82 })
      .toFile(path.join(outBase, `${stem}-thumb.webp`));

    // large for lightbox
    await sharp(abs)
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(path.join(outBase, `${stem}-large.webp`));
  }
}

async function processMembers() {
  await ensureDir(path.join(OUT, 'members'));

  let sections = [];
  try { sections = await fs.readdir(SRC_MEMBERS); } catch { return; }

  for (const section of sections) {
    const sectionAbs = path.join(SRC_MEMBERS, section);
    const st = await fs.stat(sectionAbs).catch(() => null);
    if (!st?.isDirectory()) continue;

    let people = [];
    try { people = await fs.readdir(sectionAbs); } catch { continue; }

    for (const folderName of people) {
      const folderAbs = path.join(sectionAbs, folderName);
      const pst = await fs.stat(folderAbs).catch(() => null);
      if (!pst?.isDirectory()) continue;
      await processMemberFolder(section, folderName, folderAbs);
    }
  }
}

async function main() {
  await rmDir(OUT);
  await ensureDir(OUT);
  await processHero();
  await processMembers();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
