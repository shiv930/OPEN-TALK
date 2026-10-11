import apiClient from './axios';

/**
 * Role Endpoints
 * Backend Controller: src/controllers/role.controller.js
 */
export const roleApi = {
  // GET /api/role/getAllRoles/:serverId
  getRoles: (serverId) => {
    return apiClient.get(`/api/role/getAllRoles/${serverId}`);
  },

  // GET /api/role/getSingleRole/:roleId
  getRole: (roleId) => {
    return apiClient.get(`/api/role/getSingleRole/${roleId}`);
  },

  // POST /api/role/createRole/:serverId
  createRole: (serverId, data) => {
    return apiClient.post(`/api/role/createRole/${serverId}`, data);
  },

  // PATCH /api/role/updateRole/:roleId
  updateRole: (roleId, data) => {
    return apiClient.patch(`/api/role/updateRole/${roleId}`, data);
  },

  // DELETE /api/role/deleteRole/:roleId
  deleteRole: (roleId) => {
    return apiClient.delete(`/api/role/deleteRole/${roleId}`);
  },
};

export default roleApi;
