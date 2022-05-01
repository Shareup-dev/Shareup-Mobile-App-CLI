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
  Alert,
} from 'react-native';
import AuthContext from '../authContext';
import CommentTextField from '../components/comments/CommentTextField';
import {HeaderWithBackArrow} from '../components/headers';
import moment from 'moment';
import UserProfilePicture from '../components/UserProfilePicture';
import postService from '../services/post.service';
import ReelsService from '../services/Reels.service';
import DownModal from '../components/drawers/DownModal';
import Icon from '../components/Icon';
import colors from '../config/colors';

export default function AddCommentsOnReels({navigation, route}) {
  const {reelId} = route.params;

  const [loading, setLoading] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);
  const [editComment, setEditComment] = useState(false);

  const [selectedComment, setSelectedComment] = useState(null);
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

  const deleteCommentHandler = cid => {
    postService
      .deleteComment(cid)
      .then(res => {
        if (res.status === 200) {
          setComments(prev => prev.filter(item => item.id !== cid));
          handleCloseDownModal();
        }
      })
      .catch(e => console.error(e.message));
  };
  const editCommentHandler = cid => {
    postService
      .editComment(cid, comment)
      .then(res => {
        if (res.status === 200) {
          fetchComments();
          setComment('');
          handleCloseDownModal();
        }
      })
      .catch(e => console.error(e.message));
  };

  const addComment = () => {
    if (comment) {
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

  const handleCloseDownModal = () => {
    setOpenMenu(false);
    setSelectedComment(null);
    setComment('');
    setEditComment(false);
  };

  const DropDownMenu = () => {
    return (
      <View style={styles.menuContainer}>
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: '#cacaca',
              width: 80,
              height: 6,
              borderRadius: 6,
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.menu}
          onPress={_ => setEditComment(true)}>
          <View>
            <Text style={styles.menuText}>Edit</Text>
            <Text>Edit the comment</Text>
          </View>
          <Icon size={45} name={'edit'} type="Entypo" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menu}
          onPress={_ => deleteCommentHandler(selectedComment?.id)}>
          <View>
            <Text style={styles.menuText}>Delete</Text>
            <Text>Delete this comment</Text>
          </View>
          <Icon size={45} name={'delete'} color="crimson" />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.menu}>
          <View>
            <Text style={styles.menuText}>Hide this story</Text>
            <Text
              style={{
                maxWidth: windowWidth / 2,
              }}>{`Posted by @${route.params?.userName}`}</Text>
          </View>
          <Icon size={45} name={'eye-with-line'} type="Entypo" />
        </TouchableOpacity> */}
      </View>
    );
  };

  const CommentCard = ({item}) => {
    const {
      content,
      user: {firstName, lastName, id: uid},
      published,
    } = item;

    const [date, setDate] = useState(
      moment(published, 'DD MMMM YYYY hh:mm:ss').fromNow(),
      // null
    );

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={_ => {
          if (item?.user.id === userData.id) {
            setOpenMenu(true);
            setSelectedComment(item);
            setComment(item?.content);
          }
        }}
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
        <UserProfilePicture
          size={45}
          style={{marginHorizontal: 15}}
          profilePicture={item?.user?.profilePicturePath}
        />
        <View>
          <View
            style={{
              backgroundColor: '#eee',
              paddingVertical: 5,
              paddingHorizontal: 15,
              borderRadius: 15,
              maxWidth: '90%',
              minWidth: '50%',
            }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: '#00000095',
                marginVertical: 3,
              }}>
              {`${firstName} ${lastName}`}
            </Text>
            <Text style={{fontWeight: '600', color: '#333', fontSize: 13}}>
              {content}
            </Text>
          </View>
          <Text style={{fontSize: 11}}>{date}</Text>
        </View>
      </TouchableOpacity>
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
      <DownModal isVisible={openMenu} setIsVisible={handleCloseDownModal}>
        {editComment ? (
          <View>
            <CommentTextField
              value={comment}
              onChangeText={val => setComment(val)}
            />
            <TouchableOpacity
              onPress={_ => editCommentHandler(selectedComment?.id)}
              style={{
                backgroundColor: colors.iondigoDye,
                alignSelf: 'flex-end',
                paddingVertical: 8,
                paddingHorizontal: 15,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <Text style={{color: '#fff', fontWeight: '600'}}>Update</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <DropDownMenu />
        )}
      </DownModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd90',
  },
  menuContainer: {},
  menu: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderBottomWidth: 0.6,
    // borderBottomColor: '#cacaca',
  },
  menuText: {
    fontWeight: '600',
    fontSize: 20,
    color: '#585858',
  },
});
