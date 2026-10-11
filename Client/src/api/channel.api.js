import apiClient from './axios';

/**
 * Channel Endpoints
 * Backend Controller: src/controllers/channel.controller.js
 */
export const channelApi = {
  // GET /api/channel/getAllChannel/:serverId
  getChannels: (serverId) => {
    return apiClient.get(`/api/channel/getAllChannel/${serverId}`);
  },

  // GET /api/channel/getSingleChannel/:serverId/:channelId
  getSingleChannel: (serverId, channelId) => {
    return apiClient.get(`/api/channel/getSingleChannel/${serverId}/${channelId}`);
  },

  // POST /api/channel/createChannel/:serverId
  createChannel: (serverId, data) => {
    return apiClient.post(`/api/channel/createChannel/${serverId}`, data);
  },

  // PATCH /api/channel/updateChannel/:serverId/:channelId
  updateChannel: (serverId, channelId, data) => {
    return apiClient.patch(`/api/channel/updateChannel/${serverId}/${channelId}`, data);
  },

  // DELETE /api/channel/deleteChannel/:serverId/:channelId
  deleteChannel: (serverId, channelId) => {
    return apiClient.delete(`/api/channel/deleteChannel/${serverId}/${channelId}`);
  },
};

export default channelApi;
