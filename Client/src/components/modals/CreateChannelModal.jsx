import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from './Modal';
import GlowButton from '../common/GlowButton';
import useCreateChannel from '../../hooks/useCreateChannel';
import { useMyNitro } from '../../hooks/useMyNitro';
import { Hash, Volume2 } from 'lucide-react';

export default function CreateChannelModal({ isOpen, onClose, serverId, defaultType = 'text' }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      type: defaultType,
      topic: '',
    },
  });

  const selectedType = watch('type');
  const { mutate: createChannel, isPending } = useCreateChannel(serverId);
  const { data: nitroStatus } = useMyNitro();
  const canCreateVoiceChannel = nitroStatus?.hasNitro === true;

  useEffect(() => {
    if (!canCreateVoiceChannel && selectedType === 'voice') {
      setValue('type', 'text');
    }
  }, [canCreateVoiceChannel, selectedType, setValue]);

  const onSubmit = (data) => {
    // Backend integration:
    // Channel Controller → createChannel()
    // POST /api/channel/createChannel/:serverId
    createChannel(
      {
        name: data.name.trim().toLowerCase().replace(/\s+/g, '-'),
        type: data.type,
        topic: data.topic?.trim() || '',
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Channel Frequency"
      subtitle="Establish a new transmission node in this server constellation."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Channel Type Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Channel Type
          </label>
          <div className={`grid ${canCreateVoiceChannel ? 'grid-cols-2' : 'grid-cols-1'} gap-2.5`}>
            <button
              type="button"
              onClick={() => setValue('type', 'text')}
              className={`flex items-center gap-3 p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                selectedType === 'text'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  : 'bg-white/[0.03] border-white/5 text-slate-400 hover:bg-white/[0.06]'
              }`}
            >
              <Hash className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Text Channel</div>
                <div className="text-[10px] text-slate-400">Post messages, links and media</div>
              </div>
            </button>

            {canCreateVoiceChannel && (
              <button
                type="button"
                onClick={() => setValue('type', 'voice')}
                className={`flex items-center gap-3 p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  selectedType === 'voice'
                    ? 'bg-purple-500/15 border-purple-500/40 text-purple-300 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                    : 'bg-white/[0.03] border-white/5 text-slate-400 hover:bg-white/[0.06]'
                }`}
              >
                <Volume2 className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Voice Lounge</div>
                  <div className="text-[10px] text-slate-400">Live spatial audio communications</div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Channel Name */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Channel Name
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-slate-400 text-xs">
              {selectedType === 'voice' ? '🔊' : '#'}
            </span>
            <input
              {...register('name', {
                required: 'Channel name is required',
                minLength: { value: 2, message: 'Minimum 2 characters' },
                maxLength: { value: 30, message: 'Maximum 30 characters' },
              })}
              placeholder="e.g. quantum-discussions"
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-500/50 focus:outline-none text-xs text-slate-100 placeholder:text-slate-500 transition-colors"
            />
          </div>
          {errors.name && (
            <span className="text-[11px] text-red-400 mt-1 block">{errors.name.message}</span>
          )}
        </div>

        {/* Topic / Purpose */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Transmission Topic (Optional)
          </label>
          <input
            {...register('topic')}
            placeholder="Describe the focus of this frequency..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-500/50 focus:outline-none text-xs text-slate-100 placeholder:text-slate-500 transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3">
          <GlowButton variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </GlowButton>
          <GlowButton type="submit" variant="primary" size="sm" isLoading={isPending}>
            Launch Channel
          </GlowButton>
        </div>
      </form>
    </Modal>
  );
}
