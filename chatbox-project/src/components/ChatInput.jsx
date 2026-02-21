import { useState } from 'react';

export function ChatInput({ messages, setMessages }) {
  const [inputText, setInputText] = useState('');

  // Simple internal chatbot logic
  function getResponse(text) {
    const lower = text.toLowerCase();

    if (lower.includes('date')) {
      return new Date().toDateString();
    }

    if (lower.includes('coin')) {
      return Math.random() > 0.5 ? 'Heads' : 'Tails';
    }

    if (lower.includes('hello')) {
      return 'Hello! How can I help you?';
    }

    return "I don't understand that yet 🙂";
  }

  function saveInputText(event) {
    setInputText(event.target.value);
  }

  function sendMessage() {
    if (!inputText.trim()) return;

    const response = getResponse(inputText);

    // Add both user and bot messages
    setMessages( [
      ...messages,
      { message: inputText, sender: 'user', id: crypto.randomUUID() },
      { message: response, sender: 'robot', id: crypto.randomUUID() }
    ]);

    setInputText('');
  }

  return (
    <div className="chat-input-container">
      <input
        placeholder="Send a message to Chatbox"
        size="30"
        onChange={saveInputText}
        value={inputText}
        className="chat-input"
      />
      <button onClick={sendMessage} className="send-button">
        Send
      </button>
    </div>
  );
}