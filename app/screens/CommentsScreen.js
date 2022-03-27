import React, {useState, useRef} from 'react';
import {View, StyleSheet, FlatList, Keyboard,Animated,TouchableOpacity,Dimensions,Text} from 'react-native';

import {Header, HeaderCloseIcon, HeaderTitle} from '../components/headers';
import Screen from '../components/Screen';
import CommentItem from '../components/comments/CommentItem';
import CommentTextField from '../components/comments/CommentTextField';
import EmojiesBar from '../components/comments/EmojiesBar';
import PostService from '../services/post.service';
import constants from '../config/constants';
import { prepareDataForValidation } from 'formik';
import colors from "../config/colors";
//import UserService from '../services/UserService';
export default function CommentsScreen({navigation, route}) {
  const commentsListRef = useRef();
  const commentTextFieldRef = useRef();
  const [isUserLiked, setIsUserLiked] = useState(false);

  const {comments, userId, postId, setNumberOfComments, postType, swapId} =
    route.params;
  const [commentsList, setCommentsList] = useState(comments);
  const [commentContent, setCommentContent] = useState('');
  const [commentId,setCommentId] = useState('')
  // needed to setup list refreshing
  const [refreshing, setRefreshing] = useState(false);
  console.log('swapId: ', swapId);
  const handleCancel = () => {
    navigation.goBack();
  };
  console.log('commentContent',commentContent)
  const handleAddComment = async () => {
    if (postType === 'swapPost') {
      console.log('it is Swap');
      const comment = {content: commentContent};
      PostService.addSwapComment(userId, swapId, comment.content).then(resp => {
        console.log('added swap comment success: ', resp.data);
        refreshComments();
        setCommentContent('');
        commentTextFieldRef.current.clear();
        Keyboard.dismiss();
        // scrollToListBottom();
      });
    } else {
      const comment = {content: commentContent};
      console.log('Making comment: ', userId, postId, comment);
      if (commentContent !== '') {
        PostService.addComment(userId, postId, comment)
        .then(res => {
          refreshComments();
          setCommentContent('');
          commentTextFieldRef.current.clear();
           Keyboard.dismiss();
        })
        .catch(e => console.log(e))
        
        // scrollToListBottom();
      }
    }
  };
  
  const handleDeleteComment= (itemId)=> {
    if (postType === 'swapPost') {
      console.log('it is Swap');
      const comment = {content: commentContent};
      PostService.addSwapComment(userId, swapId, comment.content).then(resp => {
        console.log('added swap comment success: ', resp.data);
        refreshComments();
        setCommentContent('');
        commentTextFieldRef.current.clear();
        Keyboard.dismiss();
        // scrollToListBottom();
      });
    } else {
      console.log('deleting comment: ', commentId);
        PostService.deleteComment(itemId)
        .then(res => {
          console.log(res.data)
          refreshComments();
           Keyboard.dismiss();
        })
        .catch(e => console.log(e))
        
        // scrollToListBottom();
    }
  };

  const refreshComments = async () => {
    setRefreshing(true);
    if (postType !== 'swapPost') {
      console.log('if NOT swapPost');
      PostService.getPostById(postId)
      .then(res => {
        setCommentsList(res.data.comments);})
      .catch(e => console.log(e))
      
    } else {
      console.log('if swapPost');
      const response = await PostService.getSwapById(swapId);
      setCommentsList(response.data.comments);
    }

    setRefreshing(false);
  };

  const handleOnChangeText = text => {
    setCommentContent(text);
  };

  const scrollToListBottom = () => {
    commentsListRef.current.scrollToEnd({animated: true});
  };
  const handleReactions = async () => {
    PostService.likePost(userId, postId)
    .then (res => {
      setIsUserLiked(!isUserLiked)
      })//need to get likePostIds 
    .catch(e => console.log(e))
    reloadPost();
  };

  
  return (
    <Screen style={styles.container}>
      <Header
        left={<HeaderCloseIcon onPress={handleCancel} />}
        middle={<HeaderTitle>Comments</HeaderTitle>}
      />

      <FlatList
        data={commentsList}
        keyExtractor={comment => comment.id.toString()}
        ref={commentsListRef}
        onContentSizeChange={scrollToListBottom}
        refreshing={refreshing}
        onRefresh={refreshComments}
        renderItem={({item}) => (
          <CommentItem
            commentId={item?.id}
            username={item?.user?.firstName}
            comment={item?.content}
            user={item?.user}
            publishedDate={item?.published}
            reactionsLength={
              item?.reactions?.length ? item?.reactions?.length : 0
            }
            isUserLiked ={isUserLiked}
            onInteraction={handleReactions}
            handleDelete={handleDeleteComment}
            
          />
        )}
      />

      <View style={styles.textFieldContainer}>
         {/* <EmojiesBar addEmoji={addEmoji}/>  */}
        <View style={styles.textFieldContainer}>
          <CommentTextField
            onForwardPress={handleAddComment}
            onChangeText={handleOnChangeText}
            ref={commentTextFieldRef}
          />
      </View>
      </View>
    </Screen>
    
  );
}

const styles = StyleSheet.create({
  textFieldContainer: {
    marginHorizontal: 15,
    marginBottom: 25,
    marginTop: 15,
  },
  container: {},
});
