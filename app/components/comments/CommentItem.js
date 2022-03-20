import React, { useContext,useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  Alert
} from "react-native";
import moment from "moment";
import colors from "../../config/colors";
import Separator from "../Separator";
import UserProfilePicture from "../UserProfilePicture";
import Icon from "../Icon";
import LinkButton from "../buttons/LinkButton";
import CommentText from "./CommentText";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import authContext from "../../authContext";
import { Button } from "react-native-paper";
export default function CommentItem({
  commentId,
  username,
  comment,
  user,
  reactionsLength,
  publishedDate,
  isUserLiked,
  onInteraction,
  handleDelete,
}) {
  const {userState} = useContext(authContext);
  const [time, setTime] = useState(
    moment(publishedDate, "DD MMMM YYYY hh:mm:ss").fromNow()
  );
  
  const leftSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
     
      <TouchableOpacity onPress={()=> user.id == userState?.userData?.id ? handleDelete(commentId): ()=>{}} 
      activeOpacity={0.6}
      style = {styles.deleteBox}>
        <View>
          <Animated.Text style={{transform: [{scale: scale}]}}>
            Delete
          </Animated.Text>
        </View>
      </TouchableOpacity>
       
    );

  };
  return (
    <>
    <Swipeable renderLeftActions={leftSwipe}>
      <View style={styles.container}>
        {/** Left */}
        <View>
          <UserProfilePicture size={40} />
        </View>

        {/** Medial */}
        <View style={styles.medialContainer}>
          <Text style={styles.userName}>{username}</Text>

          {/* <Text style={styles.comment}>{comment}</Text> */}
          <View style={styles.commentBody}>
            <CommentText
              text={comment}
              textStyle={styles.comment}
              readMoreStyle={styles.readMore}
            />
          </View>

          <View style={styles.commentDetailsContainer}>
            <Text style={styles.time}>{time}</Text>
            <Text style={styles.stars}>
              {reactionsLength} {reactionsLength < 2 ? "Star" : "Stars"}
            </Text>
            <LinkButton title="Reply" style={styles.reply}/>
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
          </TouchableWithoutFeedback> */}
          {isUserLiked ? (
            <TouchableWithoutFeedback onPress={onInteraction}>
              <Icon
                name="star"
                type="AntDesign"
                size={20}
                color={colors.iondigoDye}
                backgroundSizeRatio={1}
              />
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback onPress={onInteraction}>
              <Icon
                name="staro"
                type="AntDesign"
                size={20}
                color={colors.iondigoDye}
                backgroundSizeRatio={1}
              />
            </TouchableWithoutFeedback>
          )}
        </View>
      </View>

      <Separator style={styles.separator} />
      </Swipeable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 50,
    paddingTop: 25,
    paddingBottom: 6,
    justifyContent: "flex-start",
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
    backgroundColor: colors.LightGray,
    justifyContent: 'center',
    alignItems: 'center',
    
    width: 100,
    height: '100%',
  },
});
