import React, { useContext, useState, useRef, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Dimensions,
  FlatList,
  Keyboard,
} from 'react-native';
import Icon from '../components/Icon';
import { groupPostsActions } from '../redux/groupPosts';
import EnhancedOptionsDrawer from '../components/drawers/EnhancedOptionsDrawer';
import IconButton from '../components/buttons/IconButton';
import Text from '../components/Text';
import Screen from '../components/Screen';
import authContext from '../Contexts/authContext';
import PostService from '../services/post.service';
import swapService from '../services/swap.service';
import routes from '../navigation/routes';
import Header from '../components/headers/Header';
import constants from '../config/constants';
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
import { feedPostsAction } from '../redux/feedPostsSlice';
import RadioOptionDrawer from '../components/drawers/RadioOptionDrawer';
import OptionBox from '../components/posts/OptionBox';
import { useDispatch, useSelector } from 'react-redux';
import { postFeelingsActions } from '../redux/postFeelings';
import UserProfilePicture from '../components/UserProfilePicture';
import hangShareService from '../services/hangShare.service';
import postService from '../services/post.service';
import common from '../config/common';
import BetterImage from '../components/betterImage/BetterImage';
import CustomImageSlider from '../components/ImageSlider/CustomImageSlider';
import { postDataSliceAction } from '../redux/postDataSlice';
import { Texts, Title } from '../Materials/Text';
import { ProgressBar } from 'react-native-paper';

