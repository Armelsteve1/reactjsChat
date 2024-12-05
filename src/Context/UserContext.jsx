import { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (token) {
          const userId = sessionStorage.getItem("userId");
          const userData = await AuthService.getUserById(userId, token); // Ajoutez cette méthode dans AuthService
          setUser({ ...userData, token });
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'utilisateur :", error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const addUser = (newUser) => {
    sessionStorage.setItem("token", newUser.token);
    sessionStorage.setItem("userId", newUser.id);
    setUser(newUser);
  };

  const clearUser = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, addUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);