import React from "react";
import { StyleSheet,View } from "react-native";
import { FlatList } from "react-native";
import { HeaderWithBackArrow } from "../components/headers";
import Screen from "../components/Screen";
import UserProfilePicture from "../components/UserProfilePicture";
import colors from "../config/colors";
import { Texts } from "../Materials/Text";
import defaultStyles from '../config/GlobalStyles';
import { TouchableOpacity } from "react-native-gesture-handler";
import routes from "../navigation/routes";
import Separator from "../components/Separator";

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
            email: "harshu@gmail.com",
            firstName: "Harshu",
            id: 1654671096566,
            lastName: "Hari",
            profilePicture: "profile-image-sree@gmail.com-1654340598380.jpg",
            profilePicturePath: "https://shareup.s3.us-west-2.amazonaws.com/profile_picture/default.jpg"
               
        },
        {
            email: "hari@gmail.com",
            firstName: "Hari",
            id: 1654417515355,
            lastName: "Harikrishnan",
            profilePicture: "profile-image-sree@gmail.com-1654340598380.jpg",
            profilePicturePath: "https://shareup.s3.us-west-2.amazonaws.com/profile_picture/1654417515355/profile-image-hari@gmail.com-1655299255608.jpg"
        }
    ]

    const renderItem = ({item}) => {
        console.log(item);
        return (
            <TouchableOpacity onPress={() => navigation.navigate(routes.FRIEND_PROFILE, {
                user: item,
              })}>
            <View style={[defaultStyles.listItemTitle,{flexDirection:'row',alignItems:"center",marginTop:15,marginLeft:25}]}>
            <UserProfilePicture 
            userProfilePicture={item.profilePicturePath} 
            size={40}
            style={{marginRight:10}}/>
            <Texts size={15} style={{fontWeight:"bold"}}> {`${item.firstName} ${item.lastName}`} </Texts>
           
            </View>
            
            </TouchableOpacity>
        )

    }

    return (
        <Screen style={{backgroundColor:colors.white}}>
           <HeaderWithBackArrow 
           title={'Share'}
           onBackButton={()=>{navigation.goBack();}}/> 
           <Separator style={styles.separator} />
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