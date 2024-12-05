const ChatHeader = ({ user }) => {
  return (
    <div className="bg-gray-100 p-4 shadow-md flex items-center gap-4">
      <img
        src={user.photo || '/default-avatar.webp'}
        alt="User avatar"
        className="w-10 h-10 rounded-full"
      />
      <div>
        <h2 className="text-lg font-bold">{user.username}</h2>
        <p className={`text-sm ${user.isActive ? 'text-green-500' : 'text-red-500'}`}>
          {user.isActive ? 'En ligne' : 'Déconnecté'}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
