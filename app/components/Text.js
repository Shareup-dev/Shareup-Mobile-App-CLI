import React from "react";
import { Text } from "react-native";

import defaultStyles from "../config/GlobalStyles.js";

export default function AppText({ children, style, ...otherProps }) {
  return (
    <Text style={[defaultStyles.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}
