import sharp from 'sharp';
import { readdir, mkdir, copyFile } from 'fs/promises';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const PHOTOS_DIR = join(PUBLIC_DIR, 'photos');
const THUMBS_DIR = join(PHOTOS_DIR, 'thumbnails');

const THUMBNAIL_SIZE = 800; // Max dimension for thumbnails

async function generateThumbnails() {
  // Create directories
  await mkdir(PHOTOS_DIR, { recursive: true });
  await mkdir(THUMBS_DIR, { recursive: true });

  // Get all photo files from public directory
  const files = await readdir(PUBLIC_DIR);
  const photoFiles = files.filter(f =>
    f.includes('Chess Club') &&
    (f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'))
  );

  console.log(`Found ${photoFiles.length} photos to process`);

  for (const file of photoFiles) {
    const inputPath = join(PUBLIC_DIR, file);

    // Create URL-safe filename
    const safeName = file
      .replace(/\s+/g, '-')
      .replace(/@/g, 'at')
      .replace(/#/g, '-')
      .toLowerCase();

    const outputPath = join(PHOTOS_DIR, safeName);
    const thumbPath = join(THUMBS_DIR, safeName);

    // Copy original to photos folder with safe name
    await copyFile(inputPath, outputPath);
    console.log(`Copied: ${file} -> photos/${safeName}`);

    // Generate thumbnail
    await sharp(inputPath)
      .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toFile(thumbPath);

    console.log(`Thumbnail: ${safeName}`);
  }

  console.log('\nDone! Files created:');
  console.log('- Full size: public/photos/*.jpg');
  console.log('- Thumbnails: public/photos/thumbnails/*.jpg');
}

generateThumbnails().catch(console.error);
