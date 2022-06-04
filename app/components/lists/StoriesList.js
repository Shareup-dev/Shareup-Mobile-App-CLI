import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useContext, useState} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AuthContext from '../../Contexts/authContext';
import {storiesAction} from '../../redux/stories';
import storiesService from '../../services/story.service';
import CreateStoryCard from './CreateStoryCard';
import StoryCard from './StoryCard';
import EmptyStoryCard from '../EmptyCards/EmptyStoryCard';

export default function StoriesList({navigation, style}) {
  const {
    userState: {userData, username},
  } = useContext(AuthContext);

  const [Loading, setLoading] = useState(0);

  const dispatch = useDispatch();
  const stories = useSelector(state => state.stories);

  // useEffect(() => {
  //   const fetchStories = () => {
  //     setLoading(1);
  //     Promise.all([
  //       storiesService.getStoriesByEmail(username),
  //       storiesService.getStoriesOfFriends(userData.id),
  //     ])
  //       .then(res => {
  //         // getting user info from first element. and i spread it with list of stories - this is only for login user
  //         const myStories = {
  //           ...res[0]?.data[0]?.user,
  //           stories_List: res[0]?.data,
  //         };
  //         const friendsStories = res[1]?.data;

  //         const array = friendsStories;

  //         if (res[0].data.length) {
  //           array.unshift(myStories); // merging (login user stories + his friends stories) #### first index should be login user stories
  //         }

  //         dispatch(storiesAction.setStories(array));
  //       })
  //       .catch(e => console.error(e.message))
  //       .finally(_ => {
  //         setLoading(2);
  //       });
  //   };
  //   let mount = true;

  //   if (mount) {
  //     fetchStories();
  //   }
  //   return () => {
  //     mount = false;
  //   };
  // }, []);

  const fetchStories = () => {
    setLoading(1);
    Promise.all([
      storiesService.getStoriesByEmail(username),
      storiesService.getStoriesOfFriends(userData.id),
    ])
      .then(res => {
        // getting user info from first element. and i spread it with list of stories - this is only for login user
        const myStories = {
          ...res[0]?.data[0]?.user,
          stories_List: res[0]?.data,
        };
        const friendsStories = res[1]?.data;

        const array = friendsStories;

        if (res[0].data.length) {
          array.unshift(myStories); // merging (login user stories + his friends stories) #### first index should be login user stories
        }

        dispatch(storiesAction.setStories(array));
      })
      .catch(e => console.error(e.message))
      .finally(_ => {
        setLoading(2);
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchStories();
    }, []),
  );

  return (
    <View style={[styles.container, style]}>
      <CreateStoryCard navigation={navigation} />
      <FlatList
        data={stories}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.list}
        ListEmptyComponent={() => <EmptyStoryCard />}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({item}) => {
          return <StoryCard data={item} navigation={navigation} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 10,
    marginBottom: 15,
  },
});
