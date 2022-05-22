import {createSlice} from '@reduxjs/toolkit';

const postTypeSlice = createSlice({
  name: 'postTypeSlice',
  initialState: '',
  reducers: {
    setState: (previousState, newState) => {
        return (previousState = newState.payload);
      },
    removeState: previousState => {
      return (previousState = '');
    },
  },
});
export default postTypeSlice;
export const postTypeSliceAction = postTypeSlice.actions;
