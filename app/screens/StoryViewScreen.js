import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import Icon from '../components/Icon';
import colors from '../config/colors';
import fileStorage from '../config/fileStorage';
import {ProgressBar} from 'react-native-paper';

const StoryViewScreen = ({navigation, route}) => {
  let interval = useRef(null);
  const [process, setProcess] = useState(0);
  const [hold, setHold] = useState(false);

  const startTimer = (duration = 0) => {
    interval.current = setInterval(() => {
      if (duration <= 100) {
        setProcess(duration / 100);
        duration = duration + 5;
      } else {
        clearInterval(interval.current);
        navigation.popToTop();
      }
    });
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => {
        clearInterval(interval.current);
        setHold(true);
      }}
      onPressOut={() => {
        startTimer(process * 100);
        setHold(false);
      }}>
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        source={{uri: fileStorage.baseUrl + route.params.image}}>
        {/* <View ref={borderLineRef} style={[styles.borderLine]}></View> */}
        {!hold ? (
          <>
            <ProgressBar
              progress={process}
              style={{
                height: 5,
                backgroundColor: '#cacaca',
              }}
              color={'#242424'}
            />
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
        ) : null}
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
