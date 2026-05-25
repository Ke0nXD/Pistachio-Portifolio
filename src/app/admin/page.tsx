'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, ImagePlus, LogOut, Pencil, Power, RotateCcw, Save, Trash2, Upload, XCircle } from 'lucide-react';
import { defaultGallery, type GalleryCategory, type GalleryItem } from '@/data/gallery';
import { defaultCompletedCommissions, type CompletedCommission, type CompletedCommissionCategory } from '@/data/commissions';

type AdminTab = 'gallery' | 'completed';

type SessionState = {
  loading: boolean;
  authenticated: boolean;
  configured: boolean;
  missing: string[];
};

type GalleryForm = Omit<GalleryItem, 'id'>;
type CompletedForm = Omit<CompletedCommission, 'id'>;

const galleryCategories: GalleryCategory[] = ['icons', 'half-body', 'full-body', 'reference-sheet', 'sketches'];
const completedCategories: CompletedCommissionCategory[] = ['icon', 'half-body', 'full-body', 'reference-sheet', 'custom'];

const emptyGalleryForm: GalleryForm = {
  title: '',
  category: 'icons',
  src: '',
  featured: false,
  active: true,
};

function createEmptyCompletedForm(): CompletedForm {
  return {
    title: '',
    clientName: '',
    category: 'icon',
    src: '',
    description: '',
    completedAt: new Date().toISOString().slice(0, 10),
    active: true,
  };
}

