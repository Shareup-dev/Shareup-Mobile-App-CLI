import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, SectionList, Text} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import AuthContext from '../../authContext';
import colors from '../../config/colors';
import {storiesAction} from '../../redux/stories';
import storiesService from '../../services/story.service';
import CreateStoryCard from './CreateStoryCard';
import StoryCard from './StoryCard';

export default function StoriesList({navigation, style}) {
  const {
    userState: {userData, username},
  } = useContext(AuthContext);

  const [Loading, setLoading] = useState(0);

  const dispatch = useDispatch();
  const stories = useSelector(state => state.stories);

  // console.log("my new",story)

  useEffect(() => {
    const fetchStories = () => {
      setLoading(1);
      Promise.all([
        storiesService.getStoriesByEmail(username),
        storiesService.getStoriesOfFriends(userData.id),
      ])
        .then(res => {
          // getting user info from first element. and i spread it with list of stories - this is only for login user
          const myStories = {...res[0].data[0].user, stories_List: res[0].data};
          const friendsStories = res[1].data;

          const array = friendsStories;
          array.unshift(myStories); // merging (login user stories + his friends stories) #### first index should be login user stories

          dispatch(storiesAction.setStories(array));
        })
        .catch(e => console.error(e.message))
        .finally(_ => {
          setLoading(2);
        });
    };
    fetchStories();
  }, []);

  const EmptyCard = () => {
    return (
      <>
        <View
          style={{
            width: 100,
            height: 150,
            borderWidth: 1.5,
            borderColor: colors.lighterGray,
            borderRadius: 15,
            marginLeft: 2,
            overflow: 'hidden',
            backgroundColor: '#eeeeee',
          }}
        />
        <View
          style={{
            width: 100,
            height: 150,
            borderWidth: 1.5,
            borderColor: colors.lighterGray,
            borderRadius: 15,
            marginLeft: 2,
            overflow: 'hidden',
            backgroundColor: '#eeeeee',
          }}
        />
        <View
          style={{
            width: 100,
            height: 150,
            borderWidth: 1.5,
            borderColor: colors.lighterGray,
            borderRadius: 15,
            marginLeft: 2,
            overflow: 'hidden',
            backgroundColor: '#eeeeee',
          }}
        />
      </>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <CreateStoryCard navigation={navigation} />
      <FlatList
        data={stories}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.list}
        ListEmptyComponent={() => <EmptyCard />}
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
