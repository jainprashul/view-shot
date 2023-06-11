import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CameraState {
  video: boolean;
  audio: boolean;
  stream: MediaStream | null;
}

const initialState: CameraState = {
  video: true,
  audio: false,
  stream: null,
};

const cameraSlice = createSlice({
  name: "camera",
  initialState,
  reducers: {
    toggleVideo(state) {
      state.video = !state.video;
      const vtracks = state.stream?.getVideoTracks();
      if (vtracks) {
        if (vtracks) {
          vtracks[0].enabled = state.video;
        }
      }
    },
    toggleAudio(state) {
      state.audio = !state.audio;
      const atracks = state.stream?.getAudioTracks();
      if (atracks) {
        atracks[0].enabled = state.audio;
      }
    },
    setStream(state, action: PayloadAction<MediaStream>) {
      state.stream = action.payload;
    },
  },
});

export const cameraActions = cameraSlice.actions;
export default cameraSlice.reducer;
