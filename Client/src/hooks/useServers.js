import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import serverApi from '../api/server.api';
import { toast } from 'react-toastify';

export const useServers = () => {
  return useQuery({
    queryKey: ['servers'],
    queryFn: async () => {
      const res = await serverApi.getServers();
      return Array.isArray(res.data?.data) ? res.data.data : [];
    },
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};

export const useCreateServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await serverApi.createServer(formData);
      return res.data?.data || res.data;
    },
    onSuccess: (newServer) => {
      toast.success('Server node created in orbit!');
      queryClient.setQueryData(['servers'], (old = []) => [...old, newServer]);
      queryClient.invalidateQueries({ queryKey: ['servers'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create server');
    },
  });
};

export const useJoinServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteCode) => {
      const res = await serverApi.joinServer(inviteCode);
      return res.data?.data || res.data;
    },
    onSuccess: () => {
      toast.success('Joined cosmic server node!');
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      queryClient.invalidateQueries({ queryKey: ['publicServers'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Invalid or expired invite code');
    },
  });
};
