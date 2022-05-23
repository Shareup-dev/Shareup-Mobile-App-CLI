import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Button from '../components/buttons/Button';
import GiftDrawer from '../components/drawers/GiftDrawer';
import Icon from '../components/Icon';
import HangCard from '../components/lists/HangCard';
import Screen from '../components/Screen';
import Separator from '../components/Separator';
import colors from '../config/colors';
import constants from '../config/constants';
import routes from '../navigation/routes';
import * as ImagePicker from 'react-native-image-picker';
//import ImageCropPicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {useImagePicker} from '../hooks';

import { postDataSliceAction } from '../redux/postDataSlice';


export default function KeepHangScreen({navigation, route}) {
  const dispatch = useDispatch();
  const postImages = useSelector(state => state.postImages);
  const postType = route.params;
  const {file, pickImage, openCamera, clearFile} = useImagePicker();
  const {width, height} = Dimensions.get('window');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const {postTypes} = constants;
  //const [file, setFile] = useState([]);
  const hangList = [
    {
      id: 1,
      title: 'Hang Flow',
      image: '',
      onPress: () => {
        navigation.navigate(routes.HANG_FLOW_SCREEN);
      },
    },
    {
      id: 2,
      title: 'Hang Gifts',
      image: require('../assets/icons/gray-gift-icon.png'),
      onPress: () => setIsDrawerVisible(!isDrawerVisible),
    },
    {
      id: 3,
      title: 'Hang Meals',
      image: require('../assets/icons/gray-food-icon.png'),
    },
    {
      id: 4,
      title: '',
      image: '',
    },
    {id: 5, title: '', image: ''},
  ];
  const handleImagePicker = async () => {
    ImagePicker.launchImageLibrary({
      mediaType: 'photo',
     selectionLimit: 5,
    }).then(image => {
     
      const uris = image.assets.map(item => {
        return item.uri;
      });
      
      dispatch(postDataSliceAction.setImages(uris)) ,
          navigation.navigate(routes.ADD_POST, {
             postType: postType,
          });
    }).catch(error => console.error(error));
  };

 
  const handleCamera = async () => {
   ImagePicker.launchCamera({
      mediaType: 'photo',
     
    }).then(image => {
      const uris = image.assets.map(item => {
        return item.uri;
      });
      
      dispatch(postDataSliceAction.setImages(uris)),
      
          navigation.navigate(routes.ADD_POST, {
             postType: postType,
          });
     return image;
    });
  };
  return (
    <Screen statusPadding={true}>
      {postType === postTypes.HANG_SHARE ? (
        <View style={styles.header}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" type="Ionicons" size={50} />
          </TouchableWithoutFeedback>

          <Text style={styles.headerTitle}> Today to me, tomorrow to you</Text>
        </View>
      ) : (
        <View style={styles.header}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" type="Ionicons" size={50} />
          </TouchableWithoutFeedback>
        </View>
      )}
      {postType === postTypes.HANG_SHARE ? (
        <View style={styles.listContainer}>
          <FlatList
            data={hangList}
            horizontal
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <HangCard
                title={item.title}
                image={item.image}
                onPress={item.onPress}
              />
            )}
          />
        </View>
      ) : (
        <View />
      )}
      <View style={styles.line} />

      <View style={styles.cameraIcon}>
        <TouchableWithoutFeedback onPress={handleCamera}>
          <Icon
            name="camera"
            type="Feather"
            color={colors.mediumGray}
            backgroundSizeRatio={0.7}
          />
        </TouchableWithoutFeedback>
      </View>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Access Your Camera roll to hare</Text>
          <Text style={styles.title}>Photos</Text>
          <Text style={styles.text}>Choose how you want to allow access</Text>
          <View style={styles.extraSpace} />
          <View style={styles.sectionWrapper}>
            <Icon
              name="image"
              type="Feather"
              backgroundSizeRatio={0.7}
              color="#4CAF50"
              style={styles.icon}
            />
            <View style={styles.textWrapper}>
              <Text style={styles.subTitle}>Allow access to all photo</Text>
              <Text style={styles.text}>
                Find Photos and videos faster by viewing
              </Text>
              <Text style={styles.text}>your entire camera roll</Text>
            </View>
          </View>

          <Separator text="Or" style={styles.separator} />

          <View style={styles.sectionWrapper}>
            <Icon
              name="check-circle"
              type="Feather"
              backgroundSizeRatio={0.7}
              color={colors.iondigoDye}
              style={styles.icon}
            />
            <View style={styles.textWrapper}>
              <Text style={styles.subTitle}>Select photos to limit access</Text>
              <Text style={styles.text}>
                You'll need to manually select new photos
              </Text>
              <Text style={styles.text}>every time you want to share</Text>
            </View>
          </View>
          <View style={styles.endWrapper}>
            <Text style={styles.text}>
              Select allow access to all Photos to make
            </Text>
            <Text style={styles.text}>Sharing easier</Text>
          </View>
          <View style={styles.button}>
            <Button title="Continue" onPress={handleImagePicker} />
          </View>
        </View>
      </ScrollView>

      <GiftDrawer
        isVisible={isDrawerVisible}
        setIsVisible={setIsDrawerVisible}
        onPress={item => {
          navigation.navigate(routes.CHECKOUT, {
            postType: postTypes.HANG_SHARE,
            item,
          }),
            setIsDrawerVisible(false);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
  },
  line: {
    height: 1.5,
    width: '100%',
    backgroundColor: colors.lighterGray,
  },
  listContainer: {
    padding: 10,
  },
  cameraIcon: {
    alignItems: 'flex-end',
    marginTop: 20,
    marginRight: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  text: {
    color: colors.mediumGray,
    fontSize: 13,
    marginTop: 5,
  },
  sectionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    marginVertical: 20,
  },
  endWrapper: {
    marginTop: '15%',
    alignItems: 'center',
    // backgroundColor: "red",
  },
  button: {
    width: '70%',
    marginVertical: 10,
  },
  extraSpace: {
    marginVertical: 15,
  },
  icon: {
    marginRight: 15,
  },
});
