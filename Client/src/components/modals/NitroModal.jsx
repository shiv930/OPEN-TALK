import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Crown, Loader2 } from 'lucide-react';
import Modal from './Modal';
import GlowButton from '../common/GlowButton';
import { createNitroOrder, verifyNitroPayment } from '../../services/payment.service';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    const script = existingScript || document.createElement('script');

    script.onload = () => {
      if (window.Razorpay) resolve();
      else reject(new Error('Razorpay checkout failed to load'));
    };
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout'));

    if (!existingScript) {
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

export default function NitroModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);

  const handleGetNitro = async () => {
    setIsStartingCheckout(true);

    try {
      await loadRazorpay();
      const order = await createNitroOrder();

      if (!order?.orderId || !order?.keyId || !window.Razorpay) {
        throw new Error('Nitro payment order response is incomplete');
      }

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'OpenTalk Nitro',
        description: 'Nitro purchase',
        order_id: order.orderId,
        theme: { color: '#a78bfa' },
        handler: async (paymentResponse) => {
          try {
            await verifyNitroPayment({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });
            await queryClient.invalidateQueries({ queryKey: ['myNitro'] });
            await queryClient.invalidateQueries({ queryKey: ['channels'] });
            await queryClient.invalidateQueries({ queryKey: ['members'] });
            await queryClient.invalidateQueries({ queryKey: ['messages'] });
            toast.success('Nitro activated successfully!');
          } catch (error) {
            toast.error(error.response?.data?.message || 'Payment verification failed');
          }
        },
      });

      checkout.on('payment.failed', (event) => {
        toast.error(event.error?.description || 'Payment was not completed');
      });
      checkout.open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to start Nitro payment');
    } finally {
      setIsStartingCheckout(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="OpenTalk Nitro"
      subtitle="Continue to secure payment."
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-2xl border border-purple-400/20 bg-purple-500/[0.06] p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-200">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">Nitro</p>
            <p className="mt-1 text-xs text-slate-400">Payment order is created securely by OpenTalk.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <GlowButton
            variant="violet"
            size="md"
            icon={isStartingCheckout ? Loader2 : Crown}
            isLoading={isStartingCheckout}
            onClick={handleGetNitro}
          >
            Continue to payment
          </GlowButton>
        </div>
      </div>
    </Modal>
  );
}
