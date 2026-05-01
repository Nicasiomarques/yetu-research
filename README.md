# Yetu Budget

Sistema de Gestão de Orçamentos para a Yetu Tech.

## Funcionalidades

- **Autenticação JWT**: Login seguro para admin
- **Gestão de Campanhas**: Criar, editar, duplicar e eliminar campanhas
- **Links Únicos**: Cada campanha gera um link único para o cliente
- **Formulário Multi-step**: 8 etapas de questionário
- **Cálculo Automático**: Orçamento calculado baseado nas respostas
- **Exportação**: Excel e PDF
- **Email**: Integração com MailerSend

## Stack Tecnológico

- **Backend**: Fastify
- **ORM**: Sequelize
- **Banco de Dados**: SQLite
- **Template Engine**: Pug
- **CSS**: TailwindCSS (CDN)
- **Email**: MailerSend SDK
- **Exportação**: XLSX, PDFMake

## Instalação

### 1. Clonar o repositório

```bash
cd api
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie o arquivo `.env`:

```bash
PORT=3000
NODE_ENV=development
JWT_SECRET=sua_chave_secreta_aqui

MAILERSEND_API_KEY=mlsn.c1d578da8c9c5d98528f481c0a7bd77e2fa7903cfb9854d5dba652a696be8b0a
MAILERSEND_FROM=info@test-xkjn41md9y94z781.mlsender.net
MAILERSEND_FROM_NAME=Lombongo Exchange

ADMIN_EMAIL=admin@yetu.tech
ADMIN_PASSWORD=admin123
```

### 4. Iniciar o servidor

Modo desenvolvimento (com auto-reload):
```bash
npm run dev
```

Modo produção:
```bash
npm start
```

### 5. Acessar

- **Admin**: http://localhost:3000/admin/login
  - Email: `admin@yetu.tech`
  - Senha: `admin123`

## Estrutura do Projeto

```
api/
├── src/
│   ├── config/         # Configurações (DB, Mail)
│   ├── models/         # Models Sequelize
│   ├── routes/         # Rotas Fastify
│   ├── services/       # Serviços (Email, Export, Budget)
│   ├── middleware/     # Middleware (Auth)
│   ├── views/          # Templates Pug
│   │   ├── admin/      # Templates admin
│   │   └── public/     # Templates públicos
│   ├── public/         # Arquivos estáticos
│   └── index.js        # Entry point
├── .env                # Variáveis de ambiente
├── package.json        # Dependências
└── database.sqlite     # Banco de dados (gerado automaticamente)
```

## Fluxo de Uso

### 1. Criar Campanha

1. Login no admin
2. Ir em "Campanhas" > "Nova Campanha"
3. Preencher dados do cliente
4. Opcional: adicionar dados pré-preenchidos (JSON)
5. Salvar

### 2. Enviar Link

- **Por Email**: Clique em "Email" na lista de campanhas
- **Manual**: Clique em "Copiar Link" e envie por outro canal

### 3. Cliente Responde

- Cliente acessa o link único
- Preenche o formulário em 8 etapas
- Orçamento é calculado automaticamente
- Dados são salvos no sistema

### 4. Gerenciar Orçamentos

- Lista todos os orçamentos no dashboard
- Filtros e busca disponíveis
- Exportar para Excel ou PDF

## API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Campanhas (requer auth)
- `GET /api/admin/campaigns` - Listar
- `POST /api/admin/campaigns` - Criar
- `PUT /api/admin/campaigns/:id` - Editar
- `DELETE /api/admin/campaigns/:id` - Eliminar
- `POST /api/admin/campaigns/:id/send` - Enviar email
- `GET /api/admin/campaigns/:id/link` - Obter link
- `POST /api/admin/campaigns/:id/duplicate` - Duplicar

### Orçamentos (requer auth)
- `GET /api/admin/budgets` - Listar
- `GET /api/admin/budgets/export/excel` - Exportar Excel
- `GET /api/admin/budgets/:id/export/pdf` - Exportar PDF

### Público
- `GET /c/:token` - Formulário
- `POST /api/c/:token` - Submeter orçamento
- `GET /api/config` - Configuração do formulário

## Dados Pré-preenchidos

Exemplo de JSON para pré-preencher o formulário:

```json
{
  "peak_hours": "afternoon",
  "critical_time": "balanced",
  "downtime_impact": "medium",
  "uptime": "99.5",
  "autonomy": "full",
  "meeting_frequency": "weekly",
  "backup": "daily",
  "communication": "whatsapp",
  "payment_period": "monthly"
}
```

## Segurança

- JWT com HttpOnly cookies
- Passwords hasheadas com BCrypt
- Proteção contra SQL injection (Sequelize)
- Input validation

## Licença

MIT