<div align="center">

# 🐾 Pistachio Portfolio

### Portfolio artístico responsivo com galeria, comissões e painel administrativo

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Storage%20%2B%20DB-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-111827?style=for-the-badge&logo=vercel)](https://vercel.com/)

</div>

---

## ✨ Visão geral

**Pistachio Portfolio** é um site artístico em Next.js criado para apresentar trabalhos, preços, comissões feitas e informações de contato de forma visual, responsiva e fácil de administrar.

O projeto combina uma landing pública com uma área admin protegida, permitindo atualizar galeria, comissões, imagens e conteúdos sem precisar mexer diretamente no código. Afinal, um artista precisa criar — não lutar contra arquivos como se fossem pequenos demônios burocráticos.

---

## 🧩 Funcionalidades

### Página pública
- Landing page responsiva
- Galeria de artes
- Área de “Comissões Feitas”
- Seção de preços
- Links e informações de contato
- Suporte a textos em português e inglês

### Painel administrativo
- Login protegido por senha
- Adicionar, editar, ativar/desativar e excluir itens da galeria
- Adicionar, editar, ativar/desativar e excluir comissões feitas
- Upload de imagens para o Supabase Storage
- Reset de galeria e comissões para dados padrão

### Estrutura de dados
- Metadados salvos no Supabase Postgres
- Imagens salvas no Supabase Storage
- URLs públicas/CDN para carregamento das artes
- Chave `SUPABASE_SERVICE_ROLE_KEY` usada somente no servidor

---

## 🛠️ Stack

| Camada | Tecnologias |
|---|---|
| Framework | Next.js 14 |
| Linguagem | TypeScript |
| Interface | React, CSS/Tailwind conforme estrutura do projeto |
| Banco | Supabase Postgres |
| Storage | Supabase Storage |
| Admin | Rotas API serverless do Next.js |
| Deploy | Vercel |

---

## 🚀 Rodar localmente

```bash
npm install
npm run dev
```

Abra:

```txt
http://localhost:3000
```

---

## 🔐 Configurar Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Rode o conteúdo de:

```txt
supabase/schema.sql
```

4. Crie `.env.local` a partir de `.env.example`.
5. Preencha:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
SUPABASE_STORAGE_BUCKET=portfolio-art
ADMIN_PASSWORD=uma-senha-forte
ADMIN_SESSION_SECRET=um-segredo-grande-e-aleatorio
```

> A `SUPABASE_SERVICE_ROLE_KEY` nunca deve virar variável `NEXT_PUBLIC_*`. Ela pertence ao servidor. Expor isso no front-end seria basicamente entregar a chave do cofre e perguntar por que sumiu ouro.

---

## 🖼️ Admin

Acesse:

```txt
http://localhost:3000/admin
```

O admin permite gerenciar:

- Galeria
- Comissões feitas
- Uploads de imagem
- Dados padrão
- Conteúdo visual do portfolio

---

## 🌐 Deploy na Vercel

1. Suba o projeto para um repositório GitHub.
2. Importe na Vercel como projeto Next.js.
3. Configure as variáveis de ambiente do `.env.local`.
4. Rode o deploy normalmente.

Importante:

```txt
Este projeto não usa output: 'export'
```

Ele precisa de rotas API serverless para admin, upload e banco de dados.

---

## 🗂️ Onde editar

```txt
src/data/gallery.ts          -> Galeria padrão
src/data/commissions.ts      -> Comissões feitas padrão
src/data/prices.ts           -> Preços
src/data/links.ts            -> Links
src/data/translations.ts     -> Textos PT/EN
src/data/settings.ts         -> Configurações gerais
src/app/page.tsx             -> Landing pública
src/app/admin/page.tsx       -> Painel admin
src/lib/content-store.ts     -> Camada de banco
supabase/schema.sql          -> Estrutura do Supabase
```

---

## 📄 Licença

Projeto privado/proprietário. Uso, cópia ou distribuição dependem de autorização.

---

<div align="center">

### Um portfolio artístico não deveria apenas mostrar imagens. Deveria criar vontade de encomendar a próxima.

</div>
