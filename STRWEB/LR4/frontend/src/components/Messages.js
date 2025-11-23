import React, { createContext, useContext, useState } from 'react';
import Message from './Message';

export const MessageContext = createContext();

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('use MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const [messages, updateMessages] = useState([]);

  const showMessage = (content) => {
    const id = Date.now();
    updateMessages(prev => [...prev, { id, content }]);
  };

  const removeMessage = (id) => {
    updateMessages(prev => prev.filter(message => message.id !== id));
  };

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
      <div className="messages-container">
        {messages.map(message => (
          <Message
            key={message.id}
            content={message.content}
            onClose={() => removeMessage(message.id)}
          />
        ))}
      </div>
    </MessageContext.Provider>
  );
};