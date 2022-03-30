import React, { useRef, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, FlatList } from "react-native";
import Icon from "./Icon";
import ImageInput from "./ImageInput";

export default function ImageInputList({
  imageUris,
  onAddImage,
  onRemoveImage,
  isSwap,
}) {
  const scrollView = useRef();
  //const imageUrisSet = imageUris.map((imageUris) => imageUris.replace('file:', ''));
  console.log("imageUris",imageUris)
  return (
    
    <View style={styles.container}>
      <FlatList
        //ref={scrollView}
        // horizontal
       // onContentSizeChange={() => scrollView.current.scrollToEnd()}
       horizontal={true} 
       showsHorizontalScrollIndicator={false} 
       data= {imageUris}
       renderItem={ ({ item, index }) => {
       console.log(item,index)

        return(
         
         <Image source= {{uri:item}} /* Use item to set the image source */
           key={index} /* Important to set a key for list items,
                          but it's wrong to use indexes as keys, see below */
           style={{
             width:260,
             height:300,
            // borderWidth:2,
             //borderColor:'#d35647',
             resizeMode:'contain',
             margin:2
           }}
         />
      
       )}}
      >
        {imageUris.map((uri) => (
          <View key={uri} style={isSwap ? null : styles.imagePadding}>
            <ImageInput
              imageUri={uri}
              onChangeImage={() => onRemoveImage(uri)}
            />
            {isSwap &&
              imageUris.indexOf(uri) == 0 &&
              imageUris.length === 2 && (
                <Icon
                  image={require("../assets/icons/swap-icon.png")}
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
        )}
      </FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  imagePadding: {
    marginBottom: 10,
  },
  swapIcon: {
    alignSelf: "center",
  },
  Image: {
        width: '100%',
        height: '100%',
      },
});
