import apiClient from '../api/axios';

export const createNitroOrder = async () => {
  const response = await apiClient.post('/api/payments/create-order');
  return response.data?.data;
};

export const verifyNitroPayment = async (paymentDetails) => {
  const response = await apiClient.post('/api/payments/verify-nitro', paymentDetails);
  return response.data?.data;
};

export const getMyNitro = async () => {
  const response = await apiClient.get('/api/payments/my-nitro');
  const nitroStatus = response.data?.data;

  if (typeof nitroStatus?.hasNitro !== 'boolean') {
    throw new Error('Nitro status response is invalid');
  }

  return nitroStatus;
};
