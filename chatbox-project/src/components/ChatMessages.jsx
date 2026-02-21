import { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';

function ChatMessages({ messages }) {

  const chatMessagesRef = useRef(null);

  useEffect(() => {
    const containerElem = chatMessagesRef.current;
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="chat-messages-container"
      ref={chatMessagesRef}
    >
      {messages.map((chatMessage) => {
        return (
          <ChatMessage
            key={chatMessage.id}
            message={chatMessage.message}
            sender={chatMessage.sender}
          />
        );
      })}
    </div>
  );
}

export default ChatMessages;