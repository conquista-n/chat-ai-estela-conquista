import React from 'react';
import { Spinner } from 'react-bootstrap';
import './ChatMessages.css';

function ChatMessages({ messages, isLoading, messagesEndRef }) {
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-messages-container">
      {messages.length === 0 ? (
        <div className="welcome-message">
          <div className="welcome-icon">👋</div>
          <h5>Bem-vindo ao Chat de assistencia da Conquista!</h5>
          <p>Faça uma pergunta para começar a conversa com a Estela.</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message-wrapper ${message.sender}`}
            >
              <div className={`message-bubble ${message.sender} ${message.isError ? 'error' : ''}`}>
                <div className="message-header">
                  <strong>
                    {message.sender === 'user' ? '👤 Você' : '✨ Estela'}
                  </strong>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
                <div className="message-text">
                  {message.text}
                </div>
                {message.knowledgeSources && message.knowledgeSources.length > 0 && (
                  <div className="knowledge-sources">
                    <small className="text-muted">
                      📚 Fontes: {message.knowledgeSources.length} documento(s)
                    </small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}
      
      {isLoading && (
        <div className="message-wrapper assistant">
          <div className="message-bubble assistant loading">
            <Spinner animation="grow" size="sm" className="me-2" />
            <Spinner animation="grow" size="sm" className="me-2" />
            <Spinner animation="grow" size="sm" />
            <span className="ms-2">Processando...</span>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;