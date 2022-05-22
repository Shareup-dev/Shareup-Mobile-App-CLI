import {createSlice} from '@reduxjs/toolkit';

const updatePostMode = createSlice({
  name: 'updatePostMode',
  initialState: false,
  reducers: {
    setState: (previousState, newState) => {
        return (previousState = newState.payload);
      },
    removeState: previousState => {
      return (previousState = false);
    },
  },
});
export default updatePostMode;
export const updatePostModeAction = updatePostMode.actions;
