import React, { useState, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import ErrorModal from '../error/ErrorModal';

const ChatWS = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [error, setError] = useState(null);
  // const [isConnecting, setIsConnecting] = useState(false);

  let stompClientRef = useRef(null);

  function setErrorToUser(e) {
    setHasError(true);
  }

  function onCancelError() {
    setHasError(false);
    setError(null);
  }

  const connect = useCallback((onMessageReceived, onConnected) => {
    // setIsConnecting(true);

    if (!connected && !stompClientRef.current) {
      console.log('New Client.');
      const stompClientO = new Client({
        brokerURL: 'ws://192.168.0.155:8080/chat',
        debug: (event) => {
          // setErrorToUser(event);
          console.log('Debug: ', event);
        },
        onStompError: (error) => {
          setErrorToUser(error);
          // setIsConnecting(false);
          console.log('WebSocket connection error: ', error);
        },
        onConnect: (e) => {
          onConnected();
          subscribe(onMessageReceived);
          console.log('OnConnect Received.', e);
        },
        onWebSocketError: (error) => {
          // setIsConnecting(false);
          setErrorToUser(error);
          console.log('WebSocket connection error: ', error);
        },
        onWebSocketClose: (error) => {
          // setIsConnecting(false);
          console.log('WebSocket close: ', error);
        },
        onDisconnect: (e) => {
          //setErrorToUser(e);
          // setIsConnecting(false);
          console.log('Websocket Disconnected.', e);
        },
        onUnhandledFrame: (e) => {
          // setIsConnecting(false);
          console.log('Unhandled frame', e);
        },
        connectionTimeout: 30000,
        reconnectDelay: 0,
      });

      stompClientO.activate();
      stompClientRef.current = stompClientO;
      //subscribe(onMessageReceived);
    }
  }, []);

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
    setConnected(false);
  }, []);

  // useEffect(() => {
  //   if (connected) {
  //     console.log('Connect Called');
  //     connect(onMessageReceived, onConnected);
  //   } else {
  //     disconnect();
  //   }
  // }, [connected, connect, disconnect]);

  const onConnected = () => {
    setConnected(true);
    // setIsConnecting(false);
    console.log('Connected to WebSocket');
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleConnection = (e) => {
    e.preventDefault();
    //setConnected((prevState) => !prevState);
    if (!connected) {
      connect(onMessageReceived, onConnected);
    } else {
      disconnect();
    }
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
      {hasError && <ErrorModal errorMessage={error} onClose={onCancelError} />}
      <div id="chat-connection">
        <button onClick={handleConnection}>
          {connected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
      <div
        id="chat"
        style={{
          pointerEvents: connected ? 'auto' : 'none',
          opacity: connected ? 1 : 0.5,
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

export default ChatWS;