export default function AddPostScreen({ navigation, route }) {
  const { groupId, postType } = route.params;
  const { userData: user } = useContext(authContext)?.userState;
  const [loading, setLoading] = useState(false);

  const [tagedUserData, setTagedUserData] = useState([]);
  const [placeholder, setPlaceHolder] = useState('We Share, Do you?');
  const dispatch = useDispatch();
  const postFeel = useSelector(state => state.postFeel);
  const { postTypes } = constants;
  const DEFAULT_TEXT = 'We Share, Do You ?';
  const SWAP_DEFAULT_TEXT = 'We Share, Do You ?';
  const HANG_SHARE_TEXT = 'We Share, Do You ?';
  const isEdit = useSelector(state => state.updatePostMode);
  //const postData = useSelector(state => state.updatePostData)
  const groupid = useSelector(state => state.groupIdSlice);
  const postData = useSelector(state => state.postDataSlice);
  const textInputRef = useRef();
  const sharePostDrawerRef = useRef(null); // reference for the enhanced drawer.
  const createPostDrawerRef = useRef(null); // reference for the enhanced drawer.
  const privacyOptions = useMemo(() => common.privacyOptions, []);

  const [error, setError] = useState('');
  const [text, setText] = useState('');

  const [imageUriArray, setImageUriArray] = useState([]);
  const [displayImage, setDisplayImage] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isPrivacyOptionsVisible, setIsPrivacyOptionsVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [postPrivacyOption, setPostPrivacyOption] = useState(privacyOptions[0]); // object to present the current privacy option

  const shareUpOptions = useMemo(() => {
    [
      {
        title: 'Share Feed',
        icon: { image: require('../assets/icons/gray-feed-icon.png') },
        onPress: () => {
          alert('Share Feed');
        },
      },
      {
        title: 'Share time',
        icon: { image: require('../assets/icons/gray-share-time-icon.png') },
        onPress: () => {
          alert('Share time');
        },
      },
      {
        title: 'Share Friends',
        icon: { image: require('../assets/icons/gray-share-friends-icon.png') },
        onPress: () => {
          alert('Share Friends');
        },
      },
      {
        title: 'Share Point',
        icon: { image: require('../assets/icons/gray-share-point-icon.png') },
        onPress: () => {
          alert('Share Point');
        },
      },
      {
        title: 'Share Groups',
        icon: { image: require('../assets/icons/gray-share-groups-icon.png') },
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

  const createPostoptions = [
    {
      title: 'Photo/Video',
      icon: {
        image: require('../assets/add-post-options-icons/photo-gradient-icon.png'),
      },
      onPress: () => {
        navigation.navigate(routes.SHAREUP_CAMERA, postType);
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

  useEffect(() => {
    if (postType === postTypes.GROUP_POST) {
      dispatch(postDataSliceAction.setGroupId(groupId));
    }

    if (postData.postDetail.group) {
      dispatch(postDataSliceAction.setGroupId(postData.postDetail.group.id));
    }

    loadImages();
    if (postType === postTypes.HANG_SHARE) {
      setPlaceHolder(HANG_SHARE_TEXT);
      setIsOptionsVisible(false);
    } else if (postType === postTypes.SWAP) {
      setPlaceHolder(SWAP_DEFAULT_TEXT);
    } else if (postType === postTypes.SHARE_POST) {
      setPlaceHolder(DEFAULT_TEXT);
      //setText(postData.content)
    } else {
      setPlaceHolder(DEFAULT_TEXT);
    }
  }, [postData]);

  const loadImages = () => {
    const selectedImageUris = postData['postImages']?.map(image => {
      return image['uri'];
    });
    setImageUriArray(selectedImageUris);
    setImages(postData['postImages']);
    handleButtonActivation(text, postData['postImages']);
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
    // if (content.activity) {
    //   formData.append('activity', content.activity);
    // }
    // if (content.feelings) {
    //   formData.append('feelings', content.feelings);
    // }
    // if (content.tag) {
    //   formData.append('tag', content.tag);
    // }
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
  const onAddImage = uri => {
    if (postType === postTypes.HANG_SHARE) {
      setPlaceHolder(HANG_SHARE_TEXT);
      setIsOptionsVisible(false);
    }
    setImages(images.concat(uri));
    dispatch(postDataSliceAction.addNewImages(uri));
    handleButtonActivation(text, images);
  };

  const onRemoveImage = uri => {
    const updatedImages = images.filter(images => images !== uri);
    dispatch(postDataSliceAction.removeImage(uri));
    setImages(updatedImages);
    handleButtonActivation(text, updatedImages);
    if (postType === postTypes.SWAP && updatedImages.length === 0) {
      navigation.navigate(routes.SWAP);
    }
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
        groupId: postData['groupId'],
        tag: postData.tagedList.names,
        feeling: '',
        activity: '',
      };
      const formData = createPostFormData(postContent);
      PostService.createPost(user.id, formData)
        .then(resp => {
          let existingPosts = store.getState().groupPosts;
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
      text: text === '' ? placeholder : text,
      images: images,
      tagedList: postData.tagedList.names,
    };

    const formData = createPostFormData(swapContent);
    if (postData['EditPost']) {
      swapService
        .editSwap(postData.postDetail.id, formData)
        .then(resp => {
          store.dispatch(feedPostsAction.updateFeedPost(resp.data));
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
      text: text === '' ? placeholder : text,
      category: 'gifts',
      images: images,
      tagedList: postData.tagedList.names,
    };
    const formData = createPostFormData(swapContent);
    if (postData['EditPost']) {
      hangShareService
        .editHang(user.id, postData.postDetail.id, formData)
        .then(resp => {
          store.dispatch(feedPostsAction.updateFeedPost(resp.data));
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
      .sharePost(user.id, postData.postDetail.id, formData)
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
     
      console.log(postFeel,postData.tagedList.emails);
      const postContent = {
        text: text === '' ? placeholder : text,
        images: images,
        //feeling: postFeel.feeling ? postFeel.feeling : null,
        groupId: postData['groupId'],
        //tag: postData.tagedList.emails,
        //activity: '',
      };
      const formData = createPostFormData(postContent);
      if (postData['EditPost']) {
        PostService.editPost(postData.postDetail.id, formData)
          .then(resp => {
            store.dispatch(feedPostsAction.updateFeedPost(resp.data));
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
    // setFile([]);
    setDisplayImage(false);
    setImages([]);
    setIsButtonActive(false);
    textInputRef.current.clear();
    dispatch(postDataSliceAction.removeAllImages());
    dispatch(postDataSliceAction.removeEditPost());
    dispatch(postDataSliceAction.removePostData());
    dispatch(postDataSliceAction.removeGroupId());
    dispatch(postDataSliceAction.clearTagList());
  };

  const handelPrivacySetting = value => {
    const index = privacyOptions.map(item => item.value).indexOf(value);
    const option = privacyOptions[index];
    setPostPrivacyOption(option);
    setIsPrivacyOptionsVisible(!isPrivacyOptionsVisible);
  };

  useEffect(() => { }, [postPrivacyOption]);

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

  const { width, height } = Dimensions.get('window');
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Screen>
      {renderHeader()}
      <ProgressBar
        indeterminate={loading}
        style={{ height: 1.5 }}
        color={colors.iondigoDye}
      />
      <View style={[styles.topContainer]}>
        <View style={styles.row}>
          <UserProfilePicture style={styles.userProfile} />
          <View style={styles.column}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
              <Title size={15}>
                {user.firstName} {user.lastName}
              </Title>
              {/**Content */}
              {postFeel.feeling ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => navigation.navigate(routes.FEELING_ACTIVITY)}>
                  <View style={styles.feelingContainer}>
                    <Texts size={14} light style={{ fontWeight: '600' }} > --is</Texts>
                    {postFeel.img ? (
                      <BetterImage
                        noBackground
                        source={postFeel.img}
                        style={styles.feelImg}
                      />
                    ) : (
                      <Icon name={postFeel.icon} color={postFeel.color} />
                    )}
                    <View style={styles.row}>
                      <Texts size={14} style={{ fontWeight: '700' }}>{postFeel.feeling}</Texts>
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
              {postData.tagedList.emails.length ? (
                <View style={styles.row} >
                  <Texts size={14} light style={{ fontWeight: '600' }} > with </Texts>
                  <FlatList
                    horizontal
                    data={postData.tagedList.names}
                    keyExtractor={item => item}
                    renderItem={({ item }) => <TouchableOpacity onPress={() => { }}>
                      <Texts size={14} style={{ fontWeight: '700' }} truncate={true}>  {item}
                      </Texts>
                    </TouchableOpacity>
                    }
                  />
                </View>
              ): null}

            </View>

            <View style={[styles.row]}>
              <OptionBox
                currentOption={postPrivacyOption}
                onPress={() => {
                  setIsPrivacyOptionsVisible(!isPrivacyOptionsVisible);
                }}
              />

              <View style={[styles.headerTab, styles.row]}>
                <Icon
                  type="Feather"
                  name="plus"
                  size={12}
                  color={colors.dimGray}
                  backgroundSizeRatio={1}
                  style={{ marginLeft: 5 }}
                />
                <Texts style={styles.headerTabText}>Albums</Texts>
                <Icon
                  type="Entypo"
                  name="chevron-small-down"
                  size={15}
                  color={colors.dimGray}
                  backgroundSizeRatio={1}
                  style={{ marginRight: 2 }}
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

        <TextInput
          //value={isEdit?text:placeholder}
          placeholder={
            postData['EditPost'] ? postData.postDetail.content : placeholder
          }
          placeholderTextColor={
            postData['EditPost'] ? colors.dark : colors.dimGray
          }
          style={styles.textInput}
          // numberOfLines={10}
          multiline={true}
          onChangeText={handleOnChangeText}
          ref={textInputRef}
          onTouchEnd={handleCreatePostDrawerPosition}
        />

        {postType === postTypes.SHARE_POST && (
          <View
            style={{
              borderWidth: 1,
              borderColor: '#cacaca90',
              borderRadius: 5,
              paddingTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10,
              }}>
              <UserProfilePicture
                profilePicture={
                  !postData['EditPost']
                    ? postData.postDetail?.userdata?.profilePicturePath
                    : postData.postDetail?.post?.userdata.profilePicturePath
                }
                size={35}
              />
              <Title size={14} style={{ marginHorizontal: 10 }}>
                {!postData['EditPost']
                  ? `${postData.postDetail?.userdata?.firstName} ${postData.postDetail?.userdata?.lastName}`
                  : `${postData.postDetail?.post?.userdata?.firstName} ${postData.postDetail?.post?.userdata?.lastName}`}
              </Title>
            </View>
            <View style={{ margin: 10 }}>
              {!postData['EditPost'] && postData.postDetail?.content !== '' && (
                <Texts truncate>{postData.postDetail?.content}</Texts>
              )}
              {postData['EditPost'] &&
                postData.postDetail?.post?.content !== '' && (
                  <Texts truncate>{postData.postDetail?.post?.content}</Texts>
                )}
            </View>
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
              <CustomImageSlider
                width={width - 42}
                postType={'share'}
                height={200}
                media={
                  !postData['EditPost']
                    ? postData.postDetail?.media
                    : postData.postDetail?.post?.media
                }
              />
            </View>
          </View>
        )}
        <ImageInputList
          imageUris={images}
          onAddImage={onAddImage}
          isSwap={postType === postTypes.SWAP ? true : false}
          onRemoveImage={onRemoveImage}
        />

        {/* {loading ? (
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
        )} */}
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
  userProfile: {
    marginTop:10,
    width: 50,
    height: 50,
  },
  column: {
    width: '70%',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
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
    margin: 10,
    borderRadius: 5,
    padding:5,
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
  textInput: { height: '15%', textAlignVertical: 'top' },
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
  plusIcon: {
    marginRight: 1,

    marginTop: 10,
  },
});
