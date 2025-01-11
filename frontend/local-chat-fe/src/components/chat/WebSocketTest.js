import { Client } from '@stomp/stompjs';
import { WebSocket } from 'ws';
Object.assign(global, { WebSocket });

var stompClient = null;

// function clientConnectionTest() {
//   stompClient = new Client({
//     brokerURL: 'ws://localhost:8080/chat',
//     onConnect: (e) => {
//       console.log('OnConnect Received.', e);
//     },
//     onWebSocketError: (error) => {
//       console.log('WebSocket connection error: ', error);
//     },
//     onWebSocketClose: (error) => {
//       console.log('WebSocket close: ', error);
//     },
//     onDisconnect: (e) => {
//       console.log('Websocket Disconnected.', e);
//     },
//   });

//   stompClient.activate();
// }

// function sendMsg() {
//   if (stompClient && stompClient.active && stompClient.connected) {
//     stompClient.subscribe('/topic/public', (message) => {
//       console.log(`Received: ${message.body}`);
//     });
//     stompClient.publish({
//       destination: '/topic/public',
//       body: 'First Message',
//     });

//     stompClient.publish({
//       destination: '/app/sendMessage',
//       body: JSON.stringify({
//         sender: 'username',
//         content: 'message',
//         type: 'CHAT',
//       }),
//     });

//     console.log('Msg sent.');
//   } else {
//     console.log('Connection not acquired.');
//   }
//   console.log('After sending msg');
// }

// export const connect = (onMessageReceived, onConnected) => {
//   stompClient = new Client({
//     brokerURL: 'ws://localhost:8080/chat',
//     onStompError: (error) => {
//       console.log('WebSocket connection error: ', error);
//     },
//     onConnect: (e) => {
//       onConnected();
//       subscribe(onMessageReceived);
//       console.log('OnConnect Received.', e);
//     },
//     onWebSocketError: (error) => {
//       console.log('WebSocket connection error: ', error);
//     },
//     onWebSocketClose: (error) => {
//       console.log('WebSocket close: ', error);
//     },
//     onDisconnect: (e) => {
//       console.log('Websocket Disconnected.', e);
//     },
//   });

//   stompClient.activate();
// };

// function subscribe(onMessageReceived) {
//   if (stompClient && stompClient.active && stompClient.connected) {
//     stompClient.subscribe('/topic/public', (message) => {
//       onMessageReceived(message);
//       console.log(`Received: ${message.body}`);
//     });
//     handleSendMessage()
//   } else {
//     console.log('Not subscribed.');
//   }
// }

// export const sendMessage = (message) => {
//   try {
//     if (stompClient && stompClient.active && stompClient.connected) {
//       stompClient.publish({
//         destination: '/app/sendMessage',
//         body: JSON.stringify(message),
//       });
//     } else {
//       console.log(
//         'Unable to send msg',
//         stompClient.active,
//         stompClient.connected
//       );
//     }
//   } catch (e) {
//     console.error('Error while sending message.', e);
//   }
// };

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// const onConnected = () => {
//   console.log('Connected to WebSocket');
// };

// const onMessageReceived = (payload) => {
//   const message = JSON.parse(payload.body);
//   console.log('msg', message);
// };

const handleSendMessage = () => {
  const chatMessage = {
    sender: 'username',
    content: 'message',
    type: 'CHAT',
  };
  sendMessage(chatMessage);
};

var connected = false;

const connect = (onMessageReceived, onConnected) => {
  if (!connected && !stompClient) {
    console.log('New Client.');
    const stompClientO = new Client({
      brokerURL: 'ws://localhost:8080/chat',
      debug: (event) => {
        console.log('Debug: ', event);
      },
      onStompError: (error) => {
        console.log('WebSocket connection error: ', error);
      },
      onConnect: (e) => {
        onConnected();
        subscribe(onMessageReceived);
        console.log('OnConnect Received.', e);
      },
      onWebSocketError: (error) => {
        console.log('WebSocket connection error: ', error);
      },
      onWebSocketClose: (error) => {
        console.log('WebSocket close: ', error);
      },
      onDisconnect: (e) => {
        console.log('Websocket Disconnected.', e);
      },
      onUnhandledFrame: (e) => {
        console.log('Unhandled frame', e);
      },
      connectionTimeout: 30000,
      reconnectDelay: 0,
    });

    stompClientO.activate();
    // stompClientRef.current = stompClientO;
    stompClient = stompClientO;
    subscribe(onMessageReceived);
  }
};

function subscribe(onMessageReceived) {
  // const stompClient = stompClientRef.current;
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
    // const stompClient = stompClientRef.current;

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

const disconnect = () => {
  // const stompClient = stompClientRef.current;

  if (stompClient) {
    stompClient.deactivate();
    // stompClientRef.current = null;
    stompClient = null;
  }
};

const onConnected = () => {
  handleSendMessage();
  console.log('Connected to WebSocket');
};

const onMessageReceived = (payload) => {
  const message = JSON.parse(payload.body);
  console.log('Message received: ', message);
};

async function main() {
  connect(onMessageReceived, onConnected);

  handleSendMessage();
  // clientConnectionTest();
  // sendMsg();
  await sleep(1000);
  process.exit();
}

await main();
