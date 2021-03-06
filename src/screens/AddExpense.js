import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import IsAuthenticated from "../utils";
import Axios from "axios";
import config from "../config";
import { Surface, Portal, Provider } from "react-native-paper";
import Button from "../components/Button";
import ToastIndicator from "../components/ToastIndicator";
import { TextInput } from "react-native-paper";
import Textbox from "../components/Textbox";
import DropDown from "../components/DropDown";
import CheckBoxDetail from "../components/CheckboxDetail";
import ChipView from "../components/ChipView";
import Header from "../components/Header";

const AddExpense = (props) => {
  const [ExpenseName, setExpenseName] = useState("");
  const [ExpenseDescription, setExpenseDescription] = useState("");
  const [SpentBy, setSpentBy] = useState("");
  const [Amount, setAmount] = useState("");
  const [IsDefaultExpense, setIsDefaultExpense] = useState(false);
  const [SpentToData, setSpentToData] = useState([]);
  const [IsShow, setIsShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [SpentByUserData, setSpentByUserData] = useState([]);
  const [titleValue, setTitleValue] = useState("");

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

  useEffect(() => {
    getUsers();
    setTitleValue(props.route.params.title);
  }, []);

  const flatListHandler = async (item) => {
    let spentData = [];
    let tmp = {};
    await Promise.all(
      SpentToData.map((data) => {
        tmp = data;
        data.id === item.id && (tmp.checkedValue = !data.checkedValue);
        spentData.push(tmp);
      })
    );
    setSpentToData(spentData);
  };

  const submitHandler = async () => {
    if (await IsAuthenticated()) {
      let spentToValue = [];

      if (SpentToData.length > 0) {
        SpentToData.map((data) => {
          if (data.checkedValue) {
            spentToValue.push(data.id);
          }
        });
      }
      if(IsDefaultExpense){
        spentToValue = [];
        SpentToData.map((data) => {
            spentToValue.push(data.id);
        });
      }
      let expenseDetails = {
        spentBy: SpentBy,
        spentTo: spentToValue,
        expenseName: ExpenseName,
        expenseDescription: ExpenseDescription,
        defaultExpense: IsDefaultExpense,
        amount: Amount.toString(),
      };
      await Axios.post(config.EXPENSE_SERVICE + "createExpense", expenseDetails)
        .then((res) => {
          if (res.data !== null || res.data !== undefined) {
            if (res.data._id !== " " && res.data._id !== undefined) {
              setSpentBy("");
              setExpenseName("");
              setExpenseDescription("");
              setIsDefaultExpense(false);
              setAmount("0");
              setTimeout(() => {
                setIsShow(false);
                setErrorMessage("");
              }, 5000);
              setErrorMessage("Expense added successfully");
              props.navigation.navigate("Manage Expense" , {IsAdded: true});
            } else {
              setIsShow(true);
              setTimeout(() => {
                setIsShow(false);
                setErrorMessage("");
              }, 5000);
              setErrorMessage("Error in saving the Expense");
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

  const cancelHandler = () =>{
    setExpenseName("");
    setExpenseDescription("");
    setSpentBy("0");
    setAmount("0");
    setIsDefaultExpense(false);
    let spentToData = [];
    SpentToData.map((data) => {
      data.checkedValue = false;
      spentToData.push(data);
    });
    setSpentToData(spentToData);
    props.navigation.navigate("Manage Expense");
  }

  return (
    <View>
      <Header title={titleValue} />
      <View style={{ margin: 15 }}>
        <ToastIndicator
          isShowValue={IsShow}
          position="top"
          colorValue="error"
          value={errorMessage}
        ></ToastIndicator>
        <ScrollView style={{ marginBottom: 20 }}>
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
            textValue={ExpenseDescription}
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
          <ChipView
            dataValue={SpentToData}
            pressHandler={(data) => {
              flatListHandler(data);
            }}
          />
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Button
              modeType="contained"
              styleValue={{ marginTop: 15, flex: 0.4 }}
              colorValue="blue"
              handler={() => submitHandler()}
              titleValue="Submit"
              iconValue="content-save-all"
            />
            <View style={{ flex: 0.2 }}></View>
            <Button
              modeType="outlined"
              styleValue={{ marginTop: 15, flex: 0.4 }}
              colorValue="blue"
              handler={() => cancelHandler()}
              titleValue="Cancel"
              iconValue="cancel"
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default AddExpense;
