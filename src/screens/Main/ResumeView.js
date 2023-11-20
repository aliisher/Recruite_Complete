import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import Pdf from 'react-native-pdf';
import colors from '../../tools/color';
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'rn-fetch-blob';
const {fs} = RNFetchBlob;

export default function ResumeView(props) {
  const [Indicator, setIndicator] = useState(false);
  const [Progress, setProgress] = useState(0);
  const {resume} = props.route.params;
  let a = props.route.params.resume.split('/');
  let name = a[a.length - 1].split('.');
  console.log('sfiuasnfdsan', name);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () =>
      handleBackButtonClick(),
    );
    PermissionsAndroid.check('WRITE_EXTERNAL_STORAGE').then(response => {
      if (response === false) {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage',
            message: 'This app would like to store some files on your phone',
          },
        );
      }
    });
  }, []);

  const handleBackButtonClick = () => {
    props.navigation.goBack();
    return true;
  };

  const DownloadBook = () => {
    Toast.show('Downloading Please Wait');
    setIndicator(true);
    let PictureDir = fs.dirs.DownloadDir;
    let link =
      resume != undefined
        ? resume
        : 'https://www.hq.nasa.gov/alsj/a17/A17_FlightPlan.pdf';
    RNFetchBlob.config({
      overwrite: true,
      fileCache: true,
      path: `${PictureDir}/Recruit Me/${name[0]}.pdf`,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${PictureDir}/Recruit Me/${name[0]}.pdf`,
        description: 'Downloading image',
      },
    })
      .fetch('GET', link)
      .then(async response => {
        setIndicator(false);
        Toast.show(
          `Downloaded Please Check Directory ${response.data}`,
          Toast.LONG,
        );
        console.log('BookDownloadResponse', response);
      })
      .catch(err => {
        setIndicator(false);
        Toast.show('Downloading Error');
        console.log('The file error to ', err);
      });
  };

  return (
    <View style={{flex: 1}}>
      <Pdf
        source={
          resume != undefined
            ? {uri: resume}
            : {
                uri: 'http://www.pdf995.com/samples/pdf.pdf',
              }
        }
        onLoadComplete={(numberOfPages, filePath) => {
          setProgress(null);
        }}
        onError={error => {
          Toast.show('Error Loading');
        }}
        onLoadProgress={progress => {
          let a;
          (a = progress * 100), setProgress(a.toFixed(0));
        }}
        style={styles.pdf}
        renderActivityIndicator={() => null}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 10,
          alignSelf: 'center',
          backgroundColor: colors.blue,
          width: 100,
          alignItems: 'center',
          justifyContent: 'center',
          height: 50,
          borderRadius: 10,
        }}
        onPress={() =>
          Indicator == true ? Toast.show('Downloading') : DownloadBook()
        }>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 14,
            fontFamily: 'Raleway-regular',
            color: colors.white,
          }}>
          {Indicator == true ? (
            <ActivityIndicator color={colors.white} />
          ) : Progress == null ? (
            'Download'
          ) : (
            `${Progress}%`
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
