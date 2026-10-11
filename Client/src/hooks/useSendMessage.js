import { useMutation, useQueryClient } from '@tanstack/react-query';
import messageApi from '../api/message.api';
import { toast } from 'react-toastify';

export const useSendMessage = (channelId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, attachments = [] }) => {
      // Backend integration:
      // Message Controller → createMessage()
      // POST /api/message/create-message/:channelId
      if (attachments && attachments.length > 0) {
        const formData = new FormData();
        formData.append('content', content || '');
        attachments.forEach((file) => {
          formData.append('files', file);
        });
        const res = await messageApi.createMessage(channelId, formData);
        return res.data?.data || res.data;
      } else {
        const res = await messageApi.createMessage(channelId, { content });
        return res.data?.data || res.data;
      }
    },
    onMutate: async ({ content, attachments = [] }) => {
      await queryClient.cancelQueries({ queryKey: ['messages', channelId] });

      const previousMessages = queryClient.getQueryData(['messages', channelId]) || [];

      // Optimistic Message Object
      const optimisticMsg = {
        _id: `temp-${Date.now()}`,
        content,
        author_id: 'current-user',
        author_details: { username: 'You' },
        createdAt: new Date().toISOString(),
        attachments: attachments.map((f) => ({
          name: f.name,
          type: f.type?.startsWith('image/') ? 'image' : 'file',
          url: URL.createObjectURL(f),
        })),
        isOptimistic: true,
      };

      queryClient.setQueryData(['messages', channelId], [...previousMessages, optimisticMsg]);

      return { previousMessages };
    },
    onError: (err, newMsg, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', channelId], context.previousMessages);
      }
      toast.error(err.response?.data?.message || 'Transmission failed. Retrying...');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', channelId] });
    },
  });
};

export default useSendMessage;
