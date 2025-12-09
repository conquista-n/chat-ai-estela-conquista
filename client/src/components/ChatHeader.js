import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './ChatHeader.css';

function ChatHeader({ onClearChat }) {
  return (
    <Card.Header className="chat-header">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-1">
            <img className="agent-icon" alt="" src="/images/avatar-chat-estela"></img>
            Assitente Estela
          </h4>
          <p className="subtitle mb-0">Assistente inteligente da Conquista</p>
        </div>
        <Button 
          variant="outline-light" 
          size="sm"
          onClick={onClearChat}
          className="clear-btn"
        >
          <span className="me-1">🗑️</span>
          Limpar Chat
        </Button>
      </div>
    </Card.Header>
  );
}

export default ChatHeader;