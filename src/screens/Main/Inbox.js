import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../tools/color';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import URL from '../../tools/URL';
import Toast from 'react-native-simple-toast';
import {SwipeListView} from 'react-native-swipe-list-view';
import {DrawerActions} from '@react-navigation/native';

const CustomerAllChats = ({from, navigation}) => {
  const [flatData, setFlatData] = useState(null);
  const [indicator, setIndicator] = useState(false);
  const [userId, setuserId] = useState('');
  const [user, setUser] = useState();

  useEffect(() => {
    console.log('navigation ', navigation, from);
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('yeh chala');
      getChatted();
    });
    if (from == 'Inbox') {
      BackHandler.addEventListener('hardwareBackPress', () =>
        handleBackButtonClick(),
      );
    }
    return unsubscribe;
  }, [navigation]);

  const handleBackButtonClick = () => {
    navigation.navigate('home');
    return true;
  };

  const getChatted = async () => {
    let data = JSON.parse(await AsyncStorage.getItem('User'));
    setuserId(data.id);
    setUser(data);
    setIndicator(true);
    const userToken = await AsyncStorage.getItem('AuthToken');
    const AuthStr = 'Bearer '.concat(userToken);
    axios
      .get(`${URL}/user-chats`, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('All User chatted LIst is:---------->>>>', response);
        setFlatData(response.data.successData);
        setIndicator(false);
      })
      .catch(error => {
        console.log(
          'Error Responce for al user',
          JSON.parse(JSON.stringify(error)),
        );
        setIndicator(false);
      });
  };
  const renderItem = ({item}) => {
    return item.sender != null &&
      item.receiver != null &&
      item.receiver.id != item.sender.id ? (
      <View style={styles.sectionList}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Image
            style={styles.userImage}
            resizeMode="cover"
            source={
              item.sender_id != userId
                ? item.sender.image != null
                  ? {uri: item.sender.image}
                  : require('../../assets/download.png')
                : item.receiver_id != userId
                ? item.receiver != null && item.receiver.image != null
                  ? {uri: item.receiver.image}
                  : require('../../assets/download.png')
                : require('../../assets/download.png')
            }
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            console.log('profile click item', item);
            {
              user.id == item.sender_id && item.sender_block == 'true'
                ? navigation.navigate('Msg', {
                    myuser: user.uid,
                    name:
                      user.name == item.receiver.name
                        ? item.sender.name
                        : item.receiver.name,
                    sendId: item.receiver.id,
                    uid:
                      user.uid == item.receiver.uid
                        ? item.sender.uid
                        : item.receiver.uid,
                  })
                : user.id == item.receiver_id && item.receiver_block == 'true'
                ? navigation.navigate('Msg', {
                    myuser: user.uid,
                    name:
                      user.name == item.receiver.name
                        ? item.sender.name
                        : item.receiver.name,
                    sendId: item.sender.id,
                    uid:
                      user.uid == item.receiver.uid
                        ? item.sender.uid
                        : item.receiver.uid,
                  })
                : item.receiver_block == 'false' && item.sender_block == 'false'
                ? navigation.navigate('Msg', {
                    myuser: user.uid,
                    name:
                      user.name == item.receiver.name
                        ? item.sender.name
                        : item.receiver.name,
                    sendId:
                      user.id == item.receiver_id
                        ? item.sender.id
                        : item.receiver.id,
                    uid:
                      user.uid == item.receiver.uid
                        ? item.sender.uid
                        : item.receiver.uid,
                  })
                : Toast.show('You are Blocked', Toast.SHORT);
            }
          }}>
          <View style={{width: wp(70)}}>
            <View style={styles.descView}>
              <Text style={styles.nameText}>
                {item.sender_id != userId
                  ? item.sender.name
                  : (item.receiver != null) & (item.receiver_id != userId)
                  ? item.receiver.name
                  : 'Name'}
              </Text>
              {/* {user.id == item.receiver.id &&
              item.sender_read != null &&
              item.sender_read == 'false' ? (
                <View style={styles.unreadButton}></View>
              ) : user.id == item.sender.id &&
                item.receiver_read != null &&
                item.receiver_read == 'false' ? (
                <View style={styles.unreadButton}></View>
              ) : null} */}
              {user.id == item.sender.id && item.sender_read == '0' ? (
                <View style={styles.unreadButton}></View>
              ) : user.id == item.receiver.id && item.receiver_read == '0' ? (
                <View style={styles.unreadButton}></View>
              ) : null}
            </View>
            <View
              style={{
                width: wp(70),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text numberOfLines={1} style={styles.messageText}>
                Message Now...
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name={'arrow-left'}
                  type={'material-community'}
                  color={colors.blue}
                  size={hp(2.5)}
                />
                <Text style={styles.swipeText}>Swipe</Text>
              </View>
            </View>
          </View>
          <View style={styles.divider}></View>
        </TouchableOpacity>
      </View>
    ) : (
      <></>
    );
  };

  const deleteItem = async (data, rowMap) => {
    console.log('check your delete data ', data, rowMap);
    let form = new FormData();
    form.append(
      'chat_user_id',
      user.id == data.item.receiver_id
        ? data.item.sender_id
        : data.item.receiver_id,
    );
    const userToken = await AsyncStorage.getItem('AuthToken');
    const AuthStr = 'Bearer '.concat(userToken);
    axios
      .post(`${URL}/delete-chat-user`, form, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('Delete Sucess is:---------->>>>', response);
        getChatted();
      })
      .catch(error => {
        console.log('Error Responce', JSON.parse(JSON.stringify(error)));
        console.log('Error Responce', error.response);
        setIndicator(false);
      });
  };

  const blockItem = async (data, rowMap) => {
    console.log('block data contains this ---- ', data);
    let form = new FormData();
    form.append('chat_id', data.item.id);
    form.append(
      'is_block',
      user.id == data.item.receiver_id && data.item.receiver_block == 'true'
        ? 'false'
        : user.id == data.item.sender_id && data.item.sender_block == 'true'
        ? 'false'
        : 'true',
    );
    form.append(
      'chat_user_id',
      user.id == data.item.receiver_id
        ? data.item.sender_id
        : data.item.receiver_id,
    );
    const userToken = await AsyncStorage.getItem('AuthToken');
    const AuthStr = 'Bearer '.concat(userToken);
    axios
      .post(`${URL}/block-chat-user`, form, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        console.log('Block Sucess is:---------->>>>', response);
        {
          data.item.sender_id == user.id && data.item.sender_block == 'true'
            ? Toast.show('UnBlocked', Toast.SHORT)
            : data.item.sender_id == user.id &&
              data.item.sender_block == 'false'
            ? Toast.show('Blocked', Toast.SHORT)
            : data.item.receiver_id && data.item.receiver_block == 'true'
            ? Toast.show('UnBlocked', Toast.SHORT)
            : data.item.receiver_id && data.item.receiver_block == 'true'
            ? Toast.show('Blocked', Toast.SHORT)
            : Toast.show('Success', Toast.SHORT);
        }
        // Toast.show('Process Complete', Toast.SHORT);
        getChatted();
      })
      .catch(error => {
        console.log('Block Error Responce', error.response);
        Toast.show('Blocking Error', Toast.SHORT);
      });
  };

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      {/* {console.log('is block check kro', data)} */}
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => {
          console.log('adaddada', data);
          deleteItem(data, rowMap);
          closeRow(rowMap, data.item.id);
        }}>
        <Text style={styles.deleteBtn}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => {
          console.log('adaddada', data);
          blockItem(data, rowMap);
          closeRow(rowMap, data.item.id);
        }}>
        <Text style={styles.blockBtn}>
          {data.item.sender_id == user.id && data.item.sender_block == 'true'
            ? 'UnBlock'
            : data.item.receiver_id == user.id &&
              data.item.receiver_block == 'true'
            ? 'UnBlock'
            : 'Block'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const openRef = [];
  const openRow = (rowKey, rowMap) => {
    openRef.push(rowMap[rowKey]);
    console.log('all opened', openRef);
  };

  const closeRow = (rowMap, rowKey) => {
    console.log('CLose row works', rowMap, rowKey);
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <View
        style={{
          width: '100%',
          backgroundColor: colors.blue,
          height: hp(9),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            // backgroundColor: 'red',
            width: wp(90),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() =>
              from == 'Inbox'
                ? navigation.dispatch(DrawerActions.toggleDrawer())
                : navigation.goBack()
            }>
            <Image
              source={
                from == 'Inbox'
                  ? require('../../assets/drawer0.png')
                  : require('../../assets/bb.png')
              }
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: colors.white,
              fontSize: hp(3.5),
            }}>
            Inbox
          </Text>
          <Text></Text>
        </View>
      </View>
      {/* {flatData!=null&& */}
      {indicator == null ? (
        <ActivityIndicator size={'small'} color={colors.blue} />
      ) : flatData == undefined || flatData.length == 0 ? (
        <Text style={styles.nothingFound}>Nothing Found</Text>
      ) : (
        <View style={{flex: 1, backgroundColor: colors.white}}>
          <SwipeListView
            // listViewRef={ref => swiperRef = ref}
            data={flatData}
            renderItem={renderItem}
            keyExtractor={(rowData, index) => {
              return rowData.id;
            }}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-143}
            onRowDidOpen={(rowKey, rowMap) => openRow(rowKey, rowMap)}
            closeOnRowOpen={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainText: {
    color: 'red',
    fontFamily: 'Poppins-Bold',
  },
  subtext: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  parentView: {
    width: wp(100),
    height: hp(10),
    // borderBottomWidth: 1,
    borderColor: 'blue',
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    alignItems: 'center',
  },
  deleteBtn: {
    color: colors.white,
    right: 0,
    // height: hp(9.2),
  },
  blockBtn: {
    color: colors.white,
    right: 0,
    // height: hp(9.2),
  },
  sectionList: {
    width: wp(100),
    height: hp(11),
    flexDirection: 'row',
    // borderBottomColor: 'white',
    // borderBottomWidth: 1,
    // justifyContent:'center
    alignItems: 'center',
    backgroundColor: colors.white,
    // marginBottom:5
  },
  userImage: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    borderRadius: 50,
    marginHorizontal: wp(5),
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 65,
    height: 62,
  },
  backRightBtnLeft: {
    backgroundColor: colors.black,
    right: 65,
  },
  backRightBtnRight: {
    backgroundColor: colors.blue,
    right: 0,
  },
  descView: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  nameText: {
    color: colors.blue,
    // fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
  },
  timeText: {
    color: colors.gray,
    // fontSize:12,
    // marginLeft:wp(1)
  },
  swipeText: {
    color: colors.blue,
    fontSize: 12,
    marginLeft: wp(1),
  },
  messageText: {
    color: colors.black,
  },
  nothingFound: {
    color: colors.blue,
    fontSize: 16,
    alignSelf: 'center',
    marginTop: hp(2),
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.blue,
    width: wp(80),
    alignSelf: 'flex-end',
    marginTop: hp(2),
  },
  btnText: {
    color: colors.white,
  },
  unreadButton: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    marginLeft: 10,
    zIndex: 1000,
  },
});

export default CustomerAllChats;
