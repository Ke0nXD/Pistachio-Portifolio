import { randomUUID } from 'crypto';
import { defaultCompletedCommissions, type CompletedCommission, type CompletedCommissionCategory } from '@/data/commissions';
import { defaultGallery, type GalleryCategory, type GalleryItem } from '@/data/gallery';

type GalleryRow = {
  id: string;
  title: string;
  category: GalleryCategory;
  src: string;
  featured: boolean;
  active: boolean;
};

type CompletedCommissionRow = {
  id: string;
  title: string;
  client_name: string;
  category: CompletedCommissionCategory;
  src: string;
  description: string;
  completed_at: string;
  active: boolean;
};

export type GalleryInput = Omit<GalleryItem, 'id'>;
export type CompletedCommissionInput = Omit<CompletedCommission, 'id'>;
export type ContentCollection = 'gallery' | 'completed';

const galleryCategories = new Set<GalleryCategory>(['icons', 'half-body', 'full-body', 'reference-sheet', 'sketches']);
const completedCategories = new Set<CompletedCommissionCategory>(['icon', 'half-body', 'full-body', 'reference-sheet', 'custom']);

export class ContentStoreError extends Error {
  status: number;
  details?: string;

  constructor(message: string, status = 500, details?: string) {
    super(message);
    this.name = 'ContentStoreError';
    this.status = status;
    this.details = details;
  }
}

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new ContentStoreError('Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.', 503);
  }

  return { url, key };
}

async function supabaseRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = getSupabaseConfig();
  const headers = new Headers(init.headers);

  headers.set('apikey', key);
  headers.set('Authorization', `Bearer ${key}`);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    const details = await response.text();
    throw new ContentStoreError('Supabase request failed.', response.status, details);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

function mapGallery(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    src: row.src,
    featured: row.featured,
    active: row.active,
  };
}

function mapCompleted(row: CompletedCommissionRow): CompletedCommission {
  return {
    id: row.id,
    title: row.title,
    clientName: row.client_name,
    category: row.category,
    src: row.src,
    description: row.description,
    completedAt: row.completed_at,
    active: row.active,
  };
}

function toCompletedRow(item: CompletedCommission): CompletedCommissionRow {
  return {
    id: item.id,
    title: item.title,
    client_name: item.clientName,
    category: item.category,
    src: item.src,
    description: item.description,
    completed_at: item.completedAt,
    active: item.active,
  };
}

function assertRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ContentStoreError('Invalid request body.', 400);
  }
  return value as Record<string, unknown>;
}

function cleanText(value: unknown, field: string, maxLength: number, required = true) {
  if (typeof value !== 'string') {
    if (!required) return '';
    throw new ContentStoreError(`${field} must be a string.`, 400);
  }

  const text = value.trim();
  if (required && !text) {
    throw new ContentStoreError(`${field} is required.`, 400);
  }
  if (text.length > maxLength) {
    throw new ContentStoreError(`${field} is too long.`, 400);
  }

  return text;
}

function cleanBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback;
}

function cleanImageSrc(value: unknown) {
  const src = cleanText(value, 'src', 1000);
  const isLocalPath = src.startsWith('/') && !src.startsWith('//');
  const isHttpsUrl = src.startsWith('https://');

  if (!isLocalPath && !isHttpsUrl) {
    throw new ContentStoreError('Image src must be an HTTPS URL or a local /images path.', 400);
  }

  return src;
}

function cleanDate(value: unknown) {
  const date = cleanText(value, 'completedAt', 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ContentStoreError('completedAt must use YYYY-MM-DD format.', 400);
  }
  return date;
}

export function normalizeGalleryInput(value: unknown): GalleryInput {
  const body = assertRecord(value);
  const category = cleanText(body.category, 'category', 40) as GalleryCategory;

  if (!galleryCategories.has(category)) {
    throw new ContentStoreError('Invalid gallery category.', 400);
  }

  return {
    title: cleanText(body.title, 'title', 120),
    category,
    src: cleanImageSrc(body.src),
    featured: cleanBoolean(body.featured),
    active: cleanBoolean(body.active, true),
  };
}

export function normalizeCompletedInput(value: unknown): CompletedCommissionInput {
  const body = assertRecord(value);
  const category = cleanText(body.category, 'category', 40) as CompletedCommissionCategory;

  if (!completedCategories.has(category)) {
    throw new ContentStoreError('Invalid completed commission category.', 400);
  }

  return {
    title: cleanText(body.title, 'title', 120),
    clientName: cleanText(body.clientName, 'clientName', 120),
    category,
    src: cleanImageSrc(body.src),
    description: cleanText(body.description, 'description', 500, false),
    completedAt: cleanDate(body.completedAt),
    active: cleanBoolean(body.active, true),
  };
}

export function normalizeGalleryPatch(value: unknown): Partial<GalleryInput> {
  const body = assertRecord(value);
  const patch: Partial<GalleryInput> = {};

  if ('title' in body) patch.title = cleanText(body.title, 'title', 120);
  if ('category' in body) {
    const category = cleanText(body.category, 'category', 40) as GalleryCategory;
    if (!galleryCategories.has(category)) throw new ContentStoreError('Invalid gallery category.', 400);
    patch.category = category;
  }
  if ('src' in body) patch.src = cleanImageSrc(body.src);
  if ('featured' in body) patch.featured = cleanBoolean(body.featured);
  if ('active' in body) patch.active = cleanBoolean(body.active);

  return patch;
}

