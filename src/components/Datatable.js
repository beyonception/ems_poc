import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { DataTable } from "react-native-paper";

const DataTableDetail = ({headerData, innerData, viewDetailsHandler}) => {

  let headerValues = [];
  let dataRows = [];
  if (headerData.length > 0) {
    let i = 0;
    headerData.map((data) => {
      headerValues.push(<DataTable.Title key={i}>{data}</DataTable.Title>);
      i++;
    });
  }
 
  if (innerData.length > 0) {
    innerData.map((data) => {
      dataRows.push(
        <DataTable.Row key={data._id}>
          <DataTable.Cell>{data.expenseName}</DataTable.Cell>
          <DataTable.Cell>{data.amount}</DataTable.Cell>
          <DataTable.Cell>
            <TouchableOpacity
              onPress={() => viewDetailsHandler(data)}
            >
              <View>
                <Text>Edit</Text>
              </View>
            </TouchableOpacity>
          </DataTable.Cell>
          <DataTable.Cell>Delete</DataTable.Cell>
        </DataTable.Row>
      );
    });
  }

  return (
    <DataTable>
      <DataTable.Header>{headerValues}</DataTable.Header>
      {dataRows}
    </DataTable>
  );
};

export default DataTableDetail;
