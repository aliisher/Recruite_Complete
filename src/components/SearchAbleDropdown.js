import React, {useRef, useEffect, useState} from 'react';
import {StyleSheet, Text, View, Keyboard} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {Icon} from 'react-native-elements';
import colors from '../tools/color';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SearchableDropdown from 'react-native-searchable-dropdown';

export default function DropdownComponent(props) {
  const dropdown = useRef(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return (
    <>
      <Text style={{marginTop: hp(3.5), color: colors.blue}}>
        {props.topText}
      </Text>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.blue,
          width: wp(90),
          flexDirection: 'row',
        }}>
        <SearchableDropdown
          items={props.options}
          onItemSelect={(item, index) => props.onSelect(index, item)}
          defaultIndex={0}
          containerStyle={{
            width: wp(80),
          }}
          resetValue={false}
          ref={dropdown}
          itemStyle={{
            paddingVertical: 2,
            paddingHorizontal: 10,
            width: wp(80),
            height: hp(4),
            justifyContent: 'center',
            backgroundColor: 'white',
            borderColor: 'lightgray',
            borderWidth: 0.5,
            borderTopWidth: 0,
          }}
          itemTextStyle={{
            fontSize: hp(2),
            color: colors.gray,
            fontWeight: '100',
          }}
          itemsContainerStyle={
            isKeyboardVisible ? {maxHeight: 150} : {display: 'none'}
          }
          textInputProps={{
            placeholder: props.defaultValue,
            onTextChange: text => console.log(text),
            ref: dropdown,
          }}
          listProps={{
            nestedScrollEnabled: true,
          }}
        />
        <View style={{marginTop: hp(3)}}>
          <Icon
            name="chevron-down"
            type="font-awesome-5"
            color={colors.blue}
            size={14}
            // style={{marginTop: hp(7), backgroundColor: 'blue'}}
            onPress={() => setKeyboardVisible(true)}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
