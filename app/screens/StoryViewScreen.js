import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';

import Icon from '../components/Icon';
import colors from '../config/colors';
import fileStorage from '../config/fileStorage';
import {Menu, Divider, Provider} from 'react-native-paper';
import DownModal from '../components/drawers/DownModal';

const StoryViewScreen = ({navigation, route}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const scale = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('screen').width;

  const [duration, setDuration] = useState(6000);

  let startTime;
  let pauseTime;

  const startProgress = () => {
    startTime = new Date().valueOf();
    Animated.timing(scale, {
      toValue: windowWidth / 2,
      useNativeDriver: true,
      duration: duration,
    }).start(({finished}) => {
      if (finished) navigation.popToTop();
    });
  };

  const pauseProgress = () => {
    pauseTime = new Date().valueOf();
    setDuration(prev => prev - (pauseTime - startTime));

    Animated.timing(scale).stop();
  };

  useEffect(() => {
    // startProgress();
    return () => {
      pauseProgress();
    };
  }, []);

  const DropDownMenu = () => {
    return (
      <View style={styles.menuContainer}>
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: '#cacaca',
              width: 80,
              height: 6,
              borderRadius: 6,
            }}
          />
        </View>
        <TouchableOpacity style={styles.menu}>
          <View>
            <Text style={styles.menuText}>Edit</Text>
            <Text>Edit the Caption</Text>
          </View>
          <Icon size={45} name={'edit'} type="Entypo" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu}>
          <View>
            <Text style={styles.menuText}>Delete</Text>
            <Text>Delete your story</Text>
          </View>
          <Icon size={45} name={'delete'} color="crimson" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu}>
          <View>
            <Text style={styles.menuText}>Hide this story</Text>
            <Text
              style={{
                maxWidth: 200,
              }}>{`Posted by @${route.params?.userName}`}</Text>
          </View>
          <Icon size={45} name={'eye-with-line'} type="Entypo" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => {
          pauseProgress();
        }}
        onPressOut={() => {
          startProgress();
        }}>
        <ImageBackground
          style={{width: '100%', height: '100%'}}
          source={{uri: fileStorage.baseUrl + route.params.image}}>
          <>
            <View
              style={{
                backgroundColor: '#CACACA',
              }}>
              <Animated.View
                style={{
                  backgroundColor: '#242424',
                  transform: [
                    {
                      scaleX: scale,
                    },
                  ],
                  width: 4,
                  height: 4,
                }}
              />
            </View>
            <View style={styles.container}>
              <View style={styles.profileContainer}>
                <View style={styles.profileImg}>
                  <Image
                    source={require('../assets/icons/user-icon.png')}
                    resizeMode={'center'}
                    style={styles.userProfileImg}
                  />
                </View>
                <Text style={styles.userName}>{route.params.userName}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => {
                    setMenuOpen(true);
                  }}>
                  <Icon
                    name={'options'}
                    type={'SimpleLineIcons'}
                    size={54}
                    backgroundColor={'unset'}
                    noBackground={true}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => {
                    navigation.popToTop();
                  }}>
                  <Icon
                    name={'close'}
                    type={'AntDesign'}
                    size={54}
                    backgroundColor={'unset'}
                    noBackground={true}
                  />
                </TouchableOpacity>
                <DownModal isVisible={menuOpen} setIsVisible={setMenuOpen}>
                  <DropDownMenu />
                </DownModal>
              </View>
            </View>
          </>
        </ImageBackground>
      </TouchableOpacity>
    </>
  );
};

export default StoryViewScreen;

const styles = StyleSheet.create({
  menuContainer: {},
  menu: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderBottomWidth: 0.6,
    // borderBottomColor: '#cacaca',
  },
  menuText: {
    fontWeight: '600',
    fontSize: 20,
    color: '#585858',
  },
  borderLine: {
    borderBottomWidth: 5,
    borderColor: colors.grayX11Gray,
    position: 'absolute',
    top: 50,
    zIndex: 1,
    width: '10%',
  },
  profileImg: {
    width: 56,
    height: 56,

    borderWidth: 2,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grayX11Gray,
    borderColor: colors.mediumGray,
  },
  container: {
    marginHorizontal: 8,
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  profileContainer: {
    flexDirection: 'row',

    alignItems: 'center',
  },
  userProfileImg: {
    width: 32,
    height: 32,
  },
  userName: {
    maxWidth: 200,
    color: '#fdfdfd',
    textShadowColor: 'black',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 8,
    fontWeight: '800',
    marginLeft: 20,
    fontSize: 18,
    fontWeight: '600',
  },
  closeIcon: {},
});
