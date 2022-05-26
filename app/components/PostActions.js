import React, { useContext, useState } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import colors from '../config/colors';
import Text from '../components/Text';
import Tab from '../components/buttons/Tab';
import Icon from '../components/Icon';
import routes from '../navigation/routes';
import constants from '../config/constants';
import AuthContext from '../Contexts/authContext';

const PostActions = ({
  postId,
  postData,
  userId,
  comments,
  navigation,
  isUserLiked,
  numberOfReactions,
  numberOfComments,
  setIsOptionsVisible,
  postType,
  swapId,
  onInteraction,
  noActionBar,
  noOptions,
}) => {
  const fromReply = false;
  const actionsTabSizeRatio = 0.5;
  const { postTypes } = constants;
  const {
    userState: { userData },
  } = useContext(AuthContext);
  const [date, setDate] = useState(
    moment(postData.published, 'DD MMMM YYYY hh:mm:ss').fromNow(),
    // null
  );

  return (
    <View style={styles.content}>
      <View style={styles.userInfo}>
        <View>
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
        <TouchableOpacity
        onPress={_ => navigation.navigate(routes.GROUP_FEED, postData.group)}
        >
        <Image
                source={{
                  uri: postData.group?.groupImagePath,
                }}
                style={{
                  borderRadius: 15,
                  width: 30,
                  height: 30,
                  zIndex:1,
                  position:'absolute',
                  marginBottom:10,
                  marginLeft:1, 
                  top: -19, 
                  left: 25,

                }}
              /></TouchableOpacity>
        </View>
        <View style={styles.userNameContainer}>
          <TouchableOpacity>
            <Text style={styles.userName}>{postData.userdata.firstName}</Text>
          </TouchableOpacity>
          <Text style={styles.postDate}>{date}</Text>
          {postData.group ?
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start' }}>
              <TouchableOpacity
        onPress={_ => navigation.navigate(routes.GROUP_FEED, postData.group)}
        >
              <Text style={styles.group}>{postData.group?.name}</Text>
              </TouchableOpacity>
            </View> : <></>}
        </View>

        <View style={styles.actionsContainer}>
          <Tab
            title={numberOfReactions}
            iconName="star"
            iconType="FontAwesome5"
            sizeRatio={actionsTabSizeRatio}
            style={styles.actionTab}
            color={colors.mediumGray}
            fontColor={colors.white}
          />

          <Tab
            title={numberOfComments}
            iconName="comment"
            iconType="Octicons"
            sizeRatio={actionsTabSizeRatio}
            style={styles.actionTab}
            color={colors.mediumGray}
            fontColor={colors.white}
          />

          <Tab
            title={'0'}
            iconImage={require('../assets/icons/share-icon.png')}
            sizeRatio={actionsTabSizeRatio}
            style={styles.actionTab}
            color={colors.mediumGray}
            fontColor={colors.white}
            iconSize={10}
          />
        </View>
      </View>
      {!noActionBar && (
        <View style={styles.actionsBar}>
          <View style={styles.likes}>
            {isUserLiked ? (
              <TouchableWithoutFeedback onPress={onInteraction}>
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
              <TouchableWithoutFeedback onPress={onInteraction}>
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
                {numberOfComments} Comments
              </Text>
            </TouchableWithoutFeedback>

            <Text style={styles.actionsText}>0 Shares</Text>
          </View>
        </View>
      )}

      {postData.content !== '' && (
        <Text style={styles.postText}>{postData.content}</Text>
      )}
      {!noOptions && (
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
      )}
    </View>
  );
};

const borderRadius = 10;
const styles = StyleSheet.create({
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
  group: {
    fontWeight: '500',
    fontSize: 13,
    //marginTop:10,
  },
  userNameContainer: {
    width: '40%',
  },
  actionsContainer: {
    flexDirection: 'row',
    width: '42%',
    justifyContent: 'flex-end',
  },
  actionTab: {
    paddingHorizontal: 5,
    marginHorizontal: 5,
    borderRadius: 10,
    marginTop: 10,
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

export default PostActions;
