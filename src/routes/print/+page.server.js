import fs from 'fs/promises';
import path from 'path';

export async function load({ params }) {
  const mdFilePath = path.resolve('src/content/text/all_sections_merged.md');
  const content = await fs.readFile(mdFilePath, 'utf-8');
  return { content };
}