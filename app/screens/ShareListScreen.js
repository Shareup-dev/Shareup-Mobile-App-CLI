import React from "react";
import { StyleSheet,View } from "react-native";
import { FlatList } from "react-native";
import { HeaderWithBackArrow } from "../components/headers";
import Screen from "../components/Screen";
import UserProfilePicture from "../components/UserProfilePicture";
import colors from "../config/colors";
import { Texts } from "../Materials/Text";

export default function ShareListScreen({ navigation,route }) {
    const postData = route.params.postData;
    const data = [
        {
            email: "sree@gmail.com",
            firstName: "Sree hariii",
            id: 1654156409074,
            lastName: "Harikrishnan",
            profilePicture: "profile-image-sree@gmail.com-1654340598380.jpg",
            profilePicturePath: "https://shareup.s3.us-west-2.amazonaws.com/profile_picture/1654156409074/profile-image-sree@gmail.com-1654340598380.jpg"
        },
        {
            email: "sree@gmail.com",
            firstName: "Sree hariii",
            id: 1654156409074,
            lastName: "Harikrishnan",
            profilePicture: "profile-image-sree@gmail.com-1654340598380.jpg",
            profilePicturePath: "https://shareup.s3.us-west-2.amazonaws.com/profile_picture/1654156409074/profile-image-sree@gmail.com-1654340598380.jpg"
        },
        {
            email: "sree@gmail.com",
            firstName: "Sree hariii",
            id: 1654156409074,
            lastName: "Harikrishnan",
            profilePicture: "profile-image-sree@gmail.com-1654340598380.jpg",
            profilePicturePath: "https://shareup.s3.us-west-2.amazonaws.com/profile_picture/1654156409074/profile-image-sree@gmail.com-1654340598380.jpg"
        }
    ]

    const renderItem = (item) => {
        return (
            <View style={{flexDirection:'row'}}>
            <UserProfilePicture 
            userProfilePicture={item.profilePicturePath} 
            size={50}
            style={{marginTop:10,marginLeft:15,marginRight:10,marginBottom:5}}/>
            <Texts> {`${item.firstName}`} </Texts>
            </View>
        )

    }

    return (
        <Screen style={{backgroundColor:colors.white}}>
           <HeaderWithBackArrow 
           title={'Share'}
           onBackButton={()=>{navigation.goBack();}}/> 
        <FlatList
            data={data}
            renderItem={renderItem}
        />
        </Screen>

    )
}
const styles = StyleSheet.create({
    ProfilePicture:{

    }

})