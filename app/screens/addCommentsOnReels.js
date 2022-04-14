import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  FlatList,
  Text,
  TextInput,
} from 'react-native';
import AuthContext from '../authContext';
import CommentTextField from '../components/comments/CommentTextField';
import {HeaderWithBackArrow} from '../components/headers';
import moment from "moment";
import UserProfilePicture from '../components/UserProfilePicture';
import postService from '../services/post.service';
import ReelsService from '../services/Reels.service';

export default function AddCommentsOnReels({navigation, route}) {
  const {reelId} = route.params;

  const [loading, setLoading] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const {
    userState: {userData},
  } = useContext(AuthContext);

  const fetchComments = () => {
    setLoading(1);
    ReelsService.getReelsComments(reelId)
      .then(res => setComments(res.data))
      .catch(e => console.error(e))
      .finally(_ => setLoading(2));
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const addComment = () => {
    if(comment){

      ReelsService.addComment(userData.id, reelId, {content: comment})
      .then(res => {
        if (res.status === 200) {
          fetchComments();
          setComment('');          
        }
      })
      .catch(e => console.error(e.message));
    }
  };

  const CommentCard = ({item}) => {
    const {content,user:{firstName,lastName,id: uid},published} = item;

    const [date, setDate] = useState(
      moment(published, "DD MMMM YYYY hh:mm:ss").fromNow()
    // null
   );



    return (
      <View
        style={{
          // backgroundColor:"crimson",
          marginVertical: 5,
          padding: 5,
          borderRadius: 5,
          borderBottomColor: '#cacaca40',
          borderBottomWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <UserProfilePicture size={45} style={{marginHorizontal: 15}} />
        <View>
          <View
            style={{
              backgroundColor: '#eee',
              paddingVertical: 5,
              paddingHorizontal: 15,
              borderRadius: 15,
              maxWidth: '90%',
              minWidth:'50%'
            }}>
            <Text style={{fontWeight: '600', color: '#000000', fontSize: 13}}>
              {`${firstName} ${lastName}`}
            </Text>

            <Text style={{fontSize: 13,marginVertical:3}}>{content}</Text>
          </View>
          <Text style={{fontSize: 11}}>{date}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderWithBackArrow
        title={'Comments'}
        titleStyle={{fontSize: 19}}
        onBackButton={_ => navigation.goBack()}
      />
      <View
        // activeOpacity={0.9}
        // onPress={Keyboard.dismiss}
        style={{
          marginHorizontal: 10,
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <FlatList
          data={comments}
          key={(item, i) => i.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <CommentCard item={item} />}
          scrollsToTop
          ListEmptyComponent={
            loading === 2 && (
              <Text style={{textAlign: 'center', marginVertical: 10}}>
                No comments
              </Text>
            )
          }
        />
        <View
          style={{
            marginBottom: '5%',
          }}>
          <CommentTextField
            onForwardPress={addComment}
            value={comment}
            onChangeText={val => setComment(val)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd90',
  },
});
