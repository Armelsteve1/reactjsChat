import React, { useRef, useEffect, useState } from "react";
import dayjs from "dayjs";
import AuthService from "../../services/AuthService";

const MessageList = ({ messages, user }) => {
  const messageEndRef = useRef(null);
  const [usernames, setUsernames] = useState({});

  const uniqueMessages = messages.filter((msg, index, self) => {
    return (
      index ===
      self.findIndex(
        (m) =>
          m.content === msg.content &&
          m.senderId === msg.senderId &&
          m.recipientId === msg.recipientId &&
          dayjs(m.createdAt).isSame(msg.createdAt, "second")
      )
    );
  });

  const sortedMessages = [...uniqueMessages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const formatDate = (date) => dayjs(date).format("DD MMM YYYY");
  const formatTime = (date) => dayjs(date).format("HH:mm");

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const fetchUsernames = async () => {
      const token = sessionStorage.getItem("token");
      const uniqueSenderIds = [...new Set(messages.map((msg) => msg.senderId))];

      const newUsernames = {};
      const fetchPromises = uniqueSenderIds.map(async (senderId) => {
        if (!usernames[senderId]) {
          try {
            const userData = await AuthService.getUserById(senderId, token);
            newUsernames[senderId] = userData.username;
          } catch (error) {
            console.error(
              `Erreur lors de la récupération de l'utilisateur ${senderId}:`,
              error
            );
          }
        }
      });

      await Promise.all(fetchPromises);
      if (Object.keys(newUsernames).length > 0) {
        setUsernames((prev) => ({ ...prev, ...newUsernames }));
      }
    };

    fetchUsernames();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {sortedMessages.map((msg, index) => {
        const previousMessage = sortedMessages[index - 1];
        const currentMessageDate = formatDate(msg.createdAt);
        const previousMessageDate =
          previousMessage && formatDate(previousMessage.createdAt);

        const showDateSeparator = currentMessageDate !== previousMessageDate;

        return (
          <React.Fragment key={`${msg._id || msg.createdAt}-${index}`}>
            {showDateSeparator && (
              <div className="text-center text-gray-500 text-sm mb-2">
                {currentMessageDate}
              </div>
            )}
            <div
              className={`flex ${
                msg.senderId === user.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  msg.senderId === user.id
                    ? "bg-blue-100 text-right"
                    : "bg-green-100 text-left"
                }`}
              >
                <p>{msg.content}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {formatTime(msg.createdAt)}{" "}
                  <span className="font-semibold text-gray-700">
                    {usernames[msg.senderId] || "Inconnu"}
                  </span>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div ref={messageEndRef}></div>
    </div>
  );
};

export default MessageList;
