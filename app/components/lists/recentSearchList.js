import React from "react";
import { View, StyleSheet } from "react-native";

import Text from "../Text";
import defaultStyles from "../../config/styles";
import colors from "../../config/colors";
import { FlatList } from "react-native-gesture-handler";

export default function RecentSearchList({options, subtitle, align = 'center', containerStyle }) {
  return (
    <View style={[styles.container, containerStyle]}>
        <FlatList 
        data={options}
        renderItem={({item}) => (
            <Text>item</Text>
        )}>
        
        </FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.mediumGray,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",

    marginVertical: 20,
  },
});
