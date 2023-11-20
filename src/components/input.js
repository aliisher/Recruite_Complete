import React from 'react';
import {View, TextInput, Text} from 'react-native';

const Myinput = props => {
  return (
    <View>
      <Text style={props.titleStyles}>{props.title}</Text>
      <TextInput
        placeholder={props.Placeholder}
        onChangeText={props.OnChange}
        ref={props.ref}
        // blurOnSubmit={false}

        keyboardType={props.KeyboardType}
        onKeyPress={props.onsearch}
        onSubmitEditing={event => props.onendSubmit(event.nativeEvent.text)}
        // onBlur={props.onsearch}
        value={props.Value}
        style={props.Styles}
      />
    </View>
  );
};
export default Myinput;
