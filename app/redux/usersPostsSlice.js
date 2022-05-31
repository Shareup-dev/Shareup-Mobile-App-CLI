import {createSlice} from '@reduxjs/toolkit';

const usersPostSlice = createSlice({
  name: 'userPost',
  initialState: [],
  reducers: {
    getPosts: (previousState, newPost) => {
      return (previousState = newPost.payload);
    },
  },
});

export const usersPostActions = usersPostSlice.actions;
export default usersPostSlice.reducer;
