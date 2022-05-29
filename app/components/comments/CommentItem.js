import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Alert,
} from 'react-native';
import moment from 'moment';
import colors from '../../config/colors';
import Separator from '../Separator';
import UserProfilePicture from '../UserProfilePicture';
import Icon from '../Icon';
import LinkButton from '../buttons/LinkButton';
import CommentText from './CommentText';
import authContext from '../../Contexts/authContext';
import postService from '../../services/post.service';
import OptionsDrawer from '../drawers/OptionsDrawer';
import ReplyList from '../lists/ReplyList';

export default function CommentItem({
  comment,
  reactionsLength,
  isUserLiked,
  onInteraction,
  handleEdit,
  onReply,
  isReply,
  postType,
  refresh,
  refreshComments,
}) {

  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [replyList, setReplyList] = useState([]);
  const [showReply, setshowReply] = useState(false);
  const {userState} = useContext(authContext);
  const [isEdit, setIsEdit] = useState(false);
  const [time, setTime] = useState(
    moment(comment.published, 'DD MMMM YYYY hh:mm:ss').fromNow(),
  );

  const options = [
    {
      title: 'Edit',
      icon: {
        name: 'edit',
        type: 'Entypo',
        size: 15,
      },
      onPress: () => {
        //alert('Edit');
        setIsOptionsVisible(false);
        setIsEdit(true);
        handleEdit(isEdit);
      },
    },
    {
      title: 'Delete',
      icon: {
        name: 'delete',
        color: 'crimson',
        size: 20,
      },
      onPress: () =>
        Alert.alert('Delete', 'Are you sure you want to delete this comment?', [
          {
            text: 'Yes',
            onPress: () => {
              handleDeleteComment();
            },
          },
          {text: 'No'},
        ]),
    },
  ];

  const handleDeleteComment = () => {
    if (isReply) {
      postService
        .deleteReply(comment.id)
        .then(res => refreshComments())
        .catch(e => console.error(e))
        .finally(() => setIsOptionsVisible(false));
    } else {
      postService
        .deleteComment(comment.id)
        .then(res => {
          refreshComments();
          Keyboard.dismiss();
        })
        .catch(e => console.error(e));
    }
    // scrollToListBottom();
  };

  const handleLongPress = commendId => {
    setIsOptionsVisible(true);
  };

  const loadReply = () => {
    postService
      .getAllReply(userState.userData.id, comment.id)
      .then(res => {
        const replyArray = res.data; //.reverse();
        setReplyList(replyArray);
      })
      .catch(e => console.error(e));
  };

  const handleReply = commentId => {
    onReply(commentId, true);
    setshowReply(true);
  };
  const hideReply = () => {
    setshowReply(false);
    onReply(comment.id, false);
  };
  const handleEditComment = status => {
    setIsEdit(status);
  };

  const handleReactions = async cid => {
    const params = {reaction: 'null'};
    postService
      .likeUnlikeReply(userState?.userData?.id, cid, params)
      .then(res => {
        loadReply();
      }) 
      .catch(e => console.error(e));

  };

  return (
    <>
      <TouchableWithoutFeedback
        onLongPress={() => {
          handleLongPress(comment.id);
        }}>
        <View style={styles.commentContainer}>
          {/** Left */}
          <View>
            <UserProfilePicture
              size={40}
              profilePicture={comment.user.profilePicturePath}
            />
          </View>

          {/** Medial */}
          <View style={styles.medialContainer}>
            <Text style={styles.userName}>{comment.user.firstName}</Text>

            <View style={styles.commentBody}>
              <CommentText
                comment={comment}
                textStyle={styles.comment}
                readMoreStyle={styles.readMore}
                isEdit={isEdit}
                isReply={isReply}
                setIsEdit={setIsEdit}
              />
            </View>

            <View style={styles.commentDetailsContainer}>
              <Text style={styles.time}>{time}</Text>
              <Text style={styles.stars}>
                {reactionsLength} {reactionsLength < 2 ? 'Star' : 'Stars'}
              </Text>
              <LinkButton
                title="Reply"
                style={styles.reply}
                onPress={() =>
                  !comment.comment ? handleReply(comment.id) : {}
                }
              />
            </View>
          </View>

          {/** Right */}
          <View style={styles.reactionContainer}>
            {isUserLiked ? (
              <TouchableWithoutFeedback
                onPress={() => onInteraction(comment.id)}>
                <Icon
                  name="star"
                  type="AntDesign"
                  size={15}
                  color={colors.iondigoDye}
                  backgroundSizeRatio={1}
                />
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback
                onPress={() => onInteraction(comment.id)}>
                <Icon
                  name="staro"
                  type="AntDesign"
                  size={15}
                  color={colors.iondigoDye}
                  backgroundSizeRatio={1}
                />
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
      {showReply && (
        <View style={styles.replayContainer}>
          <Text
            style={{color: colors.iondigoDye, fontSize: 12}}
            onPress={hideReply}>
            -- Hide replies
          </Text>
          <ReplyList
            comment={comment}
            postType={postType}
            refresh={refresh}
            refreshComments={refreshComments}
          />
        </View>
      )}
      <Separator style={styles.separator} />

      <OptionsDrawer
        options={options}
        isVisible={isOptionsVisible}
        setIsVisible={setIsOptionsVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: '10%',
    paddingTop: 25,
    paddingBottom: 6,
    marginStart: '20%',
    alignItems: 'flex-start',
  },
  commentContainer: {
    flexDirection: 'row',
    width: '90%',
    paddingHorizontal: '10%',
    paddingTop: 25,
    paddingBottom: 6,
    justifyContent: 'center',
  },
  replyContainer: {
    flexDirection: 'row',
    width: '90%',
    paddingTop: 20,
    paddingBottom: 6,
    justifyContent: 'space-between',
  },

  medialContainer: {
    marginLeft: 10,
    paddingTop: 5,
    justifyContent: 'space-between',
  },
  userName: {
    fontWeight: 'bold',
  },
  commentDetailsContainer: {
    width: '65%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comment: {
    color: colors.mediumGray,
    width: Dimensions.get('window').width / 1.7,
    fontSize: 13,
  },
  commentBody: {
    marginVertical: 6,
  },
  time: {
    fontSize: 9,
  },
  stars: {
    fontSize: 10,
    color: colors.iondigoDye,
  },
  reply: {
    fontSize: 10,
    color: colors.iondigoDye,
    fontWeight: 'bold',
  },
  reactionContainer: {
    paddingTop: 5,
  },
  separator: {
    marginHorizontal: 15,
    width: '90%',
  },
  commentTextContainer: {
    marginVertical: 5,
  },
  readMore: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.iondigoDye,
  },
  deleteBox: {
    backgroundColor: colors.dimGray,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  replayContainer: {
    marginTop: 15,
    marginStart: '20%',
    width: '80%',
    alignItems: 'flex-start',
  },
});
