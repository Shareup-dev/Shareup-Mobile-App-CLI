import { createSlice } from "@reduxjs/toolkit";

let initialState = [];

const receivedRequestSlice = createSlice({
  name: "receivedRequestSlice",
  initialState,
  reducers: {
    setList: (state, newState) => {

      return (state = newState.payload);
    },
    cancelRequest: () => {
      console.log("Request Cancelled");
    },
    getList: (state) => {
      return state.payload;
    },
  },
});

export const receivedRequestsActions = receivedRequestSlice.actions;

export default receivedRequestSlice.reducer;
