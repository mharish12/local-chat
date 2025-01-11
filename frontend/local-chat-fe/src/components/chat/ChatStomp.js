import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { createServer } from 'sockjs';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
// import ErrorModal from '../error/ErrorModal';

const ChatStomp = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [toBeConnected, setToBeConnected] = useState(false);

  let stompClientRef = useRef(null);

  const url = 'ws:locahhost:8080/chat';

  const connect = useCallback((onMessageReceived, onConnected) => {
    const sock = new SockJS(url);

    let stompClientO = Stomp.over(sock);

    //stompClientO.activate();
    stompClientRef.current = stompClientO;
    stompClientO.onConnect = (e) => {
      onConnected();
      subscribe(onMessageReceived);
      console.log('OnConnect Received.', e);
    };
    stompClientO.onMessageReceived = stompClientO.connect(
      {},
      onConnected,
      onError
    );
    subscribe(onMessageReceived);
  }, []);

  function onError(e) {
    console.error('Error!', e);
  }

  function subscribe(onMessageReceived) {
    const stompClient = stompClientRef.current;

    if (stompClient && stompClient.active && stompClient.connected) {
      stompClient.subscribe('/topic/public', (message) => {
        onMessageReceived(message);
        console.log(`Received: ${message.body}`);
      });
    } else {
      console.log('Not subscribed.');
    }
  }

  const sendMessage = (message) => {
    try {
      const stompClient = stompClientRef.current;

      if (stompClient && stompClient.active && stompClient.connected) {
        stompClient.publish({
          destination: '/app/sendMessage',
          body: JSON.stringify(message),
        });
      } else {
        console.log('Unable to send msg.');
      }
    } catch (e) {
      console.error('Error while sending message.', e);
    }
  };

  const disconnect = useCallback(() => {
    const stompClient = stompClientRef.current;

    if (stompClient) {
      stompClient.deactivate();
      stompClientRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (toBeConnected) {
      connect(onMessageReceived, onConnected);
    } else {
      disconnect();
    }
  }, [toBeConnected, connect, disconnect]);

  const onConnected = () => {
    setToBeConnected(true);
    console.log('Connected to WebSocket');
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleConnection = (e) => {
    e.preventDefault();
    setToBeConnected((prevState) => !prevState);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    const chatMessage = {
      sender: username,
      content: message,
      type: 'CHAT',
    };
    sendMessage(chatMessage);
    setMessage('');
  };

  return (
    <div>
      {/* <ErrorModal onClose={} errorMessage={}/> */}
      <div id="chat-connection">
        <button onClick={handleConnection}>
          {toBeConnected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
      <div
        id="chat"
        style={{
          pointerEvents: toBeConnected ? 'auto' : 'none',
          opacity: toBeConnected ? 1 : 0.5,
        }}
      >
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>

        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.sender}:</strong> {msg.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatStomp;
