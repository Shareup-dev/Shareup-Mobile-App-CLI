import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import AuthContext from '../../authContext';
import colors from '../../config/colors';
import defaultStyles from '../../config/styles';
import routes from '../../navigation/routes';
import Card from './Card';
import moment from 'moment';
import postService from '../../services/post.service';
import Icon from '../Icon';

export default function SharedPostCard(props) {
    const {postData, navigation, ...rest} = props;
  const [isUserLiked, setIsUserLiked] = useState(postData.liked);
  const [numberOfReactions, setNumberOfReactions] = useState(0);
  const {
    userState: {userData},
  } = React.useContext(AuthContext);

  const [date, setDate] = useState(
    moment(postData.published, 'DD MMMM YYYY hh:mm:ss').fromNow(),
    // null
  );

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
  const FooterComponent = () => {
    return (
      <View style={{paddingHorizontal: 15}}>
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
      </View>
    );
  };

  return (
    <View style={[styles.card, defaultStyles.cardBorder]}>
      <HeaderComponent />
      <Card {...rest} noActionBar noOptions postData={postData.post} navigation={navigation} />
      <FooterComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  comments: {
    marginRight: 10,
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
