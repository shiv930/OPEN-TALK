import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../features/ui/uiSlice';
import CreateChannelModal from './CreateChannelModal';
import CreateServerModal from './CreateServerModal';
import ServerSettingsModal from './ServerSettingsModal';
import UserProfileModal from './UserProfileModal';
import NitroModal from './NitroModal';
import PublicHubsModal from './PublicHubsModal';

export default function ModalManager() {
  const dispatch = useDispatch();
  const { activeModal, modalData } = useSelector((state) => state.ui);

  const handleClose = () => {
    dispatch(closeModal());
  };

  if (!activeModal) return null;

  return (
    <>
      {activeModal === 'createChannel' && (
        <CreateChannelModal
          isOpen={true}
          onClose={handleClose}
          serverId={modalData?.serverId}
          defaultType={modalData?.defaultType || 'text'}
        />
      )}

      {activeModal === 'createServer' && (
        <CreateServerModal
          isOpen={true}
          onClose={handleClose}
          defaultCategory={modalData?.category || 'Community'}
          defaultIsPublic={modalData?.isPublic || false}
        />
      )}

      {activeModal === 'serverSettings' && (
        <ServerSettingsModal
          isOpen={true}
          onClose={handleClose}
          server={modalData?.server}
        />
      )}

      {activeModal === 'userProfile' && (
        <UserProfileModal
          isOpen={true}
          onClose={handleClose}
        />
      )}

      {activeModal === 'nitro' && (
        <NitroModal
          isOpen={true}
          onClose={handleClose}
        />
      )}

      {activeModal === 'publicHubs' && (
        <PublicHubsModal
          isOpen={true}
          onClose={handleClose}
        />
      )}
    </>
  );
}
