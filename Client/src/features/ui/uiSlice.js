import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMemberDrawerOpen: true,
  isChannelDrawerOpen: true,
  activeModal: null, // 'createChannel' | 'createServer' | 'serverSettings' | 'userProfile' | 'invite'
  modalData: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMemberDrawer: (state) => {
      state.isMemberDrawerOpen = !state.isMemberDrawerOpen;
    },
    setMemberDrawerOpen: (state, action) => {
      state.isMemberDrawerOpen = action.payload;
    },
    toggleChannelDrawer: (state) => {
      state.isChannelDrawerOpen = !state.isChannelDrawerOpen;
    },
    setChannelDrawerOpen: (state, action) => {
      state.isChannelDrawerOpen = action.payload;
    },
    openModal: (state, action) => {
      state.activeModal = action.payload.modal;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
  },
});

export const {
  toggleMemberDrawer,
  setMemberDrawerOpen,
  toggleChannelDrawer,
  setChannelDrawerOpen,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
