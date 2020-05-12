import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Modal,
  StyleSheet,
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
import ChipView from '../components/ChipView';

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
            setIsAddExpense(false);
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

  const checkedHandler = () => {
    if (IsDefaultExpense) {
      setIsDefaultExpense(false);
    } else {
      setIsDefaultExpense(true);
    }
  };

  const flatListHandler = async (item) => {
    let spentData = SpentToData;
    spentData.map((data) => {
      if (data.id === item.id) {
        
        if (item.checkedValue) {
          data.checkedValue = false;
        } else {
          data.checkedValue = true;
        }
      }
    }, () => setSpentToData(spentData));
    
  };

  let wholeView = [];
  if (IsAddExpense) {
    wholeView.push(
      <View style={{ flex: 1 }}>
        <FAB
          style={styles.fab}
          large
          icon="plus"
          onPress={() => alert("Pressed")}
        />
        <ScrollView>
          <ToastIndicator
            isShowValue={IsShow}
            position="top"
            colorValue="error"
            value={errorMessage}
          ></ToastIndicator>
          <View
            style={{
              marginTop: 60,
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
  } else {
    wholeView.push(
      <View style={{ margin: 15 }}>
        <Textbox
          labeValue="Name"
          textValue={ExpenseName}
          onChangedTextHandler={(text) => {
            setExpenseName(text);
          }}
          textStyle={{ backgroundColor: "white" }}
        />
        <Textbox
          labeValue="Description"
          textValue={ExpenseName}
          onChangedTextHandler={(text) => {
            setExpenseDescription(text);
          }}
          textStyle={{ backgroundColor: "white", marginTop: 15 }}
        />
        <TextInput
          style={{ backgroundColor: "white", marginTop: 15 }}
          mode="outlined"
          render={() => (
            <DropDown
              dataValue={SpentByUserData}
              selectedValue={SpentBy}
              selectedStyle={{ marginTop: 3, marginLeft: 5 }}
              valueChanged={(text) => {
                setSpentBy(text);
              }}
              defaultValue="Select Spent By"
            />
          )}
        />
        <Textbox
          labeValue="Amount"
          textValue={Amount}
          keyBoardTypeValue="numeric"
          onChangedTextHandler={(text) => {
            setAmount(text);
          }}
          textStyle={{ backgroundColor: "white", marginTop: 15 }}
        />
        <CheckBoxDetail
          checkStyle={{ flex: 0.5 }}
          IsSelected={IsDefaultExpense}
          valueChanged={() => checkedHandler()}
          labelValue="Is Default Expense"
        ></CheckBoxDetail>
        <ChipView dataValue={SpentToData} pressHandler={(data) => {flatListHandler(data)}} />
      </View>
    );
  }

  return <View>{wholeView}</View>;
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
    marginRight: 15,
    marginTop: 10,
  },
});

export default ExpenseScreen;
