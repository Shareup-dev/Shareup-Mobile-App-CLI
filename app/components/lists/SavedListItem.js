import React, { useState, useEffect, useCallback, useContext } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Alert, Image, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../../config/colors';
import Icon from '../Icon';
import authContext from '../../Contexts/authContext';
import PostService from '../../services/post.service';
//import Text from "../../components/Text";
import PostOptionDrawer from '../drawers/PostOptionsDrawer';
import ImageView from 'react-native-image-viewing';
import UserProfilePicture from '../UserProfilePicture';
import { Texts } from '../../Materials/Text';

export default function SavedListItem({
  user,
  postData,
  reloadPosts,
  onPress,
  style,
  navigation,
  postType,
}) {
  const { userState } = useContext(authContext);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);


  const options = [
    {
      title: 'Share friends',
      icon: {
        image: require('../../assets/post-options-icons/share-friends-icon.png'),
      },
      onPress: () => {
        alert('Share friends');
      },
    },
    {
      title: <Text style={{ color: colors.red }}>Delete</Text>,
      icon: {
        image: require('../../assets/post-options-icons/delete-red-icon.png'),
      },
      onPress: () => {
        showDeleteAlert();
      },
    },
  ];
  useEffect(() => {
    loadImages();
  }, []);

  useFocusEffect(
    useCallback(() => {
      reloadPost();
    }, [postData.id]),
  );
  const loadImages = () => {
    if (postData.media?.length !== 0) {
      setImages(postData.media?.map(image => image.mediaPath));
    }

  };

  // rerenders the post when interaction
  const reloadPost = async () => {
    PostService.getPostByPostId(postData.id)
      .then(res => {
        //setComments(res.data.comments)
        setNumberOfComments(res.data.numberOfComments);
        setNumberOfReactions(res.data.numberOfReaction);
      })
      .catch(e => console.error(e))

  };

  const showDeleteAlert = () =>
    Alert.alert('Delete', 'Are you sure to delete this post', [
      {
        text: 'Yes',
        onPress: deletePost,
        style: 'cancel',
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);



  //.................... POST ACTION METHOD .............................//

  const deletePost = async () => {
    // const response = await PostService.deletePost(postData.id);
    // reloadPosts();
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[styles.card, style]}>
        {currentImage && (
          <ImageView
            visible={imageViewerVisible}
            images={[{ uri: currentImage }]}
            imageIndex={0}
          />
        )}

        {/** Post Image */}

        {images?.length !== 0 && (
          <Image source={{ uri: images[0] }} style={styles.image} />
        )}
        <View style={styles.contentView}>
          {postData.content !== "" && <Texts size={15} truncate={true} style={styles.postText}>{postData.content}</Texts>}
          <View style={{
            flexDirection: 'row',
            marginTop: 5,
            marginLeft: 10,
            alignItems:'center'
          }}>
            <UserProfilePicture size={20} />
            <Texts style={{color:colors.dimGray,marginLeft:5}}>{postData.userdata.firstName}</Texts>
          </View>
          <Texts style={styles.content}>{postData.allPostsType} . {postData.published}</Texts>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setIsOptionsVisible(true);
            }}>
            <Icon
              name="options"
              type="SimpleLineIcons"
              style={styles.optionsIcon}
              size={20}
              backgroundSizeRatio={1}
            />
          </TouchableOpacity>
        </View>
        <View style={{paddingEnd:10}}>
        <PostOptionDrawer
          source={'card'}
          postId={postData.id}
          postText={postData.content}
          options={options}
          isVisible={isOptionsVisible}
          setIsVisible={setIsOptionsVisible}
        />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const borderRadius = 10;
const styles = StyleSheet.create({
  card: {
    height: 100,
    // width: "94%",
    flexDirection: "column",
    backgroundColor: colors.white,
    marginTop: 15,
    overflow: 'hidden',
    padding: 7,
    marginLeft: 15,
    borderColor: colors.LightGray,
    borderWidth: 1,
    borderRadius: borderRadius,
    marginRight:15,
    // alignItems:'center',
    // alignContent:'center',
    //  justifyContent:'space-evenly'

    // marginRight:10,
  },
  image: {
    width: "35%",
    height: "100%",
    borderRadius: borderRadius,
    resizeMode: 'cover',

  },
  contentView: {
    flexDirection: "column",
    marginRight: 10,
    //marginTop: 15,
    justifyContent: "center",
    borderRadius: borderRadius,
    width: "65%"
  },

  content: {
    fontSize: 12,
    marginTop: 3,
    marginLeft: 10,
    color: colors.dimGray,
  },
  postText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 25,
    marginLeft: 10,
  },
  optionsIcon: {
    alignSelf: 'flex-end',
    paddingBottom: 5,
  },
  menuButton: {
    padding: 3,
    alignSelf: 'flex-end',
    width: 60,
    marginTop: -5,
  },
});
