import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Myinput from '../../components/input';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../tools/color';
import MyCheckBox from '../../components/CheckBox';
import URL from '../../tools/URL';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import {Icon} from 'react-native-elements';
import {ActivityIndicator} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import DropdownComponent from '../../components/DropdownComponent';
import currencySymbol from 'currency-symbol';
import CurrencyInput from 'react-native-currency-input';
import {decodeEntity} from 'html-entities';
import SearchAbleDropdown from '../../components/SearchAbleDropdown';
let arr = [];
let professionarr = [];
let EduArr = [];
let skillArr = [];
let dataAchivement = [];
let filterskills = [];
let countryArr = [];

export default function UpdateProfile({route, navigation}) {
  const {userdata, other} = route.params;

  const [allCountries, setallCountries] = useState();
  const [cityArr, setCityArr] = useState();
  const [symbol, setSymbol] = useState(
    userdata.symbol != null || undefined ? userdata.symbol : '',
  );
  const [selectedCity, setSelectedCity] = useState(
    userdata.city != null || undefined ? userdata.city : '',
  );
  const [selectedCountry, setSelectedCountry] = useState(
    userdata.country != null || undefined ? userdata.country : '',
  );
  const [loader, setloader] = useState(false);
  const [uploader, setuploader] = useState(false);
  const [show1, setshow1] = useState('');
  const [skillsarray, setskillsarray] = useState([]);
  const [wskill, setwskill] = useState('');
  const [avail, setavail] = useState(
    userdata.availability && userdata.availability == 'Full-Time'
      ? true
      : false,
  );
  const [phoneCheck, setphoneCheck] = useState(
    userdata && userdata.phone_visibility != null
      ? userdata.phone_visibility
      : '0',
  );
  const [phoneStatus, setphoneStatus] = useState('Hide');
  const [avail2, setavail2] = useState(
    userdata.availability && userdata.availability == 'Part-Time'
      ? true
      : false,
  );
  const [avail3, setavail3] = useState(
    userdata.availability && userdata.availability == 'freelancer'
      ? true
      : false,
  );
  const [avail4, setavail4] = useState(
    userdata.availability && userdata.availability == 'unavailable'
      ? true
      : false,
  );
  const [data, setdata] = useState('');
  const [name, setname] = useState(
    userdata.name != null || undefined ? userdata.name : '',
  );
  const [age, setage] = useState(
    userdata.age != null || undefined ? userdata.age : '',
  );
  const [Profession, setProfeesion] = useState(
    userdata.profession != null || undefined ? userdata.profession : '',
  );
  const [AllEducation, setAllEducation] = useState([]);
  const [TotalEducation, setTotalEducation] = useState(
    userdata.education != null || undefined ? userdata.education : '',
  );
  const [collge1, setcollege1] = useState(null);
  const [Degree1, setDegree1] = useState(null);
  const [showskillsarr, setshowskillsarr] = useState([]);
  const [Achivievement, setAchivievement] = useState('');
  const [profileDescription, setprofileDescription] = useState(
    userdata.description != null || undefined ? userdata.description : '',
  );
  const [Location, setLocation] = useState(
    userdata.city != null || undefined ? userdata.city : '',
  );
  const [Employee, setEmployee] = useState(
    userdata.status && userdata.status == 'employed' ? true : false,
  );
  const [unEmployed, setunEmployed] = useState(
    userdata.status && userdata.status == 'unemployed' ? true : false,
  );
  const [fresh, setfresh] = useState(
    userdata.status && userdata.status == 'fresh' ? true : false,
  );
  const [company, setcompany] = useState(
    userdata.company != null ? userdata.company : '',
  );
  const [designation, setdesignation] = useState(
    userdata.designation != null ? userdata.designation : '',
  );
  const [salary, setsalary] = useState(
    userdata.current_salary != null ? userdata.current_salary : '',
  );
  const [Experience, setExperience] = useState(
    userdata.experience != null || undefined ? userdata.experience : '',
  );
  const [ExpectedSalary, setExpectedSalary] = useState(
    userdata.expected_salary != null || undefined
      ? userdata.expected_salary
      : '',
  );
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState([]);
  const [phone, setphone] = useState(
    userdata.phone != null || undefined ? userdata.phone : '',
  );
  const [UserSkills, setUserSkills] = useState('');
  const [UserProfession, setUserProfession] = useState('');
  const [Achivementarr, setAchivementarr] = useState([]);
  const [pic, setpic] = useState('');
  const [Url, setUrl] = useState('');
  const [jobstatus, setjobstatus] = useState(
    userdata.status != null || undefined ? userdata.status : '',
  );
  const [myavailable, setmyavailable] = useState(
    userdata.availability != null || undefined ? userdata.availability : '',
  );
  const [profile, setprofile] = useState(userdata);
  const [profileImage, setprofileImage] = useState(userdata);
  const [Newpro, setNewpro] = useState(
    userdata.profession != null || undefined ? userdata.profession : '',
  );
  const [saveSkill, setsaveSkill] = useState('');
  const [resume, setResume] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getallCountriesArr();
    });
  }, []);

  const getallCountriesArr = () => {
    axios
      .get('https://countriesnow.space/api/v0.1/countries/currency')
      .then(res => {
        console.log('Success Reponse', res);
        setallCountries(res.data.data);
        countryArr = res.data.data.map((item, index) => {
          return {name: item.name, id: index};
        });
      })
      .catch(error => {
        console.log('Error Response', error);
      });
  };

  const getCities = (item, index) => {
    axios({
      method: 'post',
      url: 'https://countriesnow.space/api/v0.1/countries/cities',
      headers: {},
      data: {
        country: item.name,
      },
    })
      .then(res => {
        console.log('Cities Success Reponse', res);
        setCityArr(
          res.data.data
            .map((item, index) => {
              return {name: item, id: index};
            })
            .sort(),
        );
      })
      .catch(error => {
        console.log('Error Response', error.response);
        Toast.show('No Cities Found');
      });
    // let finded = allCountries.find(item => {
    //   if (item.item == item) {
    //     return item;
    //   }
    // });
    setSelectedCountry(item.name);
    let sym = currencySymbol.symbol(item.currency);
    let formattedCurrency = decodeEntity(sym);
    if (formattedCurrency != undefined && sym != undefined) {
      setSymbol(formattedCurrency);
    } else {
      setSymbol('$');
    }
  };

  const inputclear = () => {
    setwskill('');
    setAchivievement('');
    setUrl('');
    setsaveSkill('');
    setcollege1('');
    setDegree1('');
  };
  useEffect(() => {
    // Achivementarr=[]
    getalldata();
  }, []);
  const getalldata = async () => {
    EduArr = [];
    skillArr = [];
    setAchivementarr([]);
    dataAchivement = [];
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
        setSelectedSkills(res.data.successData.user.skills);
        setSelectedProfession(res.data.successData.user.profession);
        //   setUserSkills(res.data.successData.skills)
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
        setdata(res.data.successData.user);
        res.data.successData.user.degrees.map(item => {
          EduArr.push(item);
        });

        userdata.skills.map(item => {
          skillArr.push(item.skill);
        });
        userdata.achievements.map(item => {
          if (item.achievement != item) dataAchivement.push(item.achievement);
        });
        setshowskillsarr(skillArr);
        setAchivementarr(dataAchivement);
        let EducationArray = userdata.degrees;
        EducationArray = EducationArray.reduce((item_arr, item) => {
          item_arr.push({
            institute: item.institute,
            degree: item.degree,
            image: item.image,
          });
          return item_arr;
        }, []);
        setAllEducation(EducationArray);
      })
      .catch(error => {
        console.error('Eror Message', JSON.parse(JSON.stringify(error)));
      });
  };
  const launchcameras = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      ImagUpload(image);
      setUrl(image);
    });
  };
  const onloadProfile = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      //  ImagUpload(image);
      console.log('THis is iamge', image);
      // setprofile(image);
      setprofileImage(image);
      Toast.show('Profile Image Uploaded');
    });
  };

  ///////////////////////////////////Resume Add Fucntions

  const onAddResume = async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
      });
      console.log(response);
      if (response[0].type == 'application/pdf') {
        setResume(response);
      } else {
        Toast.show('Please Select PDF File');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const ImagUpload = async photo => {
    setuploader(true);
    const AuthToken = await AsyncStorage.getItem('AuthToken');
    let ur = photo.path;
    let data = photo.path.replace('file:///', 'file://');
    var formdata = new FormData();
    photo.path &&
      formdata.append('file', {
        uri: photo.path,
        name: 'photo.jpg',
        type: 'jpeg/jpg',
      });
    const config = {
      headers: {
        Authorization: 'Bearer '.concat(AuthToken),
        'Content-Type':
          'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
      },
    };
    axios
      .post('https://recruitme.pk/api/upload-file', formdata, config)
      .then(res => {
        console.log('check image response', res);
        setpic(res.data.successData.path);
        setuploader(false);
      })
      .catch(error => {
        console.error('Eror Message', JSON.parse(JSON.stringify(error)));
        setuploader(false);
      });
  };

  const getskills = async skills => {
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
            setNewpro(item);
          });
        } else {
          setNewpro(profession);
          professionarr = [];
        }
      })
      .catch(error => {});
  };
  const ondel = item => {
    let newArrr = showskillsarr.filter(el => el != item);
    setshowskillsarr(newArrr);
  };
  const onachivementdel = item => {
    let newArrr = Achivementarr.filter(el => el != item);
    setAchivementarr(newArrr);
  };

  const oneducationdel = item => {
    let newArrr = AllEducation.filter(el => el != item);
    setAllEducation(newArrr);
  };

  const LoadData = async () => {
    if (
      name == '' ||
      age == '' ||
      Newpro == '' ||
      phone == '' ||
      Experience == '' ||
      jobstatus == '' ||
      myavailable == ''
    ) {
      alert('Please Fill Out The Mandatory Fields *(required)');
      setloader(false);
    } else {
      if (jobstatus == 'Fresh') {
        setExperience('0');
      } else {
        setExperience('');
      }
      setloader(true);
      const AuthToken = await AsyncStorage.getItem('AuthToken');
      const formdata = new FormData();
      formdata.append('name', name);
      formdata.append('age', age);
      formdata.append('profession', Newpro);
      formdata.append('experience', Experience);
      formdata.append('education', TotalEducation);
      formdata.append('description', profileDescription);
      formdata.append('city', Location);
      formdata.append('expected_salary', ExpectedSalary);
      formdata.append('status', jobstatus);
      formdata.append('phone', phone);
      formdata.append('phone_visibility', phoneCheck);
      formdata.append('company', company);
      formdata.append('designation', designation);
      formdata.append('current_salary', salary);
      formdata.append('availability', myavailable);
      // formdata.append('image',Url.path);
      // const path = Platform.OS == 'ios'? Url.path.replace('file//',''):Url.path

      profileImage.path && profileImage.path != undefined
        ? formdata.append('image', {
            uri: profileImage.path,
            name: 'photo.jpg',
            type: 'jpeg/jpg',
          })
        : formdata.append('image', profileImage.image);

      formdata.append('degree', JSON.stringify(AllEducation));
      formdata.append('achievements', JSON.stringify(Achivementarr));
      formdata.append('skills', JSON.stringify(showskillsarr));
      if (resume && resume.length < 1) {
        // Toast.show('Please Add Resume First');
        // setloader(false);
      } else {
        resume[0].uri &&
          formdata.append('resume', {
            uri: resume[0].uri,
            name: resume[0].name,
            type: resume[0].type,
          });
      }
      formdata.append('symbol', symbol);
      formdata.append('country', selectedCountry);
      formdata.append('city', selectedCity);
      axios
        .post(URL + '/update-profile', formdata, {
          headers: {
            Authorization: 'Bearer '.concat(AuthToken),
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(async response => {
          console.log('check the profile update response', response);
          navigation.navigate('EmployeeProfile', {filter: false});
          setloader(false);
        })
        .catch(error => {
          console.log('check the profile update errir', error.response);
          Toast.show(error.response.data.message);
          setloader(false);
        });
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
        if (type == 'profession') {
          setProfeesion(name);
        }
      })
      .catch(error => {});
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        style={{paddingLeft: 20}}>
        <Myinput
          title={'Name *(required)'}
          titleStyles={Style.txt}
          Placeholder={userdata.name}
          OnChange={text => setname(text)}
          Value={name}
          Styles={Style.inputview}
        />
        <Myinput
          title={'Age *(required)'}
          titleStyles={Style.txt}
          Placeholder={userdata.age}
          OnChange={text => setage(text)}
          Value={age}
          Styles={Style.inputview}
        />
        {/* <Text style={Style.txt}>Profession *</Text> */}
        {selectedProfession != '' || null ? (
          <View
            style={{
              width: '60%',
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
              height: 25,
              flexDirection: 'row',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: 'blue',
            }}>
            <TouchableOpacity
              style={{position: 'absolute', right: 5}}
              onPress={() => {
                if (show1 == true) {
                  setNewpro(Newpro);
                } else {
                  setNewpro('');
                }
                setSelectedProfession([]);
              }}>
              <Icon name="x" color={colors.blue} size={18} type={'feather'} />
            </TouchableOpacity>
            <Text numberOfLines={1} style={{marginRight: 10}}>
              {' '}
              {selectedProfession}
            </Text>
          </View>
        ) : (
          <Text></Text>
        )}
        {show1 ? (
          <View style={{marginTop: hp(4)}}>
            <View
              style={{
                height: 80,
                borderColor: colors.blue,
                borderBottomWidth: 1,
                width: wp(90),
                color: colors.blue,
              }}>
              {/* <Text style={{
                      width:'100%',
                      fontSize:13,
                      color:colors.blue,
                      alignSelf:'center',
                      fontFamily:'Raleway-medium',

                   }} >Profession*</Text> */}
              <View
                style={{
                  marginTop: 10,
                  width: '40%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                  marginBottom: 20,
                  borderRadius: 20,
                  backgroundColor: '#dedede',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setshow1(false);
                    setNewpro(userdata.profession);
                  }}
                  style={{position: 'absolute', right: 5}}>
                  <Icon
                    name="x"
                    color={colors.blue}
                    size={18}
                    type={'feather'}
                  />
                </TouchableOpacity>
                <Text style={{marginBottom: -4}} numberOfLines={1}>
                  {Newpro}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={{flexDirection: 'row', width: wp(100)}}>
            <Myinput
              title={'Profession *(required)'}
              titleStyles={Style.txt}
              Placeholder={userdata.profession}
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

        {/* Education Start---------------------- */}

        <View style={{flexDirection: 'row'}}>
          <Myinput
            title={'Education (optional)'}
            titleStyles={Style.txt}
            Placeholder={userdata.education}
            OnChange={text => setTotalEducation(text)}
            Value={TotalEducation}
            Styles={Style.inputview2}
          />
        </View>

        {AllEducation.length > 0 ? (
          AllEducation.map(item => {
            return (
              <TouchableOpacity
                onPress={() => oneducationdel(item)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: 'white',
                  width: wp(85),
                  padding: 10,
                  borderRadius: 20,
                  borderRadius: 10,
                  margin: 10,
                  alignItems: 'center',
                }}>
                <Image
                  source={{uri: item.image}}
                  style={{
                    alignSelf: 'center',
                    width: 60,
                    height: 50,
                    borderRadius: 10,
                  }}
                />
                <Text
                  style={{
                    color: 'black',
                    width: 100,
                    margin: 1,
                    fontWeight: '600',
                    fontSize: 15,
                    paddingLeft: 20,
                  }}>
                  {item.institute}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    width: 100,
                    margin: 1,
                    fontWeight: '600',
                    fontSize: 15,
                  }}>
                  {item.degree}
                </Text>
                <Icon
                  name="close"
                  color={colors.blue}
                  style={{marginRight: 10}}
                  reverse={true}
                  size={12}
                  onPress={() => oneducationdel(item)}
                />
              </TouchableOpacity>
            );
          })
        ) : (
          <View></View>
        )}

        <View>
          <Myinput
            title={'College/University (optional)'}
            titleStyles={Style.txt}
            Placeholder="Name"
            OnChange={text => setcollege1(text)}
            Value={collge1}
            Styles={Style.inputview}
          />
          <Myinput
            title={'Degree (optional)'}
            titleStyles={Style.txt}
            Placeholder="Bsc"
            OnChange={text => setDegree1(text)}
            Value={Degree1}
            Styles={Style.inputview}
          />

          {uploader ? (
            <ActivityIndicator size={22} color={'blue'} />
          ) : (
            <Text></Text>
          )}

          {Url ? (
            <View style={{alignItems: 'center', marginTop: 5}}>
              <TouchableOpacity
                onPress={() => launchcameras()}
                style={{
                  justifyContent: 'center',
                  width: 240,
                  height: 100,
                  marginTop: hp(10),
                  borderRadius: 5,
                  backgroundColor: 'gray',
                }}>
                <Image
                  source={{uri: Url.path}}
                  style={{
                    alignSelf: 'center',
                    width: '100%',
                    height: 200,
                    borderRadius: 10,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => launchcameras()}
              style={{flexDirection: 'row', marginTop: hp(5)}}>
              <Image source={require('../asset/Add_photo.png')} />
              <Text
                style={{
                  color: colors.blue,
                  marginLeft: 10,
                  alignSelf: 'center',
                }}>
                {' '}
                Add certificate{' '}
              </Text>
            </TouchableOpacity>
          )}
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                //   if(showskillsarr.findIndex(el => (el.toLowerCase() == wskill.toLowerCase())) == -1)
                setAllEducation([
                  ...AllEducation,
                  {institute: collge1, degree: Degree1, image: pic},
                ]);
                //   setAllEducation(AllEducation);
                inputclear();
              }}
              style={{
                alignSelf: 'flex-start',
                marginTop: hp(10),
                flexDirection: 'row',
              }}>
              <Image source={require('../asset/add.png')} />
              <Text style={{fontWeight: '400', marginLeft: 10}}>Add more</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={uploader == true ? true : false}
              onPress={() => {
                //   if(showskillsarr.findIndex(el => (el.toLowerCase() == wskill.toLowerCase())) == -1)
                setAllEducation([
                  ...AllEducation,
                  {institute: collge1, degree: Degree1, image: pic},
                ]);
                inputclear();
              }}
              style={{
                marginLeft: 20,
                alignSelf: 'flex-start',
                width: 60,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                height: 25,
                backgroundColor: colors.blue,
                marginTop: hp(10),
                flexDirection: 'row',
              }}>
              {/* <Image  source={require('../asset/add.png')} /> */}
              <Text style={{color: 'white', fontWeight: '400'}}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Education end ======================== */}

        {/* skills start ======================== */}

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

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {arr.length != 0 ? (
            arr.map(item => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (showskillsarr.findIndex(el => el == item) == -1)
                      setshowskillsarr([...showskillsarr, item]);
                    inputclear();
                  }}
                  style={{flexDirection: 'row', borderRadius: 10, margin: 10}}>
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
          {/* </View> */}
        </ScrollView>
        {/* skills end ======================== */}

        {/* Achivemnts start ======================== */}

        {Achivementarr.length > 0 ? (
          <Text style={Style.txt}> Your All Achievement </Text>
        ) : (
          <></>
        )}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{margin: 10, flexDirection: 'row'}}>
            {Achivementarr.length > 0 ? (
              Achivementarr.map(item => {
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
                      onPress={() => onachivementdel(item)}
                    />
                  </TouchableOpacity>
                );
              })
            ) : (
              <></>
            )}
          </View>
        </ScrollView>

        <View style={{flexDirection: 'row'}}>
          <Myinput
            title={'Achievement (optional)'}
            titleStyles={Style.txt}
            Placeholder="Enter achievement"
            OnChange={text => setAchivievement(text)}
            Value={Achivievement}
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
                Achivementarr.findIndex(
                  el => el.toLowerCase() == Achivievement.toLowerCase(),
                ) == -1
              )
                setAchivementarr([...Achivementarr, Achivievement]);
              inputclear();
            }}>
            <Text style={{color: colors.blue}}>Add more</Text>
          </TouchableOpacity>
        </View>

        {/* Achivements end ======================== */}

        <Myinput
          title={'Profile Description (optional)'}
          titleStyles={Style.txt}
          Placeholder={userdata.description}
          OnChange={text => setprofileDescription(text)}
          Value={profileDescription}
          Styles={Style.inputview}
        />
        <View>
          <Myinput
            title={'Phone Number *(required)'}
            titleStyles={Style.txt}
            KeyboardType={'decimal-pad'}
            Placeholder={userdata.phone != '' ? userdata.phone : 'Enter Phone'}
            OnChange={text => setphone(text)}
            Value={phone}
            Styles={{
              height: 40,
              borderColor: colors.blue,
              borderBottomWidth: 1,
              width: wp(90),
              color: colors.blue,
            }}
          />
          {/* <View
            style={{
              flexDirection: 'row',
              height: 80,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'flex-start',
            }}> */}
          <MyCheckBox
            Checked={phoneCheck === '0' ? false : true}
            Title={'Do you want to show your number on your profile?'}
            textStyle={{color: colors.black, fontSize: 14}}
            CheckedIcon={'dot-circle-o'}
            UncheckedIcon={'circle-o'}
            right={true}
            checkedColor={colors.blue}
            ContainerStyle={{
              backgroundColor: 'white',
              width: wp(91),
              borderColor: 'white',
            }}
            btnPress={async () => {
              phoneCheck === '0' ? setphoneCheck('1') : setphoneCheck('0');
            }}
          />
        </View>
        <SearchAbleDropdown
          topText={'Country'}
          options={
            allCountries && allCountries.length > 0
              ? allCountries.sort()
              : [{name: 'Loading', id: 0}]
          }
          defaultValue={
            (userdata && userdata.country != null) || undefined
              ? userdata.country
              : 'Please Select Country (optional)'
          }
          onSelect={(index, value) => getCities(value, index)}
        />
        {/* <DropdownComponent
          topText={'Country'}
          options={countryArr.length > 0 ? countryArr.sort() : ['Loading']}
          defaultValue={
            (userdata && userdata.country != null) || undefined
              ? userdata.country
              : 'Please Select Country (optional)'
          }
          onSelect={(index, value) => getCities(value, index)}
        /> 
        <DropdownComponent
          topText={'City'}
          options={cityArr && cityArr.length > 0 ? cityArr : ['Loading']}
          defaultValue={
            (userdata && userdata.city != null) || undefined
              ? userdata.city
              : 'Please Select City (optional)'
          }
          onSelect={(index, value) => setSelectedCity(value)}
        />*/}
        <SearchAbleDropdown
          topText={'City'}
          options={
            cityArr && cityArr.length > 0
              ? cityArr.sort()
              : [{name: 'Loading', id: 0}]
          }
          defaultValue={
            (userdata && userdata.city != null) || undefined
              ? userdata.city
              : 'Please Select City (optional)'
          }
          onSelect={(index, value) => setSelectedCity(value.name)}
        />

        <Text style={Style.txt}>Availability Status (optional)</Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'row'}}>
            <MyCheckBox
              Checked={Employee}
              CheckedIcon={'dot-circle-o'}
              UncheckedIcon={'circle-o'}
              //   status={checked ? 'checked' : 'unchecked'}
              textStyle={{color: colors.blue}}
              checkedColor={colors.blue}
              btnPress={() => {
                setEmployee(!Employee);
                setunEmployed(false);
                setfresh(false);
                setjobstatus('Employed');
              }}
            />
            <Text style={{alignSelf: 'center', marginLeft: hp(-2.5)}}>
              Employed
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <MyCheckBox
              CheckedIcon={'dot-circle-o'}
              UncheckedIcon={'circle-o'}
              Checked={unEmployed}
              //   status={checked ? 'checked' : 'unchecked'}
              textStyle={{color: colors.blue}}
              checkedColor={colors.blue}
              btnPress={() => {
                setunEmployed(!unEmployed);
                setfresh(false);
                setEmployee(false);
                setjobstatus('Unemployed');
              }}
            />
            <Text style={{alignSelf: 'center', marginLeft: hp(-2.5)}}>
              Unemployed
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <MyCheckBox
              Checked={fresh}
              CheckedIcon={'dot-circle-o'}
              UncheckedIcon={'circle-o'}
              textStyle={{color: colors.blue}}
              checkedColor={colors.blue}
              btnPress={() => {
                setfresh(!fresh);
                setEmployee(false);
                setcompany('');
                setdesignation('');
                setsalary('');
                setExperience(0);
                setExpectedSalary('');
                setunEmployed(false);
                setExperience('0');
                setjobstatus('Fresh');
              }}
            />
            <Text style={{alignSelf: 'center', marginLeft: hp(-2.5)}}>
              Fresh
            </Text>
          </View>
        </View>
        {jobstatus === 'Fresh' || jobstatus === 'fresh' ? (
          <>
            <Text style={Style.txt}>Employment Details</Text>
            <View style={Style.currencyInputView}>
              <Text style={Style.txt}>Expected Salary *(required)</Text>
              <CurrencyInput
                value={ExpectedSalary}
                elimiter={''}
                separator={''}
                delimiter={''}
                prefix={symbol}
                precision={0}
                onChangeValue={setExpectedSalary}
                onChangeText={text => console.log('on change text', text)}
                style={{height: 40, fontSize: 14, color: 'black'}}
              />
            </View>
            {/* <Myinput
              title={'Expected Salary *(required)'}
              titleStyles={Style.txt}
              KeyboardType={'numeric'}
              Placeholder="Expected Salary"
              OnChange={text => setExpectedSalary(text)}
              onendSubmit={text => setExpectedSalary(`${symbol}${text}`)}
              Value={ExpectedSalary}
              Styles={Style.inputview}
            /> */}
          </>
        ) : (
          <></>
        )}
        {jobstatus === 'Employed' || jobstatus === 'employed' ? (
          <>
            <Text style={Style.txt}>Employment Details</Text>
            <Myinput
              title={'Company (optional)'}
              titleStyles={Style.txt}
              Placeholder="Your Company"
              OnChange={text => setcompany(text)}
              Value={company}
              Styles={Style.inputview}
            />
            <Myinput
              title={'Designation (optional)'}
              titleStyles={Style.txt}
              Placeholder="Your Designation"
              OnChange={text => setdesignation(text)}
              Value={designation}
              Styles={Style.inputview}
            />
            <View style={Style.currencyInputView}>
              <Text style={Style.txt}>Salary (optional)</Text>
              <CurrencyInput
                value={salary}
                elimiter={''}
                separator={''}
                delimiter={''}
                prefix={symbol}
                precision={0}
                onChangeValue={setsalary}
                onChangeText={text => console.log('on change text', text)}
                style={{height: 40, fontSize: 14, color: 'black'}}
              />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Myinput
                title={'Experience(Years) (optional)'}
                titleStyles={Style.txt}
                KeyboardType={'number-pad'}
                Placeholder="Enter Experience"
                OnChange={text => setExperience(text)}
                Value={Experience}
                Styles={Style.inputview2}
              />
              <View style={Style.currencyInputView2}>
                <Text style={Style.txt} numberOfLines={1}>
                  Expected Salary *(required)
                </Text>
                <CurrencyInput
                  value={ExpectedSalary}
                  elimiter={''}
                  separator={''}
                  delimiter={''}
                  prefix={symbol}
                  precision={0}
                  onChangeValue={setExpectedSalary}
                  onChangeText={text => console.log('on change text', text)}
                  style={{height: 40, fontSize: 14, color: 'black'}}
                />
              </View>
            </View>
          </>
        ) : (
          <></>
        )}
        {jobstatus === 'Unemployed' || jobstatus === 'unemployed' ? (
          <>
            <Text style={Style.txt}> Last Employment Details</Text>
            <Myinput
              title={'Company (optional)'}
              titleStyles={Style.txt}
              Placeholder="Your Company"
              OnChange={text => setcompany(text)}
              Value={company}
              Styles={Style.inputview}
            />
            <Myinput
              title={'Desigation (optional)'}
              titleStyles={Style.txt}
              Placeholder="Your Desigation"
              OnChange={text => setdesignation(text)}
              Value={designation}
              Styles={Style.inputview}
            />
            <View style={Style.currencyInputView}>
              <Text style={Style.txt}>Last Salary (optional)</Text>
              <CurrencyInput
                value={salary}
                elimiter={''}
                separator={''}
                delimiter={''}
                prefix={symbol}
                precision={0}
                onChangeValue={setsalary}
                onChangeText={text => console.log('on change text', text)}
                style={{height: 40, fontSize: 14, color: 'black'}}
              />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Myinput
                title={'Experience(Years) (optional)'}
                titleStyles={Style.txt}
                Placeholder="Enter Experience"
                OnChange={text => setExperience(text)}
                Value={Experience}
                Styles={Style.inputview2}
              />
              <View style={Style.currencyInputView2}>
                <Text style={Style.txt} numberOfLines={1}>
                  Expected Salary *(required)
                </Text>
                <CurrencyInput
                  value={ExpectedSalary}
                  elimiter={''}
                  separator={''}
                  delimiter={''}
                  prefix={symbol}
                  precision={0}
                  onChangeValue={setExpectedSalary}
                  onChangeText={text => console.log('on change text', text)}
                  style={{height: 40, fontSize: 14, color: 'black'}}
                />
              </View>
            </View>
          </>
        ) : (
          <></>
        )}
        <Text style={Style.txt}>Availability *(required)</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '80%',
          }}>
          <View style={{flexDirection: 'row'}}>
            <MyCheckBox
              Checked={avail}
              CheckedIcon={'dot-circle-o'}
              UncheckedIcon={'circle-o'}
              //   status={checked ? 'checked' : 'unchecked'}
              textStyle={{color: colors.blue}}
              checkedColor={colors.blue}
              btnPress={() => {
                setavail(!avail);
                setavail2(false);
                setavail3(false);
                setavail4(false);
                setmyavailable('Full-Time');
              }}
            />
            <Text style={{alignSelf: 'center', marginLeft: hp(-2.5)}}>
              Full Time
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <MyCheckBox
              Checked={avail2}
              CheckedIcon={'dot-circle-o'}
              UncheckedIcon={'circle-o'}
              textStyle={{color: colors.blue}}
              checkedColor={colors.blue}
              btnPress={() => {
                setavail(false);
                setavail2(!avail2);
                setavail3(false);
                setavail4(false);
                setmyavailable('Part-Time');
              }}
            />
            <Text style={{alignSelf: 'center', marginLeft: hp(-2.5)}}>
              Part Time
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 15,
            justifyContent: 'space-between',
            width: '84%',
          }}>
          <View style={{flexDirection: 'row'}}>
            <MyCheckBox
              Checked={avail3}
              CheckedIcon={'dot-circle-o'}
              UncheckedIcon={'circle-o'}
              textStyle={{color: colors.blue}}
              checkedColor={colors.blue}
              btnPress={() => {
                setavail3(!avail3);
                setavail(false);
                setavail2(false);
                setavail4(false);
                setmyavailable('freelancer');
              }}
            />
            <Text style={{alignSelf: 'center', marginLeft: hp(-2.5)}}>
              Freelance
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <MyCheckBox
              Checked={avail4}
              CheckedIcon={'dot-circle-o'}
              UncheckedIcon={'circle-o'}
              textStyle={{color: colors.blue}}
              checkedColor={colors.blue}
              btnPress={() => {
                setavail4(!avail4);
                setavail(false);
                setavail2(false);
                setavail3(false);
                setmyavailable('unavailable');
              }}
            />
            <Text style={{alignSelf: 'center', marginLeft: hp(-2.5)}}>
              Currently unavailable
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: wp(90),
          }}>
          {profile ? (
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => onloadProfile()}
                style={{
                  justifyContent: 'center',
                  height: 40,
                  borderRadius: 5,
                  flexDirection: 'row',
                }}>
                <Image
                  source={{uri: profile.image}}
                  style={{
                    alignSelf: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                  }}
                />
                <Text
                  style={{
                    color: colors.blue,
                    marginLeft: 10,
                    alignSelf: 'center',
                  }}>
                  Change Profile{'  '}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => onloadProfile()}
              style={{flexDirection: 'row'}}>
              <Image
                source={require('../asset/Add_photo.png')}
                style={{width: 30, height: 30, borderRadius: 6}}
              />
              <Text
                style={{
                  color: colors.blue,
                  marginLeft: 10,
                  alignSelf: 'center',
                }}>
                Add Profile Photo{'  '}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => onAddResume()}
            style={{flexDirection: 'row'}}>
            <Image
              source={require('../asset/attachment.png')}
              style={{width: 30, height: 30, borderRadius: 6}}
            />
            <Text
              style={{
                color: colors.blue,
                marginLeft: 10,
                alignSelf: 'center',
              }}>
              {resume && resume.length > 0
                ? '1 File Uploaded'
                : 'Upload Your Resume'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => LoadData()} style={Style.btn}>
          {loader ? (
            <ActivityIndicator size={22} color={'white'} />
          ) : (
            <Text style={Style.btntxt}>Save and Make My Profile</Text>
          )}
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
    fontFamily: 'Raleway-medium',
    marginTop: hp(4),
  },
  currencyInputView: {
    borderBottomWidth: 1,
    borderBottomColor: colors.blue,
    width: wp(90),
  },
  currencyInputView2: {
    borderBottomWidth: 1,
    borderBottomColor: colors.blue,
    width: wp(45),
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
    width: wp(90),
    color: colors.blue,
  },
  btn: {
    height: 50,
    // width:wp(55),
    paddingHorizontal: wp(6),
    backgroundColor: colors.blue,
    marginVertical: hp(2),
    alignSelf: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(5),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  btntxt: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
  },
  inputview2: {
    height: 40,
    borderColor: colors.blue,
    borderBottomWidth: 1,
    width: wp(40),
    color: colors.blue,
  },
});
