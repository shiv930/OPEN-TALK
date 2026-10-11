import { useQuery } from '@tanstack/react-query';
import memberApi from '../api/member.api';
import { MOCK_MEMBERS } from '../utils/mockData';

export const useMembers = (serverId) => {
  return useQuery({
    queryKey: ['members', serverId],
    queryFn: async () => {
      if (!serverId) return [];
      try {
        const res = await memberApi.getServerMembers(serverId);
        const members = res.data?.data || res.data;
        if (Array.isArray(members) && members.length > 0) {
          return members;
        }
        return MOCK_MEMBERS;
      } catch (err) {
        console.warn('Backend members unavailable, using mock members:', err.message);
        return MOCK_MEMBERS;
      }
    },
    enabled: !!serverId,
    staleTime: 1000 * 60 * 2,
  });
};

export default useMembers;
