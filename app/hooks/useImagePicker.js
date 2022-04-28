import {useState} from 'react';
//import {launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from 'react-native-image-picker';
//import ImagePicker from 'react-native-image-crop-picker';

export default function useImagesPicker() {
  const [file, setFile] = useState([]);

  const pickImage = async() => {
    // ImagePicker.launchImageLibrary({
    //   mediaType: 'photo',
    //  selectionLimit: 5,
    // }).then(image => {
    //   console.log(image);
    //   setFile(image);
    //  return image;
    // });
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 5,
        //allowsEditing: true,
        //allowsMultipleSelection: true,
        //quality: 0.5,
      });
      setFile(result.assets);
      return result.assets;
    } catch (error) {
      console.error("Error reading an image", error);
    }
  };

  const clearFile = () => {
    setFile([]);
  };
  return {file, pickImage, clearFile};
}
