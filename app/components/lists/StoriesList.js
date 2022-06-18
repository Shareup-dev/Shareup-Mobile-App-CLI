import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AuthContext from '../../Contexts/authContext';
import {storiesAction} from '../../redux/stories';
import storiesService from '../../services/story.service';
import CreateStoryCard from './CreateStoryCard';
import StoryCard from './StoryCard';
import EmptyStoryCard from '../EmptyCards/EmptyStoryCard';

function StoriesList({navigation, style, refreshing}) {
  const {
    userState: {userData, username},
  } = useContext(AuthContext);

  const [Loading, setLoading] = useState(0);

  const dispatch = useDispatch();
  const stories = useSelector(state => state.stories);
  const fetchStories = () => {
    setLoading(1);
    Promise.all([
      storiesService.getStoriesByEmail(username).then(({data}) => data),
      storiesService.getStoriesOfFriends(userData.id).then(({data}) => data),
    ])
      .then(([myStories, friendsStories]) => {
        if (myStories.length)
          dispatch(
            storiesAction.setMyStories({
              ...myStories[0].user,
              stories_List: myStories,
            }),
          );
        if (friendsStories.length)
          dispatch(storiesAction.setFriendsStories(friendsStories));
      })
      .catch(e => console.error(e.message))
      .finally(_ => {
        setLoading(2);
      });
  };

  useEffect(() => {
    if (refreshing) fetchStories();
  }, [refreshing]);

  useEffect(() => {
    fetchStories();
  }, []);

  const IsUserHasStories = () =>
    stories.myStories?.stories_List?.length > 0 ? true : false;

  return (
    <View style={[styles.container, style]}>
      <CreateStoryCard navigation={navigation} />

      {/* this flatList for friends stories */}
      <FlatList
        ListHeaderComponent={
          // this  will display only login user stories
          IsUserHasStories() && (
            <StoryCard data={stories.myStories} navigation={navigation} />
          )
        }
        data={stories.friendsStories}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.list}
        ListEmptyComponent={() =>
          IsUserHasStories() ? null : <EmptyStoryCard />
        }
        keyExtractor={(item, i) => i.toString()}
        renderItem={({item}) => {
          return <StoryCard data={item} navigation={navigation} />;
        }}
      />
    </View>
  );
}

export default StoriesList;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 10,
    marginBottom: 15,
  },
});
