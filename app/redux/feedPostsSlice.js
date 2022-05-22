import { createSlice } from "@reduxjs/toolkit";

const feedPostsSlice = createSlice({
  name: "feedPosts",
  initialState: [],
  reducers: {
    setFeedPosts: (previousState, newFeedPost) => {
      return (previousState = newFeedPost.payload);
    },
    addFeedPost: (previousFeedPosts, newFeedPost) => {
      let allFeedPosts = [newFeedPost.payload, ...previousFeedPosts];
      return (previousFeedPosts = allFeedPosts);
    },
    removeFeedPost: (previousFeedPosts, key) => {
      const array = previousFeedPosts.filter(item => item["id"] !== key.payload);
      return (previousFeedPosts = array);
    },
    updateFeedPost: (previousFeedPosts,newFeedPost) => {
      console.log(newFeedPost,"newFeedPost::",newFeedPost.payload);
      const array = previousFeedPosts.map(item => {
       if (item["id"] !== newFeedPost.payload["id"]){
          return item
       }else{
         
          item = newFeedPost.payload
          return item
       }
      });
      return (previousFeedPosts = array);
    },
    // ToDO: Add update reducer
  },
});

export const feedPostsAction = feedPostsSlice.actions;
export default feedPostsSlice.reducer;
