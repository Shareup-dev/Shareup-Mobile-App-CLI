import {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';

export default function useImagesPicker() {
  const [file, setFile] = useState([]);

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
        selectionLimit: 1,
      });

      if (!result.didCancel) setFile(result.assets);

      return result.assets;
    } catch (error) {
      console.log('Error reading an image', error);
    }
  };

  const clearFile = () => {
    setFile([]);
  };
  return {file, pickImage, clearFile};
}
