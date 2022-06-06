import {createSlice} from '@reduxjs/toolkit';

const feedPostsSlice = createSlice({
  name: 'feedPosts',
  initialState: [],
  reducers: {
    setFeedPosts: (previousState, newFeedPost) => {
      return (previousState = newFeedPost.payload);
    },
    addFeedPost: (previousFeedPosts, newFeedPost) => {
      console.log(newFeedPost.payload, 'new');
      let allFeedPosts = [newFeedPost.payload, ...previousFeedPosts];
      return (previousFeedPosts = allFeedPosts);
    },
    removeFeedPost: (previousFeedPosts, key) => {
      const array = previousFeedPosts.filter(
        item => item['id'] !== key.payload,
      );
      return (previousFeedPosts = array);
    },
    updateFeedPost: (previousFeedPosts, newFeedPost) => {
      const array = previousFeedPosts.map(item => {
        if (item['id'] !== newFeedPost.payload['id']) {
          return item;
        } else {
          item = newFeedPost.payload;
          return item;
        }
      });
      return (previousFeedPosts = array);
    },
    updateCommentCount: (previousFeedPosts, newState) => {
      const newvalue = previousFeedPosts.map(item => {
        if (item['id'] === newState.payload.key) {
          return {
            ...item,
            numberOfComments: newState.payload.commentCount,
          };
        }
        return item;
      });
      return (previousFeedPosts = newvalue);
    },
  },
});

export const feedPostsAction = feedPostsSlice.actions;
export default feedPostsSlice.reducer;
