import React, {useContext, useRef, useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Button,
} from 'react-native';
import moment from 'moment';
import colors from '../config/colors';
import Tab from './buttons/Tab';
import Icon from './Icon';
import routes from '../navigation/routes';

import AuthContext from '../Contexts/authContext';
import {Title, Texts} from '../Materials/Text';

import Reaction from './Reactions/Reaction';

const PostActions = ({
  postId,
  postData,
  userId,
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

  const ref = useRef();

  console.log('postdata', postData);

  const {
    userState: {userData},
  } = useContext(AuthContext);
  const [date, setDate] = useState(
    moment(postData.published, 'DD MMMM YYYY hh:mm:ss').fromNow(),
    // null
  );

  const [openModal, setOpenModal] = useState(false);

  const closeReactionOnBlur = e => {
    setOpenModal(false);
  };

  const {width, height} = Dimensions.get('window');

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

        <View style={styles.actionsContainer}>
          {/* <Tab
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
          /> */}
        </View>
      </View>
      <Reaction visible={openModal} setVisible={setOpenModal} />
      {!noActionBar && (
        <View style={styles.actionsBar}>
          <TouchableOpacity
            onLongPress={() => setOpenModal(true)}
            // onPressOut={() => setOpenModal(false)}
            onPress={onInteraction}>
            <View style={styles.likes}>
              <Icon
                name={isUserLiked ? `star` : `star-o`}
                type="FontAwesome"
                size={18}
                color="#FFC107"
                backgroundSizeRatio={1}
                style={styles.star}
              />
              <Texts style={styles.bold}>{`${
                numberOfReactions > 1
                  ? `${numberOfReactions} Stars`
                  : `${numberOfReactions} Star`
              }`}</Texts>
            </View>
          </TouchableOpacity>

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
              <Texts
                style={
                  styles.bold
                }>{`${numberOfComments} Comments  ${0} Shares`}</Texts>
            </TouchableWithoutFeedback>
          </View>
        </View>
      )}

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

  actionsContainer: {
    flexDirection: 'row',
  },
  actionTab: {
    paddingHorizontal: 5,
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
