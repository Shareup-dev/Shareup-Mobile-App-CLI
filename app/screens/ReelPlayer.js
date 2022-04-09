import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  Dimensions,
} from 'react-native';

import Screen from '../components/Screen';
import fileStorage from '../config/fileStorage';
import colors from '../config/colors';
import Icon from '../components/Icon';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const ReelPlayer = ({navigation, route}) => {
  const reelVideo = route.params;

  const [mute, setMute] = useState(false);
  const [like, setLike] = useState(false);

  const videoRef = React.useRef(null);

  const Header = () => {
    return (
      <View style={styles.Header}>
        <Text style={styles.HeaderText}>Share Reels</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={{marginHorizontal: 10}}
            onPress={_ => setMute(prev => !prev)}>
            <Icon
              noBackground
              type="MaterialCommunityIcons"
              size={35}
              backgroundSizeRatio={0.8}
              color="#fff"
              name={mute ? 'volume-off' : 'volume-high'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={_ => navigation.goBack()}>
            <Icon
              noBackground
              type="MaterialCommunityIcons"
              size={35}
              backgroundSizeRatio={1}
              name={'close'}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const BottomCard = () => {
    return (
      <View style={styles.card}>
        <View style={styles.reelInfo}>
          <View
            style={{
              backgroundColor: '#33333345',
              borderRadius: 35,
            }}>
            <View style={styles.reelsInfo}>
              <Image
                source={require('../assets/default-profile-picture.png')}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  margin: 5,
                }}
              />
              <View>
                <Text style={{color: '#fff', marginTop: 2, fontSize: 14}}>
                  Username
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon
                    color={like ? '#FFCE45' : '#fff'}
                    name={like ? 'star' : 'star-o'}
                    noBackground
                    type="FontAwesome"
                  />
                  <Text style={{color: '#fff'}}>56</Text>
                  <Icon
                    color="#fff"
                    name="comment"
                    noBackground
                    type="Octicons"
                  />
                  <Text style={{color: '#fff'}}>56</Text>
                </View>
              </View>
            </View>
            <Text
              style={{
                color: '#fff',
                marginTop: 2,
                marginHorizontal: 15,
                marginBottom: 10,
                fontSize: 14,
              }}>
              Loram separator service setCurrentTab swapId
              listContentContainerStyle
            </Text>
          </View>
        </View>
        <View style={styles.reelAction}>
          <TouchableOpacity onPress={_ => setLike(prev => !prev)}>
            <Icon
              color={like ? '#FFCE45' : '#fff'}
              name={like ? 'star' : 'star-o'}
              style={{marginVertical: 5}}
              backgroundSizeRatio={0.7}
              noBackground
              type="FontAwesome"
            />
          </TouchableOpacity>
          <Icon
            color="#fff"
            style={{marginVertical: 5}}
            name="comment"
            noBackground
            backgroundSizeRatio={0.7}
            type="Octicons"
          />
          <Icon
            color="#fff"
            style={{marginVertical: 5}}
            image={require('../assets/icons/share-icon.png')}
            noBackground
            backgroundSizeRatio={0.7}
            type="Octicons"
          />
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity style={{flex: 1, justifyContent: 'space-between'}} activeOpacity={1} onLongPress={_ => setLike(prev => !prev)}>
      <Header />
      <Image
        style={styles.video}
        source={{uri: fileStorage.baseUrl + reelVideo.image}}
      />
      <BottomCard />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reelsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  reelAction: {
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
    borderRadius: 35,
    width: '20%',
    backgroundColor: '#33333335',
  },
  reelInfo: {
    paddingHorizontal: 15,
    width: '80%',
  },
  Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomColor: '#cacaca',
    borderBottomWidth: 1,
    paddingVertical: 10,
    backgroundColor: '#33333325',
  },
  HeaderText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '600',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  video: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -10,
  },
  activityIndicator: {
    position: 'absolute',
    zIndex: 2,
    top: '50%',
    bottom: '50%',
    left: '50%',
    right: '50%',
  },
});

export default ReelPlayer;
