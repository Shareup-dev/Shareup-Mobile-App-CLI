import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useMemo,
  Component,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from '../components/Icon';
import {groupPostsActions} from '../redux/groupPosts';
import EnhancedOptionsDrawer from '../components/drawers/EnhancedOptionsDrawer';
import IconButton from '../components/buttons/IconButton';
import Text from '../components/Text';
import Screen from '../components/Screen';
import authContext from '../authContext';
import AuthContext from '../UserContext';
import PostService from '../services/post.service';
import swapService from '../services/swap.service';
import routes from '../navigation/routes';
import {useImagePicker} from '../hooks';
import Header from '../components/headers/Header';
import constants from '../config/constants';
import defaultStyles from '../config/styles';
import colors from '../config/colors';
import {
  HeaderCloseIcon,
  HeaderTitle,
  HeaderButton,
  SpecialHeaderButton,
} from '../components/headers';
import OptionsDrawer from '../components/drawers/OptionsDrawer';
import store from '../redux/store';
import ImageInputList from '../components/ImageInputList';
import {feedPostsAction} from '../redux/feedPostsSlice';
import RadioOptionDrawer from '../components/drawers/RadioOptionDrawer';
import OptionBox from '../components/posts/OptionBox';
import {useDispatch, useSelector} from 'react-redux';
import {postFeelingsActions} from '../redux/postFeelings';
import UserProfilePicture from '../components/UserProfilePicture';
import hangShareService from '../services/hangShare.service';
import {useFocusEffect} from '@react-navigation/native';
import postService from '../services/post.service';
import common from '../config/common';
import {postImagesAction} from '../redux/postImages';

