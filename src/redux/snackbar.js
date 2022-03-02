import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  text: '',
  variant: 'default',
  open: false,
  duration: 6000,
};

export const snackbar = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    openSnackbar: (state, newState) => {
      return {...newState.payload, open: true};
    },
    closeSnackbar: (state, newState) => {
      return initialState;
    },
  },
});

export const snackbarActions = snackbar.actions;

export default snackbar.reducer;
