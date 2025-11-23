import React, { useState, useRef, useEffect, useContext } from 'react';
import Axios from "../axios";
import { AuthContext } from "./Auth";
import { useNavigate } from 'react-router-dom';

function Chat() {
    const [messages, updateMessages] = useState([]);
    const [question, updateQuestion] = useState("");
    const [isThinking, updateIsThinking] = useState(false);
    const messageEnd = useRef(null);

    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    const scrollToMessageEnd = () => {
        messageEnd.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToMessageEnd();
    }, [messages]);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/signin");
        }

        updateMessages([
        {
            id: 1,
            text: "Hello! Im your pet care assistant, ask me anything about your pet!",
            isBot: true,
            timestamp: new Date()
        }
        ]);
    }, [user, loading, navigate]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!question.trim() || isThinking) {
            return;
        }

        const userMessage = {
            id: Date.now(),
            text: question,
            isBot: false,
            timestamp: new Date()
        };

        updateMessages(prev => [...prev, userMessage]);
        updateQuestion("");
        updateIsThinking(true);

        try {
            const response = await Axios.post("/api/chat", {
                message: question,
            });

            const botMessage = {
                id: Date.now() + 1,
                text: response.data.bot_message,
                isBot: true,
                timestamp: new Date()
            };

            updateMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "Error occured, try again later...",
                isBot: true,
                timestamp: new Date()
            };
            updateMessages(prev => [...prev, errorMessage]);
        } finally {
            updateIsThinking(false);
        }
    };

    return (
        <div className="chat">
            <div className="chat-container">
                <div className="chat-header">
                    <h1>
                        Pet Care Assistant
                    </h1>
                    <p>
                        Ask any questions about your pets
                    </p>
                </div>

                <div className="chat-messages-container">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`chat-message ${message.isBot ? 'bot-message' : 'user-message'}`}
                    >
                    <div className="chat-message-content">
                        {message.text}
                    </div>
                    <div className="message-time">
                        {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}
                    </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="chat-message bot-message">
                    <div className="chat-message-content typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    </div>
                )}
                <div ref={messageEnd} />
                </div>

                <form onSubmit={handleSendMessage} className="input-form">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => updateQuestion(e.target.value)}
                    placeholder="Ask question..."
                    disabled={isThinking}
                    className="message-input"
                />
                <button 
                    type="submit" 
                    disabled={!question.trim() || isThinking}
                    className="send-button"
                >
                    Ask
                </button>
                </form>
            </div>
        </div>
  );
}

export default Chat;