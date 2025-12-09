require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Verificar credenciais obrigatórias
const requiredEnvVars = ['REALM', 'CLIENT_ID', 'CLIENT_KEY', 'AGENT_ID'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variáveis de ambiente faltando:', missingVars.join(', '));
  console.error('Por favor, configure o arquivo .env na raiz do projeto');
  console.error('Use o .env.example como referência');
  process.exit(1);
}

// Cache do token JWT
let jwtToken = null;
let tokenExpiry = null;

// Função para obter token JWT
async function getJWT() {
  // Se já temos um token válido, retorna
  if (jwtToken && tokenExpiry && Date.now() < tokenExpiry) {
    return jwtToken;
  }

  console.log('🔑 Obtendo novo JWT token...');

  try {
    const authUrl = `https://idm.stackspot.com/${process.env.REALM}/oidc/oauth/token`;
    
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_KEY
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao obter JWT: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    jwtToken = data.access_token;
    // Define expiração 5 minutos antes do tempo real (margem de segurança)
    tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

    console.log('✅ JWT token obtido com sucesso');
    return jwtToken;
  } catch (error) {
    console.error('❌ Erro ao obter JWT:', error.message);
    throw error;
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Servidor StackSpot AI Chat está rodando',
    config: {
      realm: process.env.REALM,
      agentId: process.env.AGENT_ID,
      clientId: process.env.CLIENT_ID
    }
  });
});

// Enviar mensagem para o agente
app.post('/api/chat', async (req, res) => {
  try {
    const jwt = await getJWT();
    const { message, conversationId, streaming = false } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    const chatUrl = `https://genai-inference-app.stackspot.com/v1/agent/${process.env.AGENT_ID}/chat`;
    
    const payload = {
      streaming: streaming,
      user_prompt: message,
      stackspot_knowledge: true,
      return_ks_in_response: true,
      use_conversation: true
    };

    // Se já existe um conversation_id, adiciona ao payload
    if (conversationId) {
      payload.conversation_id = conversationId;
      console.log('💬 Continuando conversa:', conversationId);
    } else {
      console.log('💬 Iniciando nova conversa...');
    }

    const response = await fetch(chatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API do agente: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Resposta recebida do agente');
    console.log('📦 Dados completos:', JSON.stringify(data, null, 2));

    // Extrair a resposta correta - StackSpot usa o campo "message"
    const answer = data.message || data.answer || data.response || data.result || 'Resposta recebida';
    
    console.log('💬 Resposta extraída:', answer);

    res.json({
      answer: answer,
      conversationId: data.conversation_id || data.conversationId,
      knowledgeSources: data.source || data.knowledge_sources || [],
      messageId: data.message_id,
      tokens: data.tokens
    });

  } catch (error) {
    console.error('❌ Erro no chat:', error.message);
    res.status(500).json({ 
      error: error.message,
      details: 'Erro ao comunicar com o agente StackSpot'
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ════════════════════════════════════════════════');
  console.log('🚀 Servidor StackSpot AI Chat Backend');
  console.log('🚀 ════════════════════════════════════════════════');
  console.log(`📡 Servidor rodando em: http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Configuração:');
  console.log(`   🌍 Realm: ${process.env.REALM}`);
  console.log(`   🤖 Agent ID: ${process.env.AGENT_ID}`);
  console.log(`   🔑 Client ID: ${process.env.CLIENT_ID}`);
  console.log('');
  console.log('🔌 Endpoints disponíveis:');
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   POST http://localhost:${PORT}/api/chat`);
  console.log('');
  console.log('✅ Servidor pronto para receber requisições!');
  console.log('════════════════════════════════════════════════');
  console.log('');
});