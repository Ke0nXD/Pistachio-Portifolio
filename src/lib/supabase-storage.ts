import { randomUUID } from 'crypto';
import { ContentStoreError } from '@/lib/content-store';

const allowedFolders = new Set(['gallery', 'commissions']);
const maxUploadBytes = 10 * 1024 * 1024;

function getStorageConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'portfolio-art';

  if (!url || !key) {
    throw new ContentStoreError('Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.', 503);
  }

  return { url, key, bucket };
}

function safeFileName(name: string) {
  const fallback = 'artwork';
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return cleaned || fallback;
}

export async function uploadImageToSupabase(file: File, folderValue: FormDataEntryValue | null) {
  const folder = typeof folderValue === 'string' && allowedFolders.has(folderValue) ? folderValue : 'gallery';

  if (!file.type.startsWith('image/')) {
    throw new ContentStoreError('Only image uploads are allowed.', 400);
  }

  if (file.size > maxUploadBytes) {
    throw new ContentStoreError('Image upload limit is 10MB.', 400);
  }

  const { url, key, bucket } = getStorageConfig();
  const path = `${folder}/${Date.now()}-${randomUUID()}-${safeFileName(file.name)}`;
  const uploadUrl = `${url}/storage/v1/object/${bucket}/${path}`;
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'false',
    },
    body: Buffer.from(await file.arrayBuffer()),
    cache: 'no-store',
  });

  if (!response.ok) {
    const details = await response.text();
    throw new ContentStoreError('Supabase Storage upload failed.', response.status, details);
  }

  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}

