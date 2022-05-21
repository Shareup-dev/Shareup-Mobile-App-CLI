import React, {useRef} from 'react';
import {FlatList, View,} from 'react-native';
import {CommentCard} from '.';

export default function CommentsList(props) {
  const {data, refreshing, replayComment = false} = props;
  const commentsListRef = useRef();

  const scrollToListBottom = () => {
    commentsListRef.current.scrollToEnd({animated: true});
  };


  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        ref={commentsListRef}
        onContentSizeChange={scrollToListBottom}
        refreshing={refreshing}
        renderItem={({item}) => (
          <CommentCard comment={item} replayComment={replayComment} />
        )}
      />
    </View>
  );
}
