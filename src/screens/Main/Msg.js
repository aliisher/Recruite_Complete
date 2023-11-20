import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  BackHandler,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import colors from '../../tools/color';
import {DrawerActions} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
// import Fire from '../Fire/Fire';
import axios from 'axios';
import URL from '../../tools/URL';

export default function Msg({route, navigation}) {
  const [messages, setMessages] = useState([]);
  const [UserIds, setUserIds] = useState();
  const {myuser, uid, sendId} = route.params;
  useEffect(async () => {
    const unsubscribeToNavListner = navigation.addListener('focus', () => {
      readMessage();
    });
    // BackHandler.addEventListener('hardwareBackPress', () =>
    //   handleBackButtonClick(),
    // );
    let MyUserId = JSON.parse(await AsyncStorage.getItem('User'));
    console.log(MyUserId);
    setUserIds(MyUserId.uid);

    const docid =
      uid > MyUserId.uid ? MyUserId.uid + '-' + uid : uid + '-' + MyUserId.uid;
    const messageRef = firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc');

    const unSubscribe = messageRef.onSnapshot(querySnap => {
      const allmsg = querySnap.docs.map(docSanp => {
        const data = docSanp.data();
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
    });

    return () => {
      unSubscribe();
    };
  }, [sendId]);
  // const handleBackButtonClick = () => {
  //   navigation.goBack();

  //   return true;
  // };
  const readMessage = async () => {
    let userToken = await AsyncStorage.getItem('AuthToken');
    let formdata = new FormData();
    formdata.append('receiver_id', sendId);
    axios
      .post(URL + '/read-message', formdata, {
        headers: {
          Authorization: 'Bearer ' + userToken,
        },
      })
      .then(response => {
        console.log('read Message the respnonse', response);
      })
      .catch(error => {
        console.log('check error response for read message', error.response);
      });
  };
  const onSend = async messageArray => {
    let userToken = await AsyncStorage.getItem('AuthToken');
    const msg = messageArray[0];
    const mymsg = {
      ...msg,
      sentBy: UserIds,
      sentTo: uid,
      createdAt: new Date(),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
    const docid = uid > UserIds ? UserIds + '-' + uid : uid + '-' + UserIds;

    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .add({...mymsg, createdAt: firestore.FieldValue.serverTimestamp()});

    //Message Notification Calls
    let formdata = new FormData();
    formdata.append('user_id', JSON.stringify(sendId));
    axios
      .post(URL + '/send-message-notification', formdata, {
        headers: {
          Authorization: 'Bearer ' + userToken,
        },
      })
      .then(response => {
        console.log('check the respnonse', response);
      })
      .catch(error => {
        console.log('check error notification', error.response);
      });

    // Save Chatted User Data
    let saveFormData = new FormData();
    saveFormData.append('receiver_id', sendId);
    axios
      .post(URL + '/save-chat', saveFormData, {
        headers: {
          Authorization: 'Bearer ' + userToken,
        },
      })
      .then(response => {
        console.log('Save user data', response);
      })
      .catch(error => {
        console.log('check error while send msg', error.response);
      });
  };
  return (
    <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      {console.log('afasasdfjkdsahjkf', messages)}
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
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <Image
              source={require('../../assets/drawer0.png')}
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: colors.white,
              fontSize: hp(3.5),
            }}>
            Chat
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/bb.png')}
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
        </View>
      </View>
      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{
          _id: UserIds,
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: 'green',
                },
              }}
            />
          );
        }}
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{borderTopWidth: 1.5, borderTopColor: 'green'}}
              textInputStyle={{color: 'black'}}
            />
          );
        }}
      />
    </View>
  );
}

//THUQdkImzFVOv2LqHvxdSn3RDLY2-jxgISB0nWgRmtfu2OIn1BIVlBMu1
