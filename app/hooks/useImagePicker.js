import {useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from 'react-native-image-picker';
export default useImagesPicker = () => {

  const [file, setFile] = useState({});

  const pickImage = async () => {

   // get permission
    //const { granted } = await ImagePicker.launchCamera();
    //if (!granted) alert("You need to enable permission to access the library");
    // select an image
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
      console.log("Error reading an image", error);
    }
  };

  const clearFile = () => {
    setFile({});
  };

  return {file, pickImage, clearFile};
};
