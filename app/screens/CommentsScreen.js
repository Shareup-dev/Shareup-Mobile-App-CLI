import React, {useState, useRef, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';

import {Header, HeaderCloseIcon, HeaderTitle} from '../components/headers';
import Screen from '../components/Screen';
import CommentTextField from '../components/comments/CommentTextField';
import constants from '../config/constants';
import AuthContext from '../Contexts/authContext';

import {useFocusEffect} from '@react-navigation/native';
import postService from '../services/post.service';
import SwapService from '../services/swap.service';
import {CommentsList} from '../components/comments';
import CommentsContext from '../Contexts/commentsContext';
import colors from '../config/colors';
import {CommentText} from '../components/comments';
import {feedPostsAction} from '../redux/feedPostsSlice';
import {useDispatch} from 'react-redux';

export default function CommentsScreen({navigation, route}) {
  const {postTypes} = constants;
  const commentTextFieldRef = useRef();
  const {userState} = useContext(AuthContext);
  const dispatch = useDispatch();
  const {
    postId,
    postType,
    swapId,
    fromDetailScreen,
    writeComment = true,
  } = route.params;

  const [comments, setComments] = useState({
    loading: false,
    state: [],
  });
  const [isReplied, setIsReplied] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [commentContent, setCommentContent] = useState('');

  const handleOnChangeText = text => {
    setCommentContent(text);
  };

  const focusTextField = () => commentTextFieldRef.current.focus();

  useFocusEffect(
    useCallback(() => {
      loadComments();
      if (writeComment) {
        focusTextField();
      }
      return;
    }, []),
  );

  const loadComments = () => {
    setComments(prev => ({...prev, loading: true}));
    if (postType === postTypes.SWAP) {
      SwapService.getSwapComment(swapId)
        .then(({data}) => {
          setComments(prev => ({...prev, state: data}));
        })
        .catch(e => console.error(e.message))
        .finally(_ => setComments(prev => ({...prev, loading: false})));
    } else {
      postService
        .getAllComments(userState?.userData?.id, postId)
        .then(({data}) => {
          const newData = {commentCount: data.length, key: postId};
          setComments(prev => ({...prev, state: data}));
          dispatch(feedPostsAction.updateCommentCount(newData));
        })
        .catch(e => console.error(e.message))
        .finally(_ => setComments(prev => ({...prev, loading: false})));
    }
  };

  const handleCancel = () => navigation.goBack();
  const handleAddComment = async () => {
    if (isReply) {
      const comment = {content: commentContent};
      if (commentContent !== '') {
        await postService
          .replay(userState?.userData?.id, selectedComment.id, comment)
          .then(res => {
            setCommentContent('');
            commentTextFieldRef.current.clear();
            Keyboard.dismiss();
          })
          .catch(e => console.error('1', e))
          .finally(() => setIsReplied(true));
      }
      cancelReplyComment();
    } else {
      const comment = {content: commentContent};
      if (commentContent !== '') {
        await postService
          .addComment(userState?.userData?.id, postId, comment)
          .then(({data}) => {
            commentTextFieldRef.current.clear();
            Keyboard.dismiss();
          })
          .catch(e => console.error(e));
      }
    }
    loadComments();
  };

  const cancelReplyComment = () => {
    setIsReply(false);
    setSelectedComment(null);
    setIsReplied(false);
  };

  return (
    <CommentsContext.Provider
      value={{
        setSelectedComment,
        setIsReply,
        focusTextField,
        isReplied,
      }}>
      <Screen style={styles.container}>
        {!fromDetailScreen && (
          <Header
            left={<HeaderCloseIcon onPress={handleCancel} />}
            middle={<HeaderTitle>Comments</HeaderTitle>}
          />
        )}
        <View style={styles.commentContainer}>
          <CommentsList
            navigation={navigation}
            data={comments.state}
            refreshing={comments.loading}
            onRefreshing={loadComments}
          />
        </View>

        <View style={styles.textFieldContainer}>
          {isReply && selectedComment && (
            <View
              style={{
                margin: 5,
              }}>
              <CommentText>{selectedComment.content}</CommentText>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: colors.iondigoDye,
                  }}>{`Reply to: ${selectedComment.user.firstName}`}</Text>
                <TouchableOpacity onPress={cancelReplyComment}>
                  <Text
                    style={{
                      color: colors.red,
                      marginHorizontal: 15,
                    }}>{`Cancel`}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <CommentTextField
            onForwardPress={handleAddComment}
            ref={commentTextFieldRef}
            isReply={isReply}
            onChangeText={handleOnChangeText}
          />
        </View>
      </Screen>
    </CommentsContext.Provider>
  );
}

const styles = StyleSheet.create({
  textFieldContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
    marginTop: 15,
  },
  commentContainer: {
    justifyContent: 'space-between',
    flex: 1,
  },
  container: {},
  replayContainer: {
    marginTop: 15,
    marginStart: '20%',
    alignItems: 'flex-start',
  },
});
