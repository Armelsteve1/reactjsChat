import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const AuthService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const {
        token,
        userId,
        username,
        photo,
        email: userEmail,
        isActive,
      } = response.data;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userId', userId.toString());

      return {
        token,
        id: userId,
        username: username || 'Anonymous',
        photo: photo || '/default-avatar.png',
        email: userEmail,
        isActive,
      };
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (token) {
        await axios.post(
          `${API_BASE_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      sessionStorage.clear();
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      throw error;
    }
  },

  getUserFromServer: async () => {
    try {
      const token = sessionStorage.getItem('token');
      const userId = sessionStorage.getItem('userId');

      if (!token || !userId) {
        console.warn('Token ou userId manquant dans le stockage.');
        return null;
      }

      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des données utilisateur :',
        error
      );
      return null;
    }
  },
  getUserById: async (userId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      throw error;
    }
  },
};

export default AuthService;
