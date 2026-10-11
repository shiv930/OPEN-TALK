import { useQuery } from '@tanstack/react-query';
import { getMyNitro } from '../services/payment.service';

export const useMyNitro = () =>
  useQuery({
    queryKey: ['myNitro'],
    queryFn: getMyNitro,
    staleTime: 1000 * 60,
  });

export default useMyNitro;
