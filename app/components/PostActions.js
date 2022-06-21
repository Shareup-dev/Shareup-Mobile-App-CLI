import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import colors from '../config/colors';
import Tab from './buttons/Tab';
import Icon from './Icon';
import routes from '../navigation/routes';

import AuthContext from '../Contexts/authContext';
import {Title, Texts} from '../Materials/Text';
import {feelings,activities} from '../components/Data/activitiesAndFeelings';
import {ReactionBar, TopReactions} from './Reactions';
import BetterImage from './betterImage/BetterImage';

const PostActions = ({
  postId,
  postData,
  userId,
  navigation,
  numberOfComments,
  setIsOptionsVisible,
  postType,
  swapId,
  noActionBar,
  noOptions,
  navigateToShare,
}) => {
  const fromReply = false;
  const actionsTabSizeRatio = 0.5;
  const [feel,setFeel] = useState({})
  const {
    userState: {userData},
  } = useContext(AuthContext);
  const [date, setDate] = useState(
    moment(postData.published, 'DD MMMM YYYY hh:mm:ss').fromNow(),
    // null
  );

  useEffect(()=>{
    
    if (postData?.feelings){
      console.log(postData.feelings,);
      const item = feelings.filter(item => postData.feelings === item.name)
      console.log(postData.feelings,item[0]);
      setFeel(item[0])
    }else if (postData?.activity){
      if (activities.filter(item => postData.activity === item.name)){
        setFeel(item)
      }
    }
  },[])

  const [listOfReactions, setListOfReactions] = useState(
    postData.countOfEachReaction,
  );

  const navigateToComments = () =>
    navigation.navigate(routes.COMMENTS, {
      postId,
      userId,
      //comments,
      postType,
      swapId,
      fromReply,
    });
  const showShareList = () =>
    navigation.navigate(routes.SHARE_LIST, {
      postData,
    });

  return (
    <View style={styles.content}>
      <View style={styles.row}>
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
                  uri: postData?.userdata?.profilePicturePath,
                }}
                style={styles.profilePicture}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={_ =>
                navigation.navigate(routes.GROUP_FEED, postData.group)
              }>
              <Image
                source={{
                  uri: postData.group?.groupImagePath,
                }}
                style={{
                  borderRadius: 15,
                  width: 30,
                  height: 30,
                  zIndex: 1,
                  position: 'absolute',
                  marginBottom: 10,
                  marginLeft: 1,
                  top: -19,
                  left: 25,
                }}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity>
              <Title>{postData?.userdata?.firstName}</Title>
            </TouchableOpacity>
            <Texts light>{date}</Texts>
            {postData.group ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <TouchableOpacity
                  onPress={_ =>
                    navigation.navigate(routes.GROUP_FEED, postData.group)
                  }>
                  <Texts light style={styles.bold}>
                    {postData.group?.name}
                  </Texts>
                </TouchableOpacity>
              </View>
            ) : (
              <></>
            )}
          </View>
        </View>
        {!noActionBar && (
          <View style={styles.actionsContainer}>
            <View style={styles.actionTab}>
              <TopReactions
                contentId={postData.id}
                navigation={navigation}
                reactionsList={listOfReactions}
                emojiSize={10}
                overlayColor={colors.mediumGray}
                allowNagativeVal={true}
              />
            </View>

            <TouchableOpacity
              style={styles.actionTab}
              onPress={navigateToComments}>
              <Icon
                noBackground
                color="#fff"
                size={20}
                style={styles.actionTabIcon}
                name="comment"
                type="Octicons"
              />
              <Texts size={10} color={'#fff'}>
                {numberOfComments}
              </Texts>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionTab}
              onPress={navigateToShare}>
              <BetterImage
                style={{width: 10, height: 10, marginHorizontal: 2}}
                noBackground
                source={require('../assets/icons/share-icon.png')}
              />
              <Texts size={10} color={'#fff'}>
                {postData.numberOfshares}
              </Texts>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* <Reaction visible={openModal} setVisible={setOpenModal} /> */}
      {!noActionBar && (
        <View style={styles.actionsBar}>
          {/* <TouchableOpacity
            onLongPress={() =>
              !isUserLiked
                ? setOpenModal(true)
                : increaseReactionCount(reactionType)
            }
            onPress={() => {
              increaseReactionCount(reactionType);
            }}>
            <View style={[styles.likes]}>
              {isUserLiked ? (
                <Texts style={styles.star} size={20}>
                  {findEmoji(reactionType)}
                </Texts>
              ) : (
                <Icon
                  name={`star-o`}
                  type="FontAwesome"
                  size={26}
                  color="#FFC107"
                  backgroundSizeRatio={1}
                  style={styles.star}
                  noBackground
                />
              )}
              <Texts
                size={14}
                style={{textTransform: 'capitalize', fontWeight: '600'}}>
                {reactionType}
              </Texts>
            </View>
          </TouchableOpacity> */}
          <View style={styles.row}>
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
              <>
                <ReactionBar
                  contentId={postId}
                  emojiSize={14}
                  contentType={'post'}
                  isLiked={postData.likedType}
                  setListOfReaction={setListOfReactions}
                />
              </>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.commentsShares}>
            <TouchableOpacity onPress={navigateToComments}>
              <Texts
                style={styles.bold}>{`${numberOfComments} Comments  `}</Texts>
            </TouchableOpacity>
            <TouchableOpacity onPress={showShareList}>
              <Texts
                style={
                  styles.bold
                }>{`${postData.numberOfshares} Shares`}</Texts>
            </TouchableOpacity>
          </View>
        </View>
      )}


        {/********************************* Post Feelings and tags ****************************************/}
        <View style={{ flexDirection: "row", alignItems: 'center', flexWrap: 'wrap' }}>
        {postData?.feelings && (
        <View style={styles.row}>
          <BetterImage
            noBackground
            source={feel.img}
            style={styles.feelImg}
          />
          <Texts size={13} color={'#333'} style={{fontWeight:'bold'}}>{feel.name}</Texts>
        </View>)}
        {postData?.activity && (
        <View style={styles.row}>
          <Icon name={feel.icon} color={feel.color} />
          <Texts size={13} color={'#333'} style={{fontWeight:'bold'}}>{feel.name}</Texts>
          </View>)}
        {postData?.taggedList.length !== 0 && (
          <View style={{ flexDirection: 'row' }}>
            <Texts size={14} color={colors.dimGray}  > with </Texts>
            <TouchableOpacity onPress={()=> showShareList(constants.constant.SHOW_TAGLIST)}>
              <Texts size={14} color={'#333'} style={{fontWeight:'bold'}} > 
              {postData.taggedList[0]?.firstName}{postData.taggedList[0]?.lastName} and {(postData.taggedList.length - 1 === 1) ? postData.taggedList[1]?.firstName + postData.taggedList[1]?.lastName : `${postData.taggedList.length - 1} others`} 
              </Texts>
              </TouchableOpacity>
          </View>)}
      </View>

      {postData.content !== '' && (
        <Texts truncate style={{marginTop: 10}} color={'#333'}>
          {postData.content}
        </Texts>
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
  imgSize: {
    width: 50,
    height: 50,
  },
  bold: {fontWeight: '700'},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profilePicture: {
    borderRadius: 15,
    marginRight: 10,
    width: 50,
    height: 50,
  },
  userInfo: {
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
  actionTabIcon: {
    marginHorizontal: -2,
  },

  actionsContainer: {
    flexDirection: 'row',
  },
  actionTab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#24242490',
    paddingHorizontal: 6,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  commentsShares: {
    flexDirection: 'row',
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    borderRadius: 20,
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
  feelImg: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
});

export default PostActions;
