import { useQuery } from '@tanstack/react-query';
import channelApi from '../api/channel.api';

export const useChannels = (serverId) => {
  return useQuery({
    queryKey: ['channels', serverId],
    queryFn: async () => {
      if (!serverId) return [];
      const res = await channelApi.getChannels(serverId);
      return Array.isArray(res.data?.data) ? res.data.data : [];
    },
    enabled: !!serverId,
    staleTime: 1000 * 60 * 3,
  });
};

export default useChannels;
