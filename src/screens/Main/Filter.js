import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  BackHandler,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Myinput from '../../components/input';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../tools/color';
import MyCheckBox from '../../components/CheckBox';
import axios from 'axios';
import URL from '../../tools/URL';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import {Alert} from 'react-native';
import {ESLint} from 'eslint';
import {
  Dropdown,
  GroupDropdown,
  MultiselectDropdown,
} from 'sharingan-rn-modal-dropdown';
let arr = [];
let professionarr = [];

export default function Filter({navigation}) {
  const [email, setemail] = useState(null);
  const [cash, setcash] = useState(false);
  const [cash1, setcash1] = useState(false);
  const [show1, setshow1] = useState('');

  const [valueSS, setValueSS] = useState('');
  const [valueMS, setValueMS] = useState([]);
  const [Professions, setProfeesion] = useState([]);
  const [UserSkills, setUserSkills] = useState('');
  const [UserProfession, setUserProfession] = useState('');
  const [cash2, setcash2] = useState(false);
  const [wskill, setwskill] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [Profession, SetProfession] = useState('');
  const [age, setage] = useState('');
  const [Location, setLocation] = useState('');
  const [Experience, setExperience] = useState('');
  const [Salary, setSalary] = useState('');
  const [skills, setskills] = useState('');
  const [availability, setavailability] = useState('');
  const [skillsarray, setskillsarray] = useState([]);
  const [showskillsarr, setshowskillsarr] = useState([]);
  const [Newpro, setNewpro] = useState('');
  const [saveSkill, setsaveSkill] = useState('');
  //    const [availability , setavailability] = useState('');
  const [users, setusers] = useState('');

  const inputclear = () => {
    setemail('');
    setsaveSkill('');
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () =>
      handleBackButtonClick(),
    );
    getalldata();
  }, []);
  const getProfession = async profession => {
    // setProfeesion(profession);

    professionarr = [];
    const AuthToken = await AsyncStorage.getItem('AuthToken');

    axios
      .get(URL + '/professions?search=' + profession, {
        headers: {Authorization: 'Bearer '.concat(AuthToken)},
      })
      .then(response => {
        if (response.data.successData.professions.length != 0) {
          response.data.successData.professions.map(item => {
            professionarr.push(item);
            setProfeesion(item);
          });
        } else {
          setNewpro(profession);
          professionarr = [];
        }
      })
      .catch(error => {});
  };
  const getalldata = async () => {
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
        let skills = res.data.successData.skills;
        let profession = res.data.successData.professions;
        skills = skills.reduce((item_arr, item) => {
          item_arr.push({value: item.name, label: item.name});
          return item_arr;
        }, []);
        profession = profession.reduce((item_arr, item) => {
          item_arr.push({value: item.name, label: item.name});
          return item_arr;
        }, []);
        setUserProfession(profession);
        setUserSkills(skills);
      })
      .catch(error => {
        console.error('Eror Message', JSON.parse(JSON.stringify(error)));
      });
  };
  const handleBackButtonClick = () => {
    navigation.goBack(null);

    return true;
  };
  const getskills = async skills => {
    setemail(skills);
    setwskill(skills);
    arr = [];
    const AuthToken = await AsyncStorage.getItem('AuthToken');

    axios
      .get(URL + '/skills?search=' + skills, {
        headers: {Authorization: 'Bearer '.concat(AuthToken)},
      })
      .then(response => {
        response.data.successData.map(item => {
          arr.push(item);
          setskillsarray(item);
        });
      })
      .catch(error => {});
  };
  const ondel = item => {
    let newArrr = showskillsarr.filter(el => el != item);
    setshowskillsarr(newArrr);
  };

  const Myfilter = async () => {
    const AuthToken = await AsyncStorage.getItem('AuthToken');

    const formdata = new FormData();
    formdata.append('profession', Newpro);
    formdata.append('age', age);
    formdata.append('experience', Experience);
    formdata.append('salary', Salary);
    if (showskillsarr.length == 0) {
      formdata.append('skills', '');
    } else {
      formdata.append('skills', JSON.stringify(showskillsarr));
    }
    formdata.append('location', Location);
    formdata.append('availability', availability);

    if (Newpro != '') {
      axios
        .post(URL + '/search-profiles', formdata, {
          headers: {Authorization: 'Bearer '.concat(AuthToken)},
        })
        .then(response => {
          let newuserarr = [];
          console.log('search Response', response.data.successData);
          setusers(response.data.successData);

          navigation.navigate('FilteredEmployees', {
            alluser: response.data.successData.users,
            skills: valueMS,
          });
        })
        .catch(error => {});
    } else {
      Alert.alert('Profession is required');
    }
  };
  const addProfessionSkills = async (name, type) => {
    const AuthToken = await AsyncStorage.getItem('AuthToken');

    let newForm = new FormData();
    newForm.append('name', name);
    newForm.append('type', type);
    axios
      .post(URL + '/save-profession-skill', newForm, {
        headers: {Authorization: 'Bearer '.concat(AuthToken)},
      })
      .then(response => {
        Toast.show(response.data.message);
        if (type == 'profession') {
          SetProfession(name);
        }
      })
      .catch(error => {});
  };

  return (
    <View style={{marginLeft: hp(3), marginTop: hp(5)}}>
      <ScrollView keyboardShouldPersistTaps={'always'}>
        {show1 ? (
          <View>
            <Text style={{color: colors.blue, marginBottom: hp(2)}}>
              Profession *(required)
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 3,
                width: '40%',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                marginBottom: 5,
                borderRadius: 20,
                backgroundColor: '#dedede',
              }}>
              <Text
                style={{marginBottom: -4}}
                onPress={() => {
                  setshow1(false);
                }}
                numberOfLines={1}>
                {Newpro}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{flexDirection: 'row', width: wp(100)}}>
            <Myinput
              title={'Profession *(required)'}
              titleStyles={Style.txt}
              Placeholder={'Enter Profession'}
              OnChange={text => {
                setNewpro(text);
              }}
              onsearch={() => getProfession(Newpro)}
              onendSubmit={() => {
                addProfessionSkills(Newpro, 'profession');
                setNewpro(Newpro);
              }}
              Styles={[Style.inputview, {width: wp(90)}]}
            />
          </View>
        )}

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{margin: 10, flexDirection: 'row'}}>
            {professionarr.length != 0 ? (
              professionarr.map(item => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setNewpro(item);
                      setshow1(true);
                      professionarr = [];
                    }}
                    style={{
                      flexDirection: 'row',
                      borderRadius: 10,
                      margin: 10,
                    }}>
                    <Text
                      style={{
                        backgroundColor: '#dedede',
                        padding: 10,
                        borderRadius: 20,
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text></Text>
            )}
          </View>
        </ScrollView>
        <View
          style={{
            width: '90%',
            borderBottomColor: colors.blue,
            borderBottomWidth: 1,
          }}>
          <Text style={{color: colors.blue, marginTop: hp(3)}}>
            Age (optional)
          </Text>
          <Picker
            // title={'select age'}
            selectedValue={age}
            onValueChange={(itemValue, itemIndex) => setage(itemValue)}
            style={{paddingHorizontal: 40, color: 'grey'}}>
            <Picker.Item label="Please Select Age" value="0" />
            <Picker.Item label="10-15" value="10-15" />
            <Picker.Item label="15-20" value="15-20" />
            <Picker.Item label="20-25" value="20-25" />
            <Picker.Item label="25-30" value="25-30" />

            <Picker.Item label="30-35" value="30-35" />
            <Picker.Item label="35-40" value="35-40" />
            <Picker.Item label="40-45" value="40-45" />
            <Picker.Item label="45-50" value="45-50" />
            <Picker.Item label="50-55" value="50-55" />

            <Picker.Item label="55-60" value="55-60" />
            <Picker.Item label="60-75" value="60-75" />
            <Picker.Item label="75-80" value="75-80" />
            <Picker.Item label="80-Above" value="80-Above" />
          </Picker>
        </View>

        {/* <Myinput
                title ={'Age'}
                titleStyles={Style.txt}
                Placeholder="20-30"
                OnChange={text => setage(text)}
                Value={age}
                Styles={Style.inputview}
            /> */}
        <Myinput
          title={'Location (optional)'}
          titleStyles={Style.txt}
          Placeholder="Enter Location"
          OnChange={text => setLocation(text)}
          Value={Location}
          Styles={Style.inputview}
        />
        {/* <Myinput
                title ={'Experience(Years)'}
                titleStyles={Style.txt}
                Placeholder="3-5"
                OnChange={text => setExperience(text)}
                Value={Experience}
                Styles={Style.inputview}
            /> */}
        <View
          style={{
            width: '90%',
            borderBottomColor: colors.blue,
            borderBottomWidth: 1,
          }}>
          <Text style={{color: colors.blue, marginTop: hp(5)}}>
            Experience(Years) (optional)
          </Text>
          <Picker
            selectedValue={Experience}
            onValueChange={(itemValue, itemIndex) => setExperience(itemValue)}
            style={{paddingHorizontal: 40, color: 'grey'}}>
            <Picker.Item label="Please Select Experience" value="0" />
            <Picker.Item label="1-3" value="1-3" />
            <Picker.Item label="3-6" value="3-6" />
            <Picker.Item label="6-9" value="6-9" />
            <Picker.Item label="9-12" value="9-12" />
            <Picker.Item label="12-15" value="12-15" />
            <Picker.Item label="15-18" value="15-18" />
            <Picker.Item label="18-21" value="18-21" />
            <Picker.Item label="21-24" value="21-24" />
            <Picker.Item label="24-27" value="24-27" />
            <Picker.Item label="27-30" value="27-30" />
            <Picker.Item label="30-33" value="30-33" />
            <Picker.Item label="33-36" value="33-36" />
            <Picker.Item label="36-39" value="36-39" />
            <Picker.Item label="39-42" value="39-42" />
            <Picker.Item label="42-45" value="42-45" />
          </Picker>
        </View>
        {/* <Myinput
                title ={'Expected Salary'}
                titleStyles={Style.txt}
                Placeholder="20000-30000"
                OnChange={text => setSalary(text)}
                Value={Salary}
                Styles={Style.inputview}
            /> */}
        <View
          style={{
            width: '90%',
            borderBottomColor: colors.blue,
            borderBottomWidth: 1,
          }}>
          <Text style={{color: colors.blue, marginTop: hp(5)}}>
            Expected Salary (optional)
          </Text>
          <Picker
            selectedValue={Salary}
            onValueChange={(itemValue, itemIndex) => setSalary(itemValue)}
            style={{paddingHorizontal: 40, color: 'grey'}}>
            <Picker.Item label="Please Select" value="0" />

            <Picker.Item label="15K-50K" value="15K-50k" />
            <Picker.Item label="50K-75K" value="50K-75K" />
            <Picker.Item label="75K-100K" value="75K-100K" />
            <Picker.Item label="100K-150K" value="100K-150K" />
            <Picker.Item label="150K-200K" value="150K-200K" />
            <Picker.Item label="250K-300K" value="250K-300K" />
            <Picker.Item label="Above-300K" value="Above-300K" />
          </Picker>
        </View>

        {showskillsarr.length > 0 ? (
          <Text style={Style.txt}> Your All Skills </Text>
        ) : (
          <></>
        )}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{margin: 10, flexDirection: 'row'}}>
            {showskillsarr.length > 0 ? (
              showskillsarr.map(item => {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#dedede',
                      borderRadius: 10,
                      margin: 10,
                    }}>
                    <Text style={{padding: 10, borderRadius: 20}}>{item}</Text>
                    <Icon
                      name="close"
                      color={colors.blue}
                      reverse={true}
                      size={12}
                      onPress={() => ondel(item)}
                    />
                  </TouchableOpacity>
                );
              })
            ) : (
              <View></View>
            )}
          </View>
        </ScrollView>
        <View style={{flexDirection: 'row'}}>
          <Myinput
            title={'Skills (optional)'}
            titleStyles={Style.txt}
            Placeholder="Enter Skills"
            OnChange={text => {
              setsaveSkill(text);
            }}
            onsearch={() => getskills(saveSkill)}
            onendSubmit={() => {
              addProfessionSkills(saveSkill, 'skill');
              setshowskillsarr([...showskillsarr, saveSkill]);
            }}
            Value={saveSkill}
            Styles={{
              height: 40,
              borderColor: colors.blue,
              borderBottomWidth: 1,
              width: wp(73),
              color: colors.blue,
            }}
          />
          <TouchableOpacity
            style={{marginTop: hp(6)}}
            onPress={() => {
              if (
                showskillsarr.findIndex(
                  el => el.toLowerCase() == saveSkill.toLowerCase(),
                ) == -1
              )
                setshowskillsarr([...showskillsarr, saveSkill]);
              addProfessionSkills(saveSkill, 'skill');
              inputclear();
            }}>
            <Text style={{color: colors.blue}}>Add more</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={{flexDirection:"row"}}>
               <Myinput
                title ={'Skills (optional)'}
                titleStyles={Style.txt}
                Placeholder="Enter Skills"
                OnChange={(text) => setsaveSkill(text)}
                onsearch={()=>getskills(saveSkill)}
                Value={saveSkill}
                Styles={{
                  height:40,
                  borderColor:colors.blue,
                  borderBottomWidth:1,
                  width:wp(84),
                  color:colors.blue,
               }}
             />
             <TouchableOpacity style={{marginTop:hp(6)}} onPress={()=>{
               if(showskillsarr.findIndex(el => (el.toLowerCase() == saveSkill.toLowerCase())) == -1)
               setshowskillsarr([...showskillsarr, saveSkill]);
               addProfessionSkills(saveSkill,'skill')
               inputclear();
               
            }}
           
             >
             <Image  source={require('../asset/add.png')} />
             </TouchableOpacity>
             </View> */}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{margin: 10, flexDirection: 'row'}}>
            {arr.length != 0 ? (
              arr.map(item => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      // setshowskillsarr.push(item);
                      if (showskillsarr.findIndex(el => el == item) == -1)
                        setshowskillsarr([...showskillsarr, item]);
                      // setshowskills(showskillsarr);
                      getskills(item);
                      inputclear();
                    }}
                    style={{
                      flexDirection: 'row',
                      borderRadius: 10,
                      margin: 10,
                    }}>
                    <Text
                      style={{
                        backgroundColor: '#dedede',
                        padding: 10,
                        borderRadius: 20,
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text></Text>
            )}
          </View>
        </ScrollView>

        {/* skills end ======================== */}

        {/* <View style={Style.container}>

          <MultiselectDropdown
            label="Select you skills with multiple options"
            data={UserSkills}
            enableSearch
            enableAvatar
            chipType="outlined"
            value={valueMS}
            onChange={(label)=>onChangeMS(label)}
          />
        </View>  */}

        <Text style={Style.txt}>Availability (optional)</Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'row'}}>
            <MyCheckBox
              Checked={cash}
              textStyle={{color: '#774c16'}}
              checkedColor={'#774c16'}
              btnPress={() => {
                setcash(!cash);
                setcash1(false);
                setcash2(false);
                setavailability('Full-Time');
              }}
            />
            <Text style={{alignSelf: 'center', marginLeft: hp(-2.5)}}>
              Full Time
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <MyCheckBox
              Checked={cash1}
              textStyle={{color: '#774c16'}}
              checkedColor={'#774c16'}
              btnPress={() => {
                setcash1(!cash1);
                setcash(false);
                setcash2(false);
                setavailability('Part-Time');
              }}
            />
            <Text style={{alignSelf: 'center', marginLeft: hp(-2.5)}}>
              Part Time
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <MyCheckBox
              Checked={cash2}
              textStyle={{color: '#774c16'}}
              checkedColor={'#774c16'}
              btnPress={() => {
                setcash2(!cash2);
                setcash1(false);
                setcash(false);
                setavailability('Freelance');
              }}
            />
            <Text style={{alignSelf: 'center', marginLeft: hp(-2.5)}}>
              Freelance
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => Myfilter()} style={Style.btn}>
          <Text style={Style.btntxt}>APPLY</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const Style = StyleSheet.create({
  txt: {
    width: '100%',
    fontSize: 13,
    color: colors.blue,
    alignSelf: 'center',
    marginTop: hp(4),
    fontFamily: 'Raleway-Medium',
  },
  container: {
    paddingTop: 10,
    // marginLeft: 7,
    alignSelf: 'center',
    width: '100%',
    marginRight: 20,
    flex: 1,
  },
  inputview: {
    height: 40,
    borderColor: colors.blue,
    borderBottomWidth: 1,
    width: wp(86),
    color: colors.blue,
    fontFamily: 'Raleway-Medium',
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
  },
  btntxt: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Raleway-bold',
  },
});
