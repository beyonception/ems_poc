import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, FlatList, Modal, StyleSheet } from "react-native";
import IsAuthenticated from "../utils";
import Axios from "axios";
import config from "../config";
import DataTableDetail from "../components/Datatable";
import { Surface, Portal, Provider } from "react-native-paper";
import Button from "../components/Button";
import ToastIndicator from "../components/ToastIndicator";
import { FAB } from 'react-native-paper';

const ExpenseScreen = (props) => {
  const [SpentByUserData, setSpentByUserData] = useState([]);
  const [SpentToData, setSpentToData] = useState([]);
  const [UserData, setUserData] = useState([]);
  const [ExpenseData, setExpenseData] = useState([]);
  const [IsShow, setIsShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [Id, setId] = useState("");
  const [ExpenseName, setExpenseName] = useState("");
  const [ExpenseDescription, setExpenseDescription] = useState("");
  const [IsDefaultExpense, setIsDefaultExpense] = useState(true);
  const [Amount, setAmount] = useState("0");
  const [SpentBy, setSpentBy] = useState("");
  const [SpentTo, setSpentTo] = useState([]);

  const getUsers = async () => {
    if (await IsAuthenticated()) {
      await Axios.get(config.USER_SERVICE + "getUsers")
        .then((res) => {
          if (res.data !== null || res.data !== undefined) {
            let organisedData = [];
            res.data.map((data) => {
              organisedData.push({
                id: data._id,
                value: data.FirstName + " " + data.LastName,
                checkedValue: false,
              });
            });
            setSpentByUserData(organisedData);
            setSpentToData(organisedData);
            setUserData(organisedData);
          }
        })
        .catch((err) => {
          if (err.response !== undefined && err.response.status === 400)
            console.log(err.response.data.message);
        });
    }
  };

  const getExpenses = async () => {
    if (await IsAuthenticated()) {
      await Axios.get(config.EXPENSE_SERVICE + "getExpenses")
        .then((res) => {
          if (res.data !== null || res.data !== undefined) {
            setExpenseData(res.data);
          }
        })
        .catch((err) => {
          if (err.response !== undefined && err.response.status === 400)
            ToastAndroid.showWithGravityAndOffset(
              err.response.data.message,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
        });
    }
  };

  useEffect(() => {
    getUsers();
    getExpenses();
  }, []);

  const deleteExpenseHandler = async (obj) => {
    if (await IsAuthenticated()) {
      await Axios.delete(config.EXPENSE_SERVICE + "deleteExpense?id=" + obj._id)
        .then((res) => {
          if (res.data !== null || res.data !== undefined) {
            if (
              res.data.message !== " " &&
              res.data.message !== undefined &&
              res.data.message.toString().toLowerCase() ===
                "deleted successfully"
            ) {
              setId("");
              setSpentBy("");
              setExpenseDescription("");
              setIsDefaultExpense(false);
              setExpenseName("");
              setAmount("0");
              getExpenses();
              setIsShow(true);
              setTimeout(() => {
                setIsShow(false);
                setErrorMessage("");
              }, 5000);
              setErrorMessage(res.data.message);
            } else {
              setIsShow(true);
              setTimeout(() => {
                setIsShow(false);
                setErrorMessage("");
              }, 5000);
              setErrorMessage("Error in deleting the user");
            }
          }
        })
        .catch((err) => {
          if (err.response.status === 400) {
            setIsShow(true);
            setTimeout(() => {
              setIsShow(false);
              setErrorMessage("");
            }, 5000);
            setErrorMessage(err.response.data.message);
          }
        });
    }
  };

  return (
    <ScrollView style={{flex:1}}>
        <FAB
    style={styles.fab}
    large
    icon="plus"
    onPress={() => alert('Pressed')}
  />
      <ToastIndicator
        isShowValue={IsShow}
        position="top"
        colorValue="error"
        value={errorMessage}
      ></ToastIndicator>
      <View>
        <DataTableDetail
          headerData={["Name", "Amount", "", ""]}
          innerData={ExpenseData}
          userData={UserData}
          deleteHandlerData={(obj) => {
            deleteExpenseHandler(obj);
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right:0,
    marginRight:15,
    marginTop:-30,
    zIndex:10
  },
})

export default ExpenseScreen;
