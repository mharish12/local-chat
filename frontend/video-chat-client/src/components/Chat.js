import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export default function Chat() {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const socketRef = useRef();
  const pcRef = useRef();
  const [users, setUsers] = useState([
    {
      id: 'Harish',
    },
  ]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const socket = io.connect('0.0.0.0:3000/');
    socketRef.current = socket;

    socketRef.current.on('updateUserList', (userList) => {
      if (!selectedUser) {
        setUsers(userList);
      }
    });

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;

          let peerConnection = new RTCPeerConnection();
          peerConnection.addEventListener('messaage', (e) => {
            console.log('Event', e);
          });
          //   peerConnection.addTransceiver(stream);

          pcRef.current = peerConnection;
          pcRef.current.addStream(stream);

          pcRef.current.onicecandidate = (event) => {
            if (event.candidate && selectedUser) {
              socketRef.current.emit('sendCandidate', {
                candidate: event.candidate,
                targetUserId: selectedUser.id,
              });
            }
          };

          pcRef.current.onaddstream = (event) => {
            remoteVideoRef.current.srcObject = event.stream;
          };

          socketRef.current.on('receiveOffer', handleOffer);
          socketRef.current.on('receiveAnswer', handleAnswer);
          socketRef.current.on('receiveCandidate', handleCandidate);
        });
    } else {
      console.log('Get UserMedia Not supported!');
    }

    // Set an interval to refresh the user list every 5 seconds
    const intervalId = setInterval(() => {
      socketRef.current.emit('requestUserList');
    }, 30000);

    return () => clearInterval(intervalId);
  }, [selectedUser]);

  const connectToUser = (user) => {
    setSelectedUser(user);
    pcRef.current.createOffer().then((offer) => {
      pcRef.current.setLocalDescription(offer);
      socketRef.current.emit('sendOffer', { offer, targetUserId: user.id });
    });
  };

  const handleOffer = ({ offer, fromUserId }) => {
    pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
    pcRef.current.createAnswer().then((answer) => {
      pcRef.current.setLocalDescription(answer);
      socketRef.current.emit('sendAnswer', {
        answer,
        targetUserId: fromUserId,
      });
    });
  };

  const handleAnswer = ({ answer }) => {
    pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleCandidate = ({ candidate }) => {
    pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
  };

  return (
    <div>
      <div>
        <h3>Available Users:</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <button onClick={() => connectToUser(user)}>
                Connect {user.id}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <video ref={localVideoRef} autoPlay playsInline muted />
      <video ref={remoteVideoRef} autoPlay playsInline />
    </div>
  );
}
