# NodeForm - Visual Survey Builder

Um sistema visual de criação de pesquisas estilo Miro, onde você pode criar, conectar e publicar pesquisas interativas com fluxo condicional.

## Features do MVP

- **Editor Visual** com canvas infinito estilo Miro
- **2 Tipos de Perguntas**:
  - Múltipla Escolha (com pontuação por opção)
  - Avaliação por Estrelas (rating 1-5)
- **Fluxo Condicional** - Conecte respostas a diferentes perguntas
- **Modo Runtime** - Execute e responda pesquisas
- **Sistema de Pontuação** - Calcule scores baseados nas respostas
- **Tela de Resultados** - Visualize pontuação final e estatísticas
- **Persistência Local** - Salva automaticamente no LocalStorage

## Stack Tecnológica

- **Next.js 15** - App Router + Turbopack
- **React 19** - Framework UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **ShadCN/UI** - Componentes UI
- **React Flow** - Editor visual de fluxo
- **Zustand** - Gerenciamento de estado com persistência

## Estrutura do Projeto

```
nodeform/
├── app/                    # Next.js App Router
│   ├── editor/            # Editor visual de pesquisas
│   └── survey/            # Modo de responder pesquisas
├── components/
│   ├── ui/                # Componentes ShadCN/UI
│   ├── editor/            # Componentes do editor
│   └── survey/            # Componentes de pesquisa
├── lib/
│   ├── stores/            # Zustand stores
│   └── utils.ts           # Utilitários
├── types/                 # Definições TypeScript
├── hooks/                 # React hooks customizados
└── public/                # Arquivos estáticos
```

## Como Usar

### 1. Instalação

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`

### 2. Criar uma Pesquisa

1. Clique em **"Abrir Editor Visual"** na home
2. Na sidebar, clique nos botões para adicionar perguntas:
   - **Múltipla Escolha** - Pergunta com opções
   - **Avaliação** - Rating com estrelas
3. Arraste os nós pelo canvas para organizar
4. **Dê duplo clique** em um nó para editar:
   - Altere título e descrição
   - Adicione/remova opções
   - Defina pontuações

### 3. Criar Fluxo Condicional

1. Conecte as opções de uma pergunta à próxima:
   - Em perguntas de múltipla escolha, cada opção tem um ponto de conexão
   - Arraste do ponto de saída (direita) até outra pergunta
2. Crie ramificações diferentes baseadas nas respostas

### 4. Testar a Pesquisa

1. Clique em **"Testar Pesquisa"** no header
2. Responda as perguntas seguindo o fluxo
3. Veja o resultado final com sua pontuação

### 5. Persistência

- Suas pesquisas são salvas automaticamente no LocalStorage
- Reabra o navegador e suas pesquisas estarão lá

## Estrutura de Rotas

- `/` - Home com introdução
- `/editor` - Editor visual de pesquisas
- `/survey` - Modo runtime (responder pesquisa)
- `/survey/result` - Tela de resultados

## Status do Projeto

### MVP Completo ✅

- [x] **Fase 1**: Fundamentação do Projeto
- [x] **Fase 2**: Modelagem do Domínio
- [x] **Fase 3**: Canvas Visual (Core)
- [x] **Fase 4**: Nós de Pesquisa (Custom Nodes)
- [x] **Fase 5**: Conexões e Lógica
- [x] **Fase 6**: Criação de Elementos (Sidebar)
- [x] **Fase 7**: Edição Inline
- [x] **Fase 8**: Persistência (LocalStorage)
- [x] **Fase 9**: Modo Responder (Runtime)
- [x] **Fase 10**: Resultados Básicos

### Próximas Features (Pós-MVP)

- [ ] Upload de imagens nas perguntas
- [ ] Mais tipos de perguntas (texto livre, data, etc.)
- [ ] Autenticação de usuários
- [ ] Banco de dados (Firebase/PostgreSQL)
- [ ] Analytics e métricas avançadas
- [ ] Publicação e embed de pesquisas
- [ ] Temas customizáveis
- [ ] Exportar resultados (CSV, PDF)
- [ ] Multi-idioma

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm start

# Lint
npm run lint
```

## Tecnologias

Este projeto usa as versões mais recentes de:
- Next.js 15.5.9
- React 19.0.0
- TypeScript 5
- Tailwind CSS 3.4
- React Flow 12.3.2
- Zustand 5.0.2

## Licença

MIT
