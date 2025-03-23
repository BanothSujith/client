import { createSlice } from '@reduxjs/toolkit';
const savedTheme = localStorage.getItem('theme') || 'bright';
const savedVideos = JSON.parse(localStorage.getItem('videos')) || [];

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    currentTheme: savedTheme, 
  },
  reducers: {
    changeTheme: (state, action) => {
      state.currentTheme = action.payload;
      localStorage.setItem('theme', action.payload); 
    },
  },
});

const videoPlayingSlice = createSlice({
  name: 'videoPlaying',
  initialState: {
    isVideoPlaying: false,
    videos: savedVideos, 
    isSettingsPageRequest : false,
    message:"",
    messageStatus:"",
  },
  reducers: {
    changeVideoPlaying: (state, action) => {
      state.isVideoPlaying = action.payload;
    },
    setVideos: (state, action) => {
      state.videos = action.payload;
      localStorage.setItem('videos', JSON.stringify(action.payload)); 
    },
    setSettingsPageRequest: (state, _) => {
      state.isSettingsPageRequest = !state.isSettingsPageRequest
    },
    setMessage:(state,action)=>{
      state.message = action.payload;
    },
    setMessageStatus:(state,action)=>{
     state.messageStatus = action.payload;
    },
  },
});

// Export Actions
export const { changeTheme } = themeSlice.actions;
export const { changeVideoPlaying, setVideos,setSettingsPageRequest,setMessage,setMessageStatus } = videoPlayingSlice.actions;

// Export Reducers
export const themeReducer = themeSlice.reducer;
export const videoPlayingReducer = videoPlayingSlice.reducer;
