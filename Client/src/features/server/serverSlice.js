import { createSlice } from '@reduxjs/toolkit';

const readSelection = (key) => {
  try {
    return localStorage.getItem(key) || null;
  } catch {
    return null;
  }
};

const persistSelection = (key, value) => {
  try {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // Navigation still works when browser storage is unavailable.
  }
};

const initialState = {
  activeServerId: readSelection('opentalk_active_server'),
  activeChannelId: readSelection('opentalk_active_channel'),
  activeVoiceChannelId: null,
  isMuted: false,
  isDeafened: false,
};

export const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    setActiveServerId: (state, action) => {
      state.activeServerId = action.payload;
      persistSelection('opentalk_active_server', action.payload);
    },
    setActiveChannelId: (state, action) => {
      state.activeChannelId = action.payload;
      persistSelection('opentalk_active_channel', action.payload);
    },
    setActiveVoiceChannelId: (state, action) => {
      state.activeVoiceChannelId = action.payload;
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    toggleDeafen: (state) => {
      state.isDeafened = !state.isDeafened;
      if (state.isDeafened) {
        state.isMuted = true;
      }
    },
  },
});

export const {
  setActiveServerId,
  setActiveChannelId,
  setActiveVoiceChannelId,
  toggleMute,
  toggleDeafen,
} = serverSlice.actions;

export default serverSlice.reducer;
