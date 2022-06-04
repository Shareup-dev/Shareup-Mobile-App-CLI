import React, {useContext, useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';
import authContext from '../Contexts/authContext';
import Screen from '../components/Screen';
import Card from '../components/lists/Card';
import FeedTop from '../components/FeedTop';
import colors from '../config/colors';
import SwapCard from '../components/lists/SwapCard';

import TrendingComponent from '../components/trending/TrendingComponent';
import postService from '../services/post.service';
import constants from '../config/constants';
import {useDispatch, useSelector} from 'react-redux';
import {feedPostsAction} from '../redux/feedPostsSlice';
import SharedPostCard from '../components/lists/SharedPostCard';
import routes from '../navigation/routes';
import EmptyPostCard from '../components/EmptyCards/EmptyPostCard';

export default function NewsFeedScreen({navigation, route}) {
  const posts = useSelector(state => state.feedPosts);
  const dispatch = useDispatch();

  const {userState} = useContext(authContext);
  const [activityIndicator, setActivityIndicator] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);
  const loadNews = () => {
    setActivityIndicator(true);
    postService
      .getNewsFeed(userState?.userData?.email)
      .then(({data}) => {
        dispatch(feedPostsAction.setFeedPosts(data));
      })
      .catch(e => console.error(e))
      .finally(hideActivityIndicator);
  };

  const renderItem = ({item}) => {
    switch (item.allPostsType) {
      case constants.postTypes.SWAP:
        return (
          <SwapCard
            navigation={navigation}
            route={route}
            item={item}
            userId={item.userdata.id}
            // onPress={() => {
            //   navigation.navigate(routes.POST_DETAILS_SCREEN, {postData: item});
            // }}
          />
        );
      case 'share':
        return (
          <SharedPostCard
            user={item.userdata}
            postData={item}
            navigation={navigation}
            reloadPosts={loadNews}
            postType={item.allPostsType}
          />
        );
      case constants.postTypes.HANG_SHARE:
        return (
          <SwapCard
            navigation={navigation}
            route={route}
            item={item}
            userId={item.userdata.id}
            // onPress={() => {
            //   navigation.navigate(routes.POST_DETAILS_SCREEN, {postData: item});
            // }}
          />
        );

      default:
        return (
          <Card
            user={item.userdata}
            postData={item}
            navigation={navigation}
            reloadPosts={loadNews}
            postType={item.allPostsType}
            // onPress={() => {
            //   navigation.navigate(routes.POST_DETAILS_SCREEN, {postData: item});
            // }}
          />
        );
    }
  };

  const hideActivityIndicator = () => {
    setActivityIndicator(false);
  };

  const ActivityIndicatorComponent = ({style}) => (
    <View style={[styles.listFooter, style]}>
      <ActivityIndicator size="large" color={colors.iondigoDye} />
    </View>
  );
  const ListHeader = () => {
    return (
      <>
        <FeedTop navigation={navigation} />
        <TrendingComponent />
      </>
    );
  };

  return (
    <Screen style={styles.container} statusPadding={false}>
      <FlatList
        data={posts}
        ListHeaderComponent={ListHeader}
        keyExtractor={(post, i) => i.toString()}
        showsVerticalScrollIndicator={false}
        extraData={posts}
        onRefresh={() => loadNews()}
        refreshing={activityIndicator}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <>
            {activityIndicator ? (
              <EmptyPostCard />
            ) : (
              <Text style={{alignSelf: 'center', marginVertical: 50}}>
                No posts Available
              </Text>
            )}
          </>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
  },
  profilePicture: {
    borderRadius: 15,
    marginRight: 10,
    width: 50,
    height: 50,
  },
  username: {
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  postedBy: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  postedDate: {
    marginHorizontal: 10,
    color: colors.grayX11Gray,
  },
  swapDescription: {
    marginHorizontal: 50,
    marginVertical: 15,
  },
  swapButton: {
    backgroundColor: colors.primaryGreen,
    marginHorizontal: '10%',
    borderRadius: 10,
  },
  swapContainer: {
    borderWidth: 1,
    borderColor: colors.lighterGray,
    marginVertical: 10,
    paddingVertical: 10,
    width: Dimensions.get('screen').width - 30,
    marginHorizontal: 15,
    borderRadius: 5,
  },
  menuButton: {
    padding: 3,
    alignSelf: 'flex-end',
    width: 60,
    marginTop: -5,
  },
  optionsIcon: {
    alignSelf: 'flex-end',
    top: 8,
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginTop: 10,
    overflow: 'hidden',
    padding: 7,
    paddingHorizontal: 6,
  },
  image: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  profilePicture: {
    borderRadius: 15,
    marginRight: 10,
    width: 50,
    height: 50,
  },
  userInfo: {
    display: 'flex',
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
  userNameContainer: {
    width: '40%',
  },
  actionsContainer: {
    flexDirection: 'row',
    // width: "42%",
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  actionTab: {
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
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
  listFooter: {
    height: 60,
  },
});
