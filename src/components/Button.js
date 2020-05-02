import React from "react";
import { Button } from 'galio-framework';

const ButtonSubmit = (props) => {
  return (
    <Button
      title={props.titleValue}
      onPress={props.onPressHandler}
      style={props.styleValue}
      color="info"
  >{props.titleValue}</Button>
  );
};

export default ButtonSubmit;
