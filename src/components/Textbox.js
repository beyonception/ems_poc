import React from "react";
import { Input } from 'galio-framework';

const Textbox = (props) => {
  return (
    <Input
      secureTextEntry={props.secureText}
      style={props.textStyle}
      value={props.textValue}
      placeholder={props.placeHolderValue}
      onChangeText={props.onChangedTextHandler}
      keyboardType={props.keyBoardTypeValue}
      maxLength={props.maxLengthValue}
      autoCapitalize='none'
    />
  );
};

export default Textbox;