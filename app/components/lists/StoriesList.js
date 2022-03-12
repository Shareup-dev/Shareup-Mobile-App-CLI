import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import storiesService from '../../services/stories.service';
import CreateStoryCard from './CreateStoryCard';
import StoryCard from './StoryCard';

export default function StoriesList({navigation, style}) {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      const result = await storiesService.getStories();
      setStories(result.data);
    };
    fetchStories();
  }, []);

  return (
    <View style={[styles.container, style]}>
      <CreateStoryCard navigation={navigation} />
      <FlatList
        data={stories}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
        renderItem={item => {
          return (
            <StoryCard
              image={item.item.storiesImagePath}
              navigation={navigation}
              userName={
                item.item.user.firstName + ' ' + item.item.user.lastName
              }
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
