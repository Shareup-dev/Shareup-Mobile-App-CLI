import React, {useEffect, useState, useContext, useCallback} from 'react';
import {FlatList, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {useSelector} from 'react-redux';

import Screen from '../components/Screen';
import {Header, HeaderTitle} from '../components/headers';
import Icon from '../components/Icon';
import ListItem from '../components/lists/ListItem';
import defaultStyles from '../config/styles';
import UserService from '../services/user.service';
import authContext from '../authContext';
import FriendService from '../services/friends.service';
import store from '../redux/store';
import {sentRequestsActions} from '../redux/sentRequests';
import colors from '../config/colors';
import {useFocusEffect} from '@react-navigation/native';
import routes from '../navigation/routes';

export default function AddNewFriendScreen({navigation}) {
  const [users, setusers] = useState([]);
  const [sentto, setSentto] = useState([]);
  const {
    userState: {userData: loggedInUser},
  } = useContext(authContext);
  const {userState} = useContext(authContext);
  let alreadySentTo = useSelector(state => state.sentRequests);

  useFocusEffect(
    useCallback(() => {
      UserService.getUsers()
        .then(resp => {
          let allUsers = resp.data.filter(
            person => person.id !== userState?.userData?.id,
          );
          UserService.getFriendRequestSent(userState?.userData?.email)
            .then(resp => {
              let sentRequests = resp.data;
              store.dispatch(sentRequestsActions.setList(sentRequests));
              let sendFiltered = allUsers.filter(
                ({id: id1}) => !sentRequests.some(({id: id2}) => id2 === id1),
              );
              UserService.getFriendRequestRecieved(userState?.userData?.email)
                .then(resp => {
                  let receivedReq = resp.data;
                  //store.dispatch(receivedRequestsAction.setList(receivedReq));
                  let receiveFiltered = sendFiltered.filter(
                    ({id: id1}) =>
                      !receivedReq.some(({id: id2}) => id2 === id1),
                  );
                  UserService.getFriends(userState?.userData?.email)
                    .then(res => {
                      let friends = res.data;
                      let notFriends = receiveFiltered.filter(
                        ({id: id1}) =>
                          !friends.some(({id: id2}) => id2 === id1),
                      );
                      setusers(notFriends);
                    })
                    .catch(e => console.error('error', e));
                })
                .catch(e => console.error('error', e));
              // differedReqs.forEach(user => {});
              setSentto(resp.data);
            })
            .catch(e => console.error('error', e));
        })
        .catch(e => console.error('error', e));
      return;
    }, []),
  );

  // const redirectToProfile = (userEmail) => {

  //   navigation.navigate(routes.USER_PROFILE, {userEmail:userEmail} )
  // }
  // const onSearchFriend = searchKey => {
  //   if (searchKey == '') {
  //     setIsSearch(false);
  //   } else {
  //     UserService.search(searchKey).then(resp => {
  //       let filteredResult = resp.data.filter(
  //         person => person.id !== userState?.userData?.id,
  //       );
  //       setSearchResult(filteredResult);
  //       setIsSearch(true);
  //     });
  //   }
  //   return;
  // };

  // useEffect(() => {
  //   UserService.getUsers().then(resp => {
  //     let allUsers = resp.data.filter(person => person.id !== loggedInUser.id);

  //     UserService.getFriendRequestSent(loggedInUser.email).then(resp => {
  //       let sentRequests = resp.data;

  //       let differedReqs = allUsers.filter(
  //         ({id: id1}) => !sentRequests.some(({id: id2}) => id2 === id1),
  //       );
  //       setusers(differedReqs);
  //     });
  //   });
  // }, []);

  const onSendRequest = recievedUser => {
    if (!recievedUser.firstName) {
      return;
    }
    if (sentto.filter(user => user.email === recievedUser.email)[0]) {
      return;
    }
    setSentto(previousState => {
      return [...previousState, recievedUser];
    });
    store.dispatch(
      sentRequestsActions.setList([...alreadySentTo, recievedUser]),
    );
    FriendService.sendRequest(loggedInUser.id, recievedUser.id).then(
      resp => {},
    );
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
        middle={<HeaderTitle>Add New Friends</HeaderTitle>}
        right={
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate(routes.SEARCH_SCREEN)}>
            <Icon
              name="search1"
              type="AntDesign"
              size={25}
              backgroundSizeRatio={1}
            />
          </TouchableWithoutFeedback>
        }
      />
      <FlatList
        contentContainerStyle={styles.groupsList}
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <ListItem
            email={item.email}
            user={item}
            image={item.profilePicturePath}
            title={item.firstName}
            tabTitle={
              //  sentto.filter(user => user.email === item.email)[0]
              alreadySentTo.filter(user => user.email === item.email)[0]
                ? 'Cancel Request'
                : 'Send Request'
            }
            color={
              alreadySentTo.filter(user => user.email === item.email)[0]
                ? colors.iondigoDye
                : colors.lighterGray
            }
            fontColor={
              alreadySentTo.filter(user => user.email === item.email)[0]
                ? colors.white
                : colors.dark
            }
            subTitle={
              alreadySentTo.filter(user => user.email === item.email)[0]
                ? 'Request send'
                : 'Recommended'
            }
            onPress={onSendRequest}
            showCloseButton={true}
            secondBtn={false}
            //fullWidth={true}
            style={[defaultStyles.listItemStyle, defaultStyles.lightShadow]}
            displayLeft={true}
            onPressProfile={() =>
              navigation.navigate(routes.USER_PROFILE, item.email)
            }
          />
        )}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  shadowBox: {
    backgroundColor: 'coral',
    height: 50,
    shadowColor: 'red',
  },
  container: {
    flex: 1,
    padding: 15,
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
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recommendation: {
    display: 'flex',
    flexDirection: 'column',
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
  actions: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
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
  groupsList: {
    paddingVertical: 20,
  },
});
