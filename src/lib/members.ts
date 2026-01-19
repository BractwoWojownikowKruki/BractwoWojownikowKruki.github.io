import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { MemberSection } from '../config/site';
import { readMarkdownAsHtml } from './markdown';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type Member = {
  section: MemberSection;
  folderName: string;
  order: number;
  slug: string;
  displayName: string;
  bioHtml: string;
  // first image for card
  coverThumbUrl: string | null;
  coverLargeUrl: string | null;
  allLargeUrls: string[];
};

const CONTENT_ROOT = path.join(__dirname, '..', 'content', 'members');

function titleCaseFromSlug(slug: string): string {
  const words = slug.split('-').filter(Boolean);
  return words
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

function parseOrderAndSlug(folderName: string): { order: number; slug: string } {
  const m = folderName.match(/^\s*(\d+)\-(.+)\s*$/);
  if (!m) return { order: 9999, slug: folderName };
  return { order: Number(m[1]), slug: m[2] };
}

async function listDirSafe(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

function isImageFile(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.webp');
}

export async function loadMembers(section: MemberSection): Promise<Member[]> {
  const sectionDir = path.join(CONTENT_ROOT, section);
  const entries = await listDirSafe(sectionDir);

  const members: Member[] = [];
  for (const folderName of entries) {
    const abs = path.join(sectionDir, folderName);
    const st = await fs.stat(abs).catch(() => null);
    if (!st || !st.isDirectory()) continue;

    const { order, slug } = parseOrderAndSlug(folderName);
    const displayName = titleCaseFromSlug(slug);

    const bioPath = path.join(abs, 'bio.md');
    const bioHtml = await readMarkdownAsHtml(bioPath).catch(() => '<p></p>');

    const files = await listDirSafe(abs);
    const images = files.filter(isImageFile);

    const generatedBase = `/generated/members/${section}/${folderName}`;
    // Use the first image filename stem as key.
    let coverThumbUrl: string | null = null;
    let coverLargeUrl: string | null = null;
    const allLargeUrls: string[] = [];

    for (const img of images) {
      const stem = img.replace(/\.[^.]+$/, '');
      const large = `${generatedBase}/${stem}-large.webp`;
      const thumb = `${generatedBase}/${stem}-thumb.webp`;
      allLargeUrls.push(large);
      if (!coverThumbUrl) coverThumbUrl = thumb;
      if (!coverLargeUrl) coverLargeUrl = large;
    }

    members.push({
      section,
      folderName,
      order,
      slug,
      displayName,
      bioHtml,
      coverThumbUrl,
      coverLargeUrl,
      allLargeUrls
    });
  }

  members.sort((a, b) => a.order - b.order || a.folderName.localeCompare(b.folderName));
  return members;
}
