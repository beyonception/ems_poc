import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import IsAuthenticated from "../utils";
import Axios from "axios";
import config from "../config";
import DataTableDetail from "../components/Datatable";
import { Modal, Surface } from "react-native-paper";

const ExpenseScreen = (props) => {
  const [SpentByUserData, setSpentByUserData] = useState([]);
  const [SpentToData, setSpentToData] = useState([]);
  const [UserData, setUserData] = useState([]);
  const [ExpenseData, setExpenseData] = useState([]);
  const [IsModalVisible, setIsModalVisible] = useState(false);

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

  const viewHandler = (obj) => {
    console.log(obj);
    let spentByDetails = [];
    let spentByValue = "";
    UserData.map((data) => {
      obj.spentTo.map((spent) => {
        if (data.id === spent) {
          spentByDetails.push(data.value);
        }
      });
      if (data.id === obj.spentBy) {
        spentByValue = data.value;
      }
    });
    setIsModalVisible(true);
    setExpenseName(obj.expenseName);
    setExpenseDescription(obj.expenseDescription);
    setIsDefaultExpense(obj.defaultExpense);
    setAmount(obj.amount);
    setSpentBy(spentByValue);
    setSpentTo(spentByDetails);
    setIsModalVisible(true);
  };

  return (
    <ScrollView>
      <DataTableDetail
        headerData={["Name", "Amount", "", ""]}
        innerData={ExpenseData}
        viewDetailsHandler={(obj) => viewHandler(obj)}
      />
      <Modal visible={IsModalVisible} style={{ justifyContent: "center" }}>
        <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
          <Text style={{ height: 40 }}>Expense Name : {ExpenseName}</Text>
          <Text style={{ height: 40 }}>
            Expense Description : {ExpenseDescription}
          </Text>
          <Text style={{ height: 40 }}>SpentBy : {SpentBy}</Text>
          <Text style={{ height: 40 }}>
            Is Default Expense : {IsDefaultExpense ? "Yes" : "No"}
          </Text>
          <Text style={{ height: 40 }}>Amount : {Amount}</Text>
          <Text style={{ height: 40 }}>Spent To :</Text>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ExpenseScreen;
