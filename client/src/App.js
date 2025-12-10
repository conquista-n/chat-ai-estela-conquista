import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto scroll para a última mensagem apenas quando há nova mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Só faz auto-scroll quando adiciona nova mensagem, não o tempo todo
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]); // Mudou de [messages] para [messages.length]

  // Verificar se o backend está online ao carregar
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || ''}/api/health`);
      console.log('✅ Backend conectado:', response.data);
    } catch (error) {
      console.error('❌ Backend offline:', error);
      setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    }
  };

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    // Adiciona mensagem do usuário
    const userMsg = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || ''}/api/chat`, {
        message: userMessage,
        conversationId: conversationId
      });

      // Salva o conversation_id para continuar a conversa
      if (response.data.conversationId) {
        setConversationId(response.data.conversationId);
      }

      // Adiciona resposta do assistente
      const assistantMsg = {
        id: Date.now() + 1,
        text: response.data.answer,
        sender: 'assistant',
        timestamp: new Date(),
        knowledgeSources: response.data.knowledgeSources
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setError(error.response?.data?.error || 'Erro ao enviar mensagem. Tente novamente.');
      
      // Adiciona mensagem de erro
      const errorMsg = {
        id: Date.now() + 1,
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        sender: 'assistant',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  };

  return (
    <div className="App">
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <Card className="chat-card shadow-lg">
              <ChatHeader onClearChat={clearChat} />
              
              <Card.Body className="chat-body p-0">
                <ChatMessages 
                  messages={messages} 
                  isLoading={isLoading}
                  messagesEndRef={messagesEndRef}
                />
              </Card.Body>

              <Card.Footer className="chat-footer p-3">
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                    {error}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setError(null)}
                      aria-label="Close"
                    ></button>
                  </div>
                )}
                <ChatInput 
                  onSendMessage={sendMessage} 
                  disabled={isLoading}
                />
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;