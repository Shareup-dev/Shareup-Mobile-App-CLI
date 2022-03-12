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

const StoryViewScreen = ({navigation, route}) => {
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
    startProgress();
    return () => {
      pauseProgress();
    };
  }, []);

  return (
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
          </View>
        </>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default StoryViewScreen;

const styles = StyleSheet.create({
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
    color: '#fdfdfd',
    borderColor: '#585858',
    marginLeft: 20,
    fontSize: 18,
    fontWeight: '600',
  },
  closeIcon: {},
});
