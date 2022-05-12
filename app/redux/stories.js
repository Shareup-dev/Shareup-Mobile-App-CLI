import { createSlice } from "@reduxjs/toolkit";

const stories = createSlice({
  name: "stories",
  initialState: [],
  reducers: {
    setStories: (previousState, newStories) => {
      return (previousState = newStories.payload);
    },
    addNewStory: (previousStories, newStory) => {
      // let allStories = [...previousStories, newStory.payload];
      // return (previousStories = allStories);
      return (previousStories );
    },
  },
});
export default stories;
export const storiesAction = stories.actions;
