import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * AI Chat Dashboard - Main application component
 * Features: Dark/Light mode, message search, chat export, localStorage persistence
 * @returns {JSX.Element} The main app component
 */
function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load saved messages from localStorage
    try {
      const saved = localStorage.getItem('chat-messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load messages from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('chat-messages');
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage
    try {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages to localStorage:', error);
      // Handle quota exceeded or other storage errors
      if (error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded. Consider clearing old messages.');
      }
    }
  }, [messages]);

  /**
   * Sends a user message and generates an AI response
   * @returns {void}
   */
  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: input,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'user'
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: `Echo: ${input}`,
        timestamp: new Date().toLocaleTimeString(),
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 500);
  };

  /**
   * Deletes a specific message by ID
   * @param {number} id - The message ID to delete
   * @returns {void}
   */
  const deleteMessage = (id) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  /**
   * Clears all messages from the chat
   * @returns {void}
   */
  const clearAllMessages = () => {
    if (messages.length === 0) return;
    if (window.confirm('Are you sure you want to clear all messages?')) {
      setMessages([]);
    }
  };

  /**
   * Exports chat history as a JSON file
   * @returns {void}
   */
  const exportChat = () => {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `chat-export-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredMessages = messages.filter(msg => 
    msg.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <header className="app-header">
        <h1>🤖 AI Chat Dashboard</h1>
        <div className="header-controls">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search messages"
          />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="mode-toggle"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={clearAllMessages}
            className="clear-btn"
            disabled={messages.length === 0}
            aria-label="Clear all messages"
          >
            🗑️ Clear
          </button>
          <button
            onClick={exportChat}
            className="export-btn"
            disabled={messages.length === 0}
            aria-label="Export chat history"
          >
            📥 Export
          </button>
        </div>
      </header>
      
      <main className="app-main">
        <div className="chat-container">
          <div className="messages" role="log" aria-live="polite" aria-label="Chat messages">
            {filteredMessages.length === 0 ? (
              <p className="empty-state">No messages yet. Start chatting!</p>
            ) : (
              filteredMessages.map(msg => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  <div className="message-content">
                    <span className="message-text">{msg.text}</span>
                    <span className="message-time">{msg.timestamp}</span>
                  </div>
                  <button 
                    onClick={() => deleteMessage(msg.id)}
                    className="delete-btn"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
          
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="message-input"
              aria-label="Message input"
            />
            <button
              onClick={sendMessage}
              className="send-btn"
              disabled={!input.trim()}
              aria-label="Send message"
            >
              Send 🚀
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;