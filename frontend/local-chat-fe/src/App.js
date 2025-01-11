import './App.css';
// import ChatStomp from './components/chat/ChatStomp';
import ChatWS from './components/chat/ChatWS';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <Chat /> */}
        <ChatWS />
        {/* <ChatStomp /> */}
      </header>
    </div>
  );
}

export default App;
