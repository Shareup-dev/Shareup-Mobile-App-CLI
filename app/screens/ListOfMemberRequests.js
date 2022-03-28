import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {HeaderWithBackArrow} from '../components/headers';
import fileStorage from '../config/fileStorage';
// import routes from '../navigation/routes';
import groupService from '../services/group.service';

export default function MemberRequest({navigation, route}) {
  const {params: groupData} = route;
  const [requests, setRequests] = useState([]);

  const Item = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        // onPress={() => navigation.navigate(routes.GROUP_FEED, item)}
        onPress={_ => console.log(item)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={
              item.image
                ? {uri: fileStorage.baseUrl + item.image}
                : require('../assets/images/group-texture.png')
            }
            style={styles.img}
          />
          <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const fetchMemberRequests = async () => {
      groupService
        .listOfRequests(groupData.id)
        .then(res =>
          setRequests([
            {
              title: 'New Members',
              data: res.data,
            },
          ]),
        )
        .catch(e => console.error(e.message));
    };
    fetchMemberRequests();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <HeaderWithBackArrow
          title={'Member Requests'}
          onBackButton={() => {
            navigation.goBack();
          }}
        />
      </View>
      <View style={styles.listContainer}>
        <SectionList
          showsVerticalScrollIndicator={false}
          sections={requests}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <Item item={item} />}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.header}>{title}</Text>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  img: {
    backgroundColor: '#33333360',
    width: 50,
    borderRadius: 10,
    resizeMode: 'cover',
    height: 50,
  },
  container: {
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 60,
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
    fontSize: 18,
  },
});
