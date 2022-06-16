import {StyleSheet, View, Animated, Dimensions} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';

import {Texts} from '../../Materials/Text';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import reactions, {findEmoji} from '../../Constants/reactions';
import postService from '../../services/post.service';
import AuthContext from '../../Contexts/authContext';

const ICON_SIZE = 50;
const TOUCH_DURATION = 500; //0.5 sec
const {width} = Dimensions.get('window');

enum contentTypeEnum {
  post = 'post',
  comment = 'comment',
  replay = 'replay',
}

interface Props {
  contentType: contentTypeEnum;
  contentId: number;
  emojiSize: number;
  isLiked: string;
  setListOfReaction: Function;
}

const Reactions: React.FC<Props> = props => {
  const {
    emojiSize = 15,
    isLiked,
    contentId,
    contentType,
    setListOfReaction,
  } = props;

  const {
    userState: {userData},
  } = useContext(AuthContext); //getting login user data

  // adding animated object into reaction array  - for scale animation while hover
  const filterdReactions = reactions.map(item => ({
    ...item,
    scale: useRef(new Animated.Value(1)).current,
  }));

  let hoverIndex: number | null = null;
  let touched = false;
  let longPress = false;
  let xOffset = (width - filterdReactions.length * ICON_SIZE) / 2;

  // const translationX = useRef(new Animated.Value(0)).current;
  const displayReactions = useRef(new Animated.Value(0)).current;

  interface SelectedReactionType {
    isReacted: Boolean;
    selectReaction: String;
  }

  const [selectedReaction, setSelectedReaction] =
    useState<SelectedReactionType>({
      isReacted: isLiked === 'false' ? false : true,
      selectReaction: isLiked === 'false' ? 'star' : isLiked,
    });

  const scaleHandler = (index, state = 1.7) => {
    Animated.spring(filterdReactions[index].scale, {
      toValue: state,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (hoverIndex !== null && hoverIndex >= 0) scaleHandler(hoverIndex);
  }, [hoverIndex]);

  const openReactionPopUp = state => {
    Animated.spring(displayReactions, {
      toValue: state,
      useNativeDriver: true,
    }).start();
  };

  const onTouchesMoveHandler = e => {
    const yAx = e.allTouches[0].y;
    const xAx = e.allTouches[0].x;
    if (
      yAx < 0 &&
      yAx > -60 &&
      xOffset < xAx &&
      xAx < filterdReactions.length * ICON_SIZE + xOffset
    ) {
      const crurrentHoverPoint = Math.trunc((xAx - xOffset) / ICON_SIZE);

      if (hoverIndex === crurrentHoverPoint) return;
      else {
        if (hoverIndex !== null) scaleHandler(hoverIndex, 1);
        hoverIndex = crurrentHoverPoint;
        scaleHandler(crurrentHoverPoint);
      }
    } else {
      if (hoverIndex !== null) {
        scaleHandler(hoverIndex, 1);
        hoverIndex = null;
      }
    }
  };

  const onTouchDropHandler = e => {
    const yAx = e.allTouches[0].y;
    const xAx = e.allTouches[0].x;
    if (
      yAx < 0 &&
      yAx > -60 &&
      xOffset < xAx &&
      xAx < filterdReactions.length * ICON_SIZE + xOffset
    ) {
      const crurrentHoverPoint = Math.trunc((xAx - xOffset) / ICON_SIZE);
      reactionHandler(filterdReactions[crurrentHoverPoint].name);
      scaleHandler(hoverIndex, 1);
    }
  };

  const gesture = Gesture.Pan()
    .onTouchesMove(onTouchesMoveHandler)
    .onTouchesUp(onTouchDropHandler)
    .onFinalize(e => {
      openReactionPopUp(0);
    });

  const onTouchStartHandler = e => {
    touched = true;

    setTimeout(() => {
      if (!touched) return;
      longPress = true;
      openReactionPopUp(1);
    }, TOUCH_DURATION);
  };
  const onTouchEndHandler = () => {
    touched = false;
    if (longPress) {
      longPress = false;
    } else {
      reactionHandler('star');
    }
  };

  const mapReactionsIcons = () => {
    return (
      <>
        {filterdReactions.map(item => (
          <Animated.Image
            source={item.img}
            style={[styles.img, {transform: [{scale: item.scale}]}]}
          />
        ))}
      </>
    );
  };

  const reactionHandler = emoji => {
    let err = false;
    setSelectedReaction(prev => ({
      isReacted: !prev.isReacted,
      selectReaction: emoji,
    }));

    switch (contentType) {
      case contentTypeEnum['post']:
        return postService
          .likePost(userData.id, contentId, emoji)
          .then(({data}) => setListOfReaction(data.countOfEachReaction))
          .catch(e => {
            console.error(e);
            err = true;
          });

      case contentTypeEnum['comment']:
        return postService
          .likeUnlikeComment(userData.id, contentId, emoji)
          .then(({data}) => setListOfReaction(data.countOfEachReaction))
          .catch(e => (err = true));

      default:
        break;
    }

    if (err) {
      setSelectedReaction(prev => ({
        isReacted: !prev.isReacted,
        selectReaction: 'emoji',
      }));
    }
  };

  return (
    <View style={styles.rootContainer}>
      <GestureDetector gesture={gesture}>
        <View>
          <View
            style={{
              alignItems: 'center',
              width: width,
            }}>
            <Animated.View
              style={[
                styles.reactions,
                {
                  opacity: displayReactions,
                },
              ]}>
              {mapReactionsIcons()}
            </Animated.View>
          </View>
          <View
            style={styles.row}
            onTouchStart={onTouchStartHandler}
            onTouchEnd={onTouchEndHandler}>
            {selectedReaction.isReacted ? (
              <Texts
                style={[
                  styles.reactionBtn,
                  {fontSize: emojiSize * 1.4, fontWeight: '700'},
                ]}>
                {`${findEmoji(selectedReaction.selectReaction)} ${
                  selectedReaction.selectReaction
                }`}
              </Texts>
            ) : (
              <Texts style={[styles.reactionBtn, {fontSize: emojiSize * 1.4}]}>
                star
              </Texts>
            )}
          </View>
        </View>
      </GestureDetector>
    </View>
  );
};

export default Reactions;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rootContainer: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
  },
  img: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  reactionBtn: {
    textTransform: 'capitalize',
    marginVertical: 7,
    marginLeft: 5,
  },
  reactions: {
    position: 'absolute',

    paddingVertical: 3,
    marginTop: -60,
    borderRadius: 30,
    flexDirection: 'row',

    backgroundColor: '#fff',
    elevation: 20,
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 10},
    shadowOpacity: 0.5,
  },
});
