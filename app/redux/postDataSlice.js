import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    postImages: [],
    groupId: null,
    postDetail: [],
    EditPost: false,
  };

const postDataSlice = createSlice({
  name: 'postDataSlice',
  initialState: initialState,
  reducers: {
    setImages: (previousState, newState) => {
       previousState.postImages = [...previousState.postImages, ...newState.payload];
      return (previousState);
    },
    removeAllImages: previousState => {
      previousState.postImages = []
      return (previousState);
    },
    removeImage: (previousState, key) => {
      previousState.postImages  = previousState.postImages.filter(item => item !== key.payload);
      return (previousState);
    },
    addNewImages: (previousState, newState) => {
      previousState.postImages = newState.payload
      return (previousState);
    },
    //..............GROUP_ID.......................
    setGroupId: (previousState, newState) => {
      previousState.groupId = newState.payload
        return (previousState);
      },
    removeGroupId: (previousState) => {
      previousState.groupId = null
      return (previousState);
    },
    //................POST_DATA.....................
    setPostData: (previousState, newState) => {
      previousState.postDetail = newState.payload
        return (previousState);
      },
    removePostData: previousState => {
      previousState.postDetail = []
      return (previousState);
    },
    //.................EDIT_POST....................
    setEditPost: (previousState, newState) => {
      previousState.EditPost = newState.payload
        return (previousState);
      },
    removeEditPost: previousState => {
      previousState.EditPost = false
      return (previousState);
    },
  },
});
export default postDataSlice;
export const postDataSliceAction = postDataSlice.actions;
