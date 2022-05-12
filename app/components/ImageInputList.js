import React, {useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Icon from './Icon';
import ImageInput from './ImageInput';

export default function ImageInputList({
  imageUris,
  onAddImage,
  onRemoveImage,
  isSwap,
}) {
  const scrollView = useRef();
  return (
      <View style={styles.container}>
      <ScrollView
      // horizontal
        ref={scrollView}
        showsVerticalScrollIndicator = {false}
        onContentSizeChange={() => scrollView.current.scrollToEnd()}
      >
        {imageUris.map((image) => (

          <View key={image["uri"]} style={isSwap ? null : styles.imagePadding}>
            <ImageInput
              imageUri={image}
              onChangeImage={() => onRemoveImage(image["uri"])}
            />
            {isSwap &&
              imageUris.indexOf(image) == 0 &&
              imageUris.length === 2 && (
                <Icon
                image={require('../assets/icons/swap-icon.png')}
                style={styles.swapIcon}
                />
                )}
          </View>
        ))}

        {isSwap && imageUris.length < 2 && (
          <ImageInput
            onChangeImage={(uri) => onAddImage(uri)}
            isSwap={isSwap}
          />
        )
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  imagePadding: {
    marginBottom: 10,
  },
  swapIcon: {
    alignSelf: 'center',
  },
  Image: {
    width: '100%',
    height: '100%',
  },
});
