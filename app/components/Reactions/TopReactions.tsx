import {StyleSheet, View, ViewStyle} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Texts} from '../../Materials/Text';
import {findEmoji} from '../../Constants/reactions';

interface Props {
  style?: ViewStyle;
  emojiSize?: number;
  topReactionsCount?: number;
  reactionsList: {
    angry: number;
    cry: number;
    laugh: number;
    love: number;
    star: number;
    wow: number;
  };
}

const TopThreeReactions: React.FC<Props> = props => {
  const {reactionsList, topReactionsCount = 3, emojiSize = 16, style} = props;

  const [topReactions, setTopReactions] = useState<[]>([]);

  useEffect(() => {
    const sortTopReactions = _ => {
      setTopReactions(
        Object.entries(reactionsList)
          .filter(item => item[1] > 0)
          .slice(0, topReactionsCount - 1),
      );
    };
    sortTopReactions();
  }, [reactionsList]);

  const getTotalCount = () =>
    topReactions.reduce((prev, crnt) => prev + crnt, 0);
  return (
    <View style={[style, styles.row]}>
      {topReactions.map((item, i) => (
        <View key={i} style={styles.container}>
          <Texts size={emojiSize}>{` ${findEmoji(item[0])}`}</Texts>
        </View>
      ))}
      {getTotalCount() && (
        <Texts size={emojiSize}>{` ${getTotalCount()}`}</Texts>
      )}
    </View>
  );
};

export default TopThreeReactions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 30,
    alignItems: 'center',
    marginLeft: -6,
  },
  row: {
    flexDirection: 'row',
  },
});
