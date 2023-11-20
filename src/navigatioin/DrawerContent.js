import React, {useState, useCallback, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  useLinkProps,
  DrawerActions,
  useFocusEffect,
} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../tools/color';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URL from '../tools/URL';
// import {} from '@react-navigation/native';
import {useIsDrawerOpen} from '@react-navigation/drawer';
export default function SideBar(props) {
  const [data, setdata] = useState('');
  const isDrawerOpen = useIsDrawerOpen();
  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, [isDrawerOpen]),
  );

  const getProfile = async () => {
    let data = await AsyncStorage.getItem('User');
    setdata(JSON.parse(data));
  };

  const ondelprofile = async () => {
    const AuthToken = await AsyncStorage.getItem('AuthToken');
    const UserAuth = await AsyncStorage.getItem('User');

    const config = {
      headers: {
        Authorization: 'Bearer '.concat(AuthToken),
        'Content-Type':
          'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
      },
    };
    axios
      .get(URL + '/delete-profile', config)
      .then(res => {
        AsyncStorage.clear();
        AsyncStorage.clear();
        // alert('Successfully deleted');
        AsyncStorage.getAllKeys()
          .then(keys => AsyncStorage.multiRemove(keys))
          .then(() => {
            Toast.show('User Deleted Successfully');
          });
        props.navigation.replace('Splash');
      })
      .catch(error => {
        console.error('Eror Message', JSON.parse(JSON.stringify(error)));
      });
  };
  const getUserProfile = async () => {
    // setLoader(true);
    const AuthToken = await AsyncStorage.getItem('AuthToken');
    const config = {
      headers: {
        Authorization: 'Bearer '.concat(AuthToken),
        'Content-Type':
          'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
      },
    };

    axios
      .get(URL + '/profile', config)
      .then(async res => {
        // setname(res.data.successData.user);
        if (res.data.successData.user.profession == null) {
          props.navigation.navigate('Employee', {
            screen: 'EditProfile',
          });
          await AsyncStorage.setItem('filter', 'false');
          await AsyncStorage.setItem(
            'user_id',
            JSON.stringify(res.data.successData.user.id),
          );
        } else {
          props.navigation.navigate('Employee', {
            screen: 'EmployeeProfile',
          });
          await AsyncStorage.setItem('filter', 'false');
          await AsyncStorage.setItem(
            'user_id',
            JSON.stringify(res.data.successData.user.id),
          );
        }
        // setLoader(false);
      })
      .catch(error => {
        console.warn('check error', error);
        // setLoader(false);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'flex-start',
        // top: Platform.OS == 'ios' ? (DeviceInfo.hasNotch() ? 100 : 10) : 15,
      }}>
      <View style={Style.topview}>
        <View style={{margin: 20, paddingTop: hp(5), flexDirection: 'row'}}>
          <Image
            size={100}
            source={
              data.image != null
                ? {uri: data.image}
                : require('../assets/mypic.jpeg')
            }
            style={{height: 70, borderRadius: 60, width: 70}}
          />
          <View style={{padding: 16, width: '70%'}}>
            <Text
              numberOfLines={2}
              style={{
                color: colors.blue,
                width: '100%',
                fontSize: 20,
                fontWeight: '500',
              }}>
              {data.name}
            </Text>
            <Text style={(Style.usertxt, {color: colors.black})}>
              {data.designation != null ? data.designation : 'no designation'}
            </Text>
          </View>
        </View>
        <View>
          {/* <Icon name="close" size={25} style={{marginTop:hp(5),marginLeft:wp(8)}} onPress={()=>props.navigation.dispatch(DrawerActions.toggleDrawer())} /> */}
        </View>
      </View>
      <View style={{marginLeft: 10}}>
        <TouchableOpacity
          style={Style.tabstyle}
          onPress={() => {
            getUserProfile();
          }}>
          {/* <Icon name="account-outline" color='white'  type="material-community" size={24}/> */}
          <Text style={Style.screentxt}> Profile </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Style.tabstyle}
          onPress={() => props.navigation.navigate('ChangeNumber')}>
          {/* <Icon name="key-outline" color='white' type="material-community" size={24} style={{transform:[{rotate: '90deg'}]}}/> */}
          <Text style={Style.screentxt}> Change Email </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Delete My Profile',
              'You want to delete Your Profile',
              [
                {
                  text: 'No',
                  onPress: () => {},
                  style: 'cancel',
                },
                {text: 'Yes', onPress: () => ondelprofile()},
              ],
            );
          }}
          style={Style.tabstyle}>
          {/* <Icon name="cellphone-arrow-down"  type="material-community" color='white' size={24}/> */}
          <Text style={Style.screentxt}> Delete My Profile </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Style.tabstyle}
          onPress={() => props.navigation.navigate('Inbox')}>
          {/* <Icon name="phone-message-outline"  type="material-community" color='white' size={24}/> */}
          <Text style={Style.screentxt}> Inbox </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Style.tabstyle}
          onPress={() => props.navigation.navigate('TermsCondition')}>
          {/* <Icon name="phone-message-outline"  type="material-community" color='white' size={24}/> */}
          <Text style={Style.screentxt}> Terms & Conditions </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Style.tabstyle}
          onPress={() => props.navigation.navigate('PrivacyPolicy')}>
          {/* <Icon name="phone-message-outline"  type="material-community" color='white' size={24}/> */}
          <Text style={Style.screentxt}> Privacy Policy </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            (Style.tabstyle,
            {
              borderBottomColor: colors.blue,
              borderBottomWidth: 1,
              borderTopColor: colors.blue,
              borderTopWidth: 1,
              height: hp(9),
            })
          }>
          {/* <Icon name="logout-variant" color='white' type="material-community" size={24}/> */}
          <Text
            onPress={async () => {
              await AsyncStorage.removeItem('User');
              await AsyncStorage.clear().then(() =>
                console.log('Cleared ==+++++++++++'),
              );
              props.navigation.replace('Splash');
            }}
            style={Style.screentxt}>
            {' '}
            Logout{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Style = StyleSheet.create({
  topview: {
    height: hp(25),
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'row',
  },

  usertxt: {
    fontSize: 16,
    alignSelf: 'center',
    // fontWeight:'700',
    margin: 2,
    alignSelf: 'center',
  },
  tabstyle: {
    marginVertical: 5,
    borderTopColor: colors.blue,
    borderTopWidth: 1,
  },
  screentxt: {
    fontSize: 18,
    fontFamily: 'Raleway-bold',
    color: colors.blue,
    margin: hp(2),
  },
});
