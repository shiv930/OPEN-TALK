import { io } from 'socket.io-client';
import { API_BASE_URL } from '../api/config';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL;

let socket = null;

/**
 * Initialize or get existing Socket.io singleton instance
 */
export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to OpenTalk Real-time Core:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.warn('⚠️ OpenTalk socket link notice:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 OpenTalk socket link disconnected:', reason);
    });
  }

  return socket;
};

/**
 * Connect socket instance
 */
export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
};

/**
 * Disconnect socket instance
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

/**
 * Join specific channel room
 */
export const joinChannelRoom = (channelId) => {
  const s = getSocket();
  if (channelId && s.connected) {
    s.emit('joinChannel', channelId);
  }
};

/**
 * Leave specific channel room
 */
export const leaveChannelRoom = (channelId) => {
  const s = getSocket();
  if (channelId && s.connected) {
    s.emit('leaveChannel', channelId);
  }
};

export default getSocket;
