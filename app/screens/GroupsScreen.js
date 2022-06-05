import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import Icon from '../components/Icon';
import TextField from '../components/TextField';
import Tab from '../components/buttons/Tab';
import Text from '../components/Text';
import colors from '../config/colors';
import {HeaderWithBackArrow} from '../components/headers';
import routes from '../navigation/routes';
import authContext from '../Contexts/authContext';
import groupService from '../services/group.service';
import {useFocusEffect} from '@react-navigation/native';
import constants from '../config/constants';
import Card from '../components/lists/Card';
import JoinGroupList from '../components/lists/JoinGroupList';
import EmptyPostCard from '../components/EmptyCards/EmptyPostCard';

export default function GroupsScreen({navigation}) {
  const {userData} = useContext(authContext).userState;

  const initSearchVal = {
    keyword: '',
    result: [],
    loading: 0,
  };
  const [search, setSearch] = useState(initSearchVal);
  const [feed, setFeed] = useState({
    state: [],
    loading: false,
  });

  const fetchFeed = () => {
    setFeed(prev => ({...prev, loading: true}));
    groupService
      .newsFeed(userData.id)
      .then(({data}) => setFeed(prev => ({...prev, state: data})))
      .catch(e => console.error(e.message))
      .finally(_ => setFeed(prev => ({...prev, loading: false})));
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchFeed();
    }, []),
  );

  const searchGroups = _ => {
    if (search.keyword) {
      setSearch(prev => ({...prev, loading: 1}));
      groupService
        .search(search.keyword)
        .then(res => setSearch(prev => ({...prev, result: res.data})))
        .catch(e => console.error(e.message))
        .finally(_ => setSearch(prev => ({...prev, loading: 2})));
    } else {
      setSearch(prev => ({...prev, loading: 0, result: []}));
    }
  };
  const handleClearSearch = () => {
    setSearch(initSearchVal);
  };

  const SearchResultCard = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => navigation.navigate(routes.GROUP_FEED, item)}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={
            item.groupImagePath
              ? {uri: item.groupImagePath}
              : require('../assets/images/group-texture.png')
          }
          style={styles.searchCardImg}
        />
        <View style={styles.item}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={{fontSize: 13}}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ActivityIndicatorComponent = ({style}) => (
    <View style={[styles.listFooter, style]}>
      <ActivityIndicator size="large" color={colors.iondigoDye} />
    </View>
  );

  const HeaderComponent = () => {
    return (
      <View style={styles.suggestedGroupsWrapper}>
        <JoinGroupList navigation={navigation} />
      </View>
    );
  };

  const renderItem = ({item}) => {
    switch (item.allPostsType) {
      case constants.postTypes.SWAP:
        return (
          <SwapCard
            navigation={navigation}
            route={route}
            item={item}
            userId={item.userdata.id}
          />
        );
      case constants.postTypes.HANG_SHARE:
        return (
          <SwapCard
            navigation={navigation}
            route={route}
            item={item}
            userId={item.userdata.id}
          />
      
        );
      default:
        return (
          <Card
            user={item.userdata}
            postData={item}
            navigation={navigation}
            reloadPosts={fetchFeed}
            postType={item.allPostsType}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <HeaderWithBackArrow
        onBackButton={() => navigation.navigate(routes.FEED)}
        component={
          <TextField
            placeholder="Search Groups"
            iconName="search1"
            iconType="AntDesign"
            style={styles.searchbar}
            onChangeText={val => setSearch(prev => ({...prev, keyword: val}))}
            onSubmitEditing={searchGroups}
            value={search.keyword}
            returnKeyType="search"
            endComponent={
              <TouchableOpacity
                style={{marginLeft: 0}}
                onPress={handleClearSearch}>
                <Icon
                  name="close"
                  noBackground
                  size={35}
                  style={{paddingHorizontal: 5}}
                />
              </TouchableOpacity>
            }
          />
        }
      />

      <View style={styles.optionsBar}>
        <Tab
          title="Create New"
          style={styles.tab}
          iconName="pluscircle"
          iconType="AntDesign"
          iconColor="black"
          iconSize={17}
          titleStyle={styles.tabTitle}
          onPress={() => {
            navigation.navigate(routes.CREATE_NEW_GROUP);
          }}
        />
        <Tab
          title="Manage groups"
          style={styles.tab}
          iconName="miscellaneous-services"
          iconType="MaterialIcons"
          iconColor="black"
          iconSize={17}
          titleStyle={styles.tabTitle}
          onPress={() => {
            navigation.navigate(routes.MANAGE_GROUPS);
          }}
        />
        <Tab
          title="Your groups"
          style={styles.tab}
          iconImage={require('../assets/icons/foundation_social-skillshare.png')}
          iconSize={22}
          titleStyle={styles.tabTitle}
          onPress={() => {
            navigation.navigate(routes.MY_GROUPS);
          }}
        />
        {/* <Tab
          title="Categories"
          style={styles.tab}
          iconName="list"
          iconType="Feather"
          iconSize={18}
          titleStyle={styles.tabTitle}
        /> */}
      </View>
      <View style={{backgroundColor: '#fff', marginTop: 5, flex: 1}}>
        <View>
          <ScrollView
            style={styles.listContainer}
            showsVerticalScrollIndicator={false}>
            {search.loading === 2 && (
              <>
                <Text style={[{marginVertical: 5}, styles.title]}>
                  {`Search Results`}
                </Text>
                <View
                  style={{
                    backgroundColor: '#fdfdfd',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    borderRadius: 10,
                    borderColor: '#cacaca60',
                    borderWidth: 1,
                  }}>
                  {search.result.length === 0 && (
                    <Text
                      style={{
                        textAlign: 'center',
                        marginVertical: 15,
                        fontSize: 15,
                      }}>{`Groups not found`}</Text>
                  )}
                  {search.result.map((result, i) => (
                    <SearchResultCard item={result} key={i} />
                  ))}
                </View>
              </>
            )}
          </ScrollView>
          <FlatList
            data={feed.state}
            initialNumToRender={5}
            keyExtractor={(post, i) => i.toString()}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={HeaderComponent}
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <>
                {feed.loading ? (
                <EmptyPostCard />
                ) : (
                  <Text style={{alignSelf: 'center',fontSize:14, color:'#33333380'}}>
                    No posts Available
                  </Text>
                )}
              </>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cacaca35',
  },
  searchCardImg: {
    backgroundColor: '#33333360',
    width: 50,
    borderRadius: 10,
    resizeMode: 'cover',
    height: 50,
  },
  actionContainer: {
    borderTopWidth: 1,

    paddingHorizontal: 15,
    marginTop: 5,
    borderTopColor: '#cacaca60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listContainer: {
    paddingHorizontal: 10,

    marginBottom: 10,
    paddingVertical: 10,
  },
  item: {
    paddingHorizontal: 10,
    marginVertical: 8,
    justifyContent: 'center',
  },
  header: {
    marginTop: 15,
    marginBottom: 5,
    fontSize: 20,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchbar: {
    width: '82%',
    margin: 5,
  },
  searchText: {
    width: '75%',
  },
  optionsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  tab: {
   // width: '31%',
    height: 30,
    alignContent:'space-between',
    margin: 10,
  },
  tabTitle: {
    fontSize: 12,
  },
  addGroupsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  fancyAddButton: {
    margin: 5,
  },
  smallerFont: {
    marginLeft: 20,
    fontSize: 15,
  },
  separator: {
    backgroundColor: colors.LightGray,
    width: '100%',
    height: 10,
  },
  groupsContainer: {
    paddingTop: 30,
    justifyContent: 'center',
  },
  yourGroupsTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  joinGroupThumbnail: {
    width: 65,
    height: 65,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.lighterGray,
  },
  img: {
    backgroundColor: '#33333360',
    width: 70,
    borderRadius: 10,
    resizeMode: 'cover',
    height: 70,
  },
});
