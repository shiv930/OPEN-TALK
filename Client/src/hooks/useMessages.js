import { useQuery } from '@tanstack/react-query';
import messageApi from '../api/message.api';

export const useMessages = (channelId) => {
  return useQuery({
    queryKey: ['messages', channelId],
    queryFn: async () => {
      if (!channelId) return [];
      const res = await messageApi.getChannelMessages(channelId);
      const messages = res.data?.data || res.data;
      if (!Array.isArray(messages)) {
        throw new Error('Message response was invalid');
      }
      return [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },
    enabled: !!channelId,
    staleTime: 1000 * 30, // 30s
  });
};

export default useMessages;
