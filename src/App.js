import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load saved messages from localStorage
    const saved = localStorage.getItem('chat-messages');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage
    localStorage.setItem('chat-messages', JSON.stringify(messages));
  }, [messages]);

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

  const deleteMessage = (id) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

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
          />
          <button onClick={() => setDarkMode(!darkMode)} className="mode-toggle">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={exportChat} className="export-btn">
            📥 Export
          </button>
        </div>
      </header>
      
      <main className="app-main">
        <div className="chat-container">
          <div className="messages">
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
            />
            <button onClick={sendMessage} className="send-btn">
              Send 🚀
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;