import React from 'react';
import {View, Text} from 'react-native';
import {CheckBox} from 'react-native-elements';
import colors from '../tools/color';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const MyCheckBox = props => {
  return (
    <CheckBox
      checked={props.Checked}
      title={props.Title}
      // containerStyle={{ backgroundColor: '#fff', }}
      textStyle={
        props.textStyle != undefined
          ? props.textStyle
          : {color: colors.blue, width: wp(30)}
      }
      right={props.right}
      checkedColor={props.checkedColor}
      checkedIcon={props.CheckedIcon}
      uncheckedIcon={props.UncheckedIcon}
      onPress={props.btnPress}
      containerStyle={props.ContainerStyle}
    />
  );
};

export default MyCheckBox;
