import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import moment from 'moment';

import colors from '../../config/colors';
import LinkButton from '../buttons/LinkButton';
import Icon from '../Icon';
import UserProfilePicture from '../UserProfilePicture';
import {CommentText} from './';
import AuthContext from '../../authContext';
import postService from '../../services/post.service';
import Separator from '../Separator';
import CommentsList from './CommentsList';

const {width} = Dimensions.get('window');

export default function CommentCard(props) {
  const {
    userState: {userData},
  } = useContext(AuthContext);
  const {comment, commentLiked, replayComment} = props;
  const time = moment(comment.published, 'DD MMMM YYYY hh:mm:ss').fromNow();

  const [isLiked, setIsLiked] = useState(commentLiked);
  const [collapseReply, setCollapseReply] = useState(false);
  const [replies, setReplies] = useState({
    loading: false,
    state: [],
  });

  const handleReaction = () => {
    setIsLiked(prev => !prev);
  };

  const getAllReplies = () => {
    setReplies(prev => ({...prev, loading: true}));
    postService
      .getAllReply(userData.id, comment.id)
      .then(({data}) => {
        setReplies(prev => ({...prev, state: data}));
      })
      .catch(e => console.error(e))
      .finally(() => setReplies(prev => ({...prev, loading: false})));
  };

  const handleCollapseReply = () => {
    if (!collapseReply) {
      getAllReplies();
      return setCollapseReply(true);
    }
    setCollapseReply(false);
  };

  return (
    <>
      <View
        style={[
          styles.commentContainer,
          {
            marginLeft: replayComment ? 40 : 0,
            width: replayComment ? width - 40 : width,
          },
        ]}>
        {/** Left */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <UserProfilePicture
            size={40}
            profilePicture={comment.user.profilePicturePath}
          />

          <View style={styles.medialContainer}>
            <Text style={styles.userName}>{comment.user.firstName}</Text>

            <View style={styles.commentBody}>
              <CommentText
                comment={comment}
                textStyle={styles.comment}
                readMoreStyle={styles.readMore}
                // isEdit={isEdit}
                // isReply={isReply}
                // setIsEdit={setIsEdit}
              />
            </View>

            <View style={[styles.commentDetailsContainer]}>
              <Text style={styles.time}>{time}</Text>
              <Text style={styles.stars}>
                {/* {reactionsLength} {reactionsLength < 2 ? 'Star' : 'Stars'} */}
              </Text>
            </View>
          </View>
        </View>

        {/** Right */}
        <View style={styles.reactionContainer}>
          {isLiked ? (
            <TouchableWithoutFeedback onPress={() => handleReaction()}>
              <Icon
                name="star"
                type="AntDesign"
                size={20}
                color={colors.iondigoDye}
                backgroundSizeRatio={1}
              />
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback onPress={() => handleReaction()}>
              <Icon
                name="staro"
                type="AntDesign"
                size={20}
                color={colors.iondigoDye}
                backgroundSizeRatio={1}
              />
            </TouchableWithoutFeedback>
          )}
          <View>
            {collapseReply ? (
              <LinkButton
                title="Hide reply"
                style={styles.reply}
                onPress={handleCollapseReply}
              />
            ) : (
              <LinkButton
                title="Reply"
                style={styles.reply}
                onPress={handleCollapseReply}
              />
            )}
          </View>
        </View>
      </View>
      {/* {showReply && (
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
    */}
      {collapseReply ? (
        <CommentsList replayComment data={replies.state} />
      ) : null}
      <Separator style={styles.separator} />

      {/* <OptionsDrawer
        options={options}
        isVisible={isOptionsVisible}
        setIsVisible={setIsOptionsVisible}
      /> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingBottom: 6,
    alignItems: 'flex-start',
  },
  commentContainer: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingBottom: 6,
    paddingHorizontal: 25,
    justifyContent: 'space-between',
  },
  replyContainer: {
    flexDirection: 'row',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comment: {
    color: colors.mediumGray,
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
    fontSize: 12,
    color: colors.iondigoDye,
    fontWeight: 'bold',
  },
  reactionContainer: {
    paddingTop: 5,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  separator: {
    marginHorizontal: 15,
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
