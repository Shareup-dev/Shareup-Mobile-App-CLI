import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HeaderWithBackArrow} from '../components/headers';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TabView} from '../components/Reactions';
import postService from '../services/post.service';

interface Props {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const ListOfReactions: React.FC<Props> = props => {
  const {
    navigation,
    route: {params},
  } = props;

  const [reactions, setReactions] = useState<Array<{}>>([]);

  useEffect(() => {
    const fetctReactions = () => {
      postService
        .listOfReactions(params)
        .then(({data}) => {
          setReactions(
            Object.entries(data).filter(
              ([key, value]: any) => value.length > 0,
            ),
          );
        })
        .catch(E => E);
    };
    fetctReactions();
  }, []);

  const goBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <HeaderWithBackArrow onBackButton={goBack} title={'Reactions'} />
        <TabView tabs={reactions} />
      </View>
    </View>
  );
};

export default ListOfReactions;

const styles = StyleSheet.create({
  bodyContainer: {
    backgroundColor: '#eee',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    borderBottomColor: '#cacaca',
    borderBottomWidth: 0.4,
  },
});
