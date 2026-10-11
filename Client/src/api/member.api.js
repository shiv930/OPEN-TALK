import apiClient from './axios';

/**
 * Server Member Endpoints
 * Backend Controller: src/controllers/serverMember.controller.js
 */
export const memberApi = {
  // GET /api/serverMember/get-server-member/:serverId
  getServerMembers: (serverId) => {
    return apiClient.get(`/api/serverMember/get-server-member/${serverId}`);
  },

  // DELETE /api/serverMember/remove-member/:serverId/:userId
  removeMember: (serverId, userId) => {
    return apiClient.delete(`/api/serverMember/remove-member/${serverId}/${userId}`);
  },

  // PATCH /api/serverMember/update-member-role/:serverId/:userId
  updateMemberRole: (serverId, userId, roleId) => {
    return apiClient.patch(`/api/serverMember/update-member-role/${serverId}/${userId}`, { roleId });
  },
};

export default memberApi;
