import React, {useContext, useState} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AuthContext from '../../authContext';
import {HeaderWithBackArrow} from '../../components/headers';
import colors from '../../config/colors';
import profileService from '../../services/profile.service';

export default function ManageEmail({navigation, route}) {
  const {title, value} = route.params;

  const [verifying, setVerifying] = useState(false);

  const {
    userState: {userData},
    authActions,
  } = useContext(AuthContext);

  const removeOptionalEmail = () => {
    profileService.removeOptionalEmail(userData.id).then(({status}) => {
      if (status === 200) {
        authActions.updateUserInfo();
        navigation.goBack();
      }
    });
  };

  return (
    <View style={styles.container}>
      <HeaderWithBackArrow
        onBackButton={_ => navigation.goBack()}
        title={title}
      />
 <View style={styles.body}>
          <Text style={styles.title}>{value}</Text>
          <Text>Pending</Text>
          {
              !verifying && (
                <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={_ => setVerifying(true)}>
                  <Text style={{color: '#fff', fontWeight: '700'}}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={removeOptionalEmail}
                  style={[styles.btn, {backgroundColor: 'crimson'}]}>
                  <Text style={{color: '#fff', fontWeight: '700'}}>Remove</Text>
                </TouchableOpacity>
              </View>
              )
          }
         
        </View>
      {verifying && (
        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={{textAlign: 'center', marginVertical: 10}}>
              Shareup has sent you a verification code to the email
            </Text>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.label}>Verification code</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: '#cacaca',
                    minWidth: 150,
                    textAlign: 'center',
                  },
                ]}
              />
            </View>

            <Text style={{textAlign: 'center'}}>
              Verification code will expire after 5 minutes
            </Text>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                marginVertical: 5,
                backgroundColor: '#cacaca60',
                paddingHorizontal: 15,
                paddingVertical: 6,
                borderRadius: 30,
                width: 100,
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: colors.iondigoDye, fontWeight: '700'}}>
                Re-send
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.iondigoDye,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginHorizontal: 3,
  },
  container: {
    flex: 1,
  },
  body: {
    marginTop: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    // borderColor: '#cacaca',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginVertical: 5,
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
  },
});
