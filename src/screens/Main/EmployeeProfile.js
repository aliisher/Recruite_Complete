import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Share,
  StyleSheet,
  BackHandler,
  FlatList,
  ScrollView,
  TouchableOpacity,
  AppState,
} from 'react-native';
import colors from '../../tools/color';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import URL from '../../tools/URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-simple-toast';

let EduArr = [];
let skillArr = [];
let achirvementArr = [];
export default function EmployeeProfile({route, navigation}) {
  // console.log('route.params ka data check', route.params, navigation);
  // const {blocked} = route.params;
  const [change, setchange] = useState(false);
  const [show, setshow] = useState(false);
  const [data, setdata] = useState('');
  const [logeduser, setlogeduser] = useState(false);
  const [myedu, setmyedu] = useState([]);
  const [myskill, setmyskill] = useState([]);

  const [filter, setfilter] = useState('false');
  const [loader, setloader] = useState(false);
  const [PhonePermision, setPhonePermision] = useState(null);
  const [pdfShow, setPdfShow] = useState(false);

  const shareOptions = {
    title: 'Recruit Me',
    message: `Here ${
      data && data.name != null ? data.name : 'user'
    } is an Employee at Recruitme app. Install the application to see and contact with more employees to find the perfect employee ${'https://play.google.com/store/apps/details?id=com.rightapp'} `, // Note that according to the documentation at least one of "message" or "url" fields is required
    url: 'https://www.whatsapp.com/',
    subject: 'You can find and IT Skils developers using this app',
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getprofileDetail();
    });
  }, [filter]);

  const ontogel = () => {
    Share.share(shareOptions, {
      // Android only:
      dialogTitle: 'Share your profile',
      // iOS only:
      excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
    });
  };

  const getprofileDetail = async () => {
    let data = await AsyncStorage.getItem('filter');
    let permissionPhone = await AsyncStorage.getItem('PhonePermision');
    setPhonePermision(PhonePermision);
    setfilter(data);
    setlogeduser(true);
    const AuthToken = await AsyncStorage.getItem('AuthToken');
    let frmdata = new FormData();
    frmdata.append('user_id', await AsyncStorage.getItem('user_id'));
    const config = {
      headers: {
        Authorization: 'Bearer '.concat(AuthToken),
        'Content-Type':
          'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
      },
    };

    axios
      .post(URL + '/profile-detail', frmdata, config)
      .then(res => {
        EduArr = [];
        achirvementArr = [];
        skillArr = [];
        setdata(res.data.successData.user);
        console.log('This is profile details users', res.data.successData.user);
        res.data.successData.user.degrees.map(item => {
          // setEduArr([...EduArr, item]);
          EduArr.push(item);
        });

        res.data.successData.user.achievements.map(item => {
          // setEduArr([...EduArr, item]);
          console.log('achivement state u=in component', achirvementArr);
          console.log('achivement state from back component', item.achievement);

          if (
            achirvementArr.findIndex(
              el => el.toLowerCase() == item.achievement.toLowerCase(),
            ) == -1
          )
            achirvementArr.push(item.achievement);
        });
        res.data.successData.user.skills.map(item => {
          skillArr.push(item);
        });

        // setloader(false)
        setmyedu(EduArr);
        setmyskill(skillArr);
        setlogeduser(false);
      })
      .catch(error => {
        // setloader(false)

        console.error('Eror Message', JSON.parse(JSON.stringify(error)));
        setlogeduser(false);
      });
  };

  const moveTomsg = async () => {
    const LogedinUser = JSON.parse(await AsyncStorage.getItem('User'));
    if (route.params.blocked != true) {
      if (LogedinUser.uid != data.uid) {
        navigation.navigate('Msg', {
          myuser: LogedinUser.uid,
          uid: data.uid,
          name: data.name,
          sendId: data.id,
        });
      }
    } else {
      Toast.show('You are Blocked');
    }
  };
  return (
    <View style={{flex: 1, marginVertical: hp(1)}}>
      <ScrollView>
        <View style={{flexDirection: 'row-reverse'}}>
          <TouchableOpacity onPress={() => ontogel()}>
            <Image
              source={require('../../assets/share.png')}
              style={{width: 25, height: 25, marginRight: 10}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Inbox')}>
            <Image
              source={require('../../screens/asset/msg.png')}
              style={{width: 25, height: 25, marginRight: 5}}
            />
          </TouchableOpacity>
        </View>
        <Image
          size={100}
          source={{uri: data && data.image}}
          style={{height: 80, alignSelf: 'center', borderRadius: 60, width: 80}}
        />
        <View style={{alignItems: 'center'}}>
          <View>
            <Text
              style={
                (Style.usertxt,
                {
                  color: colors.blue,
                  fontSize: 36,
                  fontWeight: '600',
                  alignSelf: 'center',
                  fontFamily: 'Raleway-Bold',
                })
              }>
              {data && data.name}
            </Text>

            <Text
              style={
                (Style.usertxt,
                {
                  color: colors.blue,
                  fontSize: 16,
                  fontWeight: '600',
                  alignSelf: 'center',
                  // fontFamily: 'Raleway-Bold',
                })
              }>
              Age : {data && data.age}
            </Text>
            {/* {console.log('phone permisson', data.phone_visibility)} */}

            {logeduser ? (
              <ActivityIndicator size={22} color={'blue'} />
            ) : (
              <Text></Text>
            )}
            <Text
              style={
                (Style.usertxt,
                {
                  color: colors.black,
                  alignSelf: 'center',
                  fontFamily: 'Raleway-regular',
                })
              }>
              {data && data.designation}
            </Text>
            <Text
              style={
                (Style.usertxt,
                {
                  color: colors.black,
                  alignSelf: 'center',
                  fontFamily: 'Raleway-regular',
                })
              }>
              {data && data.country != null ? data.country : ''}
              {', '}
              {data && data.city != null ? data.city : ''}
            </Text>
          </View>
          <View style={{margin: 20}}>
            <Text style={{lineHeight: hp(2.2), fontFamily: 'Raleway-regular'}}>
              {data && data.description}
            </Text>
            <View
              style={{
                borderColor: 'black',
                borderBottomWidth: 0.3,
                margin: 10,
              }}></View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View style={Style.row}>
              <Text style={Style.rowtxt}>{data && data.experience} Years</Text>
              <Text style={Style.rowtxt2}>Experience</Text>
            </View>

            <View style={Style.row}>
              <Text style={Style.rowtxt}>
                {data && data.expected_salary
                  ? `${data.symbol}${data.expected_salary}`
                  : 'N/A'}
              </Text>
              <Text style={Style.rowtxt2}>Expected Salary</Text>
            </View>

            <View style={{paddingHorizontal: 10}}>
              {data && data.availability == 'unavailable' ? (
                <Text style={Style.rowtxt}>N/A</Text>
              ) : (
                <Text style={Style.rowtxt}>{data && data.availability}</Text>
              )}
              <Text style={Style.rowtxt2}>Availability</Text>
            </View>
          </View>
          {filter == 'true' ? (
            <View style={{flexDirection: 'row', marginTop: hp(5)}}>
              <TouchableOpacity
                onPress={() => moveTomsg()}
                style={Style.Msgbox2}>
                <Text
                  style={{
                    paddingHorizontal: hp(2),
                    marginTop: 2,
                    color: colors.white,
                  }}>
                  MESSAGE
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text></Text>
          )}

          {/* {change?
      
             :
             <View style={{flexDirection:'row',marginTop:hp(5)}}>
             <View style={Style.Msgbox}>
                  <Text style={{paddingHorizontal:hp(2),marginTop:2,color:colors.white}}>MESSAGE</Text>
                  <Icon color={colors.white} style={{paddingHorizontal:20}} name="message" type="metterial-community" />
             </View>
             
                <Text style={{marginLeft:wp(2),marginTop:hp(1.5),color:colors.gray}}>N/A</Text>
             
             </View>
             }
              */}
        </View>

        <View
          style={{
            borderColor: 'black',
            borderTopWidth: 0.2,
            margin: 10,
          }}></View>

        <View style={{marginTop: hp(3)}}>
          <Text style={Style.heading}>Employment Details</Text>
          {/* <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-evenly',
              margin: wp(5),
            }}>
            <View style={{justifyContent:'center',alignItems:'center', width: '28%'}}>
              <Image source={require('../asset/company.png')} />
              <Text
                numberOfLines={2}
                style={{
                  // paddingLeft: 3,
                  // paddingBottom: 5,
                  fontFamily: 'Raleway-regular',
                }}>
                {data &&data.company}
              </Text>
            </View>
            <View style={{justifyContent:'center',alignItems:'center', width: '30%', marginRight: 10}}>
              <Image source={require('../asset/profession.png')} />
              <Text
                numberOfLines={2}
                style={{ fontFamily: 'Raleway-regular'}}>
                {data &&data.profession}
              </Text>
            </View>
            <View style={{justifyContent:'center',alignItems:'center',width: '30%'}}>
             
              <Text
                numberOfLines={2}
                style={{padding: 5, fontFamily: 'Raleway-regular'}}>
                {data &&data.current_salary}
              </Text>
              <Text style={Style.rowtxt2}>Current Salary</Text>
            </View>
          </View> */}
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              marginTop: 15,
              marginBottom: 15,
            }}>
            <View style={[Style.row, {width: '35%'}]}>
              <Image
                source={require('../asset/company.png')}
                style={{width: 15, height: 15}}
              />
              <Text
                style={[
                  Style.rowtxt,
                  {color: data.company != null ? 'black' : '#dedede'},
                ]}>
                {' '}
                {data && data.company != null ? data.company : 'N/A'}
              </Text>
              {/* <Text style={Style.rowtxt2}>Experience</Text> */}
            </View>

            <View style={[Style.row, {width: '35%'}]}>
              <Text
                style={[
                  Style.rowtxt,
                  {color: data.current_salary != null ? 'black' : '#dedede'},
                ]}>
                {data && data.symbol != null ? data.symbol : ''}
                {data && data.current_salary != null
                  ? data.current_salary
                  : 'N/A'}
              </Text>
              <Text style={Style.rowtxt2}>Current Salary</Text>
            </View>

            <View style={[Style.row, {width: '35%'}]}>
              <Image
                source={require('../asset/profession.png')}
                style={{width: 15, height: 15}}
              />
              <Text style={[Style.rowtxt, {width: '100%'}]} numberOfLines={2}>
                {' '}
                {data && data.profession}
              </Text>

              {/* <Text style={Style.rowtxt2}>Availability</Text> */}
            </View>
          </View>
        </View>

        <View
          style={{
            borderColor: 'black',
            borderBottomWidth: 0.3,
            margin: 10,
          }}></View>

        {show ? (
          <View>
            <View>
              <Text style={Style.heading}>Education</Text>

              {EduArr.length > 0 ? (
                <FlatList
                  data={myedu}
                  renderItem={({item}) => (
                    <View style={{marginTop: hp(1)}}>
                      <Image
                        source={{uri: item.image}}
                        style={{height: 250, marginTop: hp(2), width: '100%'}}
                      />

                      {/* <Image source={{uri:item.image}} resizeMode="contain" style={Style.img} /> */}
                      <View style={Style.imgView}>
                        <View
                          style={{
                            height: hp(8),
                            borderRightColor: 'white',
                            borderRightWidth: 1,
                            width: wp(35),
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{color: 'white', fontSize: 16}}>
                            {item.degree}
                          </Text>
                        </View>

                        <View
                          style={{
                            height: hp(8),
                            width: wp(45),
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{color: 'white', fontSize: 16}}>
                            {item.institute}
                          </Text>
                        </View>

                        {/* <View style={{paddingHorizontal:10}}>
                      <Text style={Style.rowtxt1}>Grade</Text>
                 </View> */}
                      </View>
                    </View>
                  )}
                  keyExtractor={item => item.id}
                />
              ) : (
                <Text style={{marginLeft: 20, color: colors.blue, top: 10}}>
                  {data.education}
                </Text>
              )}
            </View>
            <View>
              <View
                style={{
                  borderColor: 'black',
                  top: 10,
                  marginBottom: 10,
                  borderBottomWidth: 0.3,
                  margin: 10,
                }}></View>

              {data && data.phone_visibility === '1' && (
                <View>
                  <Text style={Style.heading}>Contact </Text>
                  <Text
                    style={
                      (Style.usertxt,
                      {
                        color: colors.blue,
                        fontSize: 16,
                        fontWeight: '600',
                        alignSelf: 'center',
                        // fontFamily: 'Raleway-Bold',
                      })
                    }>
                    Phone : {data && data.phone}
                  </Text>
                  <View
                    style={{
                      borderColor: 'black',
                      borderBottomWidth: 0.3,
                      margin: 10,
                    }}></View>
                </View>
              )}

              <Text style={Style.heading}>SKILLS</Text>

              <View
                style={{flexDirection: 'row', paddingLeft: 20, marginTop: 30}}>
                {skillArr.length > 0 ? (
                  <FlatList
                    data={skillArr}
                    renderItem={({item}) => (
                      <View style={{flexDirection: 'row', flex: 1}}>
                        <TouchableOpacity style={Style.btn}>
                          <Text style={Style.btntxt}>{item.skill}</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    keyExtractor={item => item.id}
                  />
                ) : (
                  <Text style={{alignSelf: 'center', color: 'grey'}}>
                    no skills added yet
                  </Text>
                )}
              </View>
              <View
                style={{
                  borderColor: 'black',
                  borderBottomWidth: 0.3,
                  margin: 10,
                }}></View>
              <Text style={Style.heading}>Achievements</Text>
              <View
                style={{flexDirection: 'row', paddingLeft: 20, marginTop: 30}}>
                {achirvementArr.length > 0 ? (
                  <FlatList
                    data={achirvementArr}
                    renderItem={({item}) => (
                      <View style={{flexDirection: 'row', flex: 1}}>
                        <TouchableOpacity style={Style.btn}>
                          <Text style={Style.btntxt}>{item}</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    keyExtractor={item => item.id}
                  />
                ) : (
                  <Text style={{alignSelf: 'center', color: 'grey'}}>
                    no achievement added yet
                  </Text>
                )}
              </View>
              <View
                style={{
                  borderColor: 'black',
                  borderBottomWidth: 0.3,
                  margin: 10,
                }}></View>
            </View>
          </View>
        ) : (
          <View style={{flexDirection: 'row', marginLeft: 20}}>
            <Text
              style={{color: colors.blue, fontSize: hp(2), fontWeight: '600'}}>
              For more info
            </Text>
            <Text
              style={{
                color: colors.blue,
                fontSize: hp(2),
                fontWeight: '600',
                textDecorationLine: 'underline',
                marginLeft: 10,
              }}
              onPress={() => setshow(true)}>
              Tap Here
            </Text>
          </View>
        )}
        {filter == 'true' ? (
          <Text></Text>
        ) : (
          <>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('UpdateProfile', {
                  userdata: data,
                  other: 10,
                })
              }
              style={Style.btn1}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: 12,
                  fontFamily: 'Raleway-bold',
                }}>
                Edit My Profile
              </Text>
              <Icon
                name="edit"
                type="feather"
                style={{marginTop: 3, marginLeft: 5}}
                size={14}
                color="white"
              />
            </TouchableOpacity>
          </>
        )}

        {data && data.resume != null ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ResumeView', {resume: data.resume})
            }
            style={Style.btn1}>
            <Text
              style={{
                color: colors.white,
                fontSize: 12,
                fontFamily: 'Raleway-bold',
              }}>
              View Resume
            </Text>
            <Icon
              name="file"
              type="feather"
              style={{marginTop: 3, marginLeft: 5}}
              size={16}
              color="white"
            />
          </TouchableOpacity>
        ) : (
          <Text
            style={{
              alignSelf: 'flex-end',
              paddingRight: wp(6),
              fontFamily: 'Raleway-bold',
            }}>
            Resume Not Found
          </Text>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate('AllEmployees')}
          style={Style.btn1}>
          <Text
            style={{
              color: colors.white,
              fontSize: 12,
              fontFamily: 'Raleway-bold',
            }}>
            Search Profiles
          </Text>
          <Icon
            name="search"
            type="feather"
            style={{marginTop: 3, marginLeft: 5}}
            size={14}
            color="white"
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const Style = StyleSheet.create({
  usertxt: {
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: '700',
    margin: 2,
    alignSelf: 'center',
  },
  row: {
    borderRightWidth: 1,
    borderRightColor: colors.blue,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowtxt: {
    alignSelf: 'center',
    fontSize: wp(4),
    fontFamily: 'Raleway-regular',
  },
  row1: {
    borderRightWidth: 1,
    borderRightColor: colors.white,
    paddingHorizontal: 20,
    alignSelf: 'center',
    width: wp(25),
  },
  rowtxt1: {
    alignSelf: 'center',
    color: colors.white,
    fontSize: 14,
    width: wp(25),
    paddingLeft: 20,
    padding: 10,
    fontFamily: 'Raleway-semibold',
  },
  rowtxt2: {
    alignSelf: 'center',
    fontSize: wp(4),
    color: colors.blue,
    fontWeight: '600',
    fontFamily: 'Raleway-regular',
  },
  Msgbox: {
    flexDirection: 'row',
    backgroundColor: colors.gray,
    fontFamily: 'Raleway-regular',
    padding: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0.5, height: 2},
    shadowOpacity: 4.5,
    shadowRadius: 2,
    elevation: 2,
  },
  Msgbox2: {
    flexDirection: 'row',
    fontFamily: 'Raleway-regular',
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0.5, height: 2},
    shadowOpacity: 4.5,
    shadowRadius: 2,
    elevation: 2,
  },
  heading: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.blue,
    paddingLeft: hp(2.5),
    fontFamily: 'Raleway-bold',
  },
  heading2: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.blue,
    paddingLeft: hp(1),
    fontFamily: 'Raleway-bold',
  },
  img: {
    width: '100%',
    marginTop: hp(-5),
  },
  imgView: {
    flexDirection: 'row',
    backgroundColor: colors.blue,
    justifyContent: 'space-between',
    paddingHorizontal: wp(10),
    // marginTop:hp(-2.5)
  },
  btn: {
    margin: 3,
    height: hp(5),
    backgroundColor: colors.black,
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
    fontFamily: 'Raleway-regular',
  },
  social: {
    alignItems: 'flex-end',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0.5, height: 2},
    shadowOpacity: 4.5,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 20,
    height: hp(12),
    marginRight: 4,
    padding: 3.5,
  },
  btn1: {
    padding: hp(2),
    height: hp(7),
    backgroundColor: colors.blue,
    margin: hp(1),
    alignSelf: 'flex-end',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
