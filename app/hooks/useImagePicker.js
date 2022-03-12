import {useState} from 'react';
import ImagePicker from 'react-native-image-picker';
export default function useImagesPicker() {
  const [file, setFile] = useState({});

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: '0.5',
        selectionLimit: 1,
      });
      setFile(result.assets);
      console.log('Selected image in image picker: ', result.assets);
      return result.assets;
    } catch (error) {
      console.log('Error reading an image', error);
    }
  };

  const clearFile = () => {
    setFile({});
  };

  return {file, pickImage, clearFile};
}
