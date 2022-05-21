import {createSlice} from '@reduxjs/toolkit';

const replayList = createSlice({
  name: 'replayList',
  initialState: [],
  reducers: {
    setState: (previousState, newState) => {
      const Array = [...previousState, ...newState.payload];
      return (previousState = Array);
    },
    removeAll: previousState => {
      return (previousState = []);
    },
    removeState: (previousState, key) => {
      const array = previousState.filter(item => item["id"] !== key.payload);
      return (previousState = array);
    },
    addNewState: (previousState, newState) => {
      return (previousState = newState.payload);
    },
  },
});
export default replayList;
export const replayListAction = replayList.actions;
