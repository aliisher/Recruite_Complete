import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../tools/color';
import axios from 'axios';
import URL from '../../tools/URL';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import Recaptcha from 'react-native-recaptcha-that-works';
import {recaptchaSiteKey} from '../../tools/secrets';

export default function Login({navigation}) {
  const handleBackButtonClick = () => {
    BackHandler.exitApp();
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
    );
    return () => backHandler.remove();
  }, []);

  const recaptcha = useRef();

  const [phone, setphone] = useState('');
  const [code, setcode] = useState('');
  const [loader, setloader] = useState(false);
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [Password, setPassword] = useState('');
  const [FBToken, setFirebaseToken] = useState();

  useEffect(() => {
    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        setFirebaseToken(token.token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  }, []);

  const openRecaptcha = () => {
    recaptcha.current.open();
  };

  const onVerify = token => {
    if (token) {
      APICall();
    }
  };
  const APICall = async () => {
    Keyboard.dismiss();
    setloader(true);
    const formdata = new FormData();
    formdata.append('email', email);
    formdata.append('notification_token', FBToken);
    console.log('form data chala', formdata);
    axios
      .post(URL + '/user-login', formdata, {
        headers: {
          Accept: 'application/json', // Adjust the content type based on your API requirements
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async response => {
        console.log('user-login response', response?.data);
        await AsyncStorage.setItem(
          'AuthToken',
          response.data.successData.user.accessToken,
        );
        // await AsyncStorage.setItem('u',response.data.successData.user.accessToken)
        JSON.stringify(response.data.successData.code);
        setcode(response.data.successData.code);
        await AsyncStorage.setItem(
          'User',
          JSON.stringify(response.data.successData.user),
        );
        setloader(false);
        console.log(
          'check the login user email',
          response.data.successData.user.email,
        );
        //this check is for only this email for google playstore testing requirements
        if (
          response.data.successData.user.email != 'mohib.ranglerz@gmail.com'
        ) {
          navigation.replace('NumberVerify', {
            code: JSON.stringify(response.data.successData.code),
            name: response.data.successData.user.name,
            user: response.data.successData.user,
          });
        } else {
          navigation.replace('Drawer', {
            code: 10,
            name: 'Mohib',
          });
        }
      })
      .catch(error => {
        // alert('Please SignUp')
        console.log('@erorr', error);
        if (('errrror', error?.response?.status == 400)) {
          Toast.show('First Register your account');
        }
        // Toast.show(error.response.data.message);
        setloader(false);
      });
  };

  const login = () => {
    const emailRegex =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (email == '') {
      Toast.show('Please Enter Your Email');
    } else if (!emailRegex.test(email)) {
      Toast.show('Please Enter Valid Email');
    } else if (email == 'mohib.ranglerz@gmail.com') {
      APICall();
    } else {
      openRecaptcha();
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Recaptcha
        ref={recaptcha}
        siteKey={recaptchaSiteKey}
        baseUrl={'https://recruitme.pk'}
        onVerify={onVerify}
        size="normal"
        onError={error => Alert.alert('Something went wrong!')}
        onExpire={expire => console.log('expire', expire)}
      />
      <Image
        source={require('../../assets/recruitme_icon.png')}
        resizeMode={'contain'}
        style={{height: hp(18), alignSelf: 'center', bottom: 20, width: wp(20)}}
      />
      <View style={Style.Container}>
        <Text style={Style.mainText}>Welcome</Text>
        <Text style={Style.txt}>Please login to your account</Text>
        <View style={{marginTop: wp(2)}}>
          <Text style={Style.txt}>Email</Text>
          <TextInput
            style={Style.inputview}
            onChangeText={text => setemail(text)}
            value={email}
            keyboardType={'email-address'}
            placeholderTextColor={'#dedede'}
            placeholder={'sample@gmail.com'}
          />
        </View>
        {/* <View style={{marginTop:wp(2)}}>
                <Text style={Style.txt}>Password</Text>
                    <TextInput style={Style.inputview} 
                     onChangeText={(text)=>setPassword(text)}
                     value={Password}
                     secureTextEntry={true}
                    placeholderTextColor={'#dedede'} 
                    placeholder={'+92...'} 
                    />
               </View>  */}
        <TouchableOpacity onPress={() => login()} style={Style.btn}>
          {loader ? (
            <ActivityIndicator size={20} color={'white'} />
          ) : (
            <Text style={Style.btntxt}>LOGIN</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <Text style={{color: colors.green}}>Don't have an account?</Text>
        <Text
          onPress={() => navigation.replace('SignUp')}
          style={{textDecorationLine: 'underline'}}>
          Register Now
        </Text>
      </View>
    </View>
  );
}

const Style = StyleSheet.create({
  Container: {
    paddingHorizontal: wp(7),
    // height:hp(70),
    paddingVertical: hp(2),
    backgroundColor: colors.blue,
    borderRadius: 10,
    marginTop: -20,
  },
  mainText: {
    width: wp(40),
    fontSize: wp(8),
    fontFamily: 'raleway-bold',
    fontWeight: '700',
    marginTop: 20,
    color: colors.white,
    alignSelf: 'center',
  },
  txt: {
    width: '100%',
    fontFamily: 'raleway-regular',
    fontSize: wp(4),
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
    marginTop: hp(7),
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
});
