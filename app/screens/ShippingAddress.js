import React, { useState,useContext } from "react";
import { View, Text, StyleSheet, Image, TextInput, Platform ,Pressable} from "react-native";
import { Button } from "react-native-paper";
import AppButton from "../components/buttons/Button";
import { Header, HeaderCloseIcon, HeaderTitle } from "../components/headers";
import Screen from "../components/Screen";
import colors from "../config/colors";
import routes from "../navigation/routes";
import store from "../redux/store";
import { swapedImagesAction } from "../redux/swapedImages";
import authContext from '../Contexts/authContext';
import hangShareService from "../services/hangShare.service";
import { useSelector } from "react-redux";

const ShippingAddress = ({ navigation, route }) => {
  const location = useSelector(state => state.locationSlice);
  const [region,setRegion] = useState({})
  const postData = route.params;
  const { userState } = useContext(authContext);
  const [showMessageScreen,setShowMessageScreen] = useState(true);
  const acceptHang = () => {
    const data = {
      latitude: location.latitude,
      longitude: location.longitude,
      phone_number:1234567890
    
    };
    console.log("region::",postData)
    hangShareService.acceptHang(postData.id,userState.userData.id,data)
    .then((res)=> res.data)
    .catch((e)=>{console.error(e);})
  }
  return (
    <Screen>
      <Header
        left={
          <HeaderCloseIcon
            onPress={() => {
              navigation.goBack();
            }}
          />
        }
        middle={<HeaderTitle>Shipping Address</HeaderTitle>}
      />
      <View>
        <Text style={styles.title}>Please provide your address</Text>
        <Text style={styles.subTitle}>
          So that we can deliver the item to your door step
        </Text>
        <View style={styles.imageContainer}>
          <Image source={require("../assets/icons/googleMapsIcon.png")} />
        </View>
        <Pressable onPress={()=>{navigation.navigate(routes.MAP_VIEW,postData)}}>
        <Text style={styles.subTitle}>
          select Location on Map 
        </Text>
        </Pressable>
        <View style={styles.phoneNumberContainer}>
          <Text style={styles.counteryCode}>QA +974</Text>
          <TextInput
            keyboardType={"number-pad"}
            maxLength={8}
            placeholder={"Enter your mobile number"}
            returnKeyType={"done"}
          />
        </View>
        <AppButton
          onPress={()=> acceptHang()}
          style={styles.payButton}
          title={"Let's Ship"}
          width={"70%"}
        />
        <Text style={styles.partners}>See your partners</Text>
      </View>
    </Screen>
  );
};

export default ShippingAddress;
const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "500",
    marginTop: 20,
    marginVertical: 20,
  },
  subTitle: {
    fontSize: 15,
    color: colors.dimGray,
    textAlign: "center",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  counteryCode: {
    fontSize: 16,
    fontWeight: "400",
    marginRight: 20,
  },
  phoneNumberContainer: {
    borderWidth: 1,
    borderColor: colors.LightGray,
    padding: 5,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
    marginHorizontal: "15%",
    borderRadius: 8,
    marginVertical: 10,
    height: 50,
  },
  payButton: {
    borderRadius: 12,
    marginVertical: 50,
    marginHorizontal: "15%",
  },
  partners: {
    color: colors.iondigoDye,
    textAlign: "center",
    fontSize: 18,
  },
  messageView:{
    flex:1,
    backgroundColor:colors.dimGray,
    width:"100%",
    height:"100%",
   // flexWrap:"wrap",
    opacity:0.3,
    position:"absolute",
    alignItems:"center",
    justifyContent:"center"
    
  },
message:{
  position:"relative",
  opacity:1,
  backgroundColor:colors.white,
}
});
