import { useMutation, useQueryClient } from '@tanstack/react-query';
import channelApi from '../api/channel.api';
import { toast } from 'react-toastify';

export const useCreateChannel = (serverId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, type = 'text', topic = '' }) => {
      // Connects to Channel Controller:
      // POST /api/channel/createChannel/:serverId
      const res = await channelApi.createChannel(serverId, { name, type, topic });
      return res.data?.data || res.data;
    },
    onSuccess: (newChannel) => {
      toast.success(`Channel #${newChannel?.name || 'created'} is now live in orbit!`);
      queryClient.invalidateQueries({ queryKey: ['channels', serverId] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to construct channel node');
    },
  });
};

export default useCreateChannel;
