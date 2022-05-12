import {createSlice} from '@reduxjs/toolkit';

const postImages = createSlice({
  name: 'postImages',
  initialState: [],
  reducers: {
    setImages: (previousState, newImages) => {
      const Array = [...previousState, ...newImages.payload];
      return (previousState = Array);
    },
    removeAllImages: previousState => {
      return (previousState = []);
    },
    removeImage: (previousState, key) => {
      const array = previousState.filter(item => item["uri"] !== key.payload);
      return (previousState = array);
    },
    addNewImages: (previousImages, newImage) => {
      return (previousImages = newImage.payload);
    },
  },
});
export default postImages;
export const postImagesAction = postImages.actions;
