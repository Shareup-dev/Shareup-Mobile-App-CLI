import React, { useContext, useEffect, useState,useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  Alert,
  FlatList,
} from "react-native";
import moment from "moment";
import colors from "../../config/colors";
import Separator from "../Separator";
import UserProfilePicture from "../UserProfilePicture";
import Icon from "../Icon";
import LinkButton from "../buttons/LinkButton";
import CommentText from "./CommentText";
import authContext from "../../authContext";
import { Button } from "react-native-paper";
import PostOptionDrawer from "../drawers/PostOptionsDrawer";
import postService from "../../services/post.service";
import { useFocusEffect } from "@react-navigation/native";
import OptionsDrawer from "../drawers/OptionsDrawer";
export default function CommentItem({
  fromReply,
  comment,
  reactionsLength,
  isUserLiked,
  onInteraction,
  handleDelete,
  //handleLongPress,
  onReply,
  isReply,
  reply,
  postType,
  swapId,
  //setIsOptionsVisible,
  //isOptionsVisible,
  setNumberOfComments,
  refreshreply,
}) {
  //const isReply = false
  //const [shoereply]
  const [isOptionsVisible,setIsOptionsVisible] = useState(false);
  //const [isUserLiked, setIsUserLiked] = useState(false);
  const [replyList,setReplyList] = useState([]);
  const [showReply,setshowReply] = useState(false)
  const { userState } = useContext(authContext);
  const [time, setTime] = useState(
    moment(comment.published, "DD MMMM YYYY hh:mm:ss").fromNow()
  );
  useEffect(() => {
   
    //loadReply();
    // loadStories();
    // return setActivityIndicator(false);
    return;
  },[refreshreply])

  
  const options = [ {
    title:  'Edit',
    icon: {
      image: require('../../assets/post-options-icons/unfollow-icon.png'),
    },
    onPress: () => {
      alert('Edit');
    },
  },
  {
    title:<Text style={{color:colors.red}}>Delete</Text>,
    icon: {
      image: require('../../assets/post-options-icons/delete-red-icon.png'),
    },
    onPress: () => {alert('Edit');
    //handleDelete(comment.id)
      
    },
  },
];
 

  const handleLongPress = (commendId) =>{
    setIsOptionsVisible(true)
  }

  const loadReply = (commentId) =>{
    postService.getAllReply(commentId)
    .then(res => {
      const replyArray = res.data//.reverse();
      setReplyList(replyArray)})
    .catch(e => console.error(e))
  }

  const handleReply = (commentId) =>{
    onReply(commentId,true);
    setshowReply(true);
    loadReply(commentId);
  }
  const hideReply = () =>{
    setshowReply(false)
    onReply(comment.id,false)
  }
  return (
    <>
     <TouchableWithoutFeedback onLongPress={()=>{handleLongPress(comment.id)}}>
        <View style={styles.commentContainer}>
          {/** Left */}
          <View>
            <UserProfilePicture size={40} profilePicture={comment.user.profilePicturePath} />
          </View>

          {/** Medial */}
          <View style={styles.medialContainer}>
            <Text style={styles.userName}>{comment.user.firstName}</Text>

            {/* <Text style={styles.comment}>{comment}</Text> */}
            <View style={styles.commentBody}>
              <CommentText
                text={comment.content}
                textStyle={styles.comment}
                readMoreStyle={styles.readMore}
              />
            </View>

            <View style={styles.commentDetailsContainer}>
              <Text style={styles.time}>{time}</Text>
              <Text style={styles.stars}>
                {reactionsLength} {reactionsLength < 2 ? "Star" : "Stars"}
              </Text>
              <LinkButton title="Reply" style={styles.reply} onPress={() => !comment.comment ?  handleReply(comment.id):{}} />
            </View>
          </View>

          {/** Right */}
          <View style={styles.reactionContainer}>
            {/* <TouchableWithoutFeedback onPress={onInteraction}>
            <Icon
              name="staro"
              type="AntDesign"
              color={colors.iondigoDye}
              size={20}
              backgroundSizeRatio={1}
            />
          /</TouchableWithoutFeedback> */}
            {isUserLiked ? (
              <TouchableWithoutFeedback onPress={() =>  onInteraction(comment.id)}>
                <Icon
                  name="star"
                  type="AntDesign"
                  size={isReply?20:15}
                  color={colors.iondigoDye}
                  backgroundSizeRatio={1}
                />
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback onPress={() =>  onInteraction(comment.id)}>
                <Icon
                  name="staro"
                  type="AntDesign"
                  size={isReply?20:15}
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
          <Text style={{color:colors.iondigoDye,fontSize:12}} onPress={hideReply}>-- Hide replies</Text>
           <FlatList 
           data={replyList}
           keyExtractor={comment => comment.id.toString()}
           //ref={commentsListRef}
           //onContentSizeChange={scrollToListBottom}
           //refreshing={refreshing}
           //onRefresh={refreshComments}
           renderItem={({item}) => (
             <CommentItem
               comment={item}
               reactionsLength={
                 item?.reactions?.length ? item?.reactions?.length : 0
               }
              // isUserLiked ={isUserLiked}
              // onInteraction={handleReactions}
               //handleDelete={handleDeleteComment}
               //onReply={handleReplyComment}
               //handleEdit={handleEditComment}
               //isReply={isReply}
               //reply = {replyList}
               postType={postType}
               //fromReply={fromReply}
               //isOptionVisible = {isOptionsVisible}
              // setIsOptionVisible = {setIsOptionsVisible}
             />
           )}
         />
          </View>
          )}
        <Separator style={styles.separator} />
        {/* {isReply ? (
          <CommentsScreen route={{params: { comments: reply, userId: comment.user.id, commendId: comment.id, postType: postType, swapId: swapId, fromReply:true }}}/>
        ) : (<Text />)} */}
        {/* <Separator style={styles.separator} /> */}
        <OptionsDrawer
          options={options}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
        />
    </>
  );
}

