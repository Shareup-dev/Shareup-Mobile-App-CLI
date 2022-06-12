import {createSlice} from '@reduxjs/toolkit';

const stories = createSlice({
  name: 'stories',
  initialState: {
    myStories: {
      stories_List: [],
    },
    friendsStories: [],
  },
  reducers: {
    setMyStories: (previousState, newStories) => {
      const allStories = {...previousState, myStories: newStories.payload};
      return (previousState = allStories);
    },
    deleteStories: (previousState, id) => {
      const filteredStories = previousState.myStories.stories_List.filter(
        item => item.id !== id.payload,
      );
      const allStories = {
        ...previousState,
        myStories: {...previousState.myStories, stories_List: filteredStories},
      };
      return (previousStories = allStories);
    },

    setFriendsStories: (previousState, newStories) => {
      const allStories = {...previousState, friendsStories: newStories.payload};
      return (previousState = allStories);
    },
    addNewStory: (previousStories, newStory) => {
      let allStories = {
        ...previousStories,
        myStories: {
          ...newStory.payload.user,
          stories_List: [
            newStory.payload,
            ...previousStories?.myStories?.stories_List,
          ],
        },
      };
      return (previousStories = allStories);
    },
  },
});
export default stories;
export const storiesAction = stories.actions;
