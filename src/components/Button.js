import React from "react";
import { Button } from "react-native-paper";

const ButtonSubmit = (props) => {
  return (
    <Button
      mode={props.modeType}
      style={props.styleValue}
      color={props.colorValue}
      icon={props.iconValue}
      onPress={() => props.handler()}
    >
      {props.titleValue}
    </Button>
  );
};

export default ButtonSubmit;
