import React, { useState } from "react";

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
  };

  return (
    <div className="bg-gray-100 p-4 flex">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tapez votre message ici..."
        className="flex-1 p-2 border rounded-lg focus:ring focus:ring-green-400"
      />
      <button
        onClick={handleSend}
        className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Envoyer
      </button>
    </div>
  );
};

export default MessageInput;
