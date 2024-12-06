import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useUser } from '../../Context/UserContext';
import Sidebar from '../ChatComponents/Sidebar';
import ChatHeader from '../ChatComponents/ChatHeader';
import MessageList from '../ChatComponents/MessageList';
import MessageInput from '../ChatComponents/MessageInput';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const socket = io(`${API_BASE_URL}`, {
  query: { userId: localStorage.getItem('userId') },
});

const Chat = () => {
  const { user } = useUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!selectedUser || !user) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/messages/${user.id}/${selectedUser.id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
      }
    };

    fetchMessages();
  }, [selectedUser, user]);

  useEffect(() => {
    if (!user || !selectedUser) return;

    const handleMessageReceived = (message) => {
      if (
        (message.senderId === selectedUser.id &&
          message.recipientId === user.id) ||
        (message.senderId === user.id &&
          message.recipientId === selectedUser.id)
      ) {
        setMessages((prev) => {
          if (!prev.some((m) => m._id === message._id)) {
            return [...prev, message];
          }
          return prev;
        });
      }
    };

    socket.on('messageReceived', handleMessageReceived);

    return () => {
      socket.off('messageReceived', handleMessageReceived);
    };
  }, [user, selectedUser]);

  useEffect(() => {
    socket.on('connect', () => {});

    socket.on('disconnect', () => {
      console.warn('WebSocket déconnecté.');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const handleSendMessage = async (content) => {
    if (!selectedUser || !user) return;

    const messageData = {
      senderId: user.id,
      recipientId: selectedUser.id,
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, messageData]);

    try {
      if (socket.connected) {
        socket.emit('sendMessage', messageData);
      } else {
        console.error('WebSocket non connecté. Message non envoyé.');
      }

      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message au backend.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar onUserClick={setSelectedUser} />
      <div className="flex flex-col flex-1">
        {selectedUser ? (
          <>
            <ChatHeader user={selectedUser} />
            <div className="flex-1 overflow-y-auto">
              <MessageList messages={messages} user={user} />
            </div>
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Sélectionnez un utilisateur pour commencer une conversation.
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
