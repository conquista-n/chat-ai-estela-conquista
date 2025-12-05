# StackSpot AI Chat

Interface de chat web para interagir com agentes da StackSpot AI, construída com React e Node.js.

## 🚀 Tecnologias

### Backend
- Node.js
- Express
- dotenv (gerenciamento de variáveis de ambiente)
- node-fetch (requisições HTTP)
- CORS

### Frontend
- React 18
- React Bootstrap
- Bootstrap 5
- Axios

## 📁 Estrutura do Projeto

```
stackspot-chat/
├── server/                 # Backend Node.js
│   ├── server.js          # Servidor principal
│   └── package.json       # Dependências do backend
├── client/                 # Frontend React
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatHeader.js
│   │   │   ├── ChatHeader.css
│   │   │   ├── ChatMessages.js
│   │   │   ├── ChatMessages.css
│   │   │   ├── ChatInput.js
│   │   │   └── ChatInput.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json       # Dependências do frontend
├── .env                   # Suas credenciais (NÃO commitar)
├── .env.example           # Template de configuração
└── README.md
```

## ⚙️ Configuração

### 1. Clonar/Criar o Projeto

Crie a estrutura de pastas conforme mostrado acima.

### 2. Configurar Credenciais

Copie o arquivo `.env.example` para `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e preencha com suas credenciais da StackSpot:

```env
REALM=seu_realm_aqui
CLIENT_ID=seu_client_id_aqui
CLIENT_KEY=sua_client_key_aqui
AGENT_ID=01K8JQV38KN6Q0ED7YM2Q1Y5Z8
PORT=5000
```

**Onde encontrar essas informações:**
- `REALM`: Seu realm na StackSpot
- `CLIENT_ID` e `CLIENT_KEY`: Credenciais de autenticação da sua aplicação
- `AGENT_ID`: ID do seu agente (encontrado na URL da API do agente)

### 3. Instalar Dependências

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

## 🏃 Executar o Projeto

Você precisa rodar **dois servidores** em terminais separados:

### Terminal 1 - Backend (porta 5000)
```bash
cd server
npm run dev
```

Você verá:
```
🚀 ════════════════════════════════════════════════
🚀 Servidor StackSpot AI Chat Backend
🚀 ════════════════════════════════════════════════
📡 Servidor rodando em: http://localhost:5000
...
```

### Terminal 2 - Frontend (porta 3000)
```bash
cd client
npm start
```

O navegador abrirá automaticamente em `http://localhost:3000`

## 🎯 Como Usar

1. Acesse `http://localhost:3000` no navegador
2. Digite sua mensagem no campo de texto
3. Pressione **Enter** ou clique em **Enviar**
4. Aguarde a resposta do agente StackSpot
5. Continue a conversa - o contexto é mantido automaticamente

**Atalhos:**
- `Enter`: Envia a mensagem
- `Shift + Enter`: Nova linha (não envia)
- Botão **Limpar Chat**: Reseta a conversa

## 📡 API Endpoints

### Backend (http://localhost:5000)

#### GET /api/health
Verifica se o servidor está funcionando.

**Resposta:**
```json
{
  "status": "ok",
  "message": "Servidor StackSpot AI Chat está rodando",
  "config": {
    "realm": "seu_realm",
    "agentId": "01K8JQV38KN6Q0ED7YM2Q1Y5Z8",
    "clientId": "seu_client_id"
  }
}
```

#### POST /api/chat
Envia mensagem para o agente.

**Request:**
```json
{
  "message": "Olá, como você pode me ajudar?",
  "conversationId": "01KBCYJA0Y6HG67KB01EP0C9K8" // opcional
}
```

**Response:**
```json
{
  "answer": "Resposta do agente...",
  "conversationId": "01KBCYJA0Y6HG67KB01EP0C9K8",
  "knowledgeSources": []
}
```

## 🎨 Paleta de Cores

O projeto usa uma paleta de cores customizada:

- **Primary Dark**: `#0c1c2b` (azul escuro principal)
- **Primary Green**: `#54ad34` (verde principal)
- **Secondary Dark**: `#0c242b` (azul escuro secundário)
- **Accent Green**: `#4caf34` (verde de destaque)
- **Deep Dark**: `#041c27` (azul muito escuro)

## 🚢 Deploy

### Backend

Você pode fazer deploy do backend em serviços como:
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean**

**Passos básicos:**
1. Configure as variáveis de ambiente no serviço escolhido
2. Faça deploy da pasta `server/`
3. Anote a URL do backend (ex: `https://seu-app.herokuapp.com`)

### Frontend

Você pode fazer deploy do frontend em:
- **Vercel**
- **Netlify**
- **GitHub Pages**

**Passos básicos:**
1. No `client/package.json`, atualize o proxy para a URL do backend em produção
2. Crie um arquivo `client/.env.production`:
   ```
   REACT_APP_API_URL=https://seu-backend.herokuapp.com
   ```
3. Atualize o código para usar `process.env.REACT_APP_API_URL` ao invés de `/api`
4. Build: `npm run build`
5. Faça deploy da pasta `build/`

## 🔒 Segurança

- **NUNCA** commite o arquivo `.env` 
- Adicione `.env` ao `.gitignore`
- As credenciais ficam apenas no backend
- O frontend nunca acessa diretamente as credenciais da StackSpot

## 🐛 Troubleshooting

### Backend não inicia
- Verifique se o arquivo `.env` está na raiz do projeto
- Verifique se todas as variáveis obrigatórias estão preenchidas
- Confira se a porta 5000 não está em uso

### Frontend não conecta ao backend
- Verifique se o backend está rodando na porta 5000
- Verifique o proxy no `client/package.json`
- Abra o console do navegador para ver erros

### Erro de autenticação
- Verifique se `CLIENT_ID` e `CLIENT_KEY` estão corretos
- Verifique se o `REALM` está correto
- Teste o endpoint `/api/health` para ver a configuração

### Mensagens não aparecem
- Abra o console do navegador (F12)
- Verifique o terminal do backend para logs
- Teste o endpoint `/api/chat` com Postman/Insomnia

## 📝 Licença

MIT

## 👨‍💻 Autor

Desenvolvido para integração com StackSpot AI