import React, { useContext, useState,useCallback } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, FlatList, View } from 'react-native';

import Screen from '../components/Screen';
import { Header, HeaderTitle } from '../components/headers';
import colors from '../config/colors';
import Icon from '../components/Icon';
import routes from '../navigation/routes';
import SavedListItem from '../components/lists/SavedListItem';
import { useFocusEffect } from '@react-navigation/native';
import authContext from '../authContext';
import postService from '../services/post.service';

export default function SavedPostsScreen({ navigation, route }) {

    const { userState } = useContext(authContext);
    const [savedData,setSavedData] = useState([])
    const data = [{
        allPostsType: "post",
        content: "@Ireland_Love is never defeated, and I could add, the history of Ireland proves it",
        group: null,
        id: 1649828346024,
        lastEdited: "13 April 2022 08:39:06",
        liked: false,
        media: [{
            comments: [],
            id: 1649828346024,
            media: "C32D299B-6889-4EAA-9C7B-2AD745F8D492.jpg",
            mediaPath: "/Users/lokeesan/Documents/GitHub/Shareup-Mobile-App-CLI/app/assets/images/15.jpg",
            mediaType: "post"
        }],
        numberOfComments: 1,
        numberOfReaction: 0,
        numberOfshares: 0,
        published: "13 April 2022 08:39:06",
        saved: false,
        userTag: null,
        userdata: {
            email: "hagetap144@leafzie.com",
            firstName: "Steve",
            id: 1649759197093,
            lastName: "Jobs",
            profilePicture: "default.png",
            profilePicturePath: "/src/main/default.png"
        },
        views: 0
    }, {
        allPostsType: "post",
        content: "If you're alive, you can't be bored in San Francisco",
        group: null,
        id: 1649828346024,
        lastEdited: "13 April 2022 08:39:06",
        liked: false,
        media: [{
            comments: [],
            id: 1649828346024,
            media: "76B0732B-E7FE-4727-815E-4DBD51AFF7E6.jpg",
            mediaPath: "/Users/lokeesan/Documents/GitHub/Shareup-Mobile-App-CLI/app/assets/images/15.jpg",
            mediaType: "post"
        }],
        numberOfComments: 1,
        numberOfReaction: 0,
        numberOfshares: 0,
        published: "13 April 2022 08:39:06",
        saved: false,
        userTag: null,
        userdata: {
            email: "hagetap144@leafzie.com",
            firstName: "Steve",
            id: 1649759197093,
            lastName: "Jobs",
            profilePicture: "default.png",
            profilePicturePath: "/src/main/default.png"
        },
        views: 0
    }]

    useFocusEffect(
        useCallback(() => {
            getSavedPost(userState.userData.email);
        }, []),
    );
    const getSavedPost = (userEmail) => {
        postService.getSavedPost(userEmail).then((res)=> {
            console.log("RESPONSE:::",res.data);
            setSavedData(res.data)
        })
    }
    const renderItem = ({ item }) => {
        return (
            <SavedListItem style={styles.listItem}
                user={item.userdata}
                postData={item}
                navigation={navigation}
                //reloadPosts={loadNews}
                postType={item.allPostsType}
                onPress={()=>{navigation.navigate(routes.POST_DETAILS_SCREEN)}}
            />
        );
    };

    const hideActivityIndicator = () => {
        //setActivityIndicator(false);
    };
    return (
        <Screen>
            <Header
                backgroundColor={colors.white}
                left={
                    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                        <Icon
                            name="chevron-back"
                            type="Ionicons"
                            size={25}
                            backgroundSizeRatio={1}
                        />
                    </TouchableWithoutFeedback>
                }
                middle={<HeaderTitle>Saved</HeaderTitle>}
            //     right={<TouchableWithoutFeedback onPress={() => navigation.navigate(routes.SEARCH_SCREEN)}>
            //     <Icon
            //       name="search1"
            //       type="AntDesign"
            //       size={25}
            //       backgroundSizeRatio={1}
            //     />
            //   </TouchableWithoutFeedback>}
            />

            <FlatList
                initialNumToRender={10}
                data={data}
                // ListFooterComponent={ActivityIndicatorComponent}
                keyExtractor={post => post.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                onEndReached={hideActivityIndicator}
                ListEmptyComponent={() => (
                    <Text style={{ alignSelf: "center", marginVertical: 50 }}>No posts Available</Text>
                )}
            />

        </Screen>
    )
}
const styles = StyleSheet.create({
    shadowBox: {
        backgroundColor: 'coral',
        height: 50,
        shadowColor: 'red',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: "row"
    },
    listItem: {
        borderRadius: 10,
        backgroundColor: colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

});
