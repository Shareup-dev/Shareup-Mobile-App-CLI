import { configureStore } from "@reduxjs/toolkit";

import likeReducer from "./like";
import sentRequests from "./sentRequests";
import loggedInUserSlice from "./loggedInUser";
import commentsReducer from "./comments";
import registrationSlice from "./accountRegistration";
import groupPostsReducer from "./groupPosts";
import userGroupsReducer from "./userGroups";
import swapedImages from "./swapedImages";
import imagesPickerReducer from "./imagesPickerSlice";
import stories from "./stories";
import reelScreenDetector from "./reelScreenDetector";
import groupScreenDetector from "./groupScreenDetector";
import feedPostsReducer from "./feedPostsSlice";
import messagesReducer from "./messagesSlice";
import ConversationsSlice from "./ConversationsSlice";
import postFeelings from "./postFeelings";
import recentSearch from "./recentSearch";
import postImageReducer from "./postImages";
import reelActiveIndexReducer from "./ReelActiveIndex";
import replayList from "./replyList";

export default store = configureStore({
  reducer: {
    reelActiveIndex:reelActiveIndexReducer,
    like: likeReducer,
    postImages: postImageReducer.reducer,
    comments: commentsReducer.reducer,
    loggedInUserSlice: loggedInUserSlice.reducer,
    sentRequests,
    registationSlice: registrationSlice.reducer,
    groupPosts: groupPostsReducer,
    userGroups: userGroupsReducer,
    swapedImages: swapedImages.reducer,
    imagesPicker: imagesPickerReducer,
    stories: stories.reducer,
    reelScreenDetector: reelScreenDetector.reducer,
    groupScreenDetector:groupScreenDetector.reducer,
    feedPosts: feedPostsReducer,
    messages: messagesReducer,
    conversations: ConversationsSlice,
    postFeel: postFeelings,
    recentSearch:recentSearch,
    replayList:replayList.reducer
  },
});
