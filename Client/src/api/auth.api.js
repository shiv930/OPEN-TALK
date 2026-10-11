import apiClient from './axios';


export const authApi = {
  register: (formData) => {
    return apiClient.post('/api/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  login: (credentials) => {
    return apiClient.post('/api/auth/login', credentials);
  },

 
  logout: () => {
    return apiClient.post('/api/auth/logout');
  },

 
  forgetPassword: (data) => {
    return apiClient.post('/api/auth/forget-password', data);
  },

  
  verifyOtp: (data) => {
    return apiClient.post('/api/auth/verify-otp', data);
  },

 
  resetPassword: (data) => {
    return apiClient.post('/api/auth/resetPassword', data);
  },

 
  resendOtp: (data) => {
    return apiClient.post('/api/auth/resend-otp', data);
  },

  
  regenerateToken: () => {
    return apiClient.post('/api/auth/regenrate-access-token');
  },
};

export default authApi;
