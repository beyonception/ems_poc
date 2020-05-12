import React from "react";
import { Chip } from "react-native-paper";
import { ScrollView } from "react-native";

const ChipView = (props) => {
  return (
    <ScrollView style={{ height: 150 }}>
      {props.dataValue.map((data) => {
        return (
          <Chip
            icon="account-circle"
            style={{ marginTop: 5 }}
            onPress={() => props.pressHandler(data)}
            selected={data.checkedValue}
            selectedColor={data.checkedValue ? "green" : "gray"}
            mode="outlined"
          >
            {data.value}
          </Chip>
        );
      })}
    </ScrollView>
  );
};

export default ChipView;
