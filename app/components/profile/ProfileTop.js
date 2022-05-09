import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import colors from '../../config/colors';
import UserProfilePicture from '../UserProfilePicture';
import Tab from '../buttons/Tab';
import IconBar from '../tab-bar/IconBar';
import routes from '../../navigation/routes';
import Posts from './Posts';
import StoriesList from '../lists/StoriesList';
import AuthContext from '../../authContext';
import FriendService from '../../services/friends.service';

const profilePictureSize = 70;

export default function ProfileTop({
  navigation,
  currentTab,
  onIconBarTab,
  tabs,
  user,
  numberOfPosts,
  userStatus,
  setUserStatus
}) {
  const {
    userState: {userData},
  } = useContext(AuthContext);

  const sendFriendRequest = () => {
    FriendService.sendRequest(userData.id, user.id)
      .then(({status}) => status === 200 && setUserStatus(prev => ({...prev,state:"FriendRequested"})))
      .catch(e => console.error(e.message));
  };
  const acceptRequest = () => {
    FriendService.acceptRequest(userData.id, user.id)
      .then(({status}) => status === 200 && setUserStatus(prev => ({...prev,state:"Friend"})))
      .catch(e => console.error(e.message));
  };
  const declineRequest = () => {
    FriendService.declineRequest(userData.id, user.id)
      .then(({status}) => status === 200 && setUserStatus(prev => ({...prev,state:"Unfriend"})))
      .catch(e => console.error(e.message));
  };
  const Unfriend = () => {
    FriendService.removeFriends(userData.id, user.id)
      .then(({status}) => status === 200 && setUserStatus(prev => ({...prev,state:"Unfriend"})))
      .catch(e => console.error(e.message));
  };

  const ActionButton = () => {
    switch (userStatus.state) {
      case 'Unfriend':
        return (
          <Tab
            title="Send Request"
            color={colors.LightGray}
            style={styles.editProfileButton}
            titleStyle={styles.editProfileButtonTitle}
            onPress={sendFriendRequest}
          />
        );

      case 'FriendRequested':
        return (
          <Tab
            title="Cancel Request"
            color={colors.iondigoDye}
            style={styles.editProfileButton}
            titleStyle={[styles.editProfileButtonTitle, {color: '#fff'}]}
            onPress={declineRequest}
          />
        );
      case 'Friend':
        return (
          <Tab
            title="Unfriend"
            color={colors.LightGray}
            style={styles.editProfileButton}
            titleStyle={styles.editProfileButtonTitle}
            onPress={Unfriend}
          />
        );

      default:
        return (
          <Tab
            title={null}
            disabled={true}
            color={colors.LightGray}
            style={styles.editProfileButton}
            titleStyle={styles.editProfileButtonTitle}
          />
        );
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.padding}>
        <View style={styles.row1}>
          <View style={styles.profilePicture}>
            <UserProfilePicture
              profilePicture={user.profilePicturePath}
              size={profilePictureSize}
            />
            {/* <Icon
              name="pluscircle"
              type="AntDesign"
              color={colors.iondigoDye}
              style={styles.addProfilePictureIcon}
              backgroundSizeRatio={1}
              size={25}
            /> */}
          </View>
          <View style={styles.counterWrapper}>
            <Text>
              {user.numberOfPosts ? user.numberOfPosts : numberOfPosts}
            </Text>
            <Text>Posts</Text>
          </View>
          <View style={styles.counterWrapper}>
            <Text>{user.numberOfFriends}</Text>
            <Text>Friends </Text>
          </View>
          <View style={styles.counterWrapper}>
            <Text>{user.numberOfFollowers}</Text>
            <Text>Followers </Text>
          </View>
          <View style={styles.counterWrapper}>
            <Text>{user.numberOfFollowing}</Text>
            <Text>Following</Text>
          </View>
        </View>

        {/** Row 2 */}
        <View style={styles.row2}>
          <Text
            style={
              styles.username
            }>{`${user.firstName} ${user.lastName}`}</Text>

          <Text>{user.aboutme}</Text>

          {user.id === userData.id ? (
            <Tab
              title="Edit Profile"
              color={colors.LightGray}
              style={styles.editProfileButton}
              titleStyle={styles.editProfileButtonTitle}
              onPress={() => navigation.navigate(routes.EDIT_PROFILE)}
            />
          ) : (
            <ActionButton />
          )}
        </View>
      </View>
      {user.id === userData.id && (
        <StoriesList navigation={navigation} style={styles.storiesList} />
      )}

      <IconBar tabs={tabs} currentTab={currentTab} onTab={onIconBarTab} />

      {user.id === userData.id && currentTab === 'posts' && (
        <Posts navigation={navigation} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  padding: {
    paddingHorizontal: 30,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  profilePicture: {
    width: profilePictureSize,
    height: profilePictureSize,
    marginRight: 20,
  },
  addProfilePictureIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  counterWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  row2: {
    marginTop: 30,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  editProfileButton: {
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  editProfileButtonTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  storyCard: {
    marginVertical: 10,
    marginRight: 10,
  },
  storiesContainer: {
    marginBottom: 10,
  },
  createStoryCard: {
    marginVertical: 10,
    marginRight: 5,
  },
  storiesList: {
    marginTop: 10,
  },
});
