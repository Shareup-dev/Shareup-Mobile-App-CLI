import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Screen from '../components/Screen';
import HeaderWithBackArrow from '../components/headers/HeaderWithBackArrow';
import TabBar from '../components/tab-bar/Bar';
import LongCard from '../components/lists/LongCard';

import colors from '../config/colors';
import defaultStyle from '../config/styles';
import fileStorage from '../config/fileStorage';
import store from '../redux/store';
import reelScreenDetector from '../redux/reelScreenDetector';
import StoriesService from '../services/story.service';
import routes from '../navigation/routes';
import authContext from '../authContext';
import axios from 'axios';
import ReelsService from '../services/Reels.service';
import AuthContext from '../authContext';
const width = Dimensions.get('window').width / 2 - 15;
const height = Dimensions.get('window').height / 3;

const tabes = [{name: 'My Reels'}, {name: 'Followed'}, {name: 'Explore'}];

export default function SwapScreen({navigation}) {
  const {
    userState: {userData},
  } = useContext(AuthContext);

  const [Loading, setLoading] = useState(0);
  const [MyReels, setMyReels] = useState([]);
  const [ExploreReels, setExploreReels] = useState([]);
  const [FriendsReels, setFriendsReels] = useState([]);
  const [currentTab, setCurrentTab] = useState(tabes[0].name);
  const handleTabbed = name => {
    setCurrentTab(name);
  };

  useEffect(() => {
    const fetchReels = () => {
      setLoading(1);
      Promise.all([
        ReelsService.getReelsByUser(userData.id),
        ReelsService.getFriendsReels(userData.id),
        ReelsService.exploreReels(userData.id),
      ])
        .then(res => {
          setMyReels(res[0].data);
          setFriendsReels(res[1].data);
          setExploreReels(res[2].data);
        })
        .catch(e => console.error(e))
        .finally(_ => {
          setLoading(2);
        });
    };
    fetchReels();

    return () => {
      navigation.addListener('blur', () => {
        store.dispatch(reelScreenDetector.actions.unSetReelScreen());
      });
    };
  }, []);
  const renderList = () => {
    if (currentTab === tabes[0].name) return MyReels;
    if (currentTab === tabes[1].name) return FriendsReels;
    if (currentTab === tabes[2].name) return ExploreReels;
  };

  return (
    <Screen style={styles.container}>
      <HeaderWithBackArrow
        title={currentTab}
        onBackButton={() => navigation.goBack()}
        rightComponent={
          <View style={styles.tabBar}>
            <TabBar
              tabes={tabes}
              currentTab={currentTab}
              activeUnderLineColor={colors.LightGray}
              onTab={handleTabbed}
              fontSize={12}
              underLineWidth={25}
              underLineHight={2}
            />
          </View>
        }
      />

      <FlatList
        contentContainerStyle={[
          defaultStyle.listContentContainerStyle,
          styles.list,
        ]}
        data={renderList()}
        numColumns={2}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{width:'100%', alignItems:'center'}}>

          <Text style={{ alignItems:'center'}}  >
           {Loading === 2 ? `There is no reels to display`:`Loading..`}
          </Text>
          </View>
        }
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.REEL_PLAYER, {
                index,
                data: renderList(),
              });
            }}>
            <View style={[styles.container]}>
              <Image
                source={{uri: fileStorage.baseUrl + item.image}}
                style={styles.image}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
  },
  list: {
    paddingTop: 50,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.white,
    marginHorizontal: 1.5,
  },
  image: {
    width: width,
    height: height,
    resizeMode: 'cover',
    borderRadius: 10,
    backgroundColor: colors.LightGray,
  },
  titlesContainer: {
    zIndex: 1,
    bottom: 1,
    margin: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.dark,
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: -3,
  },
  subTitle: {
    color: colors.dark,
    marginTop: 5,
  },
  privacyBadge: {
    marginTop: 10,
    flexDirection: 'row',
  },
});
