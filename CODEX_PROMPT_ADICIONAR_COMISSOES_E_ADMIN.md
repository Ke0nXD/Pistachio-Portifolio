# Prompt para Codex — adicionar área de Comissões Feitas + Admin sem quebrar funcionalidades

Você vai alterar um projeto Next.js 14 com App Router, TypeScript e Tailwind. Faça mudanças pequenas, seguras e compatíveis com a estrutura atual. Não remova funcionalidades existentes, não reescreva componentes desnecessariamente e não quebre a galeria atual, troca de idioma, música, cursor customizado, stickers de clique, preços, links ou termos.

## Objetivo

Adicionar uma nova seção pública chamada **Comissões Feitas** / **Finished Commissions**, mostrando artes já prontas/entregues para clientes, no mesmo estilo visual da galeria atual.

Também adicionar no painel admin uma área para cadastrar, editar/remover e ativar/desativar imagens de **Comissões Feitas**, seguindo o mesmo formato da área de Galeria.

## Regras de segurança

1. Preserve todos os arquivos, imports e funcionalidades existentes.
2. Antes de alterar, identifique a estrutura real do projeto.
3. Se já existir um admin, apenas acrescente uma nova aba/seção chamada `completed` ou `commissionsDone`, sem apagar as abas atuais.
4. Se não existir backend real, implemente a persistência com `localStorage` de forma compatível com o restante do projeto.
5. Se já existir API/DB no projeto, siga o padrão existente de CRUD, sem criar um padrão paralelo.
6. Não mudar nomes de rotas existentes.
7. Não alterar dados de preços, termos, links, configurações ou traduções sem necessidade.
8. Depois das mudanças, rode `npm run build` e corrija erros de TypeScript/build.

## Implementação esperada

### 1. Criar dados/tipos

Criar um arquivo semelhante a:

`src/data/commissions.ts`

Com:

- tipo `CompletedCommissionCategory`
- interface `CompletedCommission`
- array `defaultCompletedCommissions`

Campos sugeridos:

```ts
export type CompletedCommissionCategory = 'icon' | 'half-body' | 'full-body' | 'reference-sheet' | 'custom';

export interface CompletedCommission {
  id: string;
  title: string;
  clientName: string;
  category: CompletedCommissionCategory;
  src: string;
  description: string;
  completedAt: string;
  active: boolean;
}
```

Adicionar exemplos placeholder, usando URLs ou caminhos locais como `/images/commissions/example.png`.

### 2. Criar pasta pública

Criar:

`public/images/commissions/`

Essa pasta será usada para guardar artes prontas reais.

### 3. Atualizar traduções

Adicionar nas traduções em PT/EN:

- `nav.completed`
- `completed.title`
- `completed.subtitle`
- `completed.doneBadge`
- `completed.clientLabel`
- `admin.tabs.completed`

Textos sugeridos:

PT:

```ts
completed: {
  title: 'Comissões Feitas',
  subtitle: 'Uma vitrine com artes prontas e já entregues para clientes.',
  doneBadge: 'Entregue',
  clientLabel: 'Cliente',
}
```

EN:

```ts
completed: {
  title: 'Finished Commissions',
  subtitle: 'A showcase of completed artwork already delivered to clients.',
  doneBadge: 'Delivered',
  clientLabel: 'Client',
}
```

### 4. Atualizar landing pública

Na página principal, importar:

```ts
import { defaultCompletedCommissions } from '@/data/commissions';
```

Se o projeto já usa `localStorage` para admin, ler as comissões feitas da mesma forma. Caso contrário, usar o array default.

Adicionar link no menu:

```tsx
<a href="#completed">{t.nav.completed}</a>
```

Adicionar seção pública depois da Galeria e antes de Como Funciona:

```tsx
<section id="completed">
  <SectionTitle title={t.completed.title} subtitle={t.completed.subtitle} />
  <div className="grid ...">
    {activeCompletedCommissions.map((item) => (
      <article key={item.id} className="card-cute overflow-hidden">
        <a href={item.src} target="_blank">
          <img src={item.src} alt={item.title} />
        </a>
        <div>
          <span>{t.completed.doneBadge}</span>
          <h3>{item.title}</h3>
          <p>{t.completed.clientLabel}: {item.clientName}</p>
          <p>{item.description}</p>
        </div>
      </article>
    ))}
  </div>
</section>
```

Use as mesmas classes/estilo da Galeria para preservar identidade visual.

### 5. Atualizar admin

No admin, adicionar uma aba chamada **Comissões Feitas** no mesmo estilo da aba Galeria.

A área deve permitir:

- adicionar título
- adicionar nome do cliente
- escolher categoria
- colocar URL/caminho da imagem
- selecionar arquivo do PC, se o admin atual já permitir isso ou se for localStorage
- adicionar descrição curta
- data de conclusão
- marcar como ativo/inativo
- excluir item
- resetar para dados padrão, se o admin já tiver reset

Se o admin usa `localStorage`, salvar em:

```ts
'pistachio-completed-commissions'
```

Se o admin usa banco/API, criar endpoints/ações seguindo o mesmo padrão da Galeria.

### 6. Garantias finais

Depois de implementar:

1. Rodar `npm run build`.
2. Corrigir qualquer erro de TypeScript.
3. Conferir se:
   - Galeria antiga continua funcionando.
   - Nova seção Comissões Feitas aparece na landing.
   - Admin consegue adicionar imagem na Galeria.
   - Admin consegue adicionar imagem em Comissões Feitas.
   - Itens inativos não aparecem na landing.
   - Layout continua responsivo.

Não faça alterações fora do escopo.
