import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import HeaderWithBackArrow from '../components/headers/HeaderWithBackArrow';
import Icon from '../components/Icon';
import Screen from '../components/Screen';
import colors from '../config/colors';
import authContext from '../Contexts/authContext';
import Card from '../components/lists/Card';
import ImageView from 'react-native-image-viewing';

import {
  ImagesAndVideosEmpty,
  TagsEmpty,
  ProfileTop,
} from '../components/profile';
import SwapCard from '../components/lists/SwapCard';
import postService from '../services/post.service';
import profileService from '../services/profile.service';
import EmptyPostCard from '../components/EmptyCards/EmptyPostCard';
import {useDispatch, useSelector} from 'react-redux';
import {usersPostActions} from '../redux/usersPostsSlice';

const POSTS = 'posts';
const IMAGE_VIDEOS = 'images&videos';
const TAGS = 'tags';

const tabs = [
  {name: POSTS, icon: {name: 'rss', type: 'Feather'}},
  {name: IMAGE_VIDEOS, icon: {name: 'grid', type: 'Feather'}},
  {name: TAGS, icon: {image: require('../assets/icons/tag-icon.png')}},
];

export default function UserProfileScreen({navigation, route}) {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.usersPost);
  const {
    userState: {userData: user},
  } = useContext(authContext);

  const [currentTab, setCurrentTab] = useState(POSTS);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(0);
  const [imageSlider, setImageSlider] = useState({
    state: false,
    index: 0,
  });

  const [tags, setTags] = useState([]);

  const handleTapped = name => {
    setCurrentTab(name);
  };

  useEffect(() => {
    setLoading(1);
    Promise.all([
      postService.getPostByEmail(user.email),
      profileService.getAllMedia(user.id),
    ])
      .then(res => {
        dispatch(usersPostActions.getPosts(res[0].data));
        setMedia(res[1].data);
      })
      .catch(e => console.error(e.message))
      .finally(_ => {
        setLoading(2);
      });
  }, []);

  const ListHeader = () => (
    <ProfileTop
      user={user}
      currentTab={currentTab}
      numberOfPosts={posts.length}
      navigation={navigation}
      onIconBarTab={handleTapped}
      tabs={tabs}
    />
  );

  const postsItem = ({item}) =>
    item.hasOwnProperty('swaped') ? (
      /**
       * The Swap Should from backend as instance of post
       */
      // ToDO: Refactor to use one component for posts and swap.
      <SwapCard navigation={navigation} item={item} userId={item.userdata.id} />
    ) : (
      <Card user={item.userdata} postData={item} navigation={navigation} />
    );

  const {width} = Dimensions.get('window');
  const ImagesAndVideosItem = ({item, index}) => (
    <TouchableOpacity
      onPress={_ => setImageSlider({state: true, index: index})}>
      <Image
        source={{uri: item.mediaPath}}
        style={{
          width: (width - 22) / 3,
          borderRadius: 3,
          height: 150,
          margin: 2,
          backgroundColor: '#eee',
        }}
      />
    </TouchableOpacity>
  );
  const TagsItems = ({item}) => <View></View>;

  return (
    <Screen style={styles.container}>
      <HeaderWithBackArrow
        title={user.firstName}
        onBackButton={() => navigation.goBack()}
        leftComponent={
          <Icon
            name="lock"
            type="Feather"
            backgroundSizeRatio={0.8}
            size={30}
            style={styles.headerLockIcon}
          />
        }
      />

      <ImageView
        visible={imageSlider.state}
        images={media.map(media => ({uri: media.mediaPath}))}
        keyExtractor={(item, index) => index.toString()}
        imageIndex={imageSlider.index}
        onRequestClose={() => {
          setImageSlider(prev => ({...prev, state: false}));
        }}
      />

      {currentTab == POSTS && (
        <FlatList
          data={posts}
          ve={true}
          renderItem={postsItem}
          keyExtractor={(post, index) => index.toString()}
          ListHeaderComponent={ListHeader}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() =>
            loading === 2 ? (
              <Text
                style={styles.listEmptyText}>{`Start adding your posts!`}</Text>
            ) : (
              <EmptyPostCard />
            )
          }
          ListFooterComponent={() => <View style={styles.listFooter}></View>}
        />
      )}

      {currentTab == IMAGE_VIDEOS && (
        <View style={{marginHorizontal: 5, marginBottom: 50}}>
          <FlatList
            data={media}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <ImagesAndVideosItem item={item} index={index} />
            )}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={ImagesAndVideosEmpty}
          />
        </View>
      )}

      {currentTab == TAGS && (
        <FlatList
          data={tags}
          showsVerticalScrollIndicator={false}
          renderItem={TagsItems}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={TagsEmpty}
          ListFooterComponent={() => <View style={styles.listFooter}></View>}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerLockIcon: {
    marginRight: 5,
  },
  listEmptyText: {
    marginVertical: 30,
    alignSelf: 'center',
    fontSize: 15,
    color: colors.LightGray,
  },
  listFooter: {
    marginBottom: 50,
  },
  listHeaderContainer: {
    marginBottom: 20,
  },
});
