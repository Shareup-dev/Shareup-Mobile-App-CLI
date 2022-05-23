import {createSlice} from '@reduxjs/toolkit';

const groupIdSlice = createSlice({
  name: 'groupIdSlice',
  initialState: 0,
  reducers: {
    setState: (previousState, newState) => {
        return (previousState = newState.payload);
      },
    removeState: (previousState) => {
      return (previousState = 0);
    },
  },
});
export default groupIdSlice;
export const groupIdSliceAction = groupIdSlice.actions;
