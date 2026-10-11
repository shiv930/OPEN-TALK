import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://open-talk-9v3h.onrender.com';

const REFRESH_URL = '/api/auth/regenrate-access-token';

let refreshPromise = null;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, status } = error.response || {};

    if (
      status !== 401 ||
      !config ||
      config.url?.includes('/api/auth/')
    ) {
      return Promise.reject(error);
    }

    if (config._retry) {
      localStorage.removeItem('opentalk_token');
      localStorage.removeItem('opentalk_user');

      if (!config.url?.includes('/api/user/get-me')) {
        window.dispatchEvent(new Event('opentalk:unauthorized'));
      }

      return Promise.reject(error);
    }

    config._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axios.post(
          `${API_BASE_URL}${REFRESH_URL}`,
          null,
          { withCredentials: true }
        );
      }

      await refreshPromise;
      return apiClient(config);
    } catch {
      localStorage.removeItem('opentalk_token');
      localStorage.removeItem('opentalk_user');

      if (!config.url?.includes('/api/user/get-me')) {
        window.dispatchEvent(new Event('opentalk:unauthorized'));
      }

      return Promise.reject(error);
    } finally {
      refreshPromise = null;
    }
  }
);

export default apiClient;