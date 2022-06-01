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
  FlatList,
} from 'react-native';

import Video from 'react-native-video';
import Icon from '../components/Icon';
import colors from '../config/colors';
import DownModal from '../components/drawers/DownModal';
import storyService from '../services/story.service';
import AuthContext from '../Contexts/authContext';
import UserProfilePicture from '../components/UserProfilePicture';
import moment from 'moment';
import {Texts, Title} from '../Materials/Text';

const windowWidth = Dimensions.get('screen').width;

function StoryViewScreen({navigation, route}) {
  const {
    data: {stories_List: data, firstName, lastName, id: userID},
  } = route.params;
  const width = [];

  data.map(_ => width.push(useRef(new Animated.Value(0)).current));

  const {
    userState: {userData},
  } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [viewers, setViewers] = useState({
    loading: false,
    state: [],
    page: 1,
    refreshing: false,
  });
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

  // Start progress animations
  const startProgress = () => {
    let startTime = new Date().valueOf();
    dispatch({type: actions.START_TIMER, startTime});

    Animated.timing(width[activeIndex], {
      toValue: windowWidth / data.length - 2,
      useNativeDriver: false,
      duration: timerState.duration,
    }).start(({finished}) => {
      if (finished) {
        if (activeIndex !== data.length - 1) {
          dispatch({type: actions.RESET_TIMER});
          setLoaded(false);
          setActiveIndex(prev => prev + 1);
        } else {
          navigation.popToTop();
        }
      }
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

  const getStoryViewers = (pageNo = 1) => {
    if (userData.id === userID) {
      storyService
        .getStoryViewers(data[activeIndex].id, pageNo)
        .then(({data: views}) => {
          if (Array.isArray(views)) {
            setViewers(prev => ({...prev, state: views}));
          }
        })
        .catch(e => console.error(e.message));
    }
    return;
  };

  const handleRefresh = () => {
    getStoryViewers();
  };

  const handleOnReachTheEnd = () => {
    if (userData.id === userID) {
      storyService
        .getStoryViewers(data[activeIndex].id, viewers.page + 1)
        .then(({data: views}) => {
          if (Array.isArray(views)) {
            setViewers(prev => ({
              ...prev,
              state: [...views, ...prev.state],
              page: prev.page + 1,
            }));
          }
        })
        .catch(e => console.error(e.message));
    }
    return;
  };

  useEffect(() => {
    if (Loaded) {
      startProgress();
      addStoryViewer();
      getStoryViewers();
    }
  }, [Loaded]);

  const DropDownMenu = () => {
    return (
      <View style={styles.menuContainer}>
        <View style={styles.alignCenter}>
          <View style={styles.modalSwapBtn} />
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

  const ViewerCard = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.viewerCard, styles.row]}
        // onPress={_ => navigation.navigate(routes.FRIEND_PROFILE, {user: item})}
      >
        <UserProfilePicture profilePicture={item.profilePicture} size={45} />
        <Title>{`${item.firstName} ${item.lastName}`}</Title>
      </TouchableOpacity>
    );
  };

  const StorySlides = memo(() => {
    return (
      <View style={styles.slider}>
        <View style={styles.row}>
          {data.map((item, index) => (
            <View
              key={index}
              style={[
                {
                  width: windowWidth / data.length,
                },
                styles.ph1,
              ]}>
              <View style={styles.animBar}>
                <Animated.View
                  style={[
                    {
                      width: width[index],
                    },
                    styles.animBarActive,
                  ]}
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
                size={50}
              />
            </View>
            <View>
              <Title
                color={'#fff'}
                style={[styles.textShadow]}>{`${firstName} ${lastName}`}</Title>

              <Texts style={[styles.textShadow]} color="#fff" opacity={0.6}>
                {moment(
                  data[activeIndex].date,
                  'DD MMMM YYYY hh:mm:ss',
                ).fromNow()}
              </Texts>
            </View>
          </View>
          <View style={styles.row}>
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
          </View>
        </View>
      </View>
    );
  }, []);

  return (
    <>
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
            style={styles.media}
            source={{
              uri: data[activeIndex].storiesVideoPath,
            }}
          />
        ) : (
          <Image
            style={styles.media}
            resizeMode={'contain'}
            onLoadEnd={_ => setLoaded(true)}
            source={{uri: data[activeIndex].storiesMediaPath}}
          />
        )}
        <View style={styles.content}>
          <View style={styles.row}>
            <Texts
              color={'#fff'}
              truncate
              style={[styles.textShadow, styles.caption]}>
              {data[activeIndex].caption}
            </Texts>
            {userData.id === userID && (
              <TouchableOpacity
                style={styles.row}
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
                  />
                  <Texts style={styles.textShadow} color="#fff">
                    {`${data[activeIndex].views} Views`}
                  </Texts>
                </>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
      <DownModal isVisible={modelOpen} setIsVisible={handleCloseModel}>
        <View style={[styles.menuContainer, styles.customDownModel]}>
          <View style={styles.alignCenter}>
            <View
              style={{
                backgroundColor: '#cacaca',
                width: 80,
                height: 6,
                borderRadius: 6,
              }}
            />
          </View>
          <View style={[styles.menu]}>
            <Title>Viewed by</Title>
            <Texts>{data[activeIndex].views} Views</Texts>
          </View>

          <View>
            <FlatList
              refreshing={viewers.refreshing}
              onRefresh={handleRefresh}
              data={viewers.state}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={handleOnReachTheEnd}
              ListEmptyComponent={_ => (
                <View style={[styles.mv5, styles.alignCenter]}>
                  <Texts light>No viewers</Texts>
                </View>
              )}
              renderItem={({item}) => <ViewerCard item={item} />}
            />
          </View>
        </View>
      </DownModal>
    </>
  );
}

export default StoryViewScreen;

const styles = StyleSheet.create({
  caption: {
    maxWidth: '70%',
  },
  content: {
    zIndex: 100,
    position: 'absolute',
    bottom: 30,
    width: '100%',
    paddingHorizontal: 20,
  },
  animBarActive: {
    backgroundColor: '#00000099',
    borderRadius: 6,
    height: 4,
  },
  animBar: {
    borderRadius: 6,
    backgroundColor: '#CACACA',
  },
  ph1: {
    paddingHorizontal: 1,
  },
  mv5: {
    marginVertical: 5,
  },
  slider: {
    position: 'absolute',
    zIndex: 10,
  },
  alignCenter: {
    alignItems: 'center',
  },
  modalSwapBtn: {
    backgroundColor: '#cacaca',
    width: 80,

    height: 6,
    borderRadius: 6,
  },
  customDownModel: {
    paddingBottom: 60,
    height: 300,
    backgroundColor: '#fff',
  },
  viewerCardText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    marginHorizontal: 5,
  },
  viewerCard: {
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuContainer: {},
  menu: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#cacaca',
    borderBottomWidth: 1,
    marginBottom: 5,
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
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
    marginRight: 10,
    backgroundColor: colors.grayX11Gray,
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
  },
  media: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
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
