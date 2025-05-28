import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  TextInput,
  BackHandler,
  ActivityIndicator,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../tools/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import URL from '../../tools/URL';
import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info';
import {Icon} from 'react-native-elements';
import {DrawerActions} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import timer from 'react-native-timer';

let userArr = [];
let onEndReachedCalledDuringMomentum = false;
const AllEmployees = ({navigation}) => {
  const [allusers, setallusers] = useState([]);
  const [Lastpage, setLastpage] = useState(20);
  const [page, setpage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [myUser, setMyUser] = useState();
  const [totalUsers, setTotalUsers] = useState(0);

  // useFocusEffect(
  //   useCallback(() => {
  //     getUserData();
  //     BackHandler.addEventListener('hardwareBackPress', () =>
  //       handleBackButtonClick(),
  //     );

  //     if (page == 1) {
  //       timer.setInterval(
  //         'messageTimer',
  //         () => {
  //           getalluser();
  //         },
  //         10000,
  //       );
  //     }
  //     return () => timer.clearInterval('messageTimer');
  //   }, []),
  // );

  useEffect(() => {
    getUserData();
    if (page == 1) {
      getalluser();
    }
  }, [allusers]);

  const getalluser = async () => {
    if (!loading && page <= Lastpage) {
      setLoading(true);
      const AuthToken = await AsyncStorage.getItem('AuthToken');
      axios
        .get(URL + `/profiles?page=${page}`, {
          headers: {
            Authorization: 'Bearer '.concat(AuthToken),
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          setLastpage(response.data.successData.last_page);
          setTotalUsers(response.data.successData.total);
          setallusers(state => [...state, ...response.data.successData.users]);
          setpage(page + 1);
          setLoading(false);
        })
        .catch(error => {})
        .finally(() => {});
    } else {
      Toast.show('no more data to load');
    }
  };

  const getUserData = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('User'));
    setMyUser(user);
  };

  const NavigateToChat = clicked => {
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
        myuser: myUser.uid,
        uid: clicked.uid,
        name: clicked.name,
        sendId: clicked.id,
      });
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignContent: 'center',
        paddingBottom: 20,
      }}>
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
          onPress={() => navigation.navigate('Filter')}
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
            alignItems: 'center',
          }}>
          <TextInput
            placeholder={'Search for Employees'}
            editable={false}
            autoCompleteType={'street-address'}
            style={{
              height: 40,
              width: wp(50),
              alignSelf: 'center',
              fontSize: hp(1.8),
            }}
          />
          <Icon
            name="magnify"
            type="material-community"
            size={25}
            style={{
              alignSelf: 'center',
            }}
          />
          <Icon
            name="tune-vertical"
            type="material-community"
            size={25}
            style={{
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>
        {allusers?.length > 0 ? (
          <>
            <View style={Style.totalUsersContainer}>
              <Text style={Style.totalUsersText}>
                Total Employees: {totalUsers}
              </Text>
            </View>
            <FlatList
              data={allusers}
              showsVerticalScrollIndicator={false}
              // renderItem={(item)=>renderCard(item)}
              // initialNumToRender = {10}
              onEndReachedThreshold={0.5}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum = false;
              }}
              onEndReached={() => {
                if (!onEndReachedCalledDuringMomentum) {
                  getalluser(); // LOAD MORE DATA
                  onEndReachedCalledDuringMomentum = true;
                }
              }}
              renderItem={({item}) => (
                <TouchableOpacity key={item.id}>
                  <View style={Style.opcbtn}>
                    <TouchableOpacity
                      // style={{backgroundColor:'pink',width:"70%"}}
                      onPress={async () => {
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
                        // navigation.navigate('EmployeeProfile', {
                        //   userInfo: item,
                        //   filter: true,
                        // });
                      }}>
                      <View style={{flexDirection: 'row', marginBottom: 20}}>
                        {item.image != null ? (
                          <Image
                            size={100}
                            source={{uri: item.image}}
                            style={{height: 50, borderRadius: 30, width: 50}}
                          />
                        ) : (
                          <Image
                            size={100}
                            source={require('../../assets/mypic.jpeg')}
                            style={{height: 50, borderRadius: 30, width: 50}}
                          />
                        )}
                        {/* <Image size={100} source={{uri:item.image}} style={{height:50,borderRadius:30 ,width:50}}  /> */}
                        <View
                          style={{padding: 5, width: '70%', marginLeft: 10}}>
                          <Text style={Style.usertxt}>{item.name}</Text>
                          <Text style={{fontSize: 12, width: '100%'}}>
                            {item.profession}
                          </Text>
                          <Text style={{fontSize: 12}}>
                            {item.designation != null
                              ? item.designation
                              : 'Fresh'}
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Raleway-SemiBold',
                              color: colors.blue,
                              fontSize: 16,
                            }}>
                            Exp:{' '}
                            {item.symbol == '' || item.symbol == null
                              ? 'PKR'
                              : item.symbol}{' '}
                            {item.expected_salary}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        onPress={() => {
                          NavigateToChat(item);
                        }}>
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

                      {/* <Image source={require('../asset/msg.png')} 
                    style={{height:30,borderRadius:30,top:7 ,width:30}} /> */}
                      <TouchableOpacity
                        onPress={() => {
                          //  setname(item.name);

                          Share.share(
                            {
                              title: 'Recruit Me',
                              message: `Here ${
                                item.name
                              } is an Employee at Recruitme app. Install the application to see and contact with more employees to find the perfect employee ${'https://play.google.com/store/apps/details?id=com.rightapp'} `, // Note that according to the documentation at least one of "message" or "url" fields is required
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
                      {/* <Icon size={12} name="navigation"  color={colors.blue} reverse={true} type="meterial-community"  style={{transform: [{rotate: '0deg'}]}} /> */}
                    </View>

                    {/* <TouchableOpacity  onPress={()=>navigation.navigate('Msg',{ myuser:logeduser,uid:item.uid,name:item.name })}>
           
                   <Image source={require('../asset/msg.png')} 
                    style={{height:45,borderRadius:30 ,width:45}} />
                    </TouchableOpacity> */}
                  </View>
                  <View style={{position: 'absolute', right: 10, top: '50%'}}>
                    {item.availability == 'unavailable' ? (
                      <Text style={Style.rowtxt}>N/A</Text>
                    ) : (
                      <Text style={Style.rowtxt}></Text>
                    )}
                    {/* <Text style={Style.rowtxt2}>Availability</Text> */}
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
            />
          </>
        ) : (
          <Text style={{alignSelf: 'center', top: '30%', color: 'grey'}}>
            No Profiles Created Yet!
          </Text>
        )}
      </View>
    </View>
  );
};

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
    height: hp(12),
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
    fontSize: hp(3.5),
    fontWeight: '700',
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
    margin: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.blue,
  },
  totalUsersContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  totalUsersText: {
    fontSize: 16,
    color: colors.blue,
    fontFamily: 'Raleway-SemiBold',
  },
});

export default AllEmployees;