export function normalizeCompletedPatch(value: unknown): Partial<CompletedCommissionInput> {
  const body = assertRecord(value);
  const patch: Partial<CompletedCommissionInput> = {};

  if ('title' in body) patch.title = cleanText(body.title, 'title', 120);
  if ('clientName' in body) patch.clientName = cleanText(body.clientName, 'clientName', 120);
  if ('category' in body) {
    const category = cleanText(body.category, 'category', 40) as CompletedCommissionCategory;
    if (!completedCategories.has(category)) throw new ContentStoreError('Invalid completed commission category.', 400);
    patch.category = category;
  }
  if ('src' in body) patch.src = cleanImageSrc(body.src);
  if ('description' in body) patch.description = cleanText(body.description, 'description', 500, false);
  if ('completedAt' in body) patch.completedAt = cleanDate(body.completedAt);
  if ('active' in body) patch.active = cleanBoolean(body.active);

  return patch;
}

export async function getPublicContent() {
  if (!isSupabaseConfigured()) {
    return {
      gallery: defaultGallery.filter((item) => item.active),
      completed: defaultCompletedCommissions.filter((item) => item.active),
      databaseConfigured: false,
    };
  }

  try {
    const [galleryRows, completedRows] = await Promise.all([
      supabaseRest<GalleryRow[]>('gallery_items?select=id,title,category,src,featured,active&active=eq.true&order=created_at.desc'),
      supabaseRest<CompletedCommissionRow[]>('completed_commissions?select=id,title,client_name,category,src,description,completed_at,active&active=eq.true&order=completed_at.desc'),
    ]);

    return {
      gallery: galleryRows.map(mapGallery),
      completed: completedRows.map(mapCompleted),
      databaseConfigured: true,
    };
  } catch (error) {
    console.error(error);
    return {
      gallery: defaultGallery.filter((item) => item.active),
      completed: defaultCompletedCommissions.filter((item) => item.active),
      databaseConfigured: true,
    };
  }
}

export async function getAdminContent() {
  const [galleryRows, completedRows] = await Promise.all([
    supabaseRest<GalleryRow[]>('gallery_items?select=id,title,category,src,featured,active&order=created_at.desc'),
    supabaseRest<CompletedCommissionRow[]>('completed_commissions?select=id,title,client_name,category,src,description,completed_at,active&order=completed_at.desc'),
  ]);

  return {
    gallery: galleryRows.map(mapGallery),
    completed: completedRows.map(mapCompleted),
  };
}

export async function createGalleryItem(input: GalleryInput) {
  const rows = await supabaseRest<GalleryRow[]>('gallery_items', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ id: randomUUID(), ...input }),
  });

  return mapGallery(rows[0]);
}

export async function createCompletedCommission(input: CompletedCommissionInput) {
  const rows = await supabaseRest<CompletedCommissionRow[]>('completed_commissions', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      id: randomUUID(),
      title: input.title,
      client_name: input.clientName,
      category: input.category,
      src: input.src,
      description: input.description,
      completed_at: input.completedAt,
      active: input.active,
    }),
  });

  return mapCompleted(rows[0]);
}

export async function updateGalleryItem(id: string, input: Partial<GalleryInput>) {
  const rows = await supabaseRest<GalleryRow[]>(`gallery_items?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(input),
  });

  if (!rows[0]) throw new ContentStoreError('Gallery item not found.', 404);
  return mapGallery(rows[0]);
}

export async function updateCompletedCommission(id: string, input: Partial<CompletedCommissionInput>) {
  const payload: Record<string, unknown> = { ...input };

  if ('clientName' in payload) {
    payload.client_name = payload.clientName;
    delete payload.clientName;
  }
  if ('completedAt' in payload) {
    payload.completed_at = payload.completedAt;
    delete payload.completedAt;
  }

  const rows = await supabaseRest<CompletedCommissionRow[]>(`completed_commissions?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(payload),
  });

  if (!rows[0]) throw new ContentStoreError('Completed commission not found.', 404);
  return mapCompleted(rows[0]);
}

export async function deleteItem(collection: ContentCollection, id: string) {
  const table = collection === 'gallery' ? 'gallery_items' : 'completed_commissions';
  await supabaseRest<null>(`${table}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function resetCollection(collection: ContentCollection) {
  if (collection === 'gallery') {
    await supabaseRest<null>('gallery_items?id=not.is.null', { method: 'DELETE' });
    const rows = await supabaseRest<GalleryRow[]>('gallery_items', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(defaultGallery),
    });
    return rows.map(mapGallery);
  }

  await supabaseRest<null>('completed_commissions?id=not.is.null', { method: 'DELETE' });
  const rows = await supabaseRest<CompletedCommissionRow[]>('completed_commissions', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(defaultCompletedCommissions.map(toCompletedRow)),
  });
  return rows.map(mapCompleted);
}

