import fs from 'node:fs/promises';
import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true
});

export async function readMarkdownAsHtml(absPath: string): Promise<string> {
  const raw = await fs.readFile(absPath, 'utf-8');
  return marked.parse(raw);
}
