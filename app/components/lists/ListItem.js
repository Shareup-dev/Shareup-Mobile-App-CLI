import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  Text,
  Touchable,

} from 'react-native';

import colors from '../../config/colors';
import Tab from '../buttons/Tab';
import Icon from '../Icon';
import defaultStyles from '../../config/styles';
import fileStorage from '../../config/fileStorage';
import {TouchableOpacity} from 'react-native-gesture-handler';


export default function ListItem({
  email,
  title,
  tabTitle = 'Send Request',
  titleStyle,
  subTitle,
  image,
  user,
  fontColor,
  color,
  IconComponent,
  onPress,
  onPressProfile,
  style,
  secondBtnAction,
  secondBtnTitle,
  displayLeft = false,
  secondBtn = false,
  showCloseButton = true,
  fullWidth,
  handleClose,
  displayFirstButton = true,
  isBottomSheet = false,

}) {

  return (
    <TouchableWithoutFeedback onPress={!isBottomSheet ? onPressProfile : onPress}>
      <View style={[styles.listItem, style]}>
       
        {IconComponent}
        {image && (
          <Image
            style={styles.image}
            source={{uri: fileStorage.baseUrl + image}}
          />
        )}
        <View style={styles.firstlistItem}>
        <View style={styles.detailsContainer}>
          <Text
            numberOfLines={1}
            style={[styles.title, defaultStyles.fontWeightMedium, titleStyle]}>
            {title}
          </Text>
          {subTitle && (
            <Text
              numberOfLines={2}
              style={[
                defaultStyles.listItemSubTitle,
                defaultStyles.fontWeightMedium,
              ]}>
              {subTitle}
            </Text>
          )}
        </View>
        

        {displayLeft && (
          <View style={styles.leftContainer}>
            <Tab
              title={tabTitle}
              titleStyle={styles.buttonTitle}
              style={[styles.tab, {width: fullWidth ? 200 : 100}]}
              height={30}
              user={user}
              color={color}
              fontColor={fontColor}
              onPress={onPress}
            />
            {secondBtn && (
              <Tab
                title={secondBtnTitle}
                titleStyle={styles.buttonTitle}
                style={[styles.tab, {width: fullWidth ? 200 : 100}]}
                // fullWidth={false}
                height={30}
                user={user}
                onPress={secondBtnAction}
                color={colors.iondigoDye}
                fontColor={colors.white}
              />
            )}
            {!secondBtn && showCloseButton && (
              <TouchableOpacity onPress={handleClose}>
                <Icon
                  name="close"
                  type="AntDesign"
                  backgroundSizeRatio={0.5}
                  size={30}
                />
              </TouchableOpacity>
            )}
          </View>
         
        )}
         </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  listItem: {

    flexDirection: "row",
    //alignItems: "center",
    padding: 15,
    paddingVertical: 10,
  },
  firstlistItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 15,
    //paddingVertical: 10,

  },
  detailsContainer: { marginLeft: 5 ,alignItems:"flex-start"},
  image: { height: 75, width: 75, borderRadius: 35 },
  title: {alignItems: "center",},//defaultStyles.listItemTitle,
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop:10
 
  },
  tab: {
    borderRadius: 7,
    paddingHorizontal: 5,
    marginRight: 6,
  },
  buttonTitle: {
    fontSize: 11,
  },
});
