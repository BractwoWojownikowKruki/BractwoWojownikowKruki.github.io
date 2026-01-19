import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HERO_DIR = path.join(__dirname, '..', 'content', 'hero');

function isImage(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.webp');
}

export type HeroImage = {
  baseName: string;
  alt: string;
  // generated urls
  src640: string;
  src1024: string;
  src1600: string;
};

export async function loadHeroImages(): Promise<HeroImage[]> {
  const entries = await fs.readdir(HERO_DIR).catch(() => [] as string[]);
  const imgs = entries.filter(isImage).sort((a, b) => a.localeCompare(b));

  return imgs.map((file) => {
    const baseName = file.replace(/\.[^.]+$/, '');
    const base = `/generated/hero/${baseName}`;
    const alt = 'Bractwo Wojowników Kruki';
    return {
      baseName,
      alt,
      src640: `${base}-640.webp`,
      src1024: `${base}-1024.webp`,
      src1600: `${base}-1600.webp`
    };
  });
}
