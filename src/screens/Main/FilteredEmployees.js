import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
  TextInput,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../tools/color';
import {
  NavigationContainer,
  useLinkProps,
  DrawerActions,
} from '@react-navigation/native';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URL from '../../tools/URL';
import {BackHandler} from 'react-native';
import Toast from 'react-native-simple-toast';
let arr = [];
export default function FilteredEmployees({route, navigation}) {
  const {alluser, skills} = route.params;
  const [refresh, setrefresh] = useState('');
  const [nameuser, setname] = useState('');
  const [showskills, setshowskills] = useState(skills);
  const [logeduser, setlogeduser] = useState('');
  const [myUser, setMyUser] = useState();

  const shareOptions = {
    title: 'Recruit Me',
    message: `Here ${nameuser}  is an IT Employee at Right App when you install the app you can get more skilled employees at 'Sample Url placed Here' `, // Note that according to the documentation at least one of "message" or "url" fields is required
    url: 'https://www.whatsapp.com/',
    subject: 'You can find and IT Skils developers using this app',
  };

  const getemploye = async mytxt => {
    const Auth = await AsyncStorage.getItem('AuthToken');

    let formdata = new FormData();
    formdata.append('profession', mytxt);

    axios
      .post(URL + '/search-profiles', formdata, {
        headers: {Authorization: 'Bearer '.concat(Auth)},
      })
      .then(response => {
        response.data.successData.users.map(item => {
          route.params.alluser.users.push(item);
        });

        setrefresh(route.params.alluser.users);
      })
      .catch(error => {});
  };

  const myuseraction = async () => {
    const myuser = JSON.parse(await AsyncStorage.getItem('User'));
    setMyUser(myuser);
    setlogeduser(myuser.uid);
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () =>
      handleBackButtonClick(),
    );

    myuseraction();
  }, [nameuser]);
  const handleBackButtonClick = () => {
    navigation.goBack(null);
    return true;
  };

  const NavigateToChat = clicked => {
    console.log('this si clickedddddd...', clicked);
    const checkReceivers = clicked.receivers.find(
      item =>
        item.sender_id == JSON.stringify(myUser.id) &&
        item.receiver_block == 'true',
    );
    const checkSenders = clicked.senders.find(
      item =>
        item.receiver_id == JSON.stringify(myUser.id) &&
        item.sender_block == 'true',
    );
    console.log('this is check recievers', checkReceivers);
    console.log('this is check senders', checkSenders);
    if (
      checkReceivers != undefined &&
      checkReceivers.receiver_block == 'true'
    ) {
      Toast.show('You are blocked');
    } else if (
      checkSenders != undefined &&
      checkSenders.sender_block == 'true'
    ) {
      Toast.show('You are blocked');
    } else {
      navigation.navigate('Msg', {
        myuser: logeduser,
        uid: clicked.uid,
        name: clicked.name,
        sendId: clicked.id,
      });
    }
  };

  return (
    <View style={{flex: 1, alignContent: 'center'}}>
      <View
        style={{
          height:
            Platform.OS == 'ios'
              ? DeviceInfo.hasNotch()
                ? 100
                : hp(10)
              : hp(10),
          headerMode: 'none',
          flexDirection: 'row',
          justifyContent: 'space-between',
          //  top: Platform.OS == 'ios' ? (DeviceInfo.hasNotch() ? 200 : 0) : 0,
          backgroundColor: colors.blue,
        }}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <Image
            source={require('../../screens/asset/drawer0.png')}
            style={{margin: hp(3), marginTop: hp(4)}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            marginRight: wp(20),
            marginTop: hp(0),
            height: hp(5.2),
            justifyContent: 'space-evenly',
            alignSelf: 'center',
            borderColor: 'grey',
            borderRadius: 15,
            borderWidth: 0.5,
            width: wp(70),
            backgroundColor: 'white',
            alignSelf: 'center',
          }}>
          <TextInput
            placeholder={'Your Address'}
            editable={false}
            autoCompleteType={'street-address'}
            style={{height: 40, width: wp(50), alignSelf: 'center'}}
            onChangeText={text => getemploye(text)}
            // value={value}
          />
          <Icon
            name="tune-vertical"
            type="material-community"
            //color={colors.main}
            // onPress={()=>navigation.goBack()}
            size={30}
            style={{
              marginTop: 6,
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', marginTop: 0}}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {showskills.map(item => (
            <TouchableOpacity
              onPress={() => navigation.navigate('FilteredEmployees')}
              style={Style.btn}>
              <Text style={Style.btntxt}>{item}</Text>
              {/* <Icon  color={'white'} size={21} style={{padding:5,marginRight:5}} name="close" onPress={()=>ondel(item)} type="material-community" /> */}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{marginTop: 20}}></View>
      <View style={Style.opcbtn}>
        <ScrollView style={{marginBottom: '20%'}}>
          {route.params.alluser.length > 0 ? (
            route.params.alluser.map(item => (
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: 'grey',
                  width: '100%',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={async () => {
                    // await AsyncStorage.setItem('filter', 'true');

                    // await AsyncStorage.setItem(
                    //   'user_id',
                    //   JSON.stringify(item.id),
                    // );

                    // navigation.navigate('EmployeeProfile', {
                    //   userInfo: item,
                    //   filter: true,
                    // });
                    console.log('profilepress par item ', item);
                    await AsyncStorage.setItem('filter', 'true');
                    await AsyncStorage.setItem(
                      'user_id',
                      JSON.stringify(item.id),
                    );

                    const checkReceivers = item.receivers.find(
                      item =>
                        item.sender_id == JSON.stringify(myUser.id) &&
                        item.receiver_block == 'true',
                    );
                    const checkSenders = item.senders.find(
                      item =>
                        item.receiver_id == JSON.stringify(myUser.id) &&
                        item.sender_block == 'true',
                    );
                    console.log('this is check recievers', checkReceivers);
                    console.log('this is check senders', checkSenders);
                    if (
                      checkReceivers != undefined &&
                      checkReceivers.receiver_block == 'true'
                    ) {
                      navigation.navigate('EmployeeProfile', {
                        userInfo: item,
                        filter: true,
                        blocked: true,
                      });
                    } else if (
                      checkSenders != undefined &&
                      checkSenders.sender_block == 'true'
                    ) {
                      navigation.navigate('EmployeeProfile', {
                        userInfo: item,
                        filter: true,
                        blocked: true,
                      });
                    } else {
                      navigation.navigate('EmployeeProfile', {
                        userInfo: item,
                        filter: true,
                        blocked: false,
                      });
                    }
                  }}>
                  <View style={{flexDirection: 'row', marginBottom: 20}}>
                    <Image
                      size={100}
                      source={
                        item.image != null
                          ? {uri: item.image}
                          : require('../../assets/mypic.jpeg')
                      }
                      style={{height: 50, borderRadius: 30, top: 4, width: 50}}
                    />
                    <View style={{padding: 5, marginLeft: 20}}>
                      <Text style={Style.usertxt}>{item.name}</Text>
                      <Text style={{fontSize: 12}}>{item.profession}</Text>
                      <Text style={{fontSize: 12}}>
                        {item.designation != null ? item.designation : 'Fresh'}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Raleway-SemiBold',
                          color: colors.blue,
                          fontSize: 16,
                        }}>
                        Exp: PKR {item.expected_salary}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => NavigateToChat(item)}>
                      <Image
                        source={require('../asset/msg.png')}
                        style={{
                          height: 28,
                          borderRadius: 30,
                          top: 6,
                          width: 28,
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setname(item.name);
                        Share.share(
                          {
                            title: 'Recruit Me',
                            message: `Here ${
                              item.name
                            } is an Employee at Recruitme app. Install the application to see and contact with more employees to find the perfect employee ${'https://play.google.com/store/apps/details?id=com.rightapp'}  `, // Note that according to the documentation at least one of "message" or "url" fields is required
                            url: 'https://www.whatsapp.com/',
                            subject:
                              'You can find and IT Skils developers using this app',
                          },
                          {
                            // Android only:
                            dialogTitle: 'Share your profile',
                            // iOS only:
                            excludedActivityTypes: [
                              'com.apple.UIKit.activity.PostToTwitter',
                            ],
                          },
                        );
                      }}>
                      <Image
                        source={require('../../assets/share.png')}
                        style={{
                          width: 20,
                          height: 20,
                          marginRight: 5,
                          top: 10,
                          left: 5,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  {item.availability == 'unavailable' ? (
                    <Text style={{marginLeft: 10, top: 10}}>N/A</Text>
                  ) : (
                    <Text style={{marginLeft: 10, top: 10}}></Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: hp(9),
              }}>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'center'}}>
                No Employee against
              </Text>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'center'}}>
                {' '}
                your search
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const Style = StyleSheet.create({
  mainText: {
    fontSize: wp(8),
    fontWeight: '700',
    marginTop: 20,
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
    margin: 3,
    height: 30,
    backgroundColor: colors.blue,
    //   marginTop:hp(5),
    alignSelf: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btntxt: {
    color: colors.white,
    fontSize: 13,
    paddingHorizontal: 20,
  },
  btn2: {
    height: hp(12),
    width: wp(75),
    backgroundColor: colors.blue,
    marginTop: hp(5),
    alignSelf: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usertxt: {
    fontFamily: 'Raleway-SemiBold',
    color: colors.blue,
    fontSize: 18,
  },
  opcbtn: {
    margin: 10,
    justifyContent: 'space-between',
    //  flexDirection:'row',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.blue,
  },
});
