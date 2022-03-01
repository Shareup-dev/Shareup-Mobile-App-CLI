import React from 'react';
import {StyleSheet, Text} from 'react-native';

function Title(props) {
  const {children, style, ...rest} = props;
  return (
    <Text style={[styles.title, style]} {...rest}>
      {children}
    </Text>
  );
}
function SubTitle(props) {
  const {children, style, ...rest} = props;

  return (
    <Text style={[styles.subTitle, style]} {...rest}>
      {children}
    </Text>
  );
}
function Content(props) {
  const {children, style, ...rest} = props;

  return (
    <Text style={[styles.content, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#333333',
  },
  subTitle: {
    fontWeight: '600',
    color: '#242424',
  },
  content: {
    fontSize: 14,
    color: '#242424',
  },
});

export {Title, SubTitle, Content};
