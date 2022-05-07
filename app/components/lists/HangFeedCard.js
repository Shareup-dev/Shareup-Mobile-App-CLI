import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Alert,
  Text,
  Image, TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SliderBox } from 'react-native-image-slider-box';
import Tab from '../buttons/Tab'
import colors from '../../config/colors';
import defaultStyles from '../../config/styles';
import authContext from '../../authContext';
import PostService from '../../services/post.service';
import Icon from '../Icon';
import PostOptionDrawer from '../drawers/PostOptionsDrawer';
import fileStorage from '../../config/fileStorage';
import ImageView from 'react-native-image-viewing';
import PostActions from '../PostActions';
import { color } from 'react-native-reanimated';
import routes from '../../navigation/routes';
import constants from '../../config/constants';
import hangShareService from '../../services/hangShare.service';
export default function HangFeedCard({
  user,
  postData,
  reloadPosts,
  onPress,
  style,
  navigation,
  postType,
}) {
  const { userState } = useContext(authContext);
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
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [sliderWidth, setSliderWidth] = useState();
  const {width, height} = Dimensions.get('window');
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
      icon: { image: require('../../assets/post-options-icons/swap-icon.png') },
      onPress: () => {
        navigation.navigate(routes.ADD_POST,{postType: constants.postTypes.HANG_SHARE,
          postData,
          isEdit:true})
          setIsOptionsVisible(false)
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
          postData
        });
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
          <Text style={{ color: colors.dark }}>Report</Text>
        ) : (
          <Text style={{ color: colors.red }}>Delete</Text>
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
      loadImages();
      reloadPost();
    }, [postData.id]),
  );
  //.................... POST ACTION METHOD .............................//
  const savePost = itemId => {
    
  };
  const loadImages = () => {
    if (postData.media?.length !== 0) {
      setImages(
        postData.media?.map(image => image.mediaPath),
      );
    }
  };
  const checkIfLiked = () => {
    const result = postData.liked;
    return setIsUserLiked(result);
  };

  const handleReactions = async () => {
    // PostService.likePost(user.id, postData.id)
    //   .then(res => {
    //     setIsUserLiked(!isUserLiked);
    //     setNumberOfReactions(res.data.numberOfReaction);
    //   }) //need to get likePostIds
    //   .catch(e => console.error(e));
    // //reloadPost();
  };

  // rerenders the post when interaction
  const reloadPost = async () => {
    // PostService.getPostByPostId(postData.id)
    //   .then(res => {
    //     //setComments(res.data.comments)
    //     setNumberOfComments(res.data.numberOfComments);
    //     setNumberOfReactions(res.data.numberOfReaction);
    //   })
    //   .catch(e => console.error(e));
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
   
    hangShareService.deleteHang(userState.userData.id,postData.id)
    .then((res)=> {})
    .catch((e)=>{console.log("error",e);})
    reloadPosts();
    setIsOptionsVisible(false);
  };
  
  const actionsTabSizeRatio = 0.5;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[styles.card, defaultStyles.cardBorder]}>
        <View
                style={[styles.imageCard, defaultStyles.lightShadow]}>
                <Image
                     source={{
                      uri:postData?.media[0]?.mediaPath,
                    }}
                    style={styles.image}
                    resizeMode={'cover'}
                />
                <Text style={{ color: colors.iondigoDye, fontSize: 12, fontWeight: 'bold', paddingTop: 10 }}></Text>
                <View style={{ flexDirection: 'row', marginTop: 10, }}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <Icon
                            name="star"
                            type="FontAwesome"
                            size={17}
                            color={colors.iondigoDye}
                            backgroundSizeRatio={0.8}
                            style={styles.star}
                        />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <Icon
                            name="star"
                            type="FontAwesome"
                            size={17}
                            color={colors.iondigoDye}
                            backgroundSizeRatio={0.8}
                            style={styles.star}
                        />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <Icon
                            name="star"
                            type="FontAwesome"
                            size={17}
                            color={colors.iondigoDye}
                            backgroundSizeRatio={0.8}
                            style={styles.star}
                        />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <Icon
                            name="star"
                            type="FontAwesome"
                            size={17}
                            color={colors.iondigoDye}
                            backgroundSizeRatio={0.8}
                            style={styles.star}
                        />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <Icon
                            name="star"
                            type="FontAwesome"
                            size={17}
                            color={colors.iondigoDye}
                            backgroundSizeRatio={0.8}
                            style={styles.star}
                        />
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.cartComment}>
                    <Tab
                        title={"216"}
                        iconName="comment-discussion"
                        iconType="Octicons"
                        sizeRatio={0.8}
                        style={styles.actionTab,{marginTop:0,marginBottom:0}}
                        color={colors.white}
                        fontColor={colors.mediumGray}
                    />
                    <Tab
                        title={"817"}
                        iconName="shoppingcart"
                        iconType="AntDesign"
                        sizeRatio={0.8}
                        style={styles.actionTab,{marginTop:0,marginBottom:0}}
                        color={colors.white}
                        fontColor={colors.mediumGray}
                    />
                </View>
            </View>
        <View style={styles.content}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri:postData.userdata.profilePicturePath }}
              style={styles.profilePicture}
            />

            <View style={styles.userNameContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(routes.USER_PROFILE, postData.userdata.email)
                }
              >
                <Text style={styles.userName}>{postData.userdata.firstName}</Text>
              </TouchableOpacity>

              <Text style={styles.postDate}>{postData.published}</Text>
            </View>
          </View>

          {postData.content !== "" && <Text style={styles.postText}>{postData.content}</Text>}
          {userState?.userData.id !== postData.userdata.id && (
          <Tab
            title={"Accept"}
            sizeRatio={0.9}
            style={styles.actionTab}
            color="#4dae50"
            fontColor={colors.white}
            iconSize={10}
            onPress={()=> navigation.navigate(routes.SHIPPING_ADDRESS,postData)}
          />)}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setIsOptionsVisible(true);
            }}
          >
            <Icon
              name="options"
              type="SimpleLineIcons"
              style={styles.optionsIcon}
              size={20}
              backgroundSizeRatio={1}
            />
          </TouchableOpacity>
        </View>

        <PostOptionDrawer
          source={'card'}
          postId={postData.id}
          postText={postData.content}
          options={options}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const borderRadius = 10;
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom:10,
    overflow: 'hidden',
  },
  imageCard: {
    backgroundColor: colors.white,
        marginHorizontal: 15,
        marginTop: 10,
        //overflow: 'hidden',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        //height:200,
        width: "80%",
        borderColor: colors.LightGray,
        borderWidth: 1,
        borderRadius: 10,
       
        
  },
  image: {
     width: "60%", 
     height: 110,
    //borderTopLeftRadius: borderRadius,
    //borderTopRightRadius: borderRadius,
    resizeMode: 'cover',
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
  },
  hangitemName:{
    color:colors.iondigoDye,
    marginTop:10,
    paddingTop:5,
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
    marginLeft: 55,
    marginRight: 5
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
    borderRadius: 10,
    marginTop: 15,
    marginLeft:15,
    marginRight:15,
    marginBottom:10,
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
  cartComment:{
    width: "100%",
    flexDirection:"row",
    justifyContent:"space-between",
    marginTop:0

  }
});
