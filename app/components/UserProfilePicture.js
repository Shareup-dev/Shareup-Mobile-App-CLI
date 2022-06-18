import React, { useContext }  from 'react';
import { View, StyleSheet, } from 'react-native';

import Icon from './Icon';
import colors from '../config/colors';
import BetterImage from './betterImage/BetterImage';
import AuthContext from '../Contexts/authContext';

export default function UserProfilePicture(props) {

  const {userState:{userData}} = useContext(AuthContext)

  const {
    size = 100,
    style,
    userProfilePicture,
    profilePicture = userData.profilePicturePath,
    showActiveStatus = false,
    bottomOffsite = 3,
    rightOffsite = -5,
  } = props;

  return (
    <View>
      <BetterImage
        source={ 
          {uri:userProfilePicture?userProfilePicture:profilePicture}
        }
        style={[{width: size, height: size, borderRadius: size / 2}, style]}
      />

      {showActiveStatus && (
        <Icon
          name="circle"
          type="FontAwesome"
          color={colors.activeGreen}
          style={[
            styles.activeIcon,
            {bottom: bottomOffsite, right: rightOffsite},
          ]}
          size={15}
          backgroundSizeRatio={0.9}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  activeIcon: {
    position: 'absolute',
  },
});
