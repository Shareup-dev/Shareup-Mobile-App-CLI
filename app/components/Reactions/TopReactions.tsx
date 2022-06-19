import {ColorValue, StyleSheet, View, ViewStyle} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Texts} from '../../Materials/Text';
import {findEmoji} from '../../Constants/reactions';
import Icon from '../Icon';

interface Props {
  style?: ViewStyle;
  emojiSize?: number;
  topReactionsCount?: number;
  overlayColor: ColorValue;
  allowNagativeVal?: boolean;
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
  const {
    reactionsList,
    topReactionsCount = 3,
    emojiSize = 16,
    style,
    overlayColor = '#fff',
    allowNagativeVal = false,
  } = props;

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

  const getTotalCount = (): number =>
    Object.values(reactionsList).reduce((prev, crnt) => prev + crnt, 0);

  return (
    <View style={[style, styles.row]}>
      {topReactions.length ? (
        topReactions.map((item, i) => (
          <View
            key={i}
            style={[styles.container, {backgroundColor: overlayColor}]}>
            <Texts size={emojiSize}>{` ${findEmoji(item[0])}`}</Texts>
          </View>
        ))
      ) : (
        <Icon
          name={'star'}
          type={'FontAwesome5'}
          color={'#fff'}
          style={styles.icon}
          size={emojiSize}
          noBackground
          backgroundSizeRatio={0.9}
        />
      )}

      <Texts
        size={emojiSize}
        color={overlayColor === '#fff' ? '#333' : '#fff'}>{` ${
        getTotalCount() ? getTotalCount() : allowNagativeVal ? `0` : ''
      }`}</Texts>
    </View>
  );
};

export default TopThreeReactions;

const styles = StyleSheet.create({
  icon: {},
  container: {
    borderRadius: 30,
    alignItems: 'center',
    marginLeft: -6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
