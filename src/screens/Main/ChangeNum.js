import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import Myinput from '../../components/input';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../tools/color';
import URL from '../../tools/URL';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ActivityIndicator} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

export default function ChangeNum({navigation}) {
  const [Number, setNumber] = useState('');
  const [NewNumber, setNewNumber] = useState('');
  const [ConfirmNumber, setConfirmNumber] = useState('');
  const [loader, setloader] = useState('');
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () =>
      handleBackButtonClick(),
    );
  }, []);
  const handleBackButtonClick = () => {
    navigation.goBack(null);

    return true;
  };
  const Myphone = async () => {
    const MyMobile = JSON.parse(await AsyncStorage.getItem('User'));

    const AuthToken = await AsyncStorage.getItem('AuthToken');

    if (Number === MyMobile.email) {
      if (NewNumber === ConfirmNumber) {
        setloader(true);
        const formdata = new FormData();
        formdata.append('email', NewNumber);
        axios
          .post(URL + '/change-number', formdata, {
            headers: {Authorization: 'Bearer '.concat(AuthToken)},
          })
          .then(async response => {
            auth()
              .signInWithEmailAndPassword(Number, '7250043')
              .then(function (userCredential) {
                userCredential.user.updateEmail(NewNumber);
              });
            setloader(false);
            Toast.show(response.data.message);
            //    JSON.stringify(response.data.successData.code);
            //    setcode(response.data.successData.code);
            //    await AsyncStorage.setItem('AuthToken' , response.data.successData.user.accessToken ),
            //    navigation.navigate('NumberVerify', {
            //     code: JSON.stringify(response.data.successData.code),
            //     otherParam: 10,
            //   });
            AsyncStorage.clear();
            navigation.navigate('Login');
            // alert("Phone Number is changed successfully. Please Login with new phone number")
          })
          .catch(error => {
            setloader(false);
            Toast.show(error.response.data.message);
          });
      } else {
        alert('Please Enter the same email');
      }
    } else {
      alert('please enter the correct email');
    }
  };
  return (
    <View style={{flex: 1, margin: 20}}>
      <Myinput
        title={'Current Email'}
        titleStyles={Style.txt}
        Placeholder="Enter Current Email"
        OnChange={text => setNumber(text)}
        Value={Number}
        KeyboardType={'email-address'}
        Styles={Style.inputview}
      />
      <Myinput
        title={'New Email'}
        titleStyles={Style.txt}
        Placeholder="Enter New Email"
        OnChange={text => setNewNumber(text)}
        Value={NewNumber}
        KeyboardType={'email-address'}
        Styles={Style.inputview}
      />
      <Myinput
        title={'Confirm New Email'}
        titleStyles={Style.txt}
        Placeholder="Confirm New Email"
        OnChange={text => setConfirmNumber(text)}
        Value={ConfirmNumber}
        KeyboardType={'email-address'}
        Styles={Style.inputview}
      />

      <TouchableOpacity onPress={() => Myphone()} style={Style.btn}>
        {loader ? (
          <ActivityIndicator size={20} color={'white'} />
        ) : (
          <Text style={Style.btntxt}>Apply</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const Style = StyleSheet.create({
  txt: {
    width: '100%',
    fontSize: 13,
    fontFamily: 'Raleway-medium',
    color: colors.blue,
    alignSelf: 'center',
    marginTop: hp(4),
  },
  inputview: {
    height: 40,
    borderColor: colors.blue,
    borderBottomWidth: 1,
    width: wp(90),
    color: colors.blue,
  },
  btn: {
    height: 50,
    width: wp(55),
    backgroundColor: colors.blue,
    marginVertical: hp(2),
    alignSelf: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(10),
  },
  btntxt: {
    color: colors.white,
    fontSize: hp(2.5),
    fontWeight: '700',
  },
});
