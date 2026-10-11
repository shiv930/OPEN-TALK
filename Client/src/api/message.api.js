import apiClient from './axios';

/**
 * Message Endpoints
 * Backend Controller: src/controllers/message.controller.js
 */
export const messageApi = {
  // GET /api/message/get-all-channel-message/:channelId
  getChannelMessages: (channelId) => {
    return apiClient.get(`/api/message/get-all-channel-message/${channelId}`);
  },

  // GET /api/message/get-all-message/:channelId
  getAllMessages: (channelId) => {
    return apiClient.get(`/api/message/get-all-message/${channelId}`);
  },

  // POST /api/message/create-message/:channelId
  // Accepts FormData (if attachments exist) or JSON body { content }
  createMessage: (channelId, payload) => {
    const isFormData = payload instanceof FormData;
    return apiClient.post(`/api/message/create-message/${channelId}`, payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
  },

  // PATCH /api/message/update-message/:messageId
  updateMessage: (messageId, content) => {
    return apiClient.patch(`/api/message/update-message/${messageId}`, { content });
  },

  // DELETE /api/message/delete-message/:messageId
  deleteMessage: (messageId) => {
    return apiClient.delete(`/api/message/delete-message/${messageId}`);
  },
};

export default messageApi;
