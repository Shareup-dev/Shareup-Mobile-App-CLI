import {
  StyleSheet,
  Text,
  Platform,
  View,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';

import {Header, HeaderTitle} from '../components/headers';
import Separator from '../components/Separator';
import React, {useContext, useEffect, useState} from 'react';
import colors from '../config/colors';
import LinkButton from '../components/buttons/LinkButton';
import Section from '../components/Section';
import TextField from '../components/TextField';
import {ScrollView} from 'react-native-gesture-handler';
import {TouchableOpacity, Image} from 'react-native';
import AuthContext from '../authContext';
import {Formik} from 'formik';
import userService from '../services/user.service';
import LoadingComponent from '../components/Loading';
import Icon from '../components/Icon';
import {launchImageLibrary} from 'react-native-image-picker';
import fileStorage from '../config/fileStorage';
import routes from '../navigation/routes';

export default function EditProfileScreen({navigation}) {
  const {
    userState: {userData, username},
    authActions,
  } = useContext(AuthContext);

  const [Loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hobbies, setHobbies] = useState([]);
  const [hobbie, setHobbie] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const initValues = JSON.parse(
    JSON.stringify(userData).replace(/:null/gi, ':""'),
  );
  useEffect(() => {
    setHobbies(userData.interests?.split(','));
  }, []);

  const changeProfileImage = () => {
    if(!profileImage){
      return;
    }
    setUploading(true);
    const image = new FormData();
    const uniId = new Date().valueOf();

    image.append('profilePicture', {
      name: `profile-image-${username}-${uniId}.jpg`,
      type: profileImage?.type,
      uri: profileImage.uri,
    });

    userService
      .uploadProfilePicture(username, image)
      .then(({data}) => {
        authActions.updateUserInfo(data);
      })
      .catch(e => console.error(e))
      .finally(_ => setUploading(false));
  };

  const handleSubmit = values => {
    setLoading(true);
    userService
      .editProfile(username, {...values, interests: hobbies?.toString()})
      .then(({status, data}) => {
        if (status === 200) {
          authActions.updateUserInfo(data);
          setLoading(false);
          navigation.goBack();
        }
      })
      .catch(e => console.error(e.message));
  };

  const addHobbiesHandler = () => {
    if (hobbie !== '') {
      setHobbies(prev => [...prev, hobbie]);
      setHobbie('');
    }
  };

  const removeHobbiesHandler = item => {
    setHobbies(prev => prev.filter(element => element !== item));
  };

  const imgPicker = () => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5,
      maxHeight: 150,
      selectionLimit: 1,
      maxWidth: 150,
    })
      .then(({assets, didCancel}) => !didCancel && setProfileImage(assets[0]))
      .catch(e => console.error(e));
  };

  return (
    <>
      <KeyboardAvoidingView style={styles.container}>
        {Loading && <LoadingComponent text="Saving..." modal />}
        {uploading && <LoadingComponent text="Uploading" modal />}
        <Formik initialValues={initValues} enableReinitialize={true} onSubmit={handleSubmit}>
          {({handleSubmit, values, handleChange, handleBlur}) => (
            <>
              {/** Header */}
              <Header
                left={
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={_ => navigation.goBack()}
                    style={styles.leftAndRight}>
                    <Text style={styles.headerActionBtn}>Cancel</Text>
                  </TouchableOpacity>
                }
                middle={
                  <HeaderTitle titleStyle={styles.headerTitle}>
                    Edit Profile
                  </HeaderTitle>
                }
                right={
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSubmit}
                    style={styles.leftAndRight}>
                    <Text style={styles.headerActionBtn}>Done</Text>
                  </TouchableOpacity>
                }
                backgroundColor={colors.white}
                headerContainerStyle={styles.header}
              />

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always">
                <View style={styles.content}>
                  {/** Section 1 */}
                  <Section
                    title="Edit Profile"
                    btnTitle="Upload"
                    onAdd={changeProfileImage}>
                    <TouchableOpacity
                      style={{alignItems: 'center'}}
                      onPress={imgPicker}>
                      <Image
                        style={{
                          backgroundColor: '#cacaca30',
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                          resizeMode: 'cover',
                        }}
                        source={
                          profileImage
                            ? {uri: profileImage.uri}
                            : userData.profilePicture
                            ? {
                                uri:
                                  fileStorage.baseUrl + userData.profilePicture,
                              }
                            : require('../assets/default-profile-picture.png')
                        }
                      />
                    </TouchableOpacity>
                  </Section>

                  <Separator />
                  {/** Section 2 */}
                  <Section title="Bio">
                    <TextInput
                      placeholder="Describe yourself..."
                      textAlign="center"
                      multiline
                      value={values.aboutme}
                      onChangeText={handleChange('aboutme')}
                      placeholderTextColor={colors.mediumGray}
                    />
                  </Section>

                  <Separator />
                  {/** Section 3 */}
                  <Section title="Details">
                    <TextField
                      placeholder="Current town / city"
                      iconImage={require('../assets/icons/home-icon.png')}
                      backgroundColor={colors.white}
                      value={values.currenttown}
                      onChangeText={handleChange('currenttown')}
                    />

                    <TextField
                      placeholder="Home town"
                      iconImage={require('../assets/icons/location-icon.png')}
                      backgroundColor={colors.white}
                      value={values.hometown}
                      onChangeText={handleChange('hometown')}
                    />
                    <TextField
                      placeholder="Relationship status"
                      iconImage={require('../assets/icons/double-heart-icon.png')}
                      backgroundColor={colors.white}
                      value={values.relationshipstatus}
                      onChangeText={handleChange('relationshipstatus')}
                    />
                  </Section>

                  <Separator />
                  {/** Section 4 */}
                  <Section title="Hobbies">
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <TextInput
                        placeholder="Add your hobbies..."
                        placeholderTextColor={colors.mediumGray}
                        value={hobbie}
                        onChangeText={val => setHobbie(val)}
                      />
                      <TouchableOpacity
                        onPress={addHobbiesHandler}
                        activeOpacity={0.4}>
                        <Text
                          style={{
                            color: colors.iondigoDye,
                            fontSize: 18,
                            fontWeight: '700',
                          }}>
                          Add
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Section>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginHorizontal: 5,
                    }}>
                    {hobbies?.map((item, i) => {
                      return (
                        <View
                          key={i}
                          style={{
                            backgroundColor: colors.iondigoDye,
                            margin: 3,
                            paddingVertical: 3,
                            paddingHorizontal: 10,
                            borderRadius: 5,
                          }}>
                          <TouchableOpacity
                            onPress={() => removeHobbiesHandler(item)}
                            style={{flexDirection: 'row'}}>
                            <Text style={{color: '#fff', marginHorizontal: 5}}>
                              {item}
                            </Text>
                            <Icon
                              name={'close'}
                              size={18}
                              backgroundSizeRatio={0.9}
                              noBackground
                              color="#fff"
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                  <Separator />

                  <LinkButton
                    title=" Switch to professional account"
                    fontSize={18}
                    style={styles.linkButtons}
                  />
                  <Separator />

                  <LinkButton
                    onPress={_ =>
                      navigation.navigate(routes.PERSONAL_INFORMATION)
                    }
                    title=" Professional information settings"
                    fontSize={18}
                    style={styles.linkButtons}
                  />
                </View>
              </ScrollView>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom:25
  },
  headerActionBtn: {
    color: colors.iondigoDye,
    fontSize: 18,
    marginVertical: 10,
  },
  header: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: Platform.OS == 'ios' ? '500' : 'bold',
    marginVertical: 10,
  },
  leftAndRight: {
    marginBottom: 2,
  },
  content: {
    flex: 1,
  },
  textField: {
    alignSelf: 'center',
  },
  linkButtons: {
    margin: 10,
  },
  userProfilePicture: {
    alignSelf: 'center',
  },
});
