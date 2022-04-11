import React, { useState,useEffect,useContext } from "react";
import { View, StyleSheet, Text, Image } from "react-native";

import Screen from "../components/Screen";
import TextField from "../components/TextField";
import colors from "../config/colors";
import { HeaderButton, HeaderWithBackArrow } from "../components/headers";
import { Button, Checkbox } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import UserService from '../services/user.service';
import authContext from '../authContext';
import fileStorage from "../config/fileStorage";

// const usersData = [
//   { name: "john Mac", img: "../assets/images/reel2.png" },
//   { name: "Kaneshamoorthi Lokeesan", img: "../assets/images/reel2.png" },
// ];

export default function TagPeople({ navigation,TagedUserData }) {
  const [tagPeople, setTagPeople] = useState([]);
  const [friends, setFriends] = useState([]);
  const [removed, setremoved] = useState([]);
  const {userData: loggedInUser} = useContext(authContext).userState;
  const [isButtonActive, setIsButtonActive] = useState(false);
 
  useEffect(() => {
    UserService.getFriends(loggedInUser.email).then(resp => {
      resp.data.forEach(dost => dost.email);
      setFriends(resp.data);
    });
  }, []);
  const TagUserCard = (props) => {
    console.log(props)
     const name = props.data.firstName + props.data?.lastName;
     const img = props.data?.profilePicturePath

    const CheckIfChecked = (name) => {
      return tagPeople.find((item) => item === name);
    };
   
    return (
      
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={(e) => {
          CheckIfChecked(name)
            ? setTagPeople((prev) => prev.filter((item) => item !== name))
            : setTagPeople((prev) => [...prev, name]);
        }}
      >
        <View style={styles.usersInfo}>
          <Image
            style={styles.img}
            source={{ uri: fileStorage.baseUrl + img}}
          />
          <Text style={{ marginLeft: 15 }}>{name}</Text>
        </View>
        <Checkbox color= {colors.iondigoDye} status={CheckIfChecked(name) ? "checked" : "unchecked"} />
        {tagPeople.length ? setIsButtonActive(true):setIsButtonActive(false)}
      </TouchableOpacity>
    );
  };
  return (
    <Screen style={styles.container}>
      <HeaderWithBackArrow
        onBackButton={() => navigation.goBack()}
        component={
          <Text style={styles.title}>Tag Friends</Text>
        }
        rightComponent={
          <HeaderButton title="Done" isActive={isButtonActive} onPress={()=>{TagedUserData(tagPeople),navigation.goBack()}}/>
        }
      />
      <View style={styles.titleContainer}>
      <TextField
            placeholder="Search Friends"
            iconName="search1"
            iconType="AntDesign"
            style={styles.searchbar}
          />
      </View>
      {console.log("Friends:::",friends)}
      {friends.map((data, i) => (
        <TagUserCard data={data} key={i} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
   // backgroundColor:colors.red,
   // width:'90%',
    marginLeft:25,
    marginTop:15,
    marginRight:25,
   // marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  usersInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
  },
  searchbar: {
    width: "90%",
    marginLeft: 10,
    
  },

  separator: {
    backgroundColor: colors.LightGray,
    width: "100%",
    height: 10,
    marginTop: 15,
  },
});
