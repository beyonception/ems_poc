import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { List, Chip, Button } from "react-native-paper";
import { ConfirmDialog } from "react-native-simple-dialogs";

const DataTableDetail = ({ headerData, innerData, userData, deleteHandlerData }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dataValue, setDataValue] = useState([]);
  let dataRows = [];

  const deleteHandler = (obj) =>{
    setDialogVisible(true);
    setDataValue(obj);
  }

  const deleteYesHandler = () =>{
    deleteHandlerData(dataValue);
    setDialogVisible(false);
  }
  const deleteNoHandler = () =>{
    setDialogVisible(false);
  }

  if (innerData.length > 0) {
    innerData.map((data) => {
      let spentByDetails = [];
      let spentByValue = "";
      userData.map((obj) => {
        data.spentTo.map((spent) => {
          if (obj.id === spent) {
            spentByDetails.push(
              <Chip style={{ marginTop: 10, marginRight: 10 }}>
                {obj.value}
              </Chip>
            );
          }
        });
        if (obj.id === data.spentBy) {
          spentByValue = obj.value;
        }
      });
      dataRows.push(
        <List.Accordion key={data._id} title={data.expenseName} id={data._id}>
          <View style={{ flex: 1, flexDirection: "row", marginLeft: 20 }}>
            <Chip style={{ flex: 0.4, marginTop: 10, marginRight: 10 }}>
              Description
            </Chip>
            <Chip style={{ flex: 0.6, marginTop: 10, marginRight: 10 }}>
              {data.expenseDescription}
            </Chip>
          </View>
          <View style={{ flex: 1, flexDirection: "row", marginLeft: 20 }}>
            <Chip style={{ flex: 0.4, marginTop: 10, marginRight: 10 }}>
              Amount
            </Chip>
            <Chip style={{ flex: 0.6, marginTop: 10, marginRight: 10 }}>
              {data.amount}
            </Chip>
          </View>
          <View style={{ flex: 1, flexDirection: "row", marginLeft: 20 }}>
            <Chip style={{ flex: 0.4, marginTop: 10, marginRight: 10 }}>
              Spent By
            </Chip>
            <Chip style={{ flex: 0.6, marginTop: 10, marginRight: 10 }}>
              {spentByValue}
            </Chip>
          </View>
          <View style={{ flex: 1, flexDirection: "row", marginLeft: 20 }}>
            <Chip style={{ flex: 0.4, marginTop: 10, marginRight: 10 }}>
              Default Expense
            </Chip>
            <Chip style={{ flex: 0.6, marginTop: 10, marginRight: 10 }}>
              {data.defaultExpense ? "Yes" : "No"}
            </Chip>
          </View>
          <View style={{ flex: 1, flexDirection: "row", marginLeft: 20 }}>
            <Chip style={{ flex: 0.4, marginTop: 10, marginRight: 10 }}>
              Spent To
            </Chip>
            <View style={{ flex: 0.6 }}>{spentByDetails}</View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginLeft: 20,
              marginTop: 10,
            }}
          >
            <Button mode="contained" style={{ flex: 0.3 }} icon="pencil">
              EDIT
            </Button>
            <View style={{ flex: 0.1 }}></View>
            <Button
              mode="contained"
              style={{ flex: 0.2 }}
              color="red"
              icon="trash-can"
              onPress={() => deleteHandler(data)}
            >
              Delete
            </Button>
          </View>
        </List.Accordion>
      );
    });
  }

  return (
    <View>
      <List.AccordionGroup>{dataRows}</List.AccordionGroup>
      <ConfirmDialog
        title="Confirm Dialog"
        message="Are you sure delete?"
        visible={dialogVisible}
        onTouchOutside={() => setDialogVisible(false)}
        positiveButton={{
          title: "YES",
          onPress: () => deleteYesHandler(),
        }}
        negativeButton={{
          title: "NO",
          onPress: () => deleteNoHandler(),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  surface: {
    padding: 8,
    height: 80,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});

export default DataTableDetail;
