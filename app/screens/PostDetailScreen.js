import React, { useContext, useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    FlatList,
    View,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import Tab from "../components/buttons/Tab";
import Screen from '../components/Screen';
import { Header, HeaderTitle } from '../components/headers';
import colors from '../config/colors';
import Icon from '../components/Icon';
import routes from '../navigation/routes';
import SavedListItem from '../components/lists/SavedListItem';
import { useFocusEffect } from '@react-navigation/native';
import authContext from '../authContext';
import postService from '../services/post.service';
import fileStorage from '../config/fileStorage';
import Card from '../components/lists/Card';
import SwapCard from '../components/lists/SwapCard';
import CommentsScreen from './CommentsScreen';
import ImageView from 'react-native-image-viewing';
import {SliderBox} from 'react-native-image-slider-box';

export default function PostDetailScreen({ navigation, route }) {

    const { userState } = useContext(authContext);
    const [savedData, setSavedData] = useState([])
    const [commentsList, setCommentsList] = useState([]);
    const [images, setImages] = useState([]);
    const [currentImage, setCurrentImage] = useState();
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const actionsTabSizeRatio = 0.5;
    const data = [
        {
            allPostsType: "post",
            content: "If you're alive, you can't be bored in San Francisco",
            group: null,
            id: 1650184271184,
            lastEdited: "13 April 2022 08:39:06",
            liked: false,
            media: [{
                comments: [],
                id: 1650184271184,
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
                profilePicture: "profile-image-lokeesan@shareup.qa-1650259496598.jpg",
                profilePicturePath: "/src/main/default.png"
            },
            views: 0
        }]

    useFocusEffect(
        useCallback(() => {
            //getSavedPost(userState.userData.email);
            // loadComments();
            loadImages();
        }, []),
    );
    const loadImages = () => {
        if (data[0].media?.length !== 0) {
            setImages(data[0].media?.map(image => fileStorage.baseUrl + image.media));
        }
    }
        const ActivityIndicatorComponent = () => (
            <View style={styles.listFooter}>

                <CommentsScreen route={{ params: { postId: data[0].id, postType: data[0].allPostsType, swapId: data[0].id, fromDetailScreen: true } }} />

            </View>
        );

        const renderItem = ({ item }) => {
            return item.allPostsType == "swap" ? (
                /**
                 * The Swap Should from backend as instance of post
                 */
                // ToDO: Refactor to use one component for posts and swap.
                <SwapCard
                    navigation={navigation}
                    route={route}
                    item={item}
                    userId={item.userdata.id}


                />
            ) : (
                <View>
                    
                    {currentImage && (
                        <ImageView
                            visible={imageViewerVisible}
                            images={[{ uri: currentImage }]}
                            imageIndex={0}
                            onRequestClose={() => {
                                setImageViewerVisible(false);
                            }}
                        />
                    )}

                    {/** Post Image */}

                    {images?.length !== 0 && (
                        <SliderBox
                            images={images}
                            ImageComponentStyle={styles.image}
                            imageLoadingColor={colors.iondigoDye}
                            // parentWidth={sliderWidth / 1.04}
                            onCurrentImagePressed={index => {
                                setCurrentImage(images[index]);
                                setImageViewerVisible(true);
                            }}
                        />

                        // <Image source={{ uri: images[0] }} style={styles.image} />
                    )}
                    <View style={styles.actionsContainer}>
                        <Tab
                            //title={numberOfReactions}
                            iconName="star"
                            iconType="FontAwesome5"
                            sizeRatio={actionsTabSizeRatio}
                            style={styles.actionTab}
                            color={colors.mediumGray}
                            fontColor={colors.white}
                        />

                        <Tab
                            // title={numberOfComments}
                            iconName="comment"
                            iconType="Octicons"
                            sizeRatio={actionsTabSizeRatio}
                            style={styles.actionTab}
                            color={colors.mediumGray}
                            fontColor={colors.white}
                        />

                        <Tab
                            title={"0"}
                            iconImage={require("../assets/icons/share-icon.png")}
                            sizeRatio={actionsTabSizeRatio}
                            style={styles.actionTab}
                            color={colors.mediumGray}
                            fontColor={colors.white}
                            iconSize={10}
                        />
                    </View>
                </View>
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
                    middle={<View style={styles.userNameContainer}>
                        <Image
                            source={{ uri: fileStorage.baseUrl + data[0].userdata.profilePicture }}
                            style={styles.profilePicture}
                        />

                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate(routes.USER_PROFILE, data[0].userdata.email)
                            }
                        >
                            <Text style={styles.userName}>{data[0].userdata.firstName}</Text>
                            <View style={styles.postDateContainer}>
                                <Text style={styles.postDate}>{data[0].published}</Text>
                                <Text style={{ fontWeight: 'bold' }}>  .</Text>
                                <Icon
                                    image={require('../assets/post-privacy-options-icons/public-icon.png')}
                                    type='FontAwesome5'
                                    backgroundSizeRatio={1}
                                    size={15}
                                    color={colors.dimGray}
                                    style={styles.privacy}
                                />
                            </View>
                        </TouchableOpacity>


                    </View>}
                    right={<TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => {
                            setIsOptionsVisible(true);
                        }}>
                        <Icon
                            name="options"
                            type="SimpleLineIcons"
                            style={styles.optionsIcon}
                            size={20}
                            backgroundSizeRatio={1}
                        />
                    </TouchableOpacity>}
                />

                <FlatList
                    initialNumToRender={10}
                    data={data}
                    ListFooterComponent={ActivityIndicatorComponent}
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
        postDate: {
            fontSize: 12,
            color: colors.dark,
        },
        separator: {
            marginVertical: 10,
        },
        postText: {
            fontSize: 11,
            marginTop: 10,
        },
        userName: {
            fontWeight: "bold",
        },
        userNameContainer: {
            width: "100%",
            flexDirection: "row",
            alignItems: "flex-start",
            //backgroundColor: colors.red,
        },
        profilePicture: {
            borderRadius: 17.5,
            marginRight: 10,
            width: 35,
            height: 35,
        },
        postDateContainer: {
            width: "100%",
            flexDirection: "row",
            alignItems: "flex-start",
            // justifyContent:"space-between"
            // backgroundColor: colors.red,
        },
        privacy: {
            paddingLeft: 10,
        },
        actionTab: {
            paddingHorizontal: 5,
            marginHorizontal: 5,
        },
        actionsContainer:{
            flexDirection: "row",
        }

    });
