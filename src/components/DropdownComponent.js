import React, {useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {Icon} from 'react-native-elements';
import colors from '../tools/color';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function DropdownComponent(props) {
  const dropdown = useRef(null);
  return (
    <>
      <Text style={{marginTop: hp(3.5), color: colors.blue}}>
        {props.topText}
      </Text>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.blue,
          marginVertical: hp(0.5),
          width: wp(90),
          flexDirection: 'row',
          paddingVertical: hp(2),
        }}>
        <ModalDropdown
          ref={dropdown}
          value={props.value}
          defaultValue={props.defaultValue}
          options={props.options}
          defaultTextStyle={{
            color: colors.gray,
            fontSize: hp(2),
            width: wp(80),
          }}
          isFullWidth={true}
          dropdownStyle={{width: wp(40)}}
          style={{
            width: wp(80),
          }}
          textStyle={{
            fontSize: hp(2),
            color: colors.black,
          }}
          disabled={props.disabled}
          dropdownStyle={{width: wp(70)}}
          onSelect={(index, value) => props.onSelect(index, value)}
          keyboardShouldPersistTaps={'handled'}
        />
        <Icon
          name="chevron-down"
          type="font-awesome-5"
          color={colors.blue}
          size={14}
          onPress={() => dropdown.current.show()}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
