import React, {memo, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import BetterImage from '../betterImage/BetterImage';

function CustomImageSlider({media, width, height}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewRef = useRef(({viewableItems}) => {
    setActiveIndex(viewableItems[0].index);
  });
  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});
  const flatListRef = useRef();

  return (
    <>
      {/* <FlatList
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        horizontal
        pagingEnabled 
        ref={flatListRef}
       
        data={media}
        keyExtractor={({item}, index) => index.toString()}
        renderItem={({item}) => {
          return (
          
          );
        }}
      /> */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}>
        {media.map((image, index) => (
          <BetterImage
            key={index}
            style={{width, height}}
            resizeMode={'cover'}
            source={{uri: image.mediaPath}}
          />
        ))}
      </ScrollView>
      <View>
        <View
          style={{
            marginVertical: 5,
            flexDirection: 'row',
            alignSelf: 'center',
          }}>
          {media?.length > 1 &&
            media.map(({media}, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: activeIndex === index ? 15 : 6,
                  height: 6,
                  borderRadius: 5,
                  backgroundColor: '#333',
                  marginHorizontal: 3,
                }}
                // onPress={_ =>
                //   flatListRef.current.scrollToIndex({
                //     animated: true,
                //     index: '' + index,
                //   })
                // }
              />
            ))}
        </View>
      </View>
    </>
  );
}

export default React.memo(CustomImageSlider);