async function requestJson<T>(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (options.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store',
  });
  const data = (await response.json().catch(() => ({}))) as { error?: string; details?: string };

  if (!response.ok) {
    throw new Error(data.details ? `${data.error || 'Erro'}: ${data.details}` : data.error || 'Erro ao salvar dados.');
  }

  return data as T;
}

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('gallery');
  const [session, setSession] = useState<SessionState>({ loading: true, authenticated: false, configured: true, missing: [] });
  const [password, setPassword] = useState('');
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery);
  const [completed, setCompleted] = useState<CompletedCommission[]>(defaultCompletedCommissions);
  const [galleryForm, setGalleryForm] = useState<GalleryForm>(emptyGalleryForm);
  const [completedForm, setCompletedForm] = useState<CompletedForm>(createEmptyCompletedForm);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [editingCompletedId, setEditingCompletedId] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const loadContent = async () => {
    const content = await requestJson<{ gallery: GalleryItem[]; completed: CompletedCommission[] }>('/api/admin/items');
    setGallery(content.gallery);
    setCompleted(content.completed);
  };

  useEffect(() => {
    requestJson<Omit<SessionState, 'loading'>>('/api/admin/session')
      .then((data) => {
        setSession({ ...data, loading: false });
        if (data.authenticated) return loadContent();
        return null;
      })
      .catch((err) => {
        setSession({ loading: false, authenticated: false, configured: false, missing: [] });
        setError(err instanceof Error ? err.message : 'Erro ao verificar sessao.');
      });
  }, []);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setStatus('');

    try {
      const data = await requestJson<Omit<SessionState, 'loading'>>('/api/admin/session', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      setSession({ ...data, loading: false });
      setPassword('');
      await loadContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Senha invalida.');
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await requestJson('/api/admin/session', { method: 'DELETE' });
    setSession((current) => ({ ...current, authenticated: false }));
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>, folder: 'gallery' | 'commissions', onUploaded: (src: string) => void) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError('');
    setStatus('Enviando imagem...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      const data = await requestJson<{ url: string }>('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      onUploaded(data.url);
      setStatus('Upload concluido. Agora salve o item.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no upload.');
      setStatus('');
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  };

  const saveGalleryItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setStatus('');

    try {
      if (editingGalleryId) {
        const data = await requestJson<{ item: GalleryItem }>(`/api/admin/items/gallery/${editingGalleryId}`, {
          method: 'PATCH',
          body: JSON.stringify(galleryForm),
        });
        setGallery((items) => items.map((item) => (item.id === data.item.id ? data.item : item)));
        setStatus('Galeria atualizada.');
      } else {
        const data = await requestJson<{ item: GalleryItem }>('/api/admin/items', {
          method: 'POST',
          body: JSON.stringify({ collection: 'gallery', item: galleryForm }),
        });
        setGallery((items) => [data.item, ...items]);
        setStatus('Arte adicionada na galeria.');
      }

      setGalleryForm(emptyGalleryForm);
      setEditingGalleryId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar galeria.');
    } finally {
      setBusy(false);
    }
  };

  const saveCompletedItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setStatus('');

    try {
      if (editingCompletedId) {
        const data = await requestJson<{ item: CompletedCommission }>(`/api/admin/items/completed/${editingCompletedId}`, {
          method: 'PATCH',
          body: JSON.stringify(completedForm),
        });
        setCompleted((items) => items.map((item) => (item.id === data.item.id ? data.item : item)));
        setStatus('Comissao feita atualizada.');
      } else {
        const data = await requestJson<{ item: CompletedCommission }>('/api/admin/items', {
          method: 'POST',
          body: JSON.stringify({ collection: 'completed', item: completedForm }),
        });
        setCompleted((items) => [data.item, ...items]);
        setStatus('Comissao feita adicionada.');
      }

      setCompletedForm(createEmptyCompletedForm());
      setEditingCompletedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar comissao.');
    } finally {
      setBusy(false);
    }
  };

  const patchGalleryItem = async (id: string, patch: Partial<GalleryForm>) => {
    const data = await requestJson<{ item: GalleryItem }>(`/api/admin/items/gallery/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    setGallery((items) => items.map((item) => (item.id === id ? data.item : item)));
  };

  const patchCompletedItem = async (id: string, patch: Partial<CompletedForm>) => {
    const data = await requestJson<{ item: CompletedCommission }>(`/api/admin/items/completed/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    setCompleted((items) => items.map((item) => (item.id === id ? data.item : item)));
  };

  const deleteGalleryItem = async (id: string) => {
    if (!window.confirm('Excluir esta arte da galeria?')) return;
    await requestJson(`/api/admin/items/gallery/${id}`, { method: 'DELETE' });
    setGallery((items) => items.filter((item) => item.id !== id));
  };

  const deleteCompletedItem = async (id: string) => {
    if (!window.confirm('Excluir esta comissao feita?')) return;
    await requestJson(`/api/admin/items/completed/${id}`, { method: 'DELETE' });
    setCompleted((items) => items.filter((item) => item.id !== id));
  };

  const resetCollection = async (collection: AdminTab) => {
    if (!window.confirm('Resetar esta lista para os dados padrao?')) return;
    const data = await requestJson<{ items: GalleryItem[] | CompletedCommission[] }>(`/api/admin/items/${collection}/reset`, { method: 'POST' });

    if (collection === 'gallery') {
      setGallery(data.items as GalleryItem[]);
      setGalleryForm(emptyGalleryForm);
      setEditingGalleryId(null);
    } else {
      setCompleted(data.items as CompletedCommission[]);
      setCompletedForm(createEmptyCompletedForm());
      setEditingCompletedId(null);
    }
  };

  if (session.loading) {
    return <AdminShell><StatusCard title="Carregando admin" text="Verificando sessao segura..." /></AdminShell>;
  }

  if (!session.configured) {
    return (
      <AdminShell>
        <StatusCard
          title="Admin ainda nao configurado"
          text={`Defina as variaveis ${session.missing.join(', ') || 'ADMIN_PASSWORD e ADMIN_SESSION_SECRET'} no Vercel e no .env.local.`}
        />
      </AdminShell>
    );
  }

  if (!session.authenticated) {
    return (
      <AdminShell>
        <form onSubmit={login} className="mx-auto max-w-md rounded-[2rem] bg-white p-6 shadow-cute-lg">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-pistachio-purple">Acesso seguro</p>
          <h1 className="mt-2 font-display text-4xl">Entrar no Admin</h1>
          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-black text-ink/70">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <Alert tone="error" message={error} />}
          <button type="submit" disabled={busy} className="mt-5 inline-flex items-center gap-2 rounded-full bg-pistachio-purple px-6 py-3 font-black text-white shadow-cute-lg disabled:opacity-60">
            <Power size={18} /> {busy ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <section className="rounded-[2rem] bg-white p-6 shadow-cute-lg">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-pistachio-purple">Painel com banco real</p>
            <h1 className="font-display text-4xl md:text-5xl">Admin de Artes</h1>
            <p className="mt-2 max-w-2xl font-bold text-ink/65">
              Galeria e comissoes feitas sao salvas no Supabase Postgres. Uploads vao para o Supabase Storage.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setTab('gallery')} className={tab === 'gallery' ? activeTabClass : tabClass}>Galeria</button>
            <button type="button" onClick={() => setTab('completed')} className={tab === 'completed' ? activeTabClass : tabClass}>Comissoes feitas</button>
            <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-black text-white shadow-cute">
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>
      </section>

      {status && <Alert tone="success" message={status} />}
      {error && <Alert tone="error" message={error} />}

      {tab === 'gallery' ? (
        <AdminPanel
          title={editingGalleryId ? 'Editar arte da Galeria' : 'Adicionar arte na Galeria'}
          onSubmit={saveGalleryItem}
          onReset={() => resetCollection('gallery')}
          resetLabel="Resetar galeria"
          editing={Boolean(editingGalleryId)}
          onCancelEdit={() => {
            setEditingGalleryId(null);
            setGalleryForm(emptyGalleryForm);
          }}
        >
          <TextInput label="Titulo" value={galleryForm.title} onChange={(value) => setGalleryForm((form) => ({ ...form, title: value }))} />
          <SelectInput label="Categoria" value={galleryForm.category} options={galleryCategories} onChange={(value) => setGalleryForm((form) => ({ ...form, category: value as GalleryCategory }))} />
          <TextInput label="URL/caminho da imagem" value={galleryForm.src} placeholder="/images/gallery/minha-arte.png ou URL https" onChange={(value) => setGalleryForm((form) => ({ ...form, src: value }))} />
          <FileInput label="Enviar imagem para Storage" onChange={(event) => uploadImage(event, 'gallery', (src) => setGalleryForm((form) => ({ ...form, src })))} />
          <CheckboxInput label="Destaque" checked={galleryForm.featured} onChange={(checked) => setGalleryForm((form) => ({ ...form, featured: checked }))} />
          <CheckboxInput label="Ativo na landing" checked={galleryForm.active} onChange={(checked) => setGalleryForm((form) => ({ ...form, active: checked }))} />
        </AdminPanel>
      ) : (
        <AdminPanel
          title={editingCompletedId ? 'Editar Comissao Feita' : 'Adicionar Comissao Feita'}
          onSubmit={saveCompletedItem}
          onReset={() => resetCollection('completed')}
          resetLabel="Resetar comissoes"
          editing={Boolean(editingCompletedId)}
          onCancelEdit={() => {
            setEditingCompletedId(null);
            setCompletedForm(createEmptyCompletedForm());
          }}
        >
          <TextInput label="Titulo" value={completedForm.title} onChange={(value) => setCompletedForm((form) => ({ ...form, title: value }))} />
          <TextInput label="Cliente" value={completedForm.clientName} onChange={(value) => setCompletedForm((form) => ({ ...form, clientName: value }))} />
          <SelectInput label="Categoria" value={completedForm.category} options={completedCategories} onChange={(value) => setCompletedForm((form) => ({ ...form, category: value as CompletedCommissionCategory }))} />
          <TextInput label="URL/caminho da imagem" value={completedForm.src} placeholder="/images/commissions/arte-pronta.png ou URL https" onChange={(value) => setCompletedForm((form) => ({ ...form, src: value }))} />
          <FileInput label="Enviar imagem para Storage" onChange={(event) => uploadImage(event, 'commissions', (src) => setCompletedForm((form) => ({ ...form, src })))} />
          <TextInput label="Descricao curta" value={completedForm.description} onChange={(value) => setCompletedForm((form) => ({ ...form, description: value }))} />
          <TextInput label="Data" value={completedForm.completedAt} onChange={(value) => setCompletedForm((form) => ({ ...form, completedAt: value }))} />
          <CheckboxInput label="Ativo na landing" checked={completedForm.active} onChange={(checked) => setCompletedForm((form) => ({ ...form, active: checked }))} />
        </AdminPanel>
      )}

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <GalleryList
          items={gallery}
          onEdit={(item) => {
            setTab('gallery');
            setEditingGalleryId(item.id);
            setGalleryForm({ title: item.title, category: item.category, src: item.src, featured: item.featured, active: item.active });
          }}
          onDelete={deleteGalleryItem}
          onToggleActive={(item) => patchGalleryItem(item.id, { active: !item.active })}
          onToggleFeatured={(item) => patchGalleryItem(item.id, { featured: !item.featured })}
        />
        <CompletedList
          items={completed}
          onEdit={(item) => {
            setTab('completed');
            setEditingCompletedId(item.id);
            setCompletedForm({
              title: item.title,
              clientName: item.clientName,
              category: item.category,
              src: item.src,
              description: item.description,
              completedAt: item.completedAt,
              active: item.active,
            });
          }}
          onDelete={deleteCompletedItem}
          onToggleActive={(item) => patchCompletedItem(item.id, { active: !item.active })}
        />
      </section>

      {busy && <p className="mt-5 text-center text-sm font-black text-pistachio-purple">Processando...</p>}
    </AdminShell>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-pistachio-cream px-5 py-8 text-ink">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black shadow-cute">
          <ArrowLeft size={16} /> Voltar para a landing
        </a>
        {children}
      </div>
    </main>
  );
}

function StatusCard({ title, text }: { title: string; text: string }) {
  return (
    <section className="mx-auto max-w-xl rounded-[2rem] bg-white p-6 text-center shadow-cute-lg">
      <h1 className="font-display text-4xl">{title}</h1>
      <p className="mt-3 font-bold text-ink/65">{text}</p>
    </section>
  );
}

function Alert({ tone, message }: { tone: 'success' | 'error'; message: string }) {
  const Icon = tone === 'success' ? CheckCircle2 : XCircle;
  const classes = tone === 'success' ? 'bg-pistachio-green text-ink' : 'bg-pistachio-pink text-ink';

  return (
    <div className={`mt-5 flex items-start gap-2 rounded-3xl px-4 py-3 text-sm font-black shadow-cute ${classes}`}>
      <Icon size={18} />
      <p>{message}</p>
    </div>
  );
}

function AdminPanel({
  title,
  children,
  onSubmit,
  onReset,
  resetLabel,
  editing,
  onCancelEdit,
}: {
  title: string;
  children: React.ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  resetLabel: string;
  editing: boolean;
  onCancelEdit: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-8 rounded-[2rem] bg-white p-6 shadow-cute">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="font-display text-3xl">{title}</h2>
        <div className="flex flex-wrap gap-2">
          {editing && (
            <button type="button" onClick={onCancelEdit} className="inline-flex items-center gap-2 rounded-full bg-pistachio-cream px-4 py-2 text-sm font-black shadow-cute">
              <XCircle size={16} /> Cancelar edicao
            </button>
          )}
          <button type="button" onClick={onReset} className="inline-flex items-center gap-2 rounded-full bg-pistachio-cream px-4 py-2 text-sm font-black shadow-cute">
            <RotateCcw size={16} /> {resetLabel}
          </button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
      <button type="submit" className="mt-5 inline-flex items-center gap-2 rounded-full bg-pistachio-purple px-6 py-3 font-black text-white shadow-cute-lg">
        {editing ? <Save size={18} /> : <ImagePlus size={18} />} {editing ? 'Salvar alteracoes' : 'Adicionar'}
      </button>
    </form>
  );
}

function TextInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-ink/70">{label}</span>
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={inputClass} />
    </label>
  );
}

