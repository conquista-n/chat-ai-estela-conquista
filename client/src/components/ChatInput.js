import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import './ChatInput.css';

function ChatInput({ onSendMessage, disabled }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    // Envia com Enter, mas permite Shift+Enter para nova linha
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup className="chat-input-group">
        <Form.Control
          as="textarea"
          rows={1}
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="chat-input"
        />
        <Button 
          variant="primary" 
          type="submit"
          disabled={disabled || !message.trim()}
          className="send-button"
        >
          {disabled ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Enviando...
            </>
          ) : (
            <>
              <span className="send-icon">📤</span>
              Enviar
            </>
          )}
        </Button>
      </InputGroup>
      <small className="text-muted hint">
        Pressione Enter para enviar, Shift+Enter para nova linha
      </small>
    </Form>
  );
}

export default ChatInput;