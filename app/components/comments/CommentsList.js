import React, {useRef} from 'react';
import {FlatList, View} from 'react-native';
import {CommentCard} from '.';

export default function CommentsList({
  data,
  refreshing,
  replyComment = false,
  onRefreshing,
}) {
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
        onRefresh={onRefreshing}
        renderItem={({item}) => (
          <CommentCard comment={item} replyComment={replyComment} onRefreshing={onRefreshing} />
        )}
      />
    </View>
  );
}
