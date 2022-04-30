import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  StatusBar,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from '../components/Icon';
import Video from 'react-native-video';
import routes from '../navigation/routes';
import moment from 'moment';
import fileStorage from '../config/fileStorage';
import ReelsService from '../services/Reels.service';
import AuthContext from '../authContext';
import Loading from '../components/Loading';
import UserProfilePicture from '../components/UserProfilePicture';

const ReelPlayer = ({navigation, route}) => {
  const {index, data} = route.params;
  const {
    userState: {userData},
  } = useContext(AuthContext);
  const videoRef = React.useRef(null);

  const BottomCard = React.memo(
    ({
      rid,
      reactions,
      user,
      content,
      publishedDate,
      numberOfComments,
      numberOfReaction,
      reelLiked,
    }) => {
      const {firstName, lastName} = user;

      const [date, setDate] = useState(
        moment(publishedDate, 'DD MMMM YYYY hh:mm:ss').fromNow(),
        // null
      );
      const [like, setLike] = useState(Boolean(reelLiked));
      const [totalLikes, setTotalLikes] = useState(
        numberOfReaction ? numberOfReaction : 0,
      );
      const [totalComments, setTotalComments] = useState(
        numberOfComments ? numberOfComments : 0,
      );

      const toggleLike = () => {
        ReelsService.likeUnLike(userData.id, rid, {})
          .then(({status}) => {
            if (status === 200) {
              if (like) setTotalLikes(prev => prev - 1);
              else setTotalLikes(prev => prev + 1);
              setLike(prev => !prev);
            }
          })
          .catch(e => console.error(e.message));
      };

      return (
        <View style={styles.card}>
          <View style={styles.reelInfo}>
            <View
              style={{
                backgroundColor: '#33333345',
                borderRadius: 35,
              }}>
              <View style={styles.reelsInfo}>
                <UserProfilePicture
                  profilePicture={user?.profilePicture}
                  size={50}
                />

                <View>
                  <Text style={{color: '#fff', marginTop: 2,marginLeft:5, fontSize: 14}}>
                    {`${firstName} ${lastName}`}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Icon
                      color={like ? '#FFCE45' : '#fff'}
                      name={like ? 'star' : 'star-o'}
                      noBackground
                      type="FontAwesome"
                    />
                    <Text style={{color: '#fff'}}>{totalLikes}</Text>
                    <Icon
                      color="#fff"
                      name="comment"
                      noBackground
                      type="Octicons"
                    />
                    <Text style={{color: '#fff'}}>{totalComments}</Text>
                  </View>
                </View>
              </View>
              <Text
                style={{
                  color: '#fff',
                  marginTop: 2,
                  marginHorizontal: 15,
                  fontSize: 14,
                }}>
                {`Posted on: ${date}`}
              </Text>
              <Text
                style={{
                  color: '#fff',
                  marginTop: 2,
                  marginHorizontal: 15,
                  marginBottom: 10,
                  fontSize: 14,
                }}>
                {content}
              </Text>
            </View>
          </View>
          <View style={styles.reelAction}>
            <TouchableOpacity onPress={toggleLike}>
              <Icon
                color={like ? '#FFCE45' : '#fff'}
                name={like ? 'star' : 'star-o'}
                style={{marginVertical: 5}}
                backgroundSizeRatio={0.7}
                noBackground
                type="FontAwesome"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={_ =>
                navigation.navigate(routes.ADD_COMMENT_REEL, {reelId: rid})
              }>
              <Icon
                color="#fff"
                style={{marginVertical: 5}}
                name="comment"
                noBackground
                backgroundSizeRatio={0.7}
                type="Octicons"
              />
            </TouchableOpacity>
            {/* <Icon
            color="#fff"
            style={{marginVertical: 5}}
            image={require('../assets/icons/share-icon.png')}
            noBackground
            backgroundSizeRatio={0.7}
            type="Octicons"
          /> */}
          </View>
        </View>
      );
    },
  );

  const {width, height} = Dimensions.get('window');

  const RenderReels = React.memo(
    ({
      video,
      id,
      reactions,
      user,
      content,
      publishedDate,
      thumbnail_name,
      numberOfComments,
      numberOfReaction,
      reelLiked,
    }) => {
      const [paused, setPaused] = useState(false);
      const [mute, setMute] = useState(false);
      const [loaded, setLoaded] = useState(false);

      return (
        <KeyboardAvoidingView>
          <TouchableOpacity
            style={{
              justifyContent: 'space-between',
              width: width,
              height: height,
              backgroundColor: '#000',
            }}
            activeOpacity={1}
            onPress={_ => setPaused(prev => !prev)}>
            <View style={styles.Header}>
              <Text style={styles.HeaderText}>Share Reels</Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  style={{marginHorizontal: 10}}
                  onPress={_ => setMute(prev => !prev)}>
                  <Icon
                    noBackground
                    type="MaterialCommunityIcons"
                    size={35}
                    backgroundSizeRatio={0.8}
                    color="#fff"
                    name={mute ? 'volume-off' : 'volume-high'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={_ => navigation.goBack()}>
                  <Icon
                    noBackground
                    type="MaterialCommunityIcons"
                    size={35}
                    backgroundSizeRatio={1}
                    name={'close'}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {paused && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: '#33333320',
                    padding: 15,
                    borderRadius: 40,
                  }}>
                  <Icon
                    name={'pause'}
                    noBackground
                    type="Fontisto"
                    size={35}
                    backgroundSizeRatio={0.6}
                    color="#fff"
                  />
                </View>
              </View>
            )}
            <View style={styles.video}>
              {!loaded && (
                // <Image
                //   style={{
                //     width: width,
                //     height: height - StatusBar.currentHeight,
                //     zIndex: 10,
                //   }}
                //   source={{uri: fileStorage.baseUrl + thumbnail_name}}
                //   resizeMode="cover"
                // />
                <View
                  style={{
                    width: width,
                    height: height,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Loading noBackground />
                </View>
              )}
              <Video
                style={{
                  width: width,
                  height: height,
                  zIndex: -10,
                }}
                onLoadStart={_ => setLoaded(false)}
                source={{uri: fileStorage.baseUrl + video}}
                repeat
                onLoad={_ => setLoaded(true)}
                muted={mute}
                paused={paused}
                resizeMode="cover"
              />
            </View>
            <BottomCard
              numberOfComments={numberOfComments}
              numberOfReaction={numberOfReaction}
              reelLiked={reelLiked}
              rid={id}
              reactions={reactions}
              user={user}
              content={content}
              publishedDate={publishedDate}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      );
    },
  );

  return (
    <>
      <FlatList
        vertical
        style={{flex: 1}}
        initialScrollIndex={index}
        pagingEnabled
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({
          item: {
            id,
            reactions,
            userdata,
            video_name,
            content,
            published,
            thumbnail_name,
            numberOfComments,
            numberOfReaction,
            reelLiked,
            ...rest
          },
        }) => {
          return (
            <RenderReels
              video={video_name}
              thumbnail_name={thumbnail_name}
              reactions={reactions}
              id={id}
              user={userdata}
              numberOfComments={numberOfComments}
              numberOfReaction={numberOfReaction}
              reelLiked={reelLiked}
              content={content}
              publishedDate={published}
            />
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  reelsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  forwardArrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
    paddingRight: 15,
    paddingLeft: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  caption: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 30,
    fontSize: 18,
    maxHeight: 100,
    width: '85%',
  },
  reelAction: {
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    borderRadius: 35,
    width: '20%',
    // backgroundColor: '#33333335',
  },
  reelInfo: {
    paddingHorizontal: 15,
    width: '80%',
  },
  Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomColor: '#cacaca',
    borderBottomWidth: 1,
    paddingVertical: 10,
    backgroundColor: '#33333325',
  },
  HeaderText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '600',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  video: {
    position: 'absolute',
    flex: 1,
    zIndex: -10,
  },
});

export default ReelPlayer;
