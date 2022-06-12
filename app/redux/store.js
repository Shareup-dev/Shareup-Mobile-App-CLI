import {configureStore} from '@reduxjs/toolkit';

import sentRequests from './sentRequests';
import groupPostsReducer from './groupPosts';
import userGroupsReducer from './userGroups';
import swapedImages from './swapedImages';
import imagesPickerReducer from './imagesPickerSlice';
import stories from './stories';
import reelScreenDetector from './reelScreenDetector';
import groupScreenDetector from './groupScreenDetector';
import feedPostsReducer from './feedPostsSlice';
import messagesReducer from './messagesSlice';
import postFeelings from './postFeelings';
import recentSearch from './recentSearch';
import reelActiveIndexReducer from './ReelActiveIndex';
import postDataSlice from './postDataSlice';
import locationSlice from './locationSlice';
import usersProfileSlice from './usersPostsSlice';

const createFlipperDebugger = require('redux-flipper').default;

const store = configureStore({
  reducer: {
    usersPost: usersProfileSlice,
    reelActiveIndex: reelActiveIndexReducer,
    sentRequests,
    groupPosts: groupPostsReducer,
    userGroups: userGroupsReducer,
    swapedImages: swapedImages.reducer,
    imagesPicker: imagesPickerReducer,
    stories: stories.reducer,
    reelScreenDetector: reelScreenDetector.reducer,
    groupScreenDetector: groupScreenDetector.reducer,
    feedPosts: feedPostsReducer,
    messages: messagesReducer,
    postFeel: postFeelings,
    recentSearch: recentSearch,
    postDataSlice: postDataSlice.reducer,
    locationSlice: locationSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(createFlipperDebugger()),
});

export default store;