const styles = StyleSheet.create({
  container:{
    flexDirection: "row",
    //width: "100%",
    paddingHorizontal: "10%",
    paddingTop: 25,
    paddingBottom: 6,
    //justifyContent: "center",
    //alignSelf:"center",
    marginStart:"20%",
    alignItems:"flex-start",
    //backgroundColor:colors.LightGray
  },
  commentContainer: {
    flexDirection: "row",
    width: "90%",
    paddingHorizontal: "10%",
    paddingTop: 25,
    paddingBottom: 6,
    justifyContent: "center",
    //alignSelf:"center",
    //backgroundColor:colors.LightGray
    
  },
  replyContainer: {
    flexDirection: "row",
    width: "90%",
    paddingTop: 20,
    paddingBottom: 6,
    //justifyContent: "flex-start",
    justifyContent: "space-between",
   // backgroundColor:colors.activeGreen
  },

  medialContainer: {
    marginLeft: 10,
    paddingTop: 5,
    justifyContent: "space-between",
  },
  userName: {
    fontWeight: "bold",
  },
  commentDetailsContainer: {
    width: "65%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  comment: {
    color: colors.mediumGray,
    width: Dimensions.get("window").width / 1.7,
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
    fontWeight: "bold",
  },
  reactionContainer: {
    paddingTop: 5,
  },
  separator: {
    marginHorizontal: 15,
    width:"90%"
  },
  commentTextContainer: {
    marginVertical: 5,
  },
  readMore: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.iondigoDye,
  },
  deleteBox: {
    backgroundColor: colors.dimGray,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  replayContainer:{
    marginTop: 15,
    marginStart:"20%",
    width: "80%",
    alignItems:"flex-start",
    //backgroundColor:colors.red
  }
});
