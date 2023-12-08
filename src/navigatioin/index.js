import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, Pressable} from 'react-native';
import {
  NavigationContainer,
  DrawerActions,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './RootNavigation';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import messaging from '@react-native-firebase/messaging';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as RootNavigation from './RootNavigation';

import colors from '../tools/color';
import Splash from '../screens/Auth/splash';
import Home from '../screens/Main/Home';
import SideBar from './DrawerContent';
import EditProfile from '../screens/Main/EditProfile';
import Login from '../screens/Auth/Login';
import SignUp from '../screens/Auth/signUp';
import NumberVerify from '../screens/Auth/NumberVerify';
import AllEmployees from '../screens/Main/AllEmployees';
import EmployeeProfile from '../screens/Main/EmployeeProfile';
import Msg from '../screens/Main/Msg';
import Filter from '../screens/Main/Filter';
import FilteredEmployees from '../screens/Main/FilteredEmployees';
import ChangeNum from '../screens/Main/ChangeNum';
import UpdateProfile from '../screens/Main/updateprofile';
import TermsCondition from '../screens/Main/Terms&condition';
import PrivacyPolicy from '../screens/Main/PrivacyPolicy';
import Inbox from '../screens/Main/Inbox';
import ResumeView from '../screens/Main/ResumeView';

const Stack = createStackNavigator();
const drawerStack = createDrawerNavigator();
const EmployeeStack = createStackNavigator();
const EmployerStack = createStackNavigator();

let initialScreen = 'Splash';

function Employee({navigation}) {
  return (
    <EmployeeStack.Navigator
      screenOptions={({navigation}) => ({
        headerStyle: {
          // height:hp(12),
          height:
            Platform.OS == 'ios'
              ? DeviceInfo.hasNotch()
                ? hp(12)
                : hp(10)
              : hp(10),
          backgroundColor: colors.blue,
        },
        headerTitleAlign: 'center',
        //  headerTransparent:true,
        headerBackTitle: ' ',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <Image
              source={require('../screens/asset/drawer0.png')}
              style={{marginLeft: wp(2)}}
            />
          </TouchableOpacity>
        ),
        //  headerRight:() =><Icon  color={'white'} size={25}  reverseColor={'black'} name="" type="material-community" reverse={true} />,
        headerLeftContainerStyle: {
          padding: 10,
        },
        headerRightContainerStyle: {
          padding: 10,
          marginTop: 10,
        },
        headerTitleStyle: {
          color: colors.white,
          fontSize: wp(7),
        },
      })}>
      <EmployeeStack.Screen
        name="EmployeeProfile"
        component={EmployeeProfile}
        options={({navigation}) => ({
          headerTitle: 'Profile',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/bb.png')}
                style={{width: 25, marginBottom: 10, height: 25}}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <EmployeeStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{headerTitle: 'Edit Profile'}}
      />
      <EmployeeStack.Screen
        name="home"
        component={Home}
        options={{headerShown: false}}
      />
      {/* <EmployeeStack.Screen
        name="Inbox"
        component={Inbox}
        options={({navigation}) => ({
          headerStyle: {
            height: hp(9),
            backgroundColor: colors.blue,
          },
          headerTitle: 'Inbox',
          headerTitleStyle: {
            color: colors.white,
            fontSize: hp(3.5),
            // fontWeight:'bold',
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/bb.png')}
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: {
            padding: 10,
          },
        })}
      /> */}

      <EmployeeStack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{headerTitle: 'Update Profile'}}
      />
      <EmployeeStack.Screen
        name="TermsCondition"
        component={TermsCondition}
        options={({navigation}) => ({
          headerStyle: {
            height: hp(9),
            backgroundColor: colors.blue,
          },
          headerTitle: 'Terms & Condition',
          headerTitleStyle: {
            color: colors.white,
            fontSize: hp(3.5),
            // fontWeight:'bold',
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/bb.png')}
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: {
            padding: 10,
          },
        })}
      />
      <EmployeeStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={({navigation}) => ({
          headerStyle: {
            height: hp(9),
            backgroundColor: colors.blue,
          },
          headerTitle: 'Privacy Policy',
          headerTitleStyle: {
            color: colors.white,
            fontSize: hp(3.5),
            // fontWeight:'bold',
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/bb.png')}
                style={{width: 25, marginBottom: 10, height: 25}}
              />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: {
            padding: 10,
          },
        })}
      />
      <EmployeeStack.Screen
        name="AllEmployees"
        component={AllEmployees}
        options={{headerShown: false}}
        // options={{headerTitle: 'All Employees'}}
      />
      {/* <EmployeeStack.Screen
        name="Msg"
        component={Msg}
        options={{
          headerTitle: 'Chat',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('EmployeeProfile')}>
              <Image
                source={require('../assets/bb.png')}
                style={{width: 25, marginBottom: 10, height: 25}}
              />
            </TouchableOpacity>
          ),
        }}
      /> */}
      <EmployeeStack.Screen
        name="Filter"
        component={Filter}
        options={{headerTitle: 'Filter'}}
      />
      <EmployeeStack.Screen
        name="FilteredEmployees"
        component={FilteredEmployees}
        options={{headerShown: false}}
      />
      <EmployeeStack.Screen
        name="ChangeNumber"
        component={ChangeNum}
        options={{headerTitle: 'Change Email'}}
      />
    </EmployeeStack.Navigator>
  );
}

function Employer({navigation}) {
  return (
    <EmployerStack.Navigator
      screenOptions={({navigation}) => ({
        headerStyle: {
          // height:hp(12),
          height:
            Platform.OS == 'ios'
              ? DeviceInfo.hasNotch()
                ? hp(12)
                : hp(10)
              : hp(10),
          backgroundColor: colors.blue,
        },
        headerTitleAlign: 'center',
        //  headerTransparent:true,
        headerBackTitle: ' ',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <Image
              source={require('../screens/asset/drawer0.png')}
              style={{marginLeft: wp(2)}}
            />
          </TouchableOpacity>
        ),
        //  headerRight:() =><Icon  color={'white'} size={25}  reverseColor={'black'} name="" type="material-community" reverse={true} />,
        headerLeftContainerStyle: {
          padding: 10,
        },
        headerRightContainerStyle: {
          padding: 10,
          marginTop: 10,
        },
        headerTitleStyle: {
          color: colors.white,
          fontSize: wp(7),
        },
      })}>
      <EmployerStack.Screen
        name="AllEmployees"
        component={AllEmployees}
        options={{headerShown: false}}
      />
      <EmployerStack.Screen
        name="ChangeNumber"
        component={ChangeNum}
        options={{headerTitle: 'Filter'}}
      />
      <EmployerStack.Screen
        name="TermsCondition"
        component={TermsCondition}
        options={({navigation}) => ({
          headerStyle: {
            height: hp(9),
            backgroundColor: colors.blue,
          },
          headerTitle: 'Terms & Condition',
          headerTitleStyle: {
            color: colors.white,
            fontSize: hp(3.5),
            // fontWeight:'bold',
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/bb.png')}
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: {
            padding: 10,
          },
        })}
      />
      <EmployerStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={({navigation}) => ({
          headerStyle: {
            height: hp(9),
            backgroundColor: colors.blue,
          },
          headerTitle: 'Privacy Policy',
          headerTitleStyle: {
            color: colors.white,
            fontSize: hp(3.5),
            // fontWeight:'bold',
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/bb.png')}
                style={{width: 25, marginBottom: 10, height: 25}}
              />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: {
            padding: 10,
          },
        })}
      />
      <EmployerStack.Screen
        name="EmployeeProfile"
        component={EmployeeProfile}
        options={({navigation}) => ({
          headerTitle: 'Profile',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/bb.png')}
                style={{width: 25, marginBottom: 10, height: 25}}
              />
            </TouchableOpacity>
          ),
        })}
      />
      {/* <EmployerStack.Screen
        name="Inbox"
        component={Inbox}
        options={({navigation}) => ({
          headerStyle: {
            height: hp(9),
            backgroundColor: colors.blue,
          },
          headerTitle: 'Inbox',
          headerTitleStyle: {
            color: colors.white,
            fontSize: hp(3.5),
            // fontWeight:'bold',
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/bb.png')}
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: {
            padding: 10,
          },
        })}
      /> */}
      <EmployerStack.Screen
        name="home"
        component={Home}
        options={{headerShown: false}}
      />
      {/* <EmployerStack.Screen
        name="Msg"
        component={Msg}
        options={{
          headerTitle: 'Chat',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('AllEmployees')}>
              <Image
                source={require('../assets/bb.png')}
                style={{width: 25, marginBottom: 10, height: 25}}
              />
            </TouchableOpacity>
          ),
        }}
      /> */}
      <EmployerStack.Screen
        name="Filter"
        component={Filter}
        options={{headerTitle: 'Filter'}}
      />
      <EmployerStack.Screen
        name="FilteredEmployees"
        component={FilteredEmployees}
        options={{headerShown: false}}
      />
      {/* <EmployerStack.Screen name="ChangeNumber" component={ChangeNum} options={{headerTitle:'Change Email'}} /> */}

      <EmployerStack.Screen
        name="ChangeNum"
        component={ChangeNum}
        options={{headerTitle: 'Change Email'}}
      />
    </EmployerStack.Navigator>
  );
}

function Drawer(params) {
  // console.log('drawer k params e dekh lo', initialScreen === 'Splash');
  return initialScreen == 'Splash' ? (
    <drawerStack.Navigator
      backBehavior="history"
      screenOptions={{headerShown: false}}
      drawerContent={props => <SideBar {...props} />}>
      <drawerStack.Screen name="home" component={Home} />
      <drawerStack.Screen name="Employee" component={Employee} />
      <drawerStack.Screen name="Employer" component={Employer} />
      <drawerStack.Screen name="Inbox">
        {props => <Inbox {...props} from={'Splash'} />}
      </drawerStack.Screen>
      <EmployerStack.Screen name="Msg" component={Msg} />
    </drawerStack.Navigator>
  ) : (
    <drawerStack.Navigator
      backBehavior="history"
      drawerContent={props => <SideBar {...props} />}>
      <drawerStack.Screen name="Inbox">
        {props => <Inbox {...props} from={'Inbox'} />}
      </drawerStack.Screen>
      <EmployerStack.Screen name="Msg" component={Msg} />
      <drawerStack.Screen name="home" component={Home} />
      <drawerStack.Screen name="Employee" component={Employee} />
      <drawerStack.Screen name="Employer" component={Employer} />
    </drawerStack.Navigator>
  );
}

export default function Navigator() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      RootNavigation.navigate('Drawer', {screen: 'Inbox'});
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          initialScreen = 'Inbox';
        }
        setLoading(false);
        console.log('initnal Route name', initialScreen);
      });
  }, []);

  if (loading) {
    return null;
  }
  return (
    <NavigationContainer ref={navigationRef}>
      {console.log('first', initialScreen)}
      <Stack.Navigator
        initialRouteName={initialScreen}
        // screenOptions={{headerShown: false}}
      >
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TermsCondition"
          component={TermsCondition}
          options={({navigation}) => ({
            headerStyle: {
              height: hp(9),
              backgroundColor: colors.blue,
            },
            headerTitle: 'Terms & Condition',
            headerTitleStyle: {
              color: colors.white,
              fontSize: hp(3.5),
              // fontWeight:'bold',
            },
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={require('../assets/bb.png')}
                  style={{width: 25, height: 25}}
                />
              </TouchableOpacity>
            ),
            headerLeftContainerStyle: {
              padding: 10,
            },
          })}
        />
        <Stack.Screen
          name="NumberVerify"
          component={NumberVerify}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ResumeView"
          component={ResumeView}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Drawer"
          component={Drawer}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
          name="MainStackInbox"
          component={Inbox}
          options={({navigation}) => ({
            headerStyle: {
              height: hp(9),
              backgroundColor: colors.blue,
            },
            headerTitle: 'Inbox',
            headerTitleStyle: {
              color: colors.white,
              fontSize: hp(3.5),
              // fontWeight:'bold',
            },
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => RootNavigation.navigate('Drawer')}>
                <Image
                  source={require('../assets/bb.png')}
                  style={{width: 25, height: 25}}
                />
              </TouchableOpacity>
            ),
            headerLeftContainerStyle: {
              padding: 10,
            },
          })}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
