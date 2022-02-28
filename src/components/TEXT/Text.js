import React from 'react';
import {StyleSheet, Text} from 'react-native';

function Title(props) {
  const {children, style} = props;
  return (
    <Text style={[styles.title, style]} {...props}>
      {children}
    </Text>
  );
}
function SubTitle(props) {
  const {children, style} = props;

  return (
    <Text style={[styles.subTitle, style]} {...props}>
      {children}
    </Text>
  );
}
function Content(props) {
  const {children} = props;

  return (
    <Text style={styles.content} {...props}>
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
