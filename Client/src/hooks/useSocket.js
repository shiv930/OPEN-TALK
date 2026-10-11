import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { connectSocket, leaveChannelRoom } from '../socket/socket';

/**
 * Custom hook to link active channel real-time events directly to TanStack Query cache.
 */
export const useSocket = (channelId) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = connectSocket();

    const handleConnect = () => {
      if (channelId) socket.emit('joinChannel', channelId);
    };

    socket.on('connect', handleConnect);
    if (socket.connected) handleConnect();

    const handleNewMessage = (newMessage) => {
      // Check if message belongs to this channel
      const msgChannelId = newMessage.channel_id || newMessage.channel;
      if (msgChannelId && msgChannelId !== channelId) return;

      queryClient.setQueryData(['messages', channelId], (oldMessages = []) => {
        // Prevent duplicate appending
        const exists = oldMessages.some(
          (m) => m._id === newMessage._id || (m.isOptimistic && m.content === newMessage.content)
        );
        if (exists) {
          return oldMessages.map((m) =>
            m.isOptimistic && m.content === newMessage.content ? newMessage : m
          );
        }
        return [...oldMessages, newMessage];
      });
    };

    const handleMessageUpdated = (updatedMessage) => {
      queryClient.setQueryData(['messages', channelId], (oldMessages = []) =>
        oldMessages.map((message) =>
          message._id === updatedMessage._id ? { ...message, ...updatedMessage } : message
        )
      );
    };

    const handleMessageDeleted = ({ messageId, channelId: deletedChannelId }) => {
      if (deletedChannelId && deletedChannelId !== channelId) return;
      queryClient.setQueryData(['messages', channelId], (oldMessages = []) =>
        oldMessages.filter((message) => message._id !== messageId)
      );
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messageUpdated', handleMessageUpdated);
    socket.on('messageDeleted', handleMessageDeleted);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messageUpdated', handleMessageUpdated);
      socket.off('messageDeleted', handleMessageDeleted);
      socket.off('connect', handleConnect);
      if (channelId) {
        leaveChannelRoom(channelId);
      }
    };
  }, [channelId, queryClient]);
};

export default useSocket;
