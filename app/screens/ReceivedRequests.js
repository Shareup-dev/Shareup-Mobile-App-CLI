import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  ListViewBase,
  TouchableOpacity
} from 'react-native';

import Screen from '../components/Screen';
import {Header, HeaderTitle,HeaderWithBackArrow} from '../components/headers';
import Icon from '../components/Icon';
import UserService from '../services/user.service';
import routes from '../navigation/routes';
import authContext from '../Contexts/authContext';
import defaultStyles from '../config/GlobalStyles';
//import FriendService from '../services/FriendService';
import ListHeader from '../components/lists/ListHeader';
import colors from '../config/colors';
import FriendCard from '../components/lists/FriendCard';
import { Texts } from '../Materials/Text';
import { postRefreshAction } from '../redux/postRefreshSlice';
import { useDispatch } from 'react-redux';

export default function ReceivedRequests({navigation}) {
  const {userState:{userData: user},authActions} = useContext(authContext);
  const [requests, setRequests] = useState([]);
  const [acceptedFrom, setAcceptedFrom] = useState([]);
  const [rejectedFrom, setRejectedFrom] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true
    if (mounted){
    UserService.getFriendRequestRecieved(user.email).then(resp => {
      setRequests(resp.data);
      requests.forEach(request => {
   
      });
    });
  } 
  return () => mounted = false
  }, []);

  const acceptFriendRequest = friend => {
 
    UserService.acceptFriendRequest(user.id, friend.id).then(resp => {

authActions.updateUserInfo({...user,numberOfFriends: user.numberOfFriends + 1})
     
    });

    setAcceptedFrom(previousState => {
      return [...previousState, friend];
    });
  };

  const rejectFriendRequest = friend => {

    UserService.declineFriendRequest(user.id, friend.id).then(resp => {
    
    });

    setRejectedFrom(previousState => {
      return [...previousState, friend];
    });
  };
  const redirectToProfile = (item) => {
    navigation?.getState()?.routes[1]?.name === 'UserProfile'
      ? null
      : navigation.navigate(routes.USER_PROFILE, {
          user: item,
        })  
}

  const getTabTitle = friend => {
    if (acceptedFrom.filter(user => friend.email === user.email)[0]) {
      return 'unfriend';
    }

    if (rejectedFrom.filter(user => friend.email === user.email)[0]) {
      return 'Rejected';
    }
    return 'Reject';
  };

  const renderRequestsList = () => {
    if (requests.length === 0) {
      return (
        <View style={styles.container}>
          <Texts style={styles.emptyText} size={15}>
            You dont't have any received requests  !!
          </Texts>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            contentContainerStyle={styles.groupsList}
            ListHeaderComponent={() => (
              <ListHeader subtitle="Add new friends to know more about them" />
            )}
            data={requests}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <FriendCard
                user={item}
                image={item.profilePicturePath}
                title={item.firstName}
                secondBtnTitle={'Accept'}
                secondBtn={
                  acceptedFrom.filter(user => user.email === item.email)[0] ||
                  rejectedFrom.filter(user => user.email === item.email)[0]
                    ? false
                    : true
                }
                secondBtnAction={acceptFriendRequest}
                tabTitle={getTabTitle(item)}
                color={
                  acceptedFrom.filter(user => user.email === item.email)[0]
                    ? colors.iondigoDye
                    : colors.lighterGray
                }
                fontColor={
                  acceptedFrom.filter(user => user.email === item.email)[0]
                    ? colors.white
                    : colors.dark
                }
                onPress={rejectFriendRequest}
                style={[defaultStyles.listItemStyle, defaultStyles.lightShadow]}
                fullWidth={
                  acceptedFrom.filter(user => user.email === item.email)[0] ||
                  rejectedFrom.filter(user => user.email === item.email)[0]
                    ? true
                    : false
                }
                displayLeft={true}
                showCloseButton={false}
                onPressProfile={()=>  navigation.navigate(routes.FRIEND_PROFILE, {user: item})}
              />
            )}
          />
        </View>
      );
    }
  };

  return (
    <Screen>
      
      <Header
        backgroundColor={colors.white}
        left={
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Icon
              name="chevron-back"
              type="Ionicons"
              size={25}
              backgroundSizeRatio={1}
            />
          </TouchableWithoutFeedback>
        }
        middle={<HeaderTitle>Received Requests</HeaderTitle>}
      />
      {renderRequestsList()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
    marginTop: 150,
    fontSize: 18,
  },
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 12,
  },
  friendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderWidth: 0,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
  },
  dp: {
    height: 56,
    width: 56,
    marginRight: 20,
  },
  name: {
    fontSize: 16,
    color: colors.dark,
    fontWeight: '700',
  },
  requestBtn: {
    paddingHorizontal: 1,
    padding: 1,
    borderRadius: 6,
    shadowColor: 'red',
    elevation: 0,
    height: 35,
  },
  listItem: {
    marginBottom: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
});
