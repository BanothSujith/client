import { configureStore } from '@reduxjs/toolkit';
import { themeReducer } from './slices';
import { videoPlayingReducer } from './slices';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    videoPlaying: videoPlayingReducer,
  },
});

export default store;
