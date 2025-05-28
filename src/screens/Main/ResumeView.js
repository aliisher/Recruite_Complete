import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  ActivityIndicator,
  BackHandler,
  Linking,
  Alert,
} from 'react-native';
import Pdf from 'react-native-pdf';
import colors from '../../tools/color';
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'rn-fetch-blob';

const {fs} = RNFetchBlob;

export default function ResumeView(props) {
  const [Indicator, setIndicator] = useState(false);
  const [Progress, setProgress] = useState(0);
  const [localPdfPath, setLocalPdfPath] = useState(null);
  const {resume} = props.route.params;

  let nameParts = resume.split('/');
  let fileName = nameParts[nameParts.length - 1].split('.')[0];

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
    );

    checkAndRequestPermission();

    return () => backHandler.remove();
  }, []);

  const checkAndRequestPermission = async () => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to download files to your device.',
          buttonPositive: 'Allow',
        },
      );

      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('✅ Permission granted');
      } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('❌ Never ask again');
        Alert.alert(
          'Permission Required',
          'Storage permission was permanently denied. Please enable it from app settings.',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      } else {
        console.log('❌ Permission denied');
      }
    } catch (err) {
      console.warn('Permission error:', err);
    }
  };

  const handleBackButtonClick = () => {
    props.navigation.goBack();
    return true;
  };

  const DownloadBook = async () => {
    Toast.show('Downloading Please Wait');
    setIndicator(true);

    let PictureDir = fs.dirs.DownloadDir;
    let folderPath = `${PictureDir}/Recruit Me`;
    let filePath = `${folderPath}/${fileName}.pdf`;

    try {
      const exists = await fs.isDir(folderPath);
      if (!exists) {
        await fs.mkdir(folderPath);
      }

      RNFetchBlob.config({
        overwrite: true,
        fileCache: true,
        path: filePath,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: filePath,
          description: 'Downloading Resume',
          title: `${fileName}.pdf`, // Optional
          mime: 'application/pdf',
        },
      })
        .fetch('GET', resume)
        .then(response => {
          setIndicator(false);
          Toast.show(`Downloaded to ${filePath}`, Toast.LONG);
          console.log('Download Success Path:', response.path());
          setLocalPdfPath(`file://${filePath}`);
        })
        .catch(err => {
          setIndicator(false);
          Toast.show('Downloading Error');
          console.log('File download error:', err);
        });
    } catch (err) {
      setIndicator(false);
      Toast.show('Directory error');
      console.log('Folder or download error:', err);
    }
  };

  return (
    <View style={{flex: 1}}>
      {localPdfPath ? (
        <Pdf
          source={{uri: localPdfPath}}
          onLoadComplete={(numberOfPages, filePath) => {
            setProgress(null);
          }}
          onError={error => {
            Toast.show('Error Loading');
            console.log('PDF Load Error', error);
          }}
          onLoadProgress={progress => {
            let percentage = progress * 100;
            setProgress(percentage.toFixed(0));
          }}
          style={styles.pdf}
          renderActivityIndicator={() => null}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'gray', fontSize: 16}}>No PDF loaded</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() =>
          Indicator === true ? Toast.show('Downloading') : DownloadBook()
        }>
        <Text style={styles.downloadText}>
          {Indicator === true ? (
            <ActivityIndicator color={colors.white} />
          ) : Progress === null ? (
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
  downloadButton: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: colors.blue,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
  },
  downloadText: {
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: 'Raleway-regular',
    color: colors.white,
  },
});
