import React, { useState, useEffect } from "react";
import { useUser } from "../../Context/UserContext";
import ProfileDrawer from "./ProfileDrawer";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const Sidebar = ({ onUserClick }) => {
  const { user, setUser } = useUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const sortedUsers = response.data.sort((a, b) =>
          a.username.localeCompare(b.username)
        );
        setAllUsers(sortedUsers);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    };
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/users/${user?.id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const updatedData = response.data;

      setUser((prev) => ({
        ...prev,
        username: updatedData.username,
        photo: updatedData.photo,
        email: updatedData.email,
      }));
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    }
  };
  // const handleLogout = async () => {
  //   try {
  //     await axios.post(
  //       "http://localhost:3000/auth/logout",
  //       {},
  //       {
  //         headers: { Authorization: `Bearer ${user?.token}` },
  //       }
  //     );
  //     socket.emit("removeUser", user.id);
  //     clearUser();
  //   } catch (error) {
  //     console.error("Erreur lors de la déconnexion :", error);
  //   }
  // };

  // const handleDeleteAccount = async () => {
  //   const confirmDelete = window.confirm(
  //     "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
  //   );
  //   if (!confirmDelete) return;

  //   try {
  //     await axios.delete(`http://localhost:3000/users/${user?.id}`, {
  //       headers: {
  //         Authorization: `Bearer ${user?.token}`,
  //       },
  //     });
  //     handleLogout();
  //   } catch (error) {
  //     console.error("Erreur lors de la suppression du compte :", error);
  //   }
  // };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <div className="flex flex-col items-center mb-6">
        <img
          src={user.photo || "/default-avatar.webp"}
          alt="Avatar"
          className="w-16 h-16 rounded-full mb-3 border-2 border-green-500 cursor-pointer"
          onClick={() => setIsDrawerOpen(true)}
        />
        <h2 className="text-lg font-bold text-center">{user.username}</h2>
      </div>

      {isDrawerOpen && (
        <ProfileDrawer
          user={user}
          onClose={() => setIsDrawerOpen(false)}
          onUpdate={handleUpdateUser}
          // onDeleteAccount={handleDeleteAccount}
          // onLogout={handleLogout}
        />
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par email"
          className="w-full p-2 rounded-md text-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
      </div>

      <div className="flex flex-col gap-2">
        {allUsers
          .filter((u) => u.email.toLowerCase().includes(searchQuery))
          .map((u) => (
            <div
              key={u.id}
              className={`flex items-center gap-2 cursor-pointer hover:bg-gray-500 rounded-lg p-2 ${
                u.isActive ? "bg-gray-600" : ""
              }`}
              onClick={() => onUserClick(u)}
            >
              <img
                src={u.photo || "/default-avatar.webp"}
                alt="Avatar utilisateur"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{u.username}</p>
                <p className="text-sm text-gray-400">
                  {u.isActive ? "En ligne" : "Hors ligne"}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
