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
// import Separator from "../Separator";
// import UserProfilePicture from "../UserProfilePicture";
// import Icon from "../Icon";
// import LinkButton from "../buttons/LinkButton";
// import CommentText from "./CommentText";
import authContext from "../../authContext";
// import { Button } from "react-native-paper";
// import PostOptionDrawer from "../drawers/PostOptionsDrawer";
import postService from "../../services/post.service";
// import { useFocusEffect } from "@react-navigation/native";
// import OptionsDrawer from "../drawers/OptionsDrawer";
import CommentItem from "../comments/CommentItem";
import { replayListAction } from "../../redux/replyList";
import { useSelector,useDispatch } from "react-redux";
export default function ReplyList({
  // fromReply,
  comment,
  // reactionsLength,
  // isUserLiked,
  // onInteraction,
  // handleDelete,
  // handleEdit,
  //handleLongPress,
  // onReply,
  // isReply,
  // reply,
   postType,
  // swapId,
  //setIsOptionsVisible,
  //isOptionsVisible,
  // setNumberOfComments,
   refresh,
  
}) {
  //const isReply = false
  //const [shoereply]
  // const [isOptionsVisible,setIsOptionsVisible] = useState(false);
  //const [isUserLiked, setIsUserLiked] = useState(false);
  //const [replyList,setReplyList] = useState([]);
  // const [showReply,setshowReply] = useState(false)
  const dispatch = useDispatch();
  const replyList = useSelector(state => state.replyList);
  const { userState } = useContext(authContext);
  const [isEdit,setIsEdit] = useState(false)
  const [time, setTime] = useState(
    moment(comment.published, "DD MMMM YYYY hh:mm:ss").fromNow()
  );
  useEffect(() => {
   console.log("This");
    loadReply();
    // return setActivityIndicator(false);
    return;
  },[refresh])

  
  const options = [ {
    title:  'Edit',
    icon: {
      name : 'edit',
      type : "Entypo",
      size:15,
    },
    onPress: () => {
      //alert('Edit');
      setIsOptionsVisible(false)
      setIsEdit(true)
      handleEdit(isEdit)
    },
  },
  {
    title:<Text>Delete</Text>,
    icon: {
      name : 'delete',
      color : "crimson",
      size:20
    },
    onPress:()=>  Alert.alert('Delete', 'Are you sure you want to delete this comment?', [
      {text: 'Yes', onPress: () => handleDeleteComment()},
      {text: 'No'},
    ])
  },
];
const handleDeleteComment = () => {
  postService.deleteReply(comment.id)
    .then(res => {
      refreshComments();
      Keyboard.dismiss();
    })
    .catch(e => console.error(e))

  // scrollToListBottom();

};

  const handleLongPress = (commendId) =>{
    setIsOptionsVisible(true)
  }

  const loadReply = () =>{
    postService.getAllReply(userState.userData.id,comment.id)
    .then(res => {
      const replyArray = res.data//.reverse();
      dispatch(replayListAction.setState(res.data))
      //setReplyList(replyArray)
    })
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
  const handleEditComment = (status) => {
    setIsEdit(status)
  }
  const refreshList = async () => {
    setRefreshing(true);
    loadReply();
    setRefreshing(false);
  };
  const handleReactions = async (cid) => {

    const params = ({ reaction: "null" })
    postService.likeUnlikeReply(userState?.userData?.id, cid, params)
      .then(res => {
        console.log(res.data);
        loadReply();
        //setIsUserLiked(!isUserLiked)
      })//need to get likePostIds 
      .catch(e => console.error(e))

    //refreshComments();
  };
   
  return (
    <View>
 {/* <View style={styles.replayContainer}> */}
     <FlatList 
     data={replyList}
     keyExtractor={comment => comment.id.toString()}
     //ref={commentsListRef}
     //onContentSizeChange={scrollToListBottom}
     refreshing={refresh}
     onRefresh={refreshList}
     renderItem={({item}) => (
       <CommentItem
         comment={item}
         reactionsLength={
           item?.reactions?.length ? item?.reactions?.length : 0
         }
         isUserLiked ={item.replyLiked}
         onInteraction={handleReactions}
         //handleDelete={handleDeleteComment}
         //onReply={handleReplyComment}
         handleEdit={handleEditComment}
         isEdit={isEdit}
         isReply={true}
         //reply = {replyList}
         postType={postType}
         //fromReply={fromReply}
         //isOptionVisible = {isOptionsVisible}
        // setIsOptionVisible = {setIsOptionsVisible}
       />
       )}
       />
        </View>
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
