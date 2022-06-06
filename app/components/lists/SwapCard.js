import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector} from 'react-redux';
import ImageView from 'react-native-image-viewing';
import colors from '../../config/colors';
import PostOptionDrawer from '../drawers/PostOptionsDrawer';
import PostActions from '../PostActions';
import defaultStyles from '../../config/GlobalStyles';
import SwapActionContainer from '../posts/SwapActionContainer';
import AuthContext from '../../Contexts/authContext';
import swapService from '../../services/swap.service';
import CustomImageSlider from '../ImageSlider/CustomImageSlider';
import constants from '../../config/constants';
import routes from '../../navigation/routes';
import onShareHandler from '../Share';
import {useDispatch} from 'react-redux';
import {feedPostsAction} from '../../redux/feedPostsSlice';
import {postDataSliceAction} from '../../redux/postDataSlice';
import postService from '../../services/post.service';
import {postRefreshSlice} from '../../redux/postRefreshSlice'

const SwapCard = ({
  item,
  navigation,
  userId,
  style,
  reloadPosts,
  onPress,
  noActionBar,
  noOptions,
}) => {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  const [sliderWidth, setSliderWidth] = useState();
  const [currentImage, setCurrentImage] = useState();
  const [images, setImages] = useState([]);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const swapedPosts = useSelector(state => state.swapedImages);
  const dispatch = useDispatch();
  const {userState} = useContext(AuthContext);
  const [isUserLiked, setIsUserLiked] = useState(
    item.likedType === 'false' ? false : true,
  );
  const getSwapedImage = swapId => {
    let foundSwap = swapedPosts.filter(swap => swap.swapPostId === swapId)[0];
    if (foundSwap) {
      return {imagePath: foundSwap.swapImage, found: true};
    } else {
      let image = {
        imagePath: '../assets/icons/swap-square-dashed.png',
        found: false,
      };
      return image;
    }
  };

  useEffect(() => {
    console.log(userState?.userData?.id , user?.id);
    loadImages();
    checkIfLiked();
  }, []);

  const {userData: user} = useContext(AuthContext)?.userState;
  const loadImages = () => {
    if (item.media.length !== 0) {
      setImages(item.media.map(image => image.mediaPath));
    }
  };

  const options = [
    {
      title: 'Save post',
      icon: {
        image: require('../../assets/post-options-icons/save-post-icon.png'),
      },
      onPress: () => {
        alert('Save post');
      },
    },
    {
      title: 'Hide my profile',
      icon: {
        image: require('../../assets/post-options-icons/hide-profile-icon.png'),
      },
      onPress: () => {
        alert('Save post');
      },
    },
    {
      title: userState?.userData?.id === userId ? 'Edit' : '',
      icon: {image: require('../../assets/post-options-icons/swap-icon.png')},
      onPress: () => {
        dispatch(postDataSliceAction.setEditPost(true));
        dispatch(postDataSliceAction.setPostData(item));
        dispatch(
          postDataSliceAction.setImages(
            item.media?.map(image => image.mediaPath),
          ),
        );
        navigation.navigate(routes.ADD_POST, {
          postType: item.allPostsType,
        });
        setIsOptionsVisible(false);
      },
    },
    {
      title: 'Share friends',
      icon: {
        image: require('../../assets/post-options-icons/share-friends-icon.png'),
      },
      onPress: () => {
        //dispatch(postDataSliceAction.setPostData(item));
        dispatch(postRefreshSlice.setPostRefresh(true))
        navigation.navigate(routes.ADD_POST, {
          postType: constants.postTypes.SHARE_POST,
          // postData,
        });
        setIsOptionsVisible(false);
      },
    },
    {
      title: 'Share Via',
      icon: {
        image: require('../../assets/post-options-icons/share-friends-icon.png'),
      },
      onPress: () => {
        onShareHandler(item);
      },
    },
    // {
    //   title: 'Unfollow',
    //   icon: {
    //     image: require('../../assets/post-options-icons/unfollow-icon.png'),
    //   },
    //   onPress: () => {
    //     alert('Unfollow');
    //   },
    // },
    // {
    //   title: 'Report',
    //   icon: {
    //     image: require('../../assets/post-options-icons/report-icon.png'),
    //   },
    //   onPress: () => {
    //     alert('Report');
    //   },
    // },
    {
      title:
        userState?.userData?.id !== userId? (
          <Text style={{color: colors.dark}}>Report</Text>
        ) : (
          <Text style={{color: colors.red}}>Delete</Text>
        ),
      icon: {
        image:
          userState?.userData?.id !== userId
            ? require('../../assets/post-options-icons/report-icon.png')
            : require('../../assets/post-options-icons/delete-red-icon.png'),
      },
      onPress: () => {
        userState?.userData?.id !== userId
          ? alert('Report')
          : showDeleteAlert();
      },
    },
  ];
  const showDeleteAlert = () =>
    Alert.alert('Delete', 'Are you sure to delete this post', [
      {
        text: 'Yes',
        onPress: deletePost,
        style: 'cancel',
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);

  const deletePost = async () => {
    postService
      .deletePost(item.id)
      .then(res => {
        if (res.status === 200) {
          alert(res.data)
          dispatch(feedPostsAction.removeFeedPost(item.id));
          navigation.navigate(routes.FEED);
        }
      })
      .catch(e => alert(e));

   
  };
  const onLayout = e => {
    setSliderWidth(e.nativeEvent.layout.width);
  };
  const acceptHang = () => {
    navigation.navigate(routes.SHIPPING_ADDRESS, item);
  };
  const acceptSwap = () => {
    navigation.navigate(routes.CHECKOUT, {postType: item.allPostsType});
  };

  const {width} = Dimensions.get('window');

  const checkIfLiked = () => {
    // if (postData.likedType === 'false') {
    //   return setIsUserLiked(false);
    // } else {
    //   return setIsUserLiked(true);
    // }
  };
  const handleReactions = async () => {
    postService
      .likePost(user.id, item.id, 'star')
      .then(res => {
        setIsUserLiked(!isUserLiked);
        //setNumberOfReactions(res.data.numberOfReaction);
      }) //need to get likePostIds
      .catch(e => console.error(e));
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.card, defaultStyles.cardBorder, style]}>
        {currentImage && (
          <ImageView
            visible={imageViewerVisible}
            images={[{uri: currentImage}]}
            imageIndex={0}
            onRequestClose={() => {
              setImageViewerVisible(false);
            }}
          />
        )}

        {/** Post Image */}
        <View style={styles.imageContainer} onLayout={onLayout}>
          {images.length !== 0 && (
            <CustomImageSlider
              media={item?.media}
              width={width - 32}
              height={250}
            />
          )}

          {userState?.userData.id !== userId && (
            <SwapActionContainer
              item={item}
              onPress={
                item.allPostsType === constants.postTypes.SWAP
                  ? acceptSwap
                  : acceptHang
              }
            />
          )}
        </View>

        <PostActions
          comments={item.comments}
          swapId={item.id}
          isUserLiked={isUserLiked}
          navigation={navigation}
          numberOfComments={`${item.numberOfComments}`}
          numberOfReactions={`${item.numberOfReaction}`}
          postId={item.id}
          postText={item.content}
          userId={userId}
          setIsOptionsVisible={setIsOptionsVisible}
          postType={item.allPostsType}
          postData={item}
          onInteraction={handleReactions}
          noActionBar={noActionBar}
          noOptions={noOptions}
        />

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setIsOptionsVisible(true);
            }}></TouchableOpacity>

          <PostOptionDrawer
            source={'newfeed'}
            options={options}
            isVisible={isOptionsVisible}
            setIsVisible={setIsOptionsVisible}
            postId={item.id}
            postText={item.content}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const borderRadius = 10;

export default React.memo(SwapCard);

const styles = StyleSheet.create({
  swapImage: {
    margin: 10,
    borderRadius: borderRadius,
    marginTop: 15,
  },
  swapButton: {
    backgroundColor: colors.iondigoDye,
    alignSelf: 'center',
    borderRadius: borderRadius,
    marginVertical: 10,
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginTop: 10,
    overflow: 'hidden',
  },
  menuButton: {
    padding: 3,
    alignSelf: 'flex-end',
    width: 60,
    marginTop: -5,
  },
  imagesWrapper: {
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    resizeMode: 'cover',
    backgroundColor: colors.lighterGray,
  },
  extraActionsContainer: {
    backgroundColor: colors.lighterGray,
  },
  imageContainer: {
    width: '100%',
  },
  categoryDescription: {
    fontSize: 12,
    color: colors.dimGray,
  },
  sliderDotBox: {
    height: 30,
  },
  sliderDot: {},
});
