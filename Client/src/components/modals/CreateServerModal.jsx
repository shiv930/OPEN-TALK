import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from './Modal';
import GlowButton from '../common/GlowButton';
import { useCreateServer } from '../../hooks/useServers';
import { Check, Copy, UploadCloud } from 'lucide-react';
import { toast } from 'react-toastify';

export default function CreateServerModal({
  isOpen,
  onClose,
  defaultCategory = 'Community',
  defaultIsPublic = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      category: defaultCategory,
      isPublic: defaultIsPublic,
    },
  });

  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [createdServer, setCreatedServer] = useState(null);
  const { mutate: createServer, isPending } = useCreateServer();

  const handleClose = () => {
    setCreatedServer(null);
    onClose();
  };

  const handleCopyInviteCode = async () => {
    if (!createdServer?.inviteCode) return;

    try {
      await navigator.clipboard.writeText(createdServer.inviteCode);
      toast.success('Invite code copied');
    } catch {
      toast.error('Could not copy automatically. Select and copy the invite code.');
    }
  };

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data) => {
    // Backend integration:
    // Server Controller → createServer()
    // POST /api/server/create-server (multipart/form-data)
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('category', data.category || 'Community');
    formData.append('isPublic', String(data.isPublic));
    if (iconFile) {
      formData.append('icon', iconFile);
    }

    createServer(formData, {
      onSuccess: (server) => {
        reset();
        setIconFile(null);
        setIconPreview(null);
        setCreatedServer(server);
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={createdServer ? 'Server Created' : 'Synthesize New Server Node'}
      subtitle={
        createdServer
          ? 'Share this invite code so others can join your server.'
          : 'Anchor a permanent collaborative space in the OpenTalk network.'
      }
    >
      {createdServer ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
            <Check className="h-5 w-5 shrink-0 text-emerald-300" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-100">{createdServer.name}</p>
              <p className="mt-1 text-xs text-slate-400">Your server is ready.</p>
            </div>
          </div>

          {createdServer.inviteCode ? (
            <div>
              <label
                htmlFor="server-invite-code"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Server invite code
              </label>
              <div className="flex gap-2">
                <input
                  id="server-invite-code"
                  value={createdServer.inviteCode}
                  readOnly
                  onFocus={(event) => event.target.select()}
                  className="min-w-0 flex-1 rounded-xl border border-cyan-400/25 bg-white/[0.04] px-3 py-2.5 font-mono text-sm tracking-wider text-cyan-200 outline-none"
                />
                <GlowButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={Copy}
                  onClick={handleCopyInviteCode}
                >
                  Copy
                </GlowButton>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                Friends can enter this code in Browse Public Hubs → Join with code.
              </p>
            </div>
          ) : (
            <p className="text-xs text-amber-300">
              The server was created, but the backend response did not include an invite code.
            </p>
          )}

          <div className="flex justify-end pt-2">
            <GlowButton type="button" variant="primary" size="sm" onClick={handleClose}>
              Done
            </GlowButton>
          </div>
        </div>
      ) : (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Server Icon Upload */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-dashed border-white/10">
          <label className="cursor-pointer group flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleIconChange}
              className="hidden"
            />
            {iconPreview ? (
              <img
                src={iconPreview}
                alt="Server icon preview"
                className="w-16 h-16 rounded-2xl object-cover border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-2"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl glass-card border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all mb-2">
                <UploadCloud className="w-6 h-6" />
              </div>
            )}
            <span className="text-xs font-medium text-slate-300 group-hover:text-cyan-400 transition-colors">
              {iconPreview ? 'Change Emblem' : 'Upload Server Icon'}
            </span>
          </label>
        </div>

        {/* Server Name */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Server Name
          </label>
          <input
            {...register('name', {
              required: 'Server name is required',
              minLength: { value: 3, message: 'Minimum 3 characters' },
              maxLength: { value: 50, message: 'Maximum 50 characters' },
            })}
            placeholder="e.g. Celestial Engineering Hub"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-500/50 focus:outline-none text-xs text-slate-100 placeholder:text-slate-500 transition-colors"
          />
          {errors.name && (
            <span className="text-[11px] text-red-400 mt-1 block">{errors.name.message}</span>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Constellation Category
          </label>
          <select
            {...register('category')}
            className="w-full px-4 py-2.5 rounded-xl bg-[#0F121A] border border-white/10 focus:border-cyan-500/50 focus:outline-none text-xs text-slate-200 transition-colors"
          >
            <option value="Community">Community</option>
            <option value="Technology">Technology & AI</option>
            <option value="Gaming">Gaming & Simulation</option>
            <option value="Science">Deep Science</option>
            <option value="Music">Audio & Synthesizers</option>
            <option value="Art">Creative Vision</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Mission Brief (Optional)
          </label>
          <textarea
            {...register('description')}
            rows={2}
            placeholder="What brings explorers to this node?"
            className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-500/50 focus:outline-none text-xs text-slate-100 placeholder:text-slate-500 resize-none transition-colors"
          />
        </div>

        <label className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <input
            type="checkbox"
            {...register('isPublic')}
            className="mt-0.5 accent-cyan-400"
          />
          <span>
            <span className="block text-xs font-semibold text-slate-200">List this server as public</span>
            <span className="mt-0.5 block text-[10px] text-slate-400">
              Public servers appear in Browse Public Hubs and can be joined by invite.
            </span>
          </span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3">
          <GlowButton variant="ghost" size="sm" onClick={handleClose}>
            Abort
          </GlowButton>
          <GlowButton type="submit" variant="primary" size="sm" isLoading={isPending}>
            Launch Server
          </GlowButton>
        </div>
      </form>
      )}
    </Modal>
  );
}
