import React, { useState } from 'react';

const ProfileDrawer = ({
  user,
  onClose,
  onUpdate,
  onDeleteAccount,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [photo, setPhoto] = useState(user.photo);
  const [email, setEmail] = useState(user.email);

  const handleUpdateProfile = () => {
    if (!username.trim() || !email.trim()) {
      alert("Les champs 'Nom d'utilisateur' et 'Email' sont requis !");
      return;
    }
    onUpdate({ username, photo, email });
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    onDeleteAccount();
    setShowDeleteConfirmation(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50"
      onClick={onClose}
    >
      <div
        className="w-96 bg-white h-full p-6 shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="self-end text-gray-500 hover:text-gray-800 mb-4"
        >
          Fermer
        </button>

        <div className="flex items-center mb-6">
          <img
            src={photo || '/default-avatar.webp'}
            alt="User avatar"
            className="w-20 h-20 rounded-full border-2 border-green-500"
          />
          <div className="ml-4">
            <h2 className="text-sm font-bold text-gray-700">{username}</h2>
            <p className="text-sm text-gray-500">
              {email || 'Email non fourni'}
            </p>
          </div>
        </div>

        {!isEditing ? (
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Modifier le profil
            </button>
            <button
              onClick={onLogout}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Déconnexion
            </button>
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Supprimer le compte
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email || ''}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Photo de profil
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = () => setPhoto(reader.result);
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
                className="mt-1 block w-full text-sm text-gray-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateProfile}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        )}

        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-bold mb-4">
                Confirmer la suppression
              </h2>
              <p className="text-gray-600 mb-4">
                Êtes-vous sûr(e) de vouloir supprimer définitivement votre
                compte ?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDrawer;
