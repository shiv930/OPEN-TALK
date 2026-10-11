import apiClient from './axios';

/**
 * User Profile Endpoints
 * Backend Controller: src/controllers/user.controller.js
 */
export const userApi = {
  // GET /api/user/get-me
  getMe: () => {
    return apiClient.get('/api/user/get-me');
  },

  // POST /api/user/update-profile
  updateProfile: (profileData) => {
    return apiClient.post('/api/user/update-profile', profileData);
  },

  // GET /api/user/get-user-profile/:username
  getUserProfile: (username) => {
    return apiClient.get(`/api/user/get-user-profile/${username}`);
  },

  // POST /api/user/change-password
  changePassword: (passwordData) => {
    return apiClient.post('/api/user/change-password', passwordData);
  },

  // POST /api/user/update-profile-picture
  updateProfilePicture: (formData) => {
    return apiClient.post('/api/user/update-profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // DELETE /api/user/delete-account
  deleteAccount: (data) => {
    return apiClient.delete('/api/user/delete-account', { data });
  },
};

export default userApi;
