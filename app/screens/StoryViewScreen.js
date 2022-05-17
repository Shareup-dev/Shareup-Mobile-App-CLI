import React, {
  memo,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';

import Video from 'react-native-video';
import Icon from '../components/Icon';
import colors from '../config/colors';
import DownModal from '../components/drawers/DownModal';
import storyService from '../services/story.service';
import AuthContext from '../authContext';
import UserProfilePicture from '../components/UserProfilePicture';
import moment from 'moment';

const windowWidth = Dimensions.get('screen').width;

const StoryViewScreen = ({navigation, route}) => {
  const {
    data: {stories_List: data, firstName, lastName, id: userID, ...rest},
  } = route.params;

  const {
    userState: {userData},
  } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [Loaded, setLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  //  ----------------------- TIMER REDUCER ----------------------------//
  const initState = {
    duration: 6000,
    startedTime: 0,
    pausedTime: 0,
  };

  const actions = {
    START_TIMER: 'START_TIMER',
    PAUSE_TIMER: 'PAUSE_TIMER',
    RESET_TIMER: 'RESET_TIMER',
  };

  const timerReducer = (prevState, action) => {
    switch (action.type) {
      case actions.START_TIMER:
        return {
          ...prevState,
          startedTime: action.startTime,
        };
      case actions.PAUSE_TIMER:
        return {
          ...prevState,
          pausedTime: action.pausedTime,
          duration: action.duration,
        };
      case actions.RESET_TIMER:
        return initState;

      default:
        return initState;
    }
  };
  const [timerState, dispatch] = useReducer(timerReducer, initState);

  const width = [];
  data.map(_ => width.push(useRef(new Animated.Value(0)).current));

  // Start progress animations
  const startProgress = () => {
    let startTime = new Date().valueOf();
    dispatch({type: actions.START_TIMER, startTime});

    Animated.timing(width[activeIndex], {
      toValue: windowWidth / data.length - 2,
      useNativeDriver: false,
      duration: timerState.duration,
    }).start(({finished}) => {
      if (finished)
        if (activeIndex !== data.length - 1) {
          dispatch({type: actions.RESET_TIMER});
          setLoaded(false);
          setActiveIndex(prev => prev + 1);
        } else navigation.popToTop();
    });
  };
  // Pause progress animations
  const pauseProgress = () => {
    let pausedTime = new Date().valueOf();
    const {duration, startedTime} = timerState;
    const currentDuration = duration - (pausedTime - startedTime);

    dispatch({
      type: actions.PAUSE_TIMER,
      pausedTime,
      duration: currentDuration,
    });
    Animated.timing(width[activeIndex]).stop();
  };

  const addStoryViewer = () => {
    if (userData.id === userID) {
      return;
    }
    storyService
      .AddViews(data[activeIndex].id, userData.id)
      .then(res => res)
      .catch(e => console.error(e.message));
  };

  const handleCloseModel = () => {
    setMenuOpen(false);
    setModelOpen(false);
    startProgress();
  };

  const deleteStory = () => {
    storyService
      .deleteStory(data[activeIndex].id)
      .then(({status}) => status === 200 && navigation.goBack())
      .catch(e => console.error(e.message));
  };

  const handleDelete = () => {
    Alert.alert('Delete this?', 'Are you sure to delete this story?', [
      {text: 'Delete', style: 'destructive', onPress: deleteStory},
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: _ => {},
      },
    ]);
  };

  useEffect(() => {
    if (Loaded) {
      startProgress();
      addStoryViewer();
    }
    // return () => {
    //   Animated.timing(width[activeIndex]).stop();
    // };
  }, [Loaded]);

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
        {/* <TouchableOpacity style={styles.menu}>
          <View>
            <Text style={styles.menuText}>Edit</Text>
            <Text>Edit the Caption</Text>
          </View>
          <Icon size={45} name={'edit'} type="Entypo" />
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.menu} onPress={handleDelete}>
          <View>
            <Text style={styles.menuText}>Delete</Text>
            <Text>Delete your story</Text>
          </View>
          <Icon size={45} name={'delete'} color="crimson" />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.menu}>
          <View>
            <Text style={styles.menuText}>Hide this story</Text>
            <Text
              style={{
                maxWidth: windowWidth / 2,
              }}>{`Posted by @${route.params?.userName}`}</Text>
          </View>
          <Icon size={45} name={'eye-with-line'} type="Entypo" />
        </TouchableOpacity> */}
      </View>
    );
  };

  const StoriesViewers = () => {
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

        <View style={styles.menu}>
          <View>
            <Text style={styles.menuText}>Viewed by</Text>
            <Text>10 Views</Text>
          </View>
        </View>
      </View>
    );
  };

  const StorySlides = memo(() => {
    return (
      <View style={{position: 'absolute', zIndex: 10}}>
        <View style={{flexDirection: 'row'}}>
          {data.map((item, index) => (
            <View
              key={index}
              style={{
                paddingHorizontal: 1,
                width: windowWidth / data.length,
              }}>
              <View
                style={{
                  borderRadius: 6,
                  backgroundColor: '#CACACA',
                }}>
                <Animated.View
                  style={{
                    backgroundColor: '#00000099',
                    width: width[index],

                    borderRadius: 6,
                    height: 4,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <View style={styles.profileImg}>
              <UserProfilePicture
                profilePicture={
                  data[activeIndex].user?.profilePicturePath
                    ? data[activeIndex].user?.profilePicturePath
                    : require('../assets/icons/user-icon.png')
                }
                size={55}
              />
            </View>
            <View>
              <Text
                style={[
                  styles.userName,
                  styles.textShadow,
                ]}>{`${firstName} ${lastName}`}</Text>

              <Text style={[styles.date, styles.textShadow]}>
                {moment(
                  data[activeIndex].date,
                  'DD MMMM YYYY hh:mm:ss',
                ).fromNow()}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            {userData.id === userID && (
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => {
                  setMenuOpen(true);
                  pauseProgress();
                }}>
                <Icon
                  name={'options'}
                  type={'SimpleLineIcons'}
                  color={'#fff'}
                  size={54}
                  backgroundColor={'#fff'}
                  noBackground={true}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.closeIcon, styles.shadow]}
              onPress={() => {
                navigation.popToTop();
              }}>
              <Icon
                name={'close'}
                type={'AntDesign'}
                size={54}
                color={'#fff'}
                backgroundColor={'#fff'}
                style={styles.shadow}
                noBackground={true}
              />
            </TouchableOpacity>
            <DownModal isVisible={menuOpen} setIsVisible={handleCloseModel}>
              <DropDownMenu />
            </DownModal>
            <DownModal isVisible={modelOpen} setIsVisible={handleCloseModel}>
              <StoriesViewers />
            </DownModal>
          </View>
        </View>
      </View>
    );
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => {
        setPaused(true);
        pauseProgress();
      }}
      onPressOut={() => {
        setPaused(false);
        startProgress();
      }}>
      <StorySlides />
      {data[activeIndex]?.video ? (
        <Video
          ref={ref => (this.player = ref)}
          paused={paused}
          onLoad={_ => setLoaded(true)}
          resizeMode={'cover'}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
          }}
          source={{
            uri: data[activeIndex].storiesVideoPath,
          }}
        />
      ) : (
        <Image
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
          }}
          resizeMode={'contain'}
          onLoadEnd={_ => setLoaded(true)}
          source={{uri: data[activeIndex].storiesImagePath}}
        />
      )}
      <View
        style={{
          zIndex: 100,
          position: 'absolute',
          bottom: 50,
          width: '100%',
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={[
              {
                fontSize: 15,
                maxWidth: '70%',
                color: '#fff',
              },
              styles.textShadow,
            ]}>
            {data[activeIndex].caption}
          </Text>
          {userData.id === userID && (
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={_ => {
                setPaused(true);
                pauseProgress();
                setModelOpen(true);
              }}>
              <>
                <Icon
                  name="eye-outline"
                  type="Ionicons"
                  size={45}
                  color={'#fff'}
                  backgroundSizeRatio={0.4}
                  noBackground
                  style={{
                    marginHorizontal: -5,
                  }}
                />
                <Text
                  style={[
                    {color: '#fff'},
                    styles.textShadow,
                  ]}>{`${10} Views`}</Text>
              </>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoryViewScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
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
  backgroundVideo: {
    flex: 1,
    zIndex: -5,
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
    maxWidth: windowWidth / 2,
    color: '#fdfdfd',

    fontWeight: '800',
    marginLeft: 20,
    fontSize: 18,
    fontWeight: '600',
  },
  date: {
    maxWidth: windowWidth / 2,
    color: '#cacaca',
    marginLeft: 20,
    fontSize: 13,
  },
  textShadow: {
    textShadowColor: 'black',

    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 8,
  },
  shadow: {
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 8,
  },

  closeIcon: {},
});