function SelectInput({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-ink/70">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function FileInput({ label, onChange }: { label: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-black text-ink/70"><Upload size={16} /> {label}</span>
      <input type="file" accept="image/*" onChange={onChange} className={inputClass} />
    </label>
  );
}

function CheckboxInput({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-3xl bg-pistachio-cream px-4 py-3 font-black">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function GalleryList({
  items,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
}: {
  items: GalleryItem[];
  onEdit: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
  onToggleActive: (item: GalleryItem) => void;
  onToggleFeatured: (item: GalleryItem) => void;
}) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-cute">
      <h2 className="font-display text-3xl">Galeria <span className="text-pistachio-purple">({items.length})</span></h2>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="grid gap-3 rounded-3xl bg-pistachio-cream p-3 sm:grid-cols-[4rem_1fr_auto] sm:items-center">
            <img src={item.src} alt={item.title} className="h-16 w-16 rounded-2xl object-cover" />
            <div className="min-w-0">
              <p className="truncate font-black">{item.title}</p>
              <p className="text-xs font-bold text-ink/55">{item.category} / {item.featured ? 'Destaque' : 'Normal'} / {item.active ? 'Ativo' : 'Oculto'}</p>
            </div>
            <ItemActions
              active={item.active}
              onToggleActive={() => onToggleActive(item)}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id)}
              extra={<button type="button" onClick={() => onToggleFeatured(item)} className="rounded-full bg-white px-3 py-2 text-xs font-black shadow-cute">{item.featured ? 'Normal' : 'Destaque'}</button>}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function CompletedList({
  items,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  items: CompletedCommission[];
  onEdit: (item: CompletedCommission) => void;
  onDelete: (id: string) => void;
  onToggleActive: (item: CompletedCommission) => void;
}) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-cute">
      <h2 className="font-display text-3xl">Comissoes feitas <span className="text-pistachio-purple">({items.length})</span></h2>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="grid gap-3 rounded-3xl bg-pistachio-cream p-3 sm:grid-cols-[4rem_1fr_auto] sm:items-center">
            <img src={item.src} alt={item.title} className="h-16 w-16 rounded-2xl object-cover" />
            <div className="min-w-0">
              <p className="truncate font-black">{item.title}</p>
              <p className="text-xs font-bold text-ink/55">{item.clientName} / {item.category} / {item.active ? 'Ativo' : 'Oculto'}</p>
            </div>
            <ItemActions
              active={item.active}
              onToggleActive={() => onToggleActive(item)}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ItemActions({
  active,
  onToggleActive,
  onEdit,
  onDelete,
  extra,
}: {
  active: boolean;
  onToggleActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-2 sm:justify-end">
      {extra}
      <button type="button" onClick={onToggleActive} className="rounded-full bg-white px-3 py-2 text-xs font-black shadow-cute">{active ? 'Ocultar' : 'Ativar'}</button>
      <button type="button" onClick={onEdit} className="rounded-full bg-white p-3 text-pistachio-purple shadow-cute" aria-label="Editar">
        <Pencil size={18} />
      </button>
      <button type="button" onClick={onDelete} className="rounded-full bg-white p-3 text-pistachio-purple shadow-cute" aria-label="Excluir">
        <Trash2 size={18} />
      </button>
    </div>
  );
}

const inputClass = 'w-full rounded-3xl border-2 border-pistachio-purple/10 bg-pistachio-cream px-4 py-3 font-bold outline-none transition focus:border-pistachio-purple';
const tabClass = 'rounded-full bg-pistachio-cream px-4 py-2 text-sm font-black shadow-cute';
const activeTabClass = 'rounded-full bg-pistachio-purple px-4 py-2 text-sm font-black text-white shadow-cute';

