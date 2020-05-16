import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

const CheckBoxDetail = (props) => {
  return (
    <View style={{ flex: 1, flexDirection: "row", marginTop: 15 }}>
      <Checkbox
        style={props.checkStyle}
        status={props.IsSelected ? "checked" : "unchecked"}
        onPress={props.valueChanged}
      ></Checkbox>
      <Text style={{marginTop:7}}>{props.labelValue}</Text>
    </View>
  );
};

export default CheckBoxDetail;
