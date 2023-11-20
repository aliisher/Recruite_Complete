import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../tools/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ActivityIndicator} from 'react-native-paper';
import URL from '../../tools/URL';
export default function Home({navigation}) {
  const [Loader, setLoader] = useState(false);
  const [User, setname] = useState('');
  useEffect(() => {
    getUser();
  }, []);
  const getUser = async () => {
    setLoader(true);
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
      .then(res => {
        setname(res.data.successData.user);
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
      });
  };

  const getProfile = async () => {
    setLoader(true);
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
        setname(res.data.successData.user);

        if (res.data.successData.user.profession == null) {
          navigation.navigate('Employee', {
            screen: 'EditProfile',
          });

          await AsyncStorage.setItem('filter', 'false');
          await AsyncStorage.setItem(
            'user_id',
            JSON.stringify(res.data.successData.user.id),
          );
        } else {
          navigation.navigate('Employee', {
            screen: 'EmployeeProfile',
          });

          await AsyncStorage.setItem('filter', 'false');
          await AsyncStorage.setItem(
            'user_id',
            JSON.stringify(res.data.successData.user.id),
          );
        }
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
      });
  };

  return (
    <View style={{flex: 1, alignContent: 'center', marginTop: hp(10)}}>
      <Text style={Style.mainText} numberOfLines={2}>
        Hello, {User && User != '' ? User.name : ''}
      </Text>
      <Text style={Style.txt}></Text>

      <TouchableOpacity onPress={() => getProfile()} style={Style.btn}>
        {Loader ? (
          <ActivityIndicator color={'white'} size={20} />
        ) : (
          <Text style={Style.btntxt}>MY PROFILE</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Employer');
        }}
        style={Style.btn2}>
        <Text style={Style.btntxt}>SEARCH PROFILES</Text>
      </TouchableOpacity>
    </View>
  );
}

const Style = StyleSheet.create({
  mainText: {
    fontSize: 33,
    // fontWeight:'700',
    fontFamily: 'Raleway-Bold',
    marginTop: 20,
    marginBottom: 20,
    // width:'100%',
    color: colors.black,
    alignSelf: 'center',
  },
  txt: {
    fontSize: wp(5),
    marginVertical: 5,
    color: colors.blue,
    alignSelf: 'center',
    marginBottom: hp(20),
  },
  btn: {
    height: hp(11),
    width: wp(75),
    backgroundColor: colors.black,
    marginTop: hp(5),
    alignSelf: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntxt: {
    color: colors.white,
    fontSize: hp(3),
    fontWeight: '700',
    fontFamily: 'raleway-bold',
  },
  btn2: {
    height: hp(11),
    width: wp(75),
    backgroundColor: colors.blue,
    marginTop: hp(5),
    alignSelf: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
