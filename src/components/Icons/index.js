import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Icons(props) {
  const {size = 22, ...rest} = props;
  return <Icon {...rest} size={size} />;
}
