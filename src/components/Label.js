import React from "react";
import { Text } from "galio-framework";

const Label = (props) => {
  return <Text style={props.styleValue}>{props.textValue}</Text>;
};

export default Label;
