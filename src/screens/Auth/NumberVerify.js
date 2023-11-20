import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  BackHandler,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../tools/color';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import axios from 'axios';
import URL from '../../tools/URL';

const CELL_COUNT = 4;

export default function NumberVerify({navigation, route}) {
  const [value, setValue] = useState('');
  const [codevalue, setcodevalue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [propss, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const {code, name, user} = route.params;
  const [loader, setloader] = useState(false);
  useEffect(() => {
    navigation.addListener('focus', () => {
      // do something
      setcodevalue(code);
    });
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
    );
    return () => backHandler.remove();
  }, []);
  const handleBackButtonClick = () => {
    return true;
  };
  const Resend = () => {
    setloader(true);
    const formdata = new FormData();
    formdata.append('email', user.email);
    formdata.append('notification_token', user.notification_token);

    axios
      .post(URL + '/user-login', formdata)
      .then(async response => {
        Alert.alert(' OTP Resend Successfully !');
        setloader(false);
        setcodevalue(JSON.stringify(response.data.successData.code));

        //     }
      })
      .catch(error => {
        // alert('Please SignUp')
        Toast.show(error.response.data.message);
        setloader(false);
        setloader(false);
      });
  };

  const verify = async () => {
    if (value == codevalue) {
      await AsyncStorage.setItem('OTP', JSON.stringify(true));
      navigation.replace('Drawer', {
        code: 10,
        name: name,
      });
    } else {
      alert('Invalid Code Entered');
    }
  };

  const autoVerify = async val => {
    setValue(val);
    if (val == codevalue) {
      await AsyncStorage.setItem('OTP', JSON.stringify(true));
      navigation.replace('Drawer', {
        code: 10,
        name: name,
      });
    } else {
      console.log('Invalid Code Entered');
    }
  };

  const moveon = async () => {
    const gtg = await AsyncStorage.getItem('AuthToken');
    if (gtg == null) {
      navigation.navigate('Login');
    }
  };

  setInterval(() => {
    moveon();
  }, 3000000000);

  return (
    <ScrollView>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('../../assets/recruitme_icon.png')}
          resizeMode={'contain'}
          style={{height: hp(20), width: wp(20)}}
        />
        <View style={Style.Container}>
          <Text style={Style.mainText}>Welcome</Text>
          <Text style={Style.txt}>Email has been sent successfully</Text>
          <Text style={{fontSize: 16, color: 'white', alignSelf: 'center'}}>
            Note:
          </Text>

          <Text
            style={{
              width: '100%',
              fontSize: wp(3),
              fontFamily: 'raleway-regular',
              marginTop: 5,
              color: colors.white,
              alignSelf: 'center',
            }}>
            If you are unable to find email,
          </Text>
          <Text
            style={{
              width: '100%',
              fontSize: wp(3),
              fontFamily: 'raleway-regular',
              marginTop: 5,
              color: colors.white,
              alignSelf: 'center',
            }}>
            {' '}
            -Recheck provided email address
          </Text>
          <Text
            style={{
              width: '100%',
              fontSize: wp(3),
              fontFamily: 'raleway-regular',
              fontWeight: 'bold',
              marginTop: 5,
              color: colors.white,
              alignSelf: 'center',
            }}>
            {' '}
            -Check the Spam/Junk/Promotion/folder in your Inbox
          </Text>
          {loader ? <ActivityIndicator size={20} color={'white'} /> : <></>}
          <View style={Style.code}>
            <CodeField
              //ref={ref}
              value={value}
              onChangeText={autoVerify}
              cellCount={CELL_COUNT}
              rootStyle={Style.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
                <Text
                  key={index}
                  style={[Style.cell, isFocused && Style.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
          </View>

          <TouchableOpacity onPress={() => verify()} style={Style.btn}>
            <Text style={Style.btntxt}>VERIFY</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <Text style={{color: colors.green}}>Don't receive the code?</Text>
          <Text
            onPress={() => Resend()}
            style={{textDecorationLine: 'underline'}}>
            {' '}
            Resend{' '}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const Style = StyleSheet.create({
  Container: {
    paddingHorizontal: wp(-2),
    paddingBottom: 20,
    backgroundColor: colors.blue,
    borderRadius: 10,
    marginTop: hp(2),
  },
  mainText: {
    fontFamily: 'raleway-bold',
    width: wp(40),
    fontSize: wp(8),
    fontWeight: '700',
    marginTop: 20,
    color: colors.white,
    alignSelf: 'center',
  },
  txt: {
    width: '100%',
    fontSize: wp(4),
    fontFamily: 'raleway-regular',
    marginTop: 5,
    color: colors.white,
    alignSelf: 'center',
  },
  inputview: {
    height: hp(7),
    borderColor: colors.white,
    borderBottomWidth: 1,
    width: wp(80),
    color: colors.white,
    paddingLeft: 5,
  },
  btn: {
    height: 60,
    width: wp(55),
    backgroundColor: colors.black,
    marginTop: hp(2),
    alignSelf: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntxt: {
    color: colors.white,
    fontSize: hp(2.5),
    fontWeight: '700',
    fontFamily: 'raleway-bold',
  },
  codeFieldRoot: {marginTop: 20, borderRadius: 30},
  cell: {
    width: 65,
    height: 65,
    lineHeight: 38,
    fontSize: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.main,
    textAlign: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 5,
    overflow: 'hidden',
    alignSelf: 'center',
    paddingTop: 10,
  },
  focusCell: {
    borderColor: colors.darkgray,
    borderRadius: 10,
    paddingTop: 10,
  },
  code: {
    marginHorizontal: wp(10),
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: hp(2),
  },
});
