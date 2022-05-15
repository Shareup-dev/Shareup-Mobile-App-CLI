import React, {useContext, useState} from 'react';
import { View, StyleSheet, TouchableOpacity} from 'react-native';

import AuthContext from '../authContext';
import fileStorage from '../config/fileStorage';
import Icon from './Icon';
import colors from '../config/colors';
import BetterImage from './betterImage/BetterImage';

export default function UserProfilePicture({
  size = 100,
  style,
  profilePicture,
  showActiveStatus = false,
  bottomOffsite = 3,
  rightOffsite = -5,
}) {
  const {userState} = useContext(AuthContext);
  const [picture, setPicture] = useState(
    profilePicture ? profilePicture : userState?.userData?.profilePicturePath,
  );
  return (
    <View>
      <BetterImage
        source={ 
          {uri:picture}
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
