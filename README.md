# Pistachio Landing Page

Portfolio em Next.js 14 com landing publica, galeria, Comissoes Feitas e painel admin protegido.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Banco recomendado

Use Supabase:

- Supabase Postgres para salvar os metadados da galeria e das comissoes feitas.
- Supabase Storage para salvar os arquivos de imagem.
- O banco fica no servidor, usando `SUPABASE_SERVICE_ROLE_KEY` somente em rotas API do Next.js. Essa chave nunca deve virar `NEXT_PUBLIC_*`.

Esse modelo e melhor que salvar imagem binaria no Postgres: o banco guarda titulo, cliente, categoria, status e URL; o Storage entrega os arquivos com CDN/public URL.

## Configurar Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor e rode o conteudo de `supabase/schema.sql`.
3. Crie `.env.local` a partir de `.env.example`.
4. Preencha:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
SUPABASE_STORAGE_BUCKET=portfolio-art
ADMIN_PASSWORD=uma-senha-forte
ADMIN_SESSION_SECRET=um-segredo-grande-e-aleatorio
```

## Admin

Abra `http://localhost:3000/admin`.

O admin permite:

- adicionar, editar, ativar/desativar e excluir itens da Galeria;
- adicionar, editar, ativar/desativar e excluir Comissoes Feitas;
- enviar imagens do computador para o Supabase Storage;
- resetar Galeria e Comissoes Feitas para os dados padrao.

## Deploy na Vercel

1. Suba o projeto para um repositorio.
2. Importe na Vercel como projeto Next.js.
3. Configure as mesmas variaveis de ambiente do `.env.local`.
4. Rode o deploy normalmente.

Importante: este projeto nao usa `output: 'export'`, porque precisa de rotas API serverless para admin, upload e banco.

## Onde editar

- Galeria padrao: `src/data/gallery.ts`
- Comissoes feitas padrao: `src/data/commissions.ts`
- Precos: `src/data/prices.ts`
- Links: `src/data/links.ts`
- Textos PT/EN: `src/data/translations.ts`
- Configuracoes gerais: `src/data/settings.ts`
- Landing: `src/app/page.tsx`
- Admin: `src/app/admin/page.tsx`
- Camada de banco: `src/lib/content-store.ts`
- Schema do Supabase: `supabase/schema.sql`

