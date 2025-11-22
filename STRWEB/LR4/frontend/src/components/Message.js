import React, { useEffect, useState } from 'react';

const Message = ({ content, onClose, duration = 3000 }) => {
  const [closing, updateClosing] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const handleClose = () => {
    updateClosing(true);

    setTimeout(() => {
      onClose();
    }, 300);
  }

  return (
    <div className={`message ${closing ? "closing" : ""}`}>
      <div className="message-content">
        <span>{content}</span>
        <button className="message-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Message;