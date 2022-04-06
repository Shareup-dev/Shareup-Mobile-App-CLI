import React, {useState, useRef,useContext} from 'react';
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
import AuthContext from '../authContext';
import { color } from 'react-native-reanimated';
//import UserService from '../services/UserService';
export default function CommentsScreen({navigation, route}) {
  const {comments, userId, postId, setNumberOfComments, postType, swapId,fromReply} =
    route.params;
  const commentsListRef = useRef();
  const commentTextFieldRef = useRef();
  //const [isUserLiked, setIsUserLiked] = useState(false);
  const [commentsList, setCommentsList] = useState(comments);
  const [commentContent, setCommentContent] = useState('');
  const [commentId,setCommentId] = useState('')
  const [isReply,setIsReply] = useState(false)
  // needed to setup list refreshing
  const [refreshing, setRefreshing] = useState(false);
  const {userState} = useContext(AuthContext);
  //const [frmReply,setFrmReply] = useState(fromReply)
  console.log('swapId: ', swapId);
  const handleCancel = () => {
    navigation.goBack();
  };
  console.log('comment',comments)
  console.log('commentContent',commentContent)
  const reply = [
    {
        "id": 1648458212510,
        "content": "#1 reply",
        "published": "28 March 2022 12:03:32",
        "lastEdited": "28 March 2022 12:03:32",
        "user": {
            "id": 1648458047559,
            "email": "woxik36142@f1xm.com",
            "password": "$2a$10$gOrB0KVRwTiYLhY8xASb9.zNSQxn4JbgzkdHpXbALIR.BXP9X8jYK",
            "firstName": "UserTwo",
            "lastName": "Two",
            "profilePicture": "default.png",
            "coverPicture": null,
            "aboutme": null,
            "job": null,
            "hometown": null,
            "currenttown": null,
            "relationshipstatus": null,
            "interests": null,
            "gender": "Female",
            "verificationCode": null,
            "profilePicturePath": "/src/main/default.png",
            "coverPicturePath": null,
            "numberOfFriends": 0,
            "numberOfFollowers": 0,
            "numberOfFollowing": 0,
            "newUser": true
        },
        "commentType": null
    },
    {
      "id": 1648458212511,
      "content": "#2 reply",
      "published": "28 March 2022 12:03:32",
      "lastEdited": "28 March 2022 12:03:32",
      "user": {
          "id": 1648458047559,
          "email": "woxik36142@f1xm.com",
          "password": "$2a$10$gOrB0KVRwTiYLhY8xASb9.zNSQxn4JbgzkdHpXbALIR.BXP9X8jYK",
          "firstName": "UserTwo",
          "lastName": "Two",
          "profilePicture": "default.png",
          "coverPicture": null,
          "aboutme": null,
          "job": null,
          "hometown": null,
          "currenttown": null,
          "relationshipstatus": null,
          "interests": null,
          "gender": "Female",
          "verificationCode": null,
          "profilePicturePath": "/src/main/default.png",
          "coverPicturePath": null,
          "numberOfFriends": 0,
          "numberOfFollowers": 0,
          "numberOfFollowing": 0,
          "newUser": true
      },
      "commentType": null
  },]

  const hideReply = () => {
    
    console.log("reply",fromReply)
    //<CommentsScreen route={{params: { comments: reply, userId: comment.user.id, commendId: comment.id, postType: postType, swapId: swapId, fromReply:true }}}/>
  }
  const handleAddComment = async () => {
    console.log("hereee!!!!!!")
    if (isReply){
      if (postType === 'swapPost') {
      console.log('it is Swap');
      const comment = {content: commentContent};
      PostService.addSwapComment(userState?.userData?.id, swapId, comment.content).then(resp => {
        console.log('added swap comment success: ', resp.data);
        refreshComments();
        setCommentContent('');
        commentTextFieldRef.current.clear();
        Keyboard.dismiss();
        // scrollToListBottom();
      });
    } else {
      console.log("hereee!!!!!!")
      const reply = {reply: commentContent};
      console.log('Making comment: ', userId, commentId, reply);
      if (commentContent !== '') {
        PostService.replay(userState?.userData?.id, commentId, reply)
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
  }else{
    if (postType === 'swapPost') {
      console.log('it is Swap');
      const comment = {content: commentContent};
      PostService.addSwapComment(userState?.userData?.id, swapId, comment.content).then(resp => {
        console.log('added swap comment success: ', resp.data);
        refreshComments();
        setCommentContent('');
        commentTextFieldRef.current.clear();
        Keyboard.dismiss();
        // scrollToListBottom();
      });
    } else {
      console.log("hereeee")
      const comment = {content: commentContent};
      console.log('Making comment: ', userId, postId, comment);
      if (commentContent !== '') {
        PostService.addComment(userState?.userData?.id, postId, comment)
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
  }
  };

  const handleEditComment = (comment) => {
    //<CommentTextField value={comment.content}/>
    //commentTextFieldRef.current.value = "hello" //defaultValue = comment.content
    // commentTextFieldRef.current.focus()
  }
  const handleReplyComment = (commentId) => {
    setCommentId(commentId)
    //setCommentsList(reply)
    setIsReply(true)
    commentTextFieldRef.current.focus()
  };
  
  const handleDeleteComment= (itemId,isHide)=> {
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
      if(!isHide){
      console.log('deleting comment: ', itemId);
        PostService.deleteComment(itemId)
        .then(res => {
          console.log(res.data)
          refreshComments();
           Keyboard.dismiss();
        })
        .catch(e => console.log(e))
      }else{
        
      }
        // scrollToListBottom();
    }
  };

  const refreshComments = async () => {
    setRefreshing(true);
    if (postType !== 'swapPost') {
      console.log('if NOT swapPost');
      PostService.getPostByPostId(postId)
      .then(res => {
        console.log("response",res.data)
        setCommentsList(res.data.comments);
       
        
       // setCommentsList(res.data.comments);
      })
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
  const handleReactions = async (cid,isUserLiked) => {
    console.log(userState?.userData?.id,cid,isUserLiked)
    const params = ({reaction:isUserLiked})
    PostService.likeUnlikeComment(userState?.userData?.id, cid,params)
    .then (res => {
      console.log(res.data)
      //setIsUserLiked(!isUserLiked)
      })//need to get likePostIds 
    .catch(e => console.log(e))
    //refreshComments();
  };

  console.log("isReply",fromReply)
  return !fromReply ? (  
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
            comment={item}
            reactionsLength={
              item?.reactions?.length ? item?.reactions?.length : 0
            }
            //isUserLiked ={isUserLiked}
            onInteraction={handleReactions}
            handleDelete={handleDeleteComment}
            onReply={handleReplyComment}
            handleEdit={handleEditComment}
            isReply={isReply}
            reply = {reply}
            postType={postType}
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
            isReply={isReply}
          />
      </View>
      </View> 
    </Screen>
  ) : ( <Screen style={styles.replayContainer}>
    <Text style={{color:colors.iondigoDye,fontSize:12}} onPress={hideReply}>-- Hide replies</Text>
   <FlatList
     data={commentsList}
     keyExtractor={comment => comment.id.toString()}
     ref={commentsListRef}
     onContentSizeChange={scrollToListBottom}
     refreshing={refreshing}
     onRefresh={refreshComments}
     renderItem={({item}) => (
       <CommentItem
         comment={item}
         reactionsLength={
           item?.reactions?.length ? item?.reactions?.length : 0
         }
        // isUserLiked ={isUserLiked}
         onInteraction={handleReactions}
         handleDelete={handleDeleteComment}
         onReply={handleReplyComment}
         handleEdit={handleEditComment}
         isReply={isReply}
         reply = {reply}
         postType={postType}
         fromReply={fromReply}
       />
     )}
   />
 </Screen>);
}

const styles = StyleSheet.create({
  textFieldContainer: {
    marginHorizontal: 15,
    marginBottom: 25,
    marginTop: 15,
  },
  container: {},
  replayContainer:{
    marginTop: 15,
    marginStart:"20%",
   // width: "50%",
    alignItems:"flex-start"
  }
});
