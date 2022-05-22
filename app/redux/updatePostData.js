import {createSlice} from '@reduxjs/toolkit';

const updatePostData = createSlice({
  name: 'updatePostData',
  initialState: [],
  reducers: {
    setState: (previousState, newState) => {
        return (previousState = newState.payload);
      },
    removeState: previousState => {
      return (previousState = []);
    },
  },
});
export default updatePostData;
export const updatePostDataAction = updatePostData.actions;
