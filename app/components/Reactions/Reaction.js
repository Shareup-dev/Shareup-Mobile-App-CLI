import React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import reactions from '../../Constants/reactions';
import {Texts} from '../../Materials/Text';
import LinkButton from '../buttons/LinkButton';

const ReactionModal = ({visible, setVisible, onInteraction}) => {
  const hideReactions = () => setVisible(false);
  if (visible)
    return (
      <View>
        <TouchableOpacity style={styles.container} onPressIn={hideReactions} />
        <View style={styles.reactionContainer}>
          <View style={styles.row}>
            {reactions.map((feeling, index) => (
              <TouchableOpacity
                onPress={() => {
                  onInteraction(feeling.name);
                  hideReactions();
                }}>
                {/* <BetterImage
                  noBackground
                  source={feeling.img}
                  style={styles.imgSize}
                /> */}
                <Texts size={25}> {feeling.emoji} </Texts>
              </TouchableOpacity>
            ))}
          </View>
          <LinkButton
            title={'Cancel'}
            fontSize={13}
            onPress={hideReactions}
            style={styles.cancelBtn}
          />
        </View>
      </View>
    );
  return null;
};
export default React.memo(ReactionModal);

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  imgSize: {
    width: 45,
    height: 45,
  },
  container: {
    position: 'absolute',
    width: width,
    height: height,
  },
  reactionContainer: {
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 10,
  },
  cancelBtn: {color: '#333', marginTop: 5, fontWeight: '700'},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
