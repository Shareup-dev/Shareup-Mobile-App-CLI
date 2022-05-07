import React, {useEffect, useState} from 'react';
import {StyleSheet, FlatList, View} from 'react-native';
import { useDispatch } from 'react-redux';
import RenderReels from '../components/Reels/Reel';
import { onActiveIndexChanged } from '../redux/ReelActiveIndex';

const ReelPlayer = ({navigation, route}) => {
  const {index, data} = route.params;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onActiveIndexChanged(index))
  }, []);

  const onViewRef = ({changed}) => {
    dispatch(onActiveIndexChanged(changed[0].index))
    // Use viewable items in state or as intended
  };
  const viewConfigRef = {viewAreaCoveragePercentThreshold: 50};
  return (
    <FlatList
      vertical
      style={{flex: 1}}
      initialScrollIndex={index}
      pagingEnabled
      data={data}
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewRef}
      viewabilityConfig={viewConfigRef}
      keyExtractor={(item, i) => i.toString()}
      renderItem={({item, index}) => (
        <RenderReels navigation={navigation} index={index} item={item} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});

export default ReelPlayer;
