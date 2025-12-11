# TaskFlow Frontend

Frontend do sistema TaskFlow para organização de demandas internas, desenvolvido com React, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento
- **Zustand** - Gerenciamento de estado
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos e visualizações
- **Radix UI** - Componentes acessíveis (via Shadcn/ui)

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/            # Componentes base de UI
│   └── PermissionWrapper.tsx
├── constants/          # Constantes e configurações
├── hooks/              # Custom hooks
│   ├── api/           # Hooks de recursos da API
│   ├── usePermissions.ts
│   └── useValidation.ts
├── interfaces/         # Interfaces TypeScript
├── layouts/            # Layouts da aplicação
├── lib/               # Utilitários e configurações
├── pages/              # Páginas da aplicação
│   ├── auth/
│   ├── dashboard/
│   ├── kanban/
│   ├── metrics/
│   ├── tasks/
│   └── users/
├── router/             # Configuração de rotas
│   └── guards/        # Guards de autenticação e permissões
├── stores/             # Stores do Zustand
└── App.tsx
```

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Code** e **SOLID**:

- **Separação de Responsabilidades**: Cada módulo tem uma responsabilidade específica
- **Hooks Customizados**: Lógica reutilizável encapsulada em hooks
- **Stores Centralizados**: Estado global gerenciado com Zustand
- **Sistema de Permissões**: Controle de acesso baseado em roles e permissões
- **Type Safety**: TypeScript em todo o projeto para maior segurança

## 🔐 Autenticação e Permissões

O sistema possui dois tipos de usuários:
- **Administrador**: Acesso completo ao sistema
- **Funcionário**: Acesso limitado às suas tarefas

As permissões são gerenciadas através do hook `usePermissions` e do componente `PermissionWrapper`.

## 🚦 Rotas

- `/auth/login` - Tela de login
- `/dashboard` - Dashboard principal
- `/kanban` - Visualização Kanban das tarefas
- `/tasks/new` - Criar nova tarefa
- `/tasks/:id/edit` - Editar tarefa
- `/users/new` - Cadastrar funcionário
- `/metrics` - Dashboard de métricas

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URI=http://localhost:3001
```

## 🎨 Componentes UI

Os componentes base seguem o padrão do Shadcn/ui, utilizando Radix UI e Tailwind CSS para criar uma interface moderna e acessível.

## 📝 Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter
- `npm run format` - Formata o código com Prettier

## 🔄 Integração com Backend

O frontend espera que o backend esteja rodando na porta 3001 (ou conforme configurado no `.env`). As rotas da API seguem o padrão REST:

- `GET /auth/me` - Obter dados do usuário logado
- `POST /auth/login` - Login
- `GET /tasks` - Listar tarefas
- `POST /tasks` - Criar tarefa
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Excluir tarefa
- `GET /users` - Listar usuários
- `POST /users` - Criar usuário

## 📄 Licença

Este projeto é privado e de uso interno.

