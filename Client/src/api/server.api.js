import apiClient from './axios';

/**
 * Server Endpoints
 * Backend Controller: src/controllers/server.controller.js
 */
export const serverApi = {
  // GET /api/server/get-server
  getServers: () => {
    return apiClient.get('/api/server/get-server');
  },

  // GET /api/server/public
  getPublicServers: () => {
    return apiClient.get('/api/server/public');
  },

  // GET /api/server/get-server-details/:id
  getServerDetails: (serverId) => {
    return apiClient.get(`/api/server/get-server-details/${serverId}`);
  },

  // POST /api/server/create-server (multipart/form-data for icon, banner)
  createServer: (formData) => {
    return apiClient.post('/api/server/create-server', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // PATCH /api/server/update-server/:serverId
  updateServer: (serverId, formData) => {
    return apiClient.patch(`/api/server/update-server/${serverId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // DELETE /api/server/delete-server/:serverId
  deleteServer: (serverId) => {
    return apiClient.delete(`/api/server/delete-server/${serverId}`);
  },

  // POST /api/server/join/:inviteCode
  joinServer: (inviteCode) => {
    return apiClient.post(`/api/server/join/${inviteCode}`);
  },

  // DELETE /api/server/leave/:serverId
  leaveServer: (serverId) => {
    return apiClient.delete(`/api/server/leave/${serverId}`);
  },
};

export default serverApi;
