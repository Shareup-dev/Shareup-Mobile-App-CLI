import React, {useState, useEffect, useContext} from 'react';
import {TouchableOpacity, View, StyleSheet, Text, Image} from 'react-native';

import Screen from '../components/Screen';
import TextField from '../components/TextField';
import colors from '../config/colors';
import {HeaderButton, HeaderWithBackArrow} from '../components/headers';
import {Checkbox} from 'react-native-paper';
import UserService from '../services/user.service';
import authContext from '../Contexts/authContext';
import {postDataSliceAction} from '../redux/postDataSlice';
import {useDispatch} from 'react-redux';

export default function TagPeople({navigation, TagedUserData}) {
  const [tagPeople, setTagPeople] = useState([]);
  const [friends, setFriends] = useState([]);
  const {userData: loggedInUser} = useContext(authContext).userState;
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    UserService.getFriends(loggedInUser.email).then(resp => {
      // resp.data.forEach(dost => dost.email);
      setFriends(resp.data);
    });
  }, []);
  const onSearchFriend = searchKey => {
    if (searchKey == '') {
      setIsSearch(false);
    } else {
      UserService.searchFriends(loggedInUser.id, searchKey).then(resp => {
        let filteredResult = resp.data;
        setSearchResult(filteredResult);
        setIsSearch(true);
      });
    }
    return;
  };
  const TagUserCard = props => {
    const fullname = props.data.firstName + props.data?.lastName;
    const img = props.data?.profilePicturePath;
    const id = props.data.id;

    const CheckIfChecked = id => {
      return tagPeople.find(item => item.id === id);
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={e => {
          CheckIfChecked(id)
            ? setTagPeople(prev => prev.filter(item => item.id !== id))
            : setTagPeople(prev => [...prev, props.data]);
        }}>
        <View style={styles.usersInfo}>
          <Image style={styles.img} source={{uri: img}} />
          <Text style={{marginLeft: 15}}>{fullname}</Text>
        </View>
        <Checkbox
          color={colors.iondigoDye}
          status={CheckIfChecked(id) ? 'checked' : 'unchecked'}
        />
        {tagPeople.length ? setIsButtonActive(true) : setIsButtonActive(false)}
      </TouchableOpacity>
    );
  };
  return (
    <Screen style={styles.container}>
      <HeaderWithBackArrow
        onBackButton={() => navigation.goBack()}
        component={<Text style={styles.title}>Tag Friends</Text>}
        rightComponent={
          <HeaderButton
            title="Done"
            isActive={isButtonActive}
            onPress={() => {
              const emails = tagPeople.map(item => item.email);
              const names = tagPeople.map(
                item => item.firstName + item.lastName,
              );
              dispatch(postDataSliceAction.setTagList({emails, names}));
              navigation.goBack();
            }}
          />
        }
      />
      <View style={styles.titleContainer}>
        <TextField
          placeholder="Search Friends"
          iconName="search1"
          iconType="AntDesign"
          style={styles.searchbar}
          onChangeText={text => {
            onSearchFriend(text);
          }}
        />
      </View>

      {!isSearch
        ? friends.map((data, i) => <TagUserCard data={data} key={i} />)
        : searchResult.map((data, i) => <TagUserCard data={data} key={i} />)}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    // backgroundColor:colors.red,
    // width:'90%',
    marginLeft: 25,
    marginTop: 15,
    marginRight: 25,
    // marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  usersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
  },
  searchbar: {
    width: '90%',
    marginLeft: 10,
  },

  separator: {
    backgroundColor: colors.LightGray,
    width: '100%',
    height: 10,
    marginTop: 15,
  },
});
