import React from "react";
import { TextInput } from 'react-native-paper';

const Textbox = (props) => {
  return (
    <TextInput
      secureTextEntry={props.secureText}
      mode='outlined'
      style={props.textStyle}
      value={props.textValue}
      label={props.labeValue}
      placeholder={props.placeHolderValue}
      onChangeText={props.onChangedTextHandler}
      keyboardType={props.keyBoardTypeValue}
      maxLength={props.maxLengthValue}
      autoCapitalize='none'
    />
  );
};

export default Textbox;