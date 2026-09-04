/**
 * Copy photos into public/photos with URL-safe names and generate 800px thumbnails.
 *
 * Usage:
 *   node scripts/generate-thumbnails.mjs <source-dir> [--prefix press]
 *
 * Example (press photos dropped in ~/Downloads/press):
 *   node scripts/generate-thumbnails.mjs ~/Downloads/press --prefix press
 *
 * Requires sharp (not a project dependency): run with `npx -p sharp node scripts/...`
 * or `npm i -D sharp` locally.
 */
import sharp from 'sharp';
import { readdir, mkdir, copyFile } from 'fs/promises';
import { join, extname, basename, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const PHOTOS_DIR = join(PUBLIC_DIR, 'photos');
const THUMBS_DIR = join(PHOTOS_DIR, 'thumbnails');
const THUMBNAIL_SIZE = 800;

const args = process.argv.slice(2);
const sourceDir = args.find((a) => !a.startsWith('--'));
const prefixIdx = args.indexOf('--prefix');
const prefix = prefixIdx !== -1 ? args[prefixIdx + 1] : '';

if (!sourceDir) {
  console.error('Usage: node scripts/generate-thumbnails.mjs <source-dir> [--prefix press]');
  process.exit(1);
}

function safeName(file) {
  const ext = extname(file).toLowerCase();
  const base = basename(file, extname(file))
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/@/g, 'at')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return `${prefix ? `${prefix}--` : ''}${base}${ext === '.jpeg' ? '.jpg' : ext}`;
}

async function run() {
  await mkdir(THUMBS_DIR, { recursive: true });
  const src = resolve(sourceDir);
  const files = (await readdir(src)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  console.log(`Found ${files.length} photos in ${src}`);

  const entries = [];
  for (const file of files) {
    const name = safeName(file);
    const inputPath = join(src, file);
    await copyFile(inputPath, join(PHOTOS_DIR, name));
    await sharp(inputPath)
      .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(join(THUMBS_DIR, name.replace(/\.(png|webp)$/i, '.jpg')));
    console.log(`✓ ${file} -> photos/${name}`);
    entries.push({
      id: name.replace(/\.[^.]+$/, ''),
      thumbnail: `/photos/thumbnails/${name.replace(/\.(png|webp)$/i, '.jpg')}`,
      fullSize: `/photos/${name}`,
      photographer: 'TODO',
      photographerLink: '',
      date: 'YYYY-MM-DD',
      venue: prefix === 'press' ? 'Press Photo' : 'TODO',
      showId: null,
    });
  }

  console.log('\nPaste into data/photos.json (under "press" or "live") and fill in the TODOs:\n');
  console.log(JSON.stringify(entries, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
