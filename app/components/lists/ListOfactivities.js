import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {postFeelingsActions} from '../../redux/postFeelings';
import Icon from '../Icon';
import {activities} from '../Data/activitiesAndFeelings';

export default function ListOfActivities(props) {
  const dispatch = useDispatch();

  const ActivityCard = ({activity}) => {
    const {name, icon, color, type} = activity;
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          dispatch(
            postFeelingsActions.setFeel({feeling: name, icon, color, type}),
          );
          props.navigation.goBack();
        }}>
        <View style={styles.card}>
          {/* <Image source={img} style={styles.img} /> */}
          <Icon name={icon} color={color} />

          <Text style={styles.cardText}>{name + '...'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {activities.map((activity, index) => (
          <ActivityCard key={index} activity={activity} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardText: {},
  card: {flexDirection: 'row', alignItems: 'center', padding: 5},
  img: {
    width: 50,
    height: 50,
  },
});