export default function AddPostScreen({navigation, route}) {
  const {postType, groupId, swapImage, postData, isEdit} = route.params;
  const flatListRef = useRef();
  const {loadingIndicator, setloadingIndicator} = useContext(AuthContext);
  const postImages = useSelector(state => state.postImages);
  const {userData: user} = useContext(authContext)?.userState;
  const [loading, setLoading] = useState(false);
  const [tagedUserData, setTagedUserData] = useState([]);
  const [placeholder, setPlaceHolder] = useState('We Share, Do you?');

  const dispatch = useDispatch();
  const postFeel = useSelector(state => state.postFeel);

  const {postTypes} = constants;

  const DEFAULT_TEXT = 'We Share, Do You ?';
  const SWAP_DEFAULT_TEXT = 'Hi all \n I want to Swap ...';
  const HANG_SHARE_TEXT = 'Please anyone want this,can have it';

  const textInputRef = useRef();
  const [file, setFile] = useState([]);
  const sharePostDrawerRef = useRef(null); // reference for the enhanced drawer.
  const createPostDrawerRef = useRef(null); // reference for the enhanced drawer.
  const shareUpOptions = useMemo(() => {
    [
      {
        title: 'Share Feed',
        icon: {image: require('../assets/icons/gray-feed-icon.png')},
        onPress: () => {
          alert('Share Feed');
        },
      },
      {
        title: 'Share time',
        icon: {image: require('../assets/icons/gray-share-time-icon.png')},
        onPress: () => {
          alert('Share time');
        },
      },
      {
        title: 'Share Friends',
        icon: {image: require('../assets/icons/gray-share-friends-icon.png')},
        onPress: () => {
          alert('Share Friends');
        },
      },
      {
        title: 'Share Point',
        icon: {image: require('../assets/icons/gray-share-point-icon.png')},
        onPress: () => {
          alert('Share Point');
        },
      },
      {
        title: 'Share Groups',
        icon: {image: require('../assets/icons/gray-share-groups-icon.png')},
        onPress: () => {
          alert('Share Groups');
        },
      },
      {
        title: 'Sell and Share',
        icon: {
          image: require('../assets/icons/gray-sell-and-share-icon.png'),
        },
        onPress: () => {
          alert('Sell and Share');
        },
      },
    ];
  }, []);


  const createPostoptions = [{
    title: 'Photos',
    icon: {
      image: require('../assets/add-post-options-icons/photo-gradient-icon.png'),
    },
    onPress: () => {
      navigation.navigate(routes.SHAREUP_CAMERA,postType)
     //navigation.navigate(routes.ADDS_STORY)
    },
  },
    {
      title: 'Tag People',
      icon: {
        image: require('../assets/add-post-options-icons/tag-people-gradient-icon.png'),
      },
      onPress: () => {
        navigation.navigate(routes.TAG_PEOPLE);
      },
    },
    {
      title: 'Sell and Share',
      icon: {
        image: require('../assets/add-post-options-icons/sell-and-share-gradient-icon.png'),
      },
      onPress: () => {
        alert('Sell and Share');
      },
    },
    {
      title: 'Feeling/Activity',
      icon: {
        image: require('../assets/add-post-options-icons/feeling-gradient-icon.png'),
      },
      onPress: () => {
        navigation.navigate(routes.FEELING_ACTIVITY);
      },
    },
    {
      title: 'Location',
      icon: {
        image: require('../assets/add-post-options-icons/location-gradient-icon.png'),
      },
      onPress: () => {
        alert('Location');
      },
    },
    {
      title: 'Live',
      icon: {
        image: require('../assets/add-post-options-icons/live-gradient-icon.png'),
      },
      onPress: () => {
        alert('Live');
      },
    },
  ];
  const sharePostOptions = [
    {
      title: 'Tag People',
      icon: {
        image: require('../assets/add-post-options-icons/tag-people-gradient-icon.png'),
      },
      onPress: () => {
        navigation.navigate(routes.TAG_PEOPLE);
      },
    },

    {
      title: 'Feeling/Activity',
      icon: {
        image: require('../assets/add-post-options-icons/feeling-gradient-icon.png'),
      },
      onPress: () => {
        navigation.navigate(routes.FEELING_ACTIVITY);
      },
    },
  ];
  const privacyOptions = useMemo(() => common.privacyOptions, []);

  const [error, setError] = useState('');
  const [text, setText] = useState('');
  //const { file, pickImage, clearFile } = useImagePicker();

  const [displayImage, setDisplayImage] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isPrivacyOptionsVisible, setIsPrivacyOptionsVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [postPrivacyOption, setPostPrivacyOption] = useState(privacyOptions[0]); // object to present the current privacy option

  useEffect(() => {
    if (postType === postTypes.HANG_SHARE) {
      setPlaceHolder(HANG_SHARE_TEXT);
      //setImages([postImages])
    } else if (postType === postTypes.SWAP) {
      setPlaceHolder(SWAP_DEFAULT_TEXT);
      //setImages([swapImage]);
    } else {
      setPlaceHolder(DEFAULT_TEXT);
      // setImages([postImages])
    }
  });
  useFocusEffect(

    useCallback(() => {
      if (postType === postTypes.HANG_SHARE) {
        setPlaceHolder(HANG_SHARE_TEXT);
        setIsOptionsVisible(false);
        setImages(postImages);
        handleButtonActivation(text, postImages);
      }
      if (postType === postTypes.SWAP) {
        setPlaceHolder(SWAP_DEFAULT_TEXT);
        setImages([swapImage]);
        handleButtonActivation(text, [swapImage]);
      } else {
        setPlaceHolder(DEFAULT_TEXT);
        setImages(postImages);
        handleButtonActivation(text, postImages);
      }
      if (isEdit) {
        loadImages();
      }
      return;
    }, [swapImage, postImages]),
  );

  const loadImages = () => {
    if (postData.media?.length !== 0) {
      setImages(postData.media?.map(image => image.mediaPath));
    }
  };
  const setTagedUser = userData => {
    setTagedUserData(userData);
  };

  const createPostFormData = content => {
    const formData = new FormData();
    formData.append('content', content.text);
    if (content.images.length !== 0) {
      content.images.forEach(image => {
        const splitPathArr = image.split('/');
        formData.append(`files`, {
          name: String(splitPathArr.slice(-1).pop()),
          type: 'image/jpg',
          uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
        });
      });
    }

    if (content.groupId) {
      formData.append('groupid', content.groupId);
    }
    if (content.category) {
      formData.append('category', content.category);
    }
    return formData;
  };

  const handleOnChangeText = text => {
    setText(text);
    handleButtonActivation(text, images);
  };

  const handleButtonActivation = (text, images) => {
    if (text !== '' || text !== undefined) setIsButtonActive(true);
    if (images?.length > 0) setIsButtonActive(true);
    if (images?.length === 0 && text === '') setIsButtonActive(false);
    if (images?.length === 0 && text === undefined) setIsButtonActive(false);
    if (postType === postTypes.SHARE_POST) setIsButtonActive(true);
  };

  // const handelPickImage = async () => {
  //   ImagePicker.openPicker({
  //     width: "100%",
  //     height: "100%",
  //     multiple: true,
  //     cropping: true
  //   }).then(image => {

  //     setFile(image);
  //     const uri = image.map(item => {
  //       return item.sourceURL;
  //     });
  //     onAddImage(uri);
  //   });
  // try {
  //   const result = await pickImage().then((result) =>)
  //   const uri = result.map(item => {
  //     return item.sourceURL;
  //   });
  //   if (!result.cancelled) onAddImage(uri);
  // } catch (error) {
  //   console.error(error);
  // }
  // };

  const onAddImage = uri => {
    if (postType === postTypes.HANG_SHARE) {
      setPlaceHolder(HANG_SHARE_TEXT);
      setIsOptionsVisible(false);
    }
    setImages(images.concat(uri));
    handleButtonActivation(text, images);
  };

  const onRemoveImage = uri => {
    const updatedImages = images.filter(images => images !== uri);
    dispatch(postImagesAction.removeImage(uri));
    setImages(updatedImages);
    handleButtonActivation(text, updatedImages);
  };

  //******************* POST HANDLE METHODS *********************//

  //........GROUP POST................//
  const group = () => {
    if (text === '' && images.length === 0) {
      setError("Can't Create empty post");
    } else {
      const postContent = {
        text: text,
        images: images,
        groupId: groupId,
      };
      const formData = createPostFormData(postContent);
      PostService.createPost(user.id, formData)
        .then(resp => {
          let existingPosts = store.getState().groupPosts;
          // setloadingIndicator(false)
          store.dispatch(
            groupPostsActions.setPosts([resp.data, ...existingPosts]),
          );
          store.dispatch(feedPostsAction.addFeedPost(resp.data));
          // const popAction = StackActions.pop(1);
          navigation.navigate(routes.GROUP_FEED, resp.data.group);
          // navigation.dispatch(popAction);
        })
        .catch(e => {
          console.error(e);
        })
        .finally(_ => {
          setLoading(false);
          clearFields();
        });
    }
  };

  //........SWAP POST................//
  const swap = () => {
    const swapContent = {
      text: text === '' ? SWAP_DEFAULT_TEXT : text,
      images: [swapImage],
    };

    const formData = createPostFormData(swapContent);
    if (isEdit) {
      swapService
        .editSwap(postData.id, formData)
        .then(resp => {
          store.dispatch(feedPostsAction.addFeedPost(resp.data));
          navigation.navigate(routes.FEED);
        })
        .catch(e => {
          console.error(e);
        })
        .finally(_ => setLoading(false));
    } else {
      swapService
        .createSwap(user.id, formData)
        .then(resp => {
          store.dispatch(feedPostsAction.addFeedPost(resp.data));
          navigation.navigate(routes.FEED);
        })
        .catch(e => {
          console.error(e);
        })
        .finally(_ => {
          setLoading(false);
          clearFields();
        });
    }
  };

  //........HANG SHARE POST................//
  const hangShare = () => {
    const swapContent = {
      text: text === '' ? HANG_SHARE_TEXT : text,
      category: 'gifts',
      images: images,
    };
    const formData = createPostFormData(swapContent);
    if (isEdit) {
      hangShareService
        .editHang(user.id, postData.id, formData)
        .then(resp => {
          store.dispatch(feedPostsAction.addFeedPost(resp.data));
          navigation.navigate(routes.FEED);
        })
        .catch(e => {
          console.error(e);
        })
        .finally(_ => setLoading(false));
    } else {
      hangShareService
        .createHang(user.id, formData)
        .then(resp => {
          store.dispatch(feedPostsAction.addFeedPost(resp.data));
          navigation.navigate(routes.FEED);
        })
        .catch(e => {
          console.error(e);
        })
        .finally(_ => {
          setLoading(false);
          clearFields();
        });
    }
  };
  //........SHARE POST................//
  const sharePost = () => {
    // const postContent = {
    //   content: text,
    // };

    const formData = new FormData();
    formData.append('content', text);

    postService
      .sharePost(user.id, postData.id, formData)
      .then(res => {
        store.dispatch(feedPostsAction.addFeedPost(res.data));
        navigation.navigate(routes.FEED);
      })
      .catch(e => console.error(e.message))
      .finally(_ => {
        setLoading(false);
        clearFields();
      });
  };

  //........CREATE POST................//
  const createPost = () => {
    if (text === '' && images.length === 0) {
      setError("Can't Create empty post");
    } else {
      const postContent = {
        text: text === '' ? DEFAULT_TEXT : text,
        images: images,
        feeling: postFeel.feeling ? postFeel.feeling : null,
        groupId: groupId,
      };
      const formData = createPostFormData(postContent);
      if (isEdit) {
        PostService.editPost(postData.id, formData)
          .then(resp => {
            store.dispatch(feedPostsAction.addFeedPost(resp.data));
            dispatch(postFeelingsActions.setDefault());
            navigation.navigate(routes.FEED);
          })
          .catch(e => {
            console.error(e);
          })
          .finally(_ => setLoading(false));
      } else {
        PostService.createPost(user.id, formData)
          .then(resp => {
            store.dispatch(feedPostsAction.addFeedPost(resp.data));
            dispatch(postFeelingsActions.setDefault());
            navigation.navigate(routes.FEED);
          })
          .catch(e => {
            console.error(e);
          })
          .finally(_ => {
            setLoading(false);
            clearFields();
          });
        //setProgress(prog)
      }
    }
  };

  const handleAddPost = async () => {
    setLoading(true);
    switch (postType) {
      case postTypes.GROUP_POST:
        return group();
      case postTypes.SWAP:
        return swap();
      case postTypes.HANG_SHARE:
        return hangShare();

      case postTypes.SHARE_POST:
        return sharePost();
      case postTypes.CREATE_POST:
        return createPost();
    }
  };

  // used to change the position of the enhanced drawer,
  // when user click on the text input.
  const handleCreatePostDrawerPosition = () => {
    if (postType === postTypes.CREATE_POST)
      createPostDrawerRef.current.snapTo(0);
    if (postType === postTypes.GROUP_POST)
      createPostDrawerRef.current.snapTo(0);
  };

  const handleCancel = () => {
    clearFields();
    navigation.navigate(routes.FEED);
    dispatch(postFeelingsActions.setDefault());
  };

  const clearFields = () => {
    setText('');
    setFile([]);
    setDisplayImage(false);
    setImages([]);
    setIsButtonActive(false);
    textInputRef.current.clear();
    dispatch(postImagesAction.removeAllImages());
  };

  const handelPrivacySetting = value => {
    const index = privacyOptions.map(item => item.value).indexOf(value);
    const option = privacyOptions[index];
    setPostPrivacyOption(option);
    setIsPrivacyOptionsVisible(!isPrivacyOptionsVisible);
  };

  useEffect(() => {}, [postPrivacyOption]);

  const renderHeader = () => {
    if (postType === postTypes.HANG_SHARE && images.length === 0)
      return (
        <Header
          left={<HeaderCloseIcon onPress={handleCancel} />}
          middle={
            <Text style={styles.hangShareHeaderTitle}>
              Today to me, tomorrow to you
            </Text>
          }
          right={
            <SpecialHeaderButton
              title="Keep Hang"
              onPress={() => navigation.navigate(routes.KEEP_HANG, postType)}
            />
          }
        />
      );
    if (
      postType === postTypes.CREATE_POST ||
      postType === postTypes.SHARE_UP ||
      postType === postTypes.SWAP ||
      postType === postTypes.GROUP_POST ||
      postType === postTypes.SHARE_POST ||
      postType === postTypes.HANG_SHARE
    )
      return (
        <Header
          left={<HeaderCloseIcon onPress={handleCancel} />}
          middle={
            <HeaderTitle>
              {postType === postTypes.SWAP && 'Swap'}
              {postType === postTypes.CREATE_POST && postTypes.CREATE_POST}
              {postType === postTypes.SHARE_UP && postTypes.SHARE_UP}
              {postType === postTypes.GROUP_POST && postTypes.GROUP_POST}
              {postType === postTypes.SHARE_POST && postTypes.SHARE_POST}
              {postType === postTypes.HANG_SHARE && postTypes.HANG_SHARE}
            </HeaderTitle>
          }
          right={
            <HeaderButton
              onPress={handleAddPost}
              title={postType === postTypes.SHARE_POST ? 'Share' : 'Post'}
              isActive={isButtonActive}
            />
          }
        />
      );
  };

  const {width, height} = Dimensions.get('window');
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewRef = React.useRef(({viewableItems}) => {
    setActiveIndex(viewableItems[0].index);
  });
  const viewConfigRef = React.useRef({viewAreaCoveragePercentThreshold: 50});

  return (
    <Screen>
      {renderHeader()}
      <View style={[styles.topContainer]}>
        <View style={styles.row}>
          <Image
            source={
              user.profilePicture
                ? {uri: user.profilePicturePath}
                : require('../assets/default-profile-picture.png')
            }
            style={defaultStyles.circledProfilePicture}
          />
          <View style={styles.column}>
            <Text style={styles.userName}>
              {user.firstName} {user.lastName}
            </Text>
            <View style={styles.row}>
              {/**Friends */}
              <OptionBox
                currentOption={postPrivacyOption}
                onPress={() => {
                  setIsPrivacyOptionsVisible(!isPrivacyOptionsVisible);
                }}
              />

              {/* {postType === postTypes.CREATE_POST ||
                (postTypes.GROUP_POST && ( */}
              <View style={[styles.headerTab, styles.row]}>
                <Icon
                  type="MaterialCommunityIcons"
                  name="plus"
                  size={15}
                  color={colors.dimGray}
                />
                <Text style={styles.headerTabText}>Albums</Text>
                <Icon
                  type="MaterialIcons"
                  name="keyboard-arrow-down"
                  size={15}
                  color={colors.dimGray}
                />
              </View>
              {/* ))} */}
              {/*** // Todo: Create swap category! */}
            </View>
          </View>

          {(postType === postTypes.HANG_SHARE ||
            postType === postTypes.SHARE_UP) && (
            <IconButton
              onPress={() => navigation.navigate(routes.KEEP_HANG, postType)}
              IconComponent={
                <Icon
                  image={require('../assets/icons/squared-add-icon.png')}
                  color={colors.iondigoDye}
                  backgroundSizeRatio={0.8}
                />
              }
              style={styles.plusIcon}
            />
          )}
        </View>

        {/**Content */}
        {postFeel.feeling ? (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate(routes.FEELING_ACTIVITY)}>
            <View style={styles.feelingContainer}>
              {postFeel.img ? (
                <Image source={postFeel.img} style={styles.feelImg} />
              ) : (
                <Icon name={postFeel.icon} color={postFeel.color} />
              )}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={
                    (styles.postFeelText, {fontWeight: '700', fontSize: 14})
                  }>
                  {postFeel.feeling}
                </Text>
                {postFeel.type === 'activity' && (
                  <>
                    <Text>{' - '}</Text>
                    <TextInput
                      placeholder={
                        (postFeel.feeling !== 'Travelling to'
                          ? `What do you `
                          : `Where do you `) + postFeel.feeling
                      }
                    />
                  </>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ) : null}
        <TextInput
          placeholder={isEdit ? postData.content : placeholder}
          //   postType === postTypes.SWAP
          //     ? SWAP_DEFAULT_TEXT
          //     : postType === postTypes.HANG_SHARE ? 'Please Anyone want it,can have it' :'We Share, Do you?'
          // }
          placeholderTextColor={isEdit ? colors.dark : colors.dimGray}
          style={styles.textInput}
          numberOfLines={10}
          multiline={true}
          onChangeText={handleOnChangeText}
          ref={textInputRef}
          onTouchEnd={handleCreatePostDrawerPosition}
        />

        {postType === postTypes.SHARE_POST && (
          <View
            style={{
              borderColor: '#cacaca60',
              borderWidth: 1,
              paddingTop: 10,
              borderRadius: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 5,
              }}>
              <UserProfilePicture
                profilePicture={postData.userdata.profilePicturePath}
                size={35}
              />
              <Text
                style={{fontSize: 15, marginHorizontal: 5, fontWeight: '600'}}>
                {`${postData.userdata?.firstName} ${postData.userdata?.lastName}`}
              </Text>
            </View>
            {console.log(postData.content)}
            <View style={{margin: 5}} >
            {postData.content!=="" && (
                <Text style={{fontSize: 14, }}>
                  {postData?.content}
                </Text>
            )}
            </View>

            <FlatList
              onViewableItemsChanged={onViewRef.current}
              viewabilityConfig={viewConfigRef.current}
              horizontal
              ref={flatListRef}
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              data={postData.media}
              keyExtractor={({item}, index) => index.toString()}
              renderItem={({item}) => {
                return (
                  <Image
                    style={{width: width - 42, height: 200}}
                    resizeMode={'cover'}
                    source={{uri: item.mediaPath}}
                  />
                );
              }}
            />
            <View>
              <View
                style={{
                  marginVertical: 5,
                  flexDirection: 'row',
                  alignSelf: 'center',
                }}>
                {postData.media?.length > 1 &&
                  postData.media.map(({media}, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        width: activeIndex === index ? 15 : 6,
                        height: 6,
                        borderRadius: 5,
                        backgroundColor: '#333',
                        marginHorizontal: 3,
                      }}
                      onPress={_ =>
                        flatListRef.current.scrollToIndex({
                          animated: true,
                          index: '' + index,
                        })
                      }
                    />
                  ))}
              </View>
            </View>
          </View>
        )}
        <ImageInputList
          imageUris={images}
          onAddImage={onAddImage}
          isSwap={postType === postTypes.SWAP ? true : false}
          onRemoveImage={onRemoveImage}
        />
        {loading ? (
          <ActivityIndicator
            style={styles.topContainer}
            animating={true}
            size="large"
            color={colors.iondigoDye}
          />
        ) : (
          <ActivityIndicator
            style={styles.activity}
            animating={false}
            size="large"
            color={colors.iondigoDye}
          />
        )}
      </View>
      {postType === postTypes.CREATE_POST && (
        <EnhancedOptionsDrawer
          options={createPostoptions}
          forwardedRef={createPostDrawerRef}
        />
      )}
      {postType === postTypes.GROUP_POST && (
        <EnhancedOptionsDrawer
          options={createPostoptions}
          forwardedRef={createPostDrawerRef}
        />
      )}
      {postType === postTypes.SHARE_UP && (
        <OptionsDrawer
          options={shareUpOptions}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
        />
      )}
      {postType === postTypes.HANG_SHARE && (
        <OptionsDrawer
          title="What's in Hang ?"
          options={[createPostoptions[0]]}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
        />
      )}
      {postType === postTypes.SHARE_POST && (
        <EnhancedOptionsDrawer
          snap={[125, 100, 100, 100]}
          options={sharePostOptions}
          forwardedRef={sharePostDrawerRef}
        />
      )}

      <RadioOptionDrawer
        isVisible={isPrivacyOptionsVisible}
        setIsVisible={setIsPrivacyOptionsVisible}
        options={privacyOptions}
        title="Who can see your posts?"
        subTitle="Your post will appear in news feed, on your profile and in search results"
        initialValue={privacyOptions[0].value}
        onSubmit={handelPrivacySetting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    padding: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '70%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontWeight: 'bold',
  },
  headerTab: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.dimGray,
    margin: 5,
    borderRadius: 5,
    padding: 2,
  },
  headerTabText: {
    fontSize: 14,
    color: colors.dimGray,
    marginHorizontal: 5,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalView: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 0.5,
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
  },
  tempModal: {
    marginTop: 10,
    flex: 0.4,
    height: '100%',
    backgroundColor: colors.white,
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4.65,
    elevation: 24,
  },
  topBorderRadius: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textInput: {height: '15%', textAlignVertical: 'top', marginTop: 10},
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
  },
  hangShareHeaderTitle: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  fancyAddButton: {
    marginLeft: 10,
  },
  postFeelText: {
    color: '#333333',
    fontSize: 14,
    marginTop: 10,
  },
  feelingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feelImg: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  activity: {
    flex: 1,
  },
});
