import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useUser } from "../../Context/UserContext";
import Sidebar from "../ChatComponents/Sidebar";
import ChatHeader from "../ChatComponents/ChatHeader";
import MessageList from "../ChatComponents/MessageList";
import MessageInput from "../ChatComponents/MessageInput";

const socket = io("http://localhost:3000", {
  query: { userId: localStorage.getItem("userId") },
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
          `http://localhost:3000/messages/${user.id}/${selectedUser.id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
      }
    };

    fetchMessages();
  }, [selectedUser, user]);

  useEffect(() => {
    if (!user || !selectedUser) return;
  
    socket.on("messageReceived", (message) => {
      console.log("Message reçu :", message);
      if (
        (message.senderId === selectedUser.id && message.recipientId === user.id) ||
        (message.senderId === user.id && message.recipientId === selectedUser.id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });
  
    return () => {
      socket.off("messageReceived");
    };
  }, [user, selectedUser]);
   
   const handleSendMessage = (content) => {
    if (!selectedUser || !user) return;
  
    const messageData = {
      senderId: user.id,
      recipientId: selectedUser.id,
      content,
      createdAt: new Date().toISOString(),
    };
  
    setMessages((prev) => {
      if (
        !prev.some(
          (msg) =>
            msg.content === messageData.content &&
            msg.senderId === messageData.senderId &&
            msg.recipientId === messageData.recipientId
        )
      ) {
        return [...prev, messageData];
      }
      return prev;
    });
  
    socket.emit("sendMessage", messageData);
  
    fetch("http://localhost:3000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(messageData),
    }).catch((error) =>
      console.error("Erreur lors de l'envoi du message au backend :", error)
    );
  };
  

  return (
    <div className="flex h-screen">
      <Sidebar onUserClick={setSelectedUser} />
      <div className="flex flex-col flex-1">
        {selectedUser ? (
          <>
            <ChatHeader user={selectedUser} />
            <div className="flex-1 overflow-y-auto">
              <MessageList messages={messages} user={selectedUser} />
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
