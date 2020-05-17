import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import IsAuthenticated from "../utils";
import Axios from "axios";
import config from "../config";
import DataTableDetail from "../components/Datatable";
import { Surface, Portal, Provider } from "react-native-paper";
import Button from "../components/Button";
import ToastIndicator from "../components/ToastIndicator";
import { FAB, TextInput } from "react-native-paper";
import Textbox from "../components/Textbox";
import DropDown from "../components/DropDown";
import CheckBoxDetail from "../components/CheckboxDetail";
import ChipView from "../components/ChipView";
import SubmitButton from '../components/Button';
import AddExpense from "./AddExpense";
import { useIsFocused } from '@react-navigation/native';

const ExpenseScreen = (props) => {
  const [SpentByUserData, setSpentByUserData] = useState([]);
  const [SpentToData, setSpentToData] = useState([]);
  const [UserData, setUserData] = useState([]);
  const [ExpenseData, setExpenseData] = useState([]);
  const [IsShow, setIsShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [IsAddExpense, setIsAddExpense] = useState(false);

  const [Id, setId] = useState("");
  const [ExpenseName, setExpenseName] = useState("");
  const [ExpenseDescription, setExpenseDescription] = useState("");
  const [IsDefaultExpense, setIsDefaultExpense] = useState(true);
  const [Amount, setAmount] = useState("");
  const [SpentBy, setSpentBy] = useState("");
  const [SpentTo, setSpentTo] = useState([]);

  const getUsers = async () => {
    if (await IsAuthenticated()) {
      await Axios.get(config.USER_SERVICE + "getUsers")
        .then(async (res) => {
          if (res.data !== null || res.data !== undefined) {
            let organisedData = [];
            res.data.map((data) => {
              organisedData.push({
                id: data._id,
                value: data.FirstName + " " + data.LastName,
                checkedValue: false,
              });
            });
            await Promise.all(
              setSpentByUserData(organisedData),
              setSpentToData(organisedData),
              setUserData(organisedData),
              setIsAddExpense(false)
            );
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
  const isFocused = useIsFocused();
  if(isFocused){
    getExpenses();
  }
  
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
              setIsAddExpense(false);
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

  const fabClickHandler = () => {
    // return (<AddExpense spentToData={SpentToData} spentByUserData={SpentByUserData} />);
    props.navigation.navigate("AddExpense", {
      expenseDetail: "",
      title: "Add Expense"
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0, flexDirection: "row" }}>
        <View style={{ flex: 0.5 }}></View>
        <TouchableOpacity
          onPress={() => alert("clicked 1")}
          style={{ flex: 0.5 }}
        >
          <View>
          <SubmitButton
          titleValue="Add Expense"
          handler={fabClickHandler}
          styleValue={{marginRight:30}}
          modeType="text"
          colorValue="blue"
          iconValue="plus"
        />
          </View>
        </TouchableOpacity>
      </View>

      <ToastIndicator
        isShowValue={IsShow}
        position="top"
        colorValue="error"
        value={errorMessage}
      ></ToastIndicator>
      <ScrollView>
        <View
          style={{
            marginRight: 15,
            marginBottom: 20,
            marginLeft: 5,
          }}
        >
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
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 0,
    top: -62,
    marginBottom: 20,
    marginRight: 20,
  },
});

export default ExpenseScreen;
