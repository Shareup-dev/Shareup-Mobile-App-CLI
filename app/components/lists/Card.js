import React, {useState, useEffect, useCallback, useContext} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Alert,
  Text,
  Dimensions,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import colors from '../../config/colors';
import defaultStyles from '../../config/styles';
import authContext from '../../Contexts/authContext';
import PostService from '../../services/post.service';

import PostOptionDrawer from '../drawers/PostOptionsDrawer';
import ImageView from 'react-native-image-viewing';
import PostActions from '../PostActions';
import routes from '../../navigation/routes';
import constants from '../../config/constants';
import CustomImageSlider from '../ImageSlider/CustomImageSlider';
import onShareHandler from '../Share';
export default function Card({
  user,
  postData,
  reloadPosts,
  onPress,
  style,
  navigation,
  postType,
  noActionBar,
  noOptions,
}) {
  const {userState} = useContext(authContext);
  const [numberOfReactions, setNumberOfReactions] = useState(
    postData.numberOfReaction,
  );

  const [numberOfComments, setNumberOfComments] = useState(
    postData.numberOfComments,
  );

  const [isUserLiked, setIsUserLiked] = useState(postData.liked);
  const [comment, setComments] = useState(postData.comments);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState();
  // const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [sliderWidth, setSliderWidth] = useState();



  const options = [
    {
      title: 'Save post',
      icon: {
        image: require('../../assets/post-options-icons/save-post-icon.png'),
      },
      onPress: () => {
        savePost(postData.id);
      },
    },
    {
      title: 'Hide my profile',
      icon: {
        image: require('../../assets/post-options-icons/hide-profile-icon.png'),
      },
      onPress: () => {
        savePost(postData.id);
      },
    },
    {
      title: 'Edit',
      icon: {image: require('../../assets/post-options-icons/swap-icon.png')},
      onPress: () => {
        navigation.navigate(routes.ADD_POST, {
          postType: constants.postTypes.CREATE_POST,
          postData: postData,
          isEdit: true,
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
        navigation.navigate(routes.ADD_POST, {
          postType: constants.postTypes.SHARE_POST,
          postData,
        });
      },
    },
    {
      title: 'Share via',
      icon: {
        image: require('../../assets/icons/share-point-icon.png'),
      },
      onPress: () => {
        onShareHandler(postData);
      },
    },
    {
      title: userState?.userData?.id !== user?.id ? 'Unfollow' : '',
      icon: {
        image: require('../../assets/post-options-icons/unfollow-icon.png'),
      },
      onPress: () => {
        alert('Unfollow');
      },
    },
    {
      title:
        userState?.userData?.id !== user?.id ? (
          <Text style={{color: colors.dark}}>Report</Text>
        ) : (
          <Text style={{color: colors.red}}>Delete</Text>
        ),
      icon: {
        image:
          userState?.userData?.id !== user?.id
            ? require('../../assets/post-options-icons/report-icon.png')
            : require('../../assets/post-options-icons/delete-red-icon.png'),
      },
      onPress: () => {
        userState?.userData?.id !== user?.id
          ? alert('Report')
          : showDeleteAlert();
      },
    },
  ];

  const [formattedDate, setFormattedDate] = useState({
    day: '',
    month: '',
    year: '',
    time: '',
  });
  function randomno() {
    return Math.floor(Math.random() * (100000 - 0 + 1) + 0);
  }
  const formateDate = () => {
    // 01 May 2022 09:24:23
    // var d = new Date(postData.lastEdited); /* midnight in China on April 13th */
    // d.toLocaleString('en-US', { timeZone: 'America/New_York' });
    const arrDate = postData.lastEdited.split(' ');
    const monthShort = arrDate[1].slice(0, 3);

    setFormattedDate({
      day: arrDate[0],
      month: monthShort,
      year: arrDate[2],
      time: arrDate[3],
    });
  };
  const formateNumber = number => {
    if (number > 1000) {
      number = Math.floor(number / 1000);
      return number + 'k ';
    } else return number;
  };

  useEffect(() => {
    formateDate();
    checkIfLiked();
    //loadImages();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // reloadPost();
      loadImages();
    }, [postData.id]),
  );
  //.................... POST ACTION METHOD .............................//
  const savePost = itemId => {
    PostService.savePost(userState?.userData?.id, itemId).then(res => {
      alert('Post saved...');
    });
  };
  const loadImages = () => {
    if (postData.media?.length !== 0) {
      setImages(postData.media?.map(image => image.mediaPath));
    }
  };
  const checkIfLiked = () => {
    const result = postData.liked;
    return setIsUserLiked(result);
  };

  const handleReactions = async () => {
    PostService.likePost(user.id, postData.id)
      .then(res => {
        setIsUserLiked(!isUserLiked);
        setNumberOfReactions(res.data.numberOfReaction);
      }) //need to get likePostIds
      .catch(e => console.error(e));
    //reloadPost();
  };

  // rerenders the post when interaction
  const reloadPost = async () => {
    PostService.getPostByPostId(postData.id)
      .then(res => {
        //setComments(res.data.comments)
        setNumberOfComments(res.data.numberOfComments);
        setNumberOfReactions(res.data.numberOfReaction);
      })
      .catch(e => console.error(e));
  };

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
    const response = await PostService.deletePost(postData.id);
    // reloadPosts();
    setIsOptionsVisible(false);
  };

  const actionsTabSizeRatio = 0.5;

  const onLayout = e => {
    setSliderWidth(e.nativeEvent.layout.width);
  };

  const {width} = Dimensions.get('window');

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[styles.card, defaultStyles.cardBorder, style]}
        onLayout={onLayout}>
        {/* {currentImage && (
          <ImageView
            visible={imageViewerVisible}
            images={[{uri: currentImage}]}
            imageIndex={0}
            onRequestClose={() => {
              setImageViewerVisible(false);
            }}
          />
        )} */}

        {/** Post Image */}

        {images?.length !== 0 && (
          <CustomImageSlider
            media={postData.media}
            width={width - 32}
            height={250}
          />
        )}

        <PostActions
          //comments={comment}
          postData={postData}
          //firstName={firstName}
          navigation={navigation}
          postId={postData.id}
          //date={formattedDate}
          //postText={postText}
          userId={user.id}
          //userEmail={userEmail}
          numberOfReactions={`${numberOfReactions}`}
          numberOfComments={`${numberOfComments}`}
          //profileImage={profileImage}
          isUserLiked={isUserLiked}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
          setIsOptionsVisible={setIsOptionsVisible}
          onInteraction={handleReactions}
          postType={postType}
          noActionBar={noActionBar}
          noOptions={noOptions}
        />

        {!noOptions && (
          <PostOptionDrawer
            source={'card'}
            postId={postData.id}
            postText={postData.content}
            options={options}
            isVisible={isOptionsVisible}
            setIsVisible={setIsOptionsVisible}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const borderRadius = 10;
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginTop: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    resizeMode: 'cover',
  },
  profilePicture: {
    borderRadius: 10,
    marginRight: 10,
    width: 50,
    height: 50,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'row',
  },
  content: {
    justifyContent: 'center',
    padding: 10,
  },
  postDate: {
    fontSize: 12,
    color: colors.dimGray,
  },
  separator: {
    marginVertical: 10,
  },
  postText: {
    fontSize: 11,
    marginTop: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  userNameContainer: {
    width: '40%',
  },
  actionsContainer: {
    flexDirection: 'row',
    width: '42%',
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  actionTab: {
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  commentsShares: {
    flexDirection: 'row',
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  star: {
    marginRight: 5,
  },
  comments: {
    marginRight: 10,
  },
  optionsIcon: {
    alignSelf: 'flex-end',
    top: 8,
  },
  menuButton: {
    padding: 3,
    alignSelf: 'flex-end',
    width: 60,
    marginTop: -5,
  },
});
