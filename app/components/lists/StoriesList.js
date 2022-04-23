import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, SectionList, Text} from 'react-native';
import AuthContext from '../../authContext';
import colors from '../../config/colors';
import storiesService from '../../services/story.service';
import CreateStoryCard from './CreateStoryCard';
import StoryCard from './StoryCard';

export default function StoriesList({navigation, style}) {
  const {
    userState: {userData, username},
  } = useContext(AuthContext);
  const [stories, setStories] = useState([]);

  const [Loading, setLoading] = useState(0);

  useEffect(() => {
    const fetchStories = () => {
      setLoading(1);
      Promise.all([
        storiesService.getStoriesByEmail(username),
        storiesService.getStoriesOfFriends(userData.id),
      ])
        .then(res => {
          setStories([
            {
              title: 'my stories',
              data: res[0].data.length
                ? [
                    {
                      ...res[0].data[0].user,
                      stories_List: res[0].data,
                    },
                  ]
                : [],
            },
            {
              title: 'friends stories',
              data: res[1].data,
            },
          ]);
        })
        .catch(e => console.error(e.message))
        .finally(_ => {
          setLoading(2);
        });
    };
    fetchStories();
    navigation.addListener('focus', async e => fetchStories());
  }, [navigation]);

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
        }} />
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
        }} />
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
        }} />
  
        </>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <CreateStoryCard navigation={navigation} />
      <SectionList
        sections={stories}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => i.toString()}
        style={styles.list}
        ListEmptyComponent={() => <EmptyCard />}
        renderItem={({item}) => {
          return (
            <StoryCard
              data={item}
              setStories={setStories}
              navigation={navigation}
            />
          );
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
