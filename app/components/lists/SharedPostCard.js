import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import AuthContext from '../../Contexts/authContext';
import colors from '../../config/colors';
import defaultStyles from '../../config/styles';
import routes from '../../navigation/routes';
import Card from './Card';
import moment from 'moment';
import postService from '../../services/post.service';
import Icon from '../Icon';
import PostOptionDrawer from '../drawers/PostOptionsDrawer';
import constants from '../../config/constants';

import onShareHandler from '../Share';
import { postDataSliceAction } from '../../redux/postDataSlice';

import { useDispatch } from 'react-redux';
import { Switch } from 'react-native-gesture-handler';
import SwapCard from './SwapCard';

export default function SharedPostCard(props) {
  const {postData, navigation,user, ...rest} = props;  
  const dispatch = useDispatch()
  const [isUserLiked, setIsUserLiked] = useState(postData.liked);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [numberOfReactions, setNumberOfReactions] = useState(0);
  const {
    userState: {userData},
  } = React.useContext(AuthContext);

  const [date, setDate] = useState(
    moment(postData.published, 'DD MMMM YYYY hh:mm:ss').fromNow(),
    // null
  );
 
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
      title: userData?.id !== postData.userdata?.id ? '':'Edit',
      icon: {image: require('../../assets/post-options-icons/swap-icon.png')},
      onPress: () => {
        // dispatch(updatePostModeAction.setState(true))
        // dispatch(updatePostDataAction.setState(postData))
        // navigation.navigate(routes.ADD_POST, {
        //   postType: constants.postTypes.SHARE_POST,
        // });
        // setIsOptionsVisible(false);
      },
    },
    {
      title: 'Share friends',
      icon: {
        image: require('../../assets/post-options-icons/share-friends-icon.png'),
      },
      onPress: () => {
        
        dispatch(postDataSliceAction.setPostData(postData.post))
        
        navigation.navigate(routes.ADD_POST, {
           postType: constants.postTypes.SHARE_POST,
          // postData: postData.post,
        });
        setIsOptionsVisible(false);
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
      title: userData?.id !== postData.userdata?.id ? 'Unfollow' : '',
      icon: {
        image: require('../../assets/post-options-icons/unfollow-icon.png'),
      },
      onPress: () => {
        alert('Unfollow');
      },
    },
    {
      title:
        userData?.id !== postData.userdata?.id ? (
          <Text style={{color: colors.dark}}>Report</Text>
        ) : (
          <Text style={{color: colors.red}}>Delete</Text>
        ),
      icon: {
        image:
          userData?.id !== postData.userdata?.id
            ? require('../../assets/post-options-icons/report-icon.png')
            : require('../../assets/post-options-icons/delete-red-icon.png'),
      },
      onPress: () => {
        userData?.id !== postData.userdata?.id
          ? alert('Report')
          : showDeleteAlert();
      },
    },
  ];

  const showDeleteAlert = () =>
      Alert.alert('Delete', 'Are you sure to delete this post', [
        {
          text: 'Yes',
          onPress: ()=> {},
          style: 'cancel',
        },
        {
          text: 'No',
          style: 'cancel',
        },
      ]);

    const deletePost = async () => {
      swapService
        .deleteSwap(item.id)
        .then(res => {
          if (res.status === 200){
            dispatch(feedPostsAction.removeFeedPost(postData.id));
            navigation.navigate(routes.FEED);
          }
        })
        .catch(e => alert(e));
      }
  const HeaderComponent = () => {
    return (
      <View style={{paddingTop: 10, paddingHorizontal: 15}}>
        <View style={styles.userInfo}>
          <TouchableOpacity
            onPress={() =>
              postData.userdata?.id === userData.id
                ? navigation.navigate(routes.USER_PROFILE, {
                    user: postData.userdata,
                  })
                : navigation.navigate(routes.FRIEND_PROFILE, {
                    user: postData.userdata,
                  })
            }>
            <Image
              source={{
                uri: postData.userdata.profilePicturePath,
              }}
              style={styles.profilePicture}
            />
          </TouchableOpacity>

          <View style={styles.userNameContainer}>
            <TouchableOpacity>
              <Text style={styles.userName}>{postData.userdata.firstName}</Text>
            </TouchableOpacity>

            <Text style={styles.postDate}>{date}</Text>
          </View>
        </View>
      </View>
    );
  };
  const handleReactions = async () => {
    postService
      .likePost(userData.id, postData.id)
      .then(res => {
        setIsUserLiked(!isUserLiked);
        setNumberOfReactions(res.data.numberOfReaction);
      }) //need to get likePostIds
      .catch(e => console.error(e));
    //reloadPost();
  };
  const renderCard = (item) => {
    switch (item.post.allPostsType) {
      case constants.postTypes.SWAP:
        return (
          <SwapCard
          noActionBar
          noOptions
            navigation={navigation}
            // route={route}
            item={item.post}
            userId={item.post.userdata.id}
            onPress={() => { navigation.navigate(routes.POST_DETAILS_SCREEN, { postData: item.post }) }}
          />
        );
      // case "share":
      //   return (
      //     <SharedPostCard
      //     user={item.userdata}
      //     postData={item}
      //     navigation={navigation}
      //     reloadPosts={loadNews}
      //     postType={item.allPostsType}
      //     />
      //   );
      case constants.postTypes.HANG_SHARE:
        return (
          <SwapCard
          noActionBar
          noOptions
            navigation={navigation}
            // route={route}
            item={item.post}
            userId={item.post.userdata.id}
            onPress={() => { navigation.navigate(routes.POST_DETAILS_SCREEN, { postData: item.post }) }}
          />
          // <HangFeedCard //style={styles.listItem}
          //   user={item.userdata}
          //   postData={item}
          //   navigation={navigation}
          //   reloadPosts={loadNews}
          //   postType={item.allPostsType}
          //   onPress={() => { navigation.navigate(routes.POST_DETAILS_SCREEN, { postData: item }) }}
          // />
        );
      default:
        return (
          <Card
          {...rest}
          noActionBar
          noOptions
          postData={postData.post}
          navigation={navigation}
          user = {user}
        />
        );
    }
};
  const FooterComponent = () => {
    return (
      <View style={{paddingHorizontal: 15,paddingTop:15}}>
        <View style={styles.actionsBar}>
          <View style={styles.likes}>
            {isUserLiked ? (
              <TouchableWithoutFeedback onPress={handleReactions}>
                <Icon
                  name="star"
                  type="FontAwesome"
                  size={17}
                  color="#FFC107"
                  backgroundSizeRatio={1}
                  style={styles.star}
                />
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback onPress={handleReactions}>
                <Icon
                  name="star-o"
                  type="FontAwesome"
                  size={17}
                  color="#FFC107"
                  backgroundSizeRatio={1}
                  style={styles.star}
                />
              </TouchableWithoutFeedback>
            )}

            <Text style={styles.actionsText}>{numberOfReactions}</Text>
          </View>

          <View style={styles.commentsShares}>
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate(routes.COMMENTS, {
                  postId,
                  userId,
                  //comments,
                  postType,
                  swapId,
                  fromReply,
                })
              }>
              <Text style={[styles.actionsText, styles.comments]}>
                {postData.numberOfComments} Comments
              </Text>
            </TouchableWithoutFeedback>

            <Text style={styles.actionsText}>0 Shares</Text>
          </View>
        </View>

        {postData.content !== '' && (
          <Text style={styles.postText}>{postData.content}</Text>
        )}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            setIsOptionsVisible(true);
          }}>
          <Icon
            name="options"
            type="SimpleLineIcons"
            style={styles.optionsIcon}
            size={20}
            backgroundSizeRatio={1}
          />
        </TouchableOpacity>
        <PostOptionDrawer
          source={'card'}
          postId={postData.id}
          postText={postData.content}
          options={options}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
        />
      </View>
    );
  };

  return (
    <View style={[styles.card, defaultStyles.cardBorder]}>
      <HeaderComponent />
      
      {postData.post ? (
        <View>
        {renderCard(postData)}
        </View>
        
      ) : (
        <View style={{alignItems: 'center', paddingVertical: 10}}>
          <Text>Post unavailable</Text>
        </View>
      )}
      <FooterComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  comments: {
    marginRight: 10,
  },
  menuButton: {
    padding: 3,
    alignSelf: 'flex-end',
    marginTop: -5,
  },
  actionsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  star: {
    marginRight: 5,
  },
  userNameContainer: {
    width: '40%',
  },
  postText: {
    fontSize: 11,
    marginVertical: 5,
  },
  postDate: {
    fontSize: 12,
    color: colors.dimGray,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginTop: 10,
    paddingBottom: 5,

    overflow: 'hidden',
    // padding: 7,
    // paddingHorizontal: 6,
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
  profilePicture: {
    borderRadius: 15,
    marginRight: 10,
    width: 50,
    height: 50,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'row',
  },
});
