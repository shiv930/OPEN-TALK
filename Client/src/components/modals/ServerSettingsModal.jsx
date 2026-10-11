import React, { useState } from 'react';
import Modal from './Modal';
import GlowButton from '../common/GlowButton';
import Avatar from '../common/Avatar';
import { useMembers } from '../../hooks/useMembers';
import serverApi from '../../api/server.api';
import { toast } from 'react-toastify';
import { Shield, Trash2, Users, Layers, AlertTriangle, Save } from 'lucide-react';

export default function ServerSettingsModal({ isOpen, onClose, server }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'members' | 'danger'
  const [name, setName] = useState(server?.name || '');
  const [description, setDescription] = useState(server?.description || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: members = [] } = useMembers(server?._id);

  const handleUpdateOverview = async (e) => {
    e.preventDefault();
    if (!server?._id) return;
    setIsUpdating(true);
    try {
      // Connects to Server Controller:
      // PATCH /api/server/update-server/:serverId
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      await serverApi.updateServer(server._id, formData);
      toast.success('Server configuration synchronized!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update server parameters');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteServer = async () => {
    if (!window.confirm(`Are you certain you want to permanently decommission "${server?.name}"?`)) {
      return;
    }
    try {
      // DELETE /api/server/delete-server/:serverId
      await serverApi.deleteServer(server._id);
      toast.success('Server decommissioned.');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete server');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${server?.name || 'Server'} — Orbital Configuration`}
      subtitle="Modify parameters, access control, and constellation roles."
      maxWidth="max-w-2xl"
    >
      <div className="flex gap-4 min-h-[320px]">
        {/* Left Tab Navigation */}
        <div className="w-40 shrink-0 flex flex-col gap-1 border-r border-white/[0.06] pr-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
              activeTab === 'overview'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
              activeTab === 'members'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Members ({members.length})
          </button>

          <button
            onClick={() => setActiveTab('danger')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left mt-auto ${
              activeTab === 'danger'
                ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                : 'text-red-400/70 hover:text-red-300 hover:bg-red-500/10'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Danger Zone
          </button>
        </div>

        {/* Right Content View */}
        <div className="flex-1 pl-2">
          {activeTab === 'overview' && (
            <form onSubmit={handleUpdateOverview} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Server Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-500/50 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-500/50 text-xs text-slate-100 resize-none"
                />
              </div>

              <div className="pt-2">
                <GlowButton type="submit" variant="primary" size="sm" icon={Save} isLoading={isUpdating}>
                  Save Adjustments
                </GlowButton>
              </div>
            </form>
          )}

          {activeTab === 'members' && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              <span className="text-[11px] text-slate-400 block mb-2">
                Current participants attached to this constellation frequency.
              </span>
              {members.map((m) => {
                const u = m.user || m;
                return (
                  <div
                    key={m._id || u._id}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar src={u.profile_pic} name={u.username} size="sm" />
                      <div>
                        <div className="text-xs font-medium text-slate-200">{u.username}</div>
                        <div className="text-[10px] text-cyan-400">{m.role || 'Member'}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-3">
              <h4 className="text-xs font-semibold text-red-300 uppercase tracking-wider">
                Decommission Server
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Permanently terminates this server node, its frequencies, and all stored communications. This action is irreversible.
              </p>
              <GlowButton variant="danger" size="sm" icon={Trash2} onClick={handleDeleteServer}>
                Decommission Node
              </GlowButton>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
