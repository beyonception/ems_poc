import React, { useState, useEffect } from "react";
import {
  View,
  AsyncStorage,
  FlatList,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  ToastAndroid,
  ScrollView,
} from "react-native";
import Header from "../components/Header";
import Label from "../components/Label";
import Axios from "axios";
import config from "../config";
import DropDown from "../components/DropDown";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import CheckBoxDetail from "../components/CheckboxDetail";
import DataTableDetail from "../components/Datatable";
import Modal from "react-native-modal";
import { DataTable } from "react-native-paper";
import { or } from "react-native-reanimated";

const ManageExpenseScreen = (props) => {
  const [spentByUserData, setSpentByUserData] = useState([]);
  const [userLeftData, setUserLeftData] = useState([]);
  const [userRightData, setUserRightData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [SpentBy, setSpentBy] = useState("0");
  const [ExpenseName, setExpenseName] = useState("");
  const [expenseData, setExpenseData] = useState([]);
  const [ExpenseDescription, setExpenseDescription] = useState("");
  const [Amount, setAmount] = useState(0);
  const [IsDefaultExpense, setIsDefaultExpense] = useState(false);
  const [IsAddExpense, setIsAddExpense] = useState(false);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [spentTo, setSpentTo] = useState([]);
  const [buttonValue, setButtonValue] = useState("Add Expense");
  const [IsAdd, setIsAdd] = useState(false);
  const [UserButtonValue, setUserButtonValue] = useState("");
  const [spentToData, setSpentToData] = useState([]);

  authenticateWithRefreshToken = async (userAuth) => {
    await Axios.post(
      config.AUTH_SERVICE + "authenticateWithrefreshtoken",
      userAuth
    )
      .then((res) => {
        AsyncStorage.setItem("userAuth", JSON.stringify(res.data));
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  decodeToken = async (userAuth) => {
    let userAuth1 = await AsyncStorage.getItem("userAuth");
    await Axios.post(config.AUTH_SERVICE + "decodeToken", userAuth)
      .then((res) => {
        if (res.data.status === 403) {
          userAuth = {
            refresh_token: JSON.parse(userAuth1).refresh_token,
          };
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  IsLoginAuthenticated = async () => {
    try {
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  };

  const getUsers = async () => {
    let userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
        .access_token,
    };
    let isAuthorised = await decodeToken(userAuth);
    if (!isAuthorised) {
      userAuth = {
        refresh_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
          .refresh_token,
      };
      await authenticateWithRefreshToken(userAuth);
      userAuth = {
        access_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
          .access_token,
      };
      await decodeToken(userAuth);
    }
    userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
        .access_token,
    };
    Axios.defaults.headers.common["Authorization"] =
      "bearer " + userAuth.access_token;
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
  };

  useEffect(() => {
    getUsers();
    getExpenses();
  }, []);

  changedHandler = (value) => {
    setSpentBy(value);
  };

  flatListHandler = (event, item) => {
    let spentData = spentToData;
    spentData.map((data) => {
      if (data.id === item.id) {
        if (item.checkedValue) {
          data.checkedValue = false;
        } else {
          data.checkedValue = true;
        }
      }
    });
    setSpentToData(spentData);
  };

  submitHandler = async () => {
    let userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
        .access_token,
    };
    let isAuthorised = await decodeToken(userAuth);
    if (!isAuthorised) {
      userAuth = {
        refresh_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
          .refresh_token,
      };
      await authenticateWithRefreshToken(userAuth);
      userAuth = {
        access_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
          .access_token,
      };
      await decodeToken(userAuth);
    }
    userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
        .access_token,
    };
    Axios.defaults.headers.common["Authorization"] =
      "bearer " + userAuth.access_token;
    let spentToValue = [];
    if (spentToData.length > 0) {
      spentToData.map((data) => {
        if (data.checkedValue) {
          spentToValue.push(data.id);
        }
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
            setIsAdd(true);
            setUserButtonValue("Add Expense");
            setIsAddExpense(false);
            getUsers();
            getExpenses();
            ToastAndroid.showWithGravityAndOffset(
              "Expense added successfully",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              "Error in saving the Expense",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          ToastAndroid.showWithGravityAndOffset(
            err.response.data.message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        }
      });
  };

  checkedHandler = () => {
    if (IsDefaultExpense) {
      setIsDefaultExpense(false);
    } else {
      setIsDefaultExpense(true);
    }
  };

  getExpenses = async () => {
    let userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
        .access_token,
    };
    let isAuthorised = await decodeToken(userAuth);
    if (!isAuthorised) {
      userAuth = {
        refresh_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
          .refresh_token,
      };
      await authenticateWithRefreshToken(userAuth);
      userAuth = {
        access_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
          .access_token,
      };
      await decodeToken(userAuth);
    }
    userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
        .access_token,
    };
    Axios.defaults.headers.common["Authorization"] =
      "bearer " + userAuth.access_token;
    await Axios.get(config.EXPENSE_SERVICE + "getExpenses")
      .then((res) => {
        if (res.data !== null || res.data !== undefined) {
          setExpenseData(res.data);
          setIsLoaded(true);
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
  };

  viewHandler = (obj) => {
    let spentByDetails = [];
    let spentByValue = "";
    userData.map((data) => {
      obj.spentTo.map((spent) => {
        if (data.id === spent) {
          spentByDetails.push(data.value);
        }
      });
      if (data.id === obj.spentBy) {
        spentByValue = data.value;
      }
    });
    setisModalVisible(true);
    setExpenseName(obj.expenseName);
    setExpenseDescription(obj.expenseDescription);
    setIsDefaultExpense(obj.defaultExpense);
    setAmount(obj.amount);
    setSpentBy(spentByValue);
    setSpentTo(spentByDetails);
  };

  addExpenseHandler = () => {
    if (IsAddExpense) {
      setIsAddExpense(false);
      setButtonValue("Add Expense");
      getExpenses();
    } else {
      setIsAddExpense(true);
      setButtonValue("View Expense");
    }
  };

  deleteExpenseHandler = async (obj) => {
    let userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
        .access_token,
    };
    let isAuthorised = await decodeToken(userAuth);
    if (!isAuthorised) {
      userAuth = {
        refresh_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
          .refresh_token,
      };
      await authenticateWithRefreshToken(userAuth);
      userAuth = {
        access_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
          .access_token,
      };
      await decodeToken(userAuth);
    }
    userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
        .access_token,
    };
    Axios.defaults.headers.common["Authorization"] =
      "bearer " + userAuth.access_token;
    await Axios.delete(config.EXPENSE_SERVICE + "deleteExpense?id=" + obj._id)
      .then((res) => {
        if (res.data !== null || res.data !== undefined) {
          if (
            res.data.message !== " " &&
            res.data.message !== undefined &&
            res.data.message.toString().toLowerCase() === "deleted successfully"
          ) {
            setButtonValue("Add Expense");
            setId("");
            setSpentBy("");
            setUserLeftData([]);
            setUserRightData([]);
            setExpenseDescription("");
            setIsDefaultExpense(false);
            setExpenseName("");
            setAmount("0");
            setIsAdd(true);
            getExpenses();
            ToastAndroid.showWithGravityAndOffset(
              res.data.message,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              "Error in deleting the user",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          ToastAndroid.showWithGravityAndOffset(
            err.response.data.message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        }
      });
  };

  let expenseDetails;
  let headerData = ["Expense Name", "Amount", "", ""];
  if (IsAddExpense) {
    expenseDetails = (
      <ScrollView>
        <Header navigation={props.navigation} />
        <View
          style={{
            flex: 1,
            marginLeft: 10,
            marginTop: 10,
            marginBottom: 10,
            marginRight: 10,
          }}
        >
          <Button
            titleValue={buttonValue}
            onPressHandler={addExpenseHandler()}
            styleValue={{ marginBottom: 25, marginTop: 25 }}
          />
          <Label textValue="Expense Name" styleValue={{ height: 25 }} />
          <Textbox
            secureText={false}
            textStyle={{
              height: 40,
              backgroundColor: "#ebe9f5",
              marginBottom: 10,
            }}
            textValue={ExpenseName}
            keyBoardTypeValue="default"
            onChangedTextHandler={(text) => {
              setExpenseName(text);
            }}
          />
          <Label textValue="Expense Description" styleValue={{ height: 25 }} />
          <Textbox
            secureText={false}
            textStyle={{
              height: 40,
              backgroundColor: "#ebe9f5",
              marginBottom: 10,
            }}
            textValue={ExpenseDescription}
            keyBoardTypeValue="default"
            onChangedTextHandler={(text) => {
              setExpenseDescription(text);
            }}
          />
          <Label textValue="Amount" styleValue={{ height: 25 }} />
          <Textbox
            secureText={false}
            textStyle={{
              height: 40,
              backgroundColor: "#ebe9f5",
              marginBottom: 10,
            }}
            textValue={Amount}
            keyBoardTypeValue="numeric"
            onChangedTextHandler={(text) => {
              setAmount(text);
            }}
          />
          <Label textValue="Spent By" styleValue={{ height: 25 }} />
          <DropDown
            dataValue={spentByUserData}
            selectedStyle={{
              height: 40,
              backgroundColor: "#ebe9f5",
              marginBottom: 10,
            }}
            selectedValue={SpentBy}
            valueChanged={changedHandler()}
            defaultValue="Select Spent By"
          />
          <CheckBoxDetail
            IsSelected={IsDefaultExpense}
            textValue="Default Expense"
            valueChanged={checkedHandler()}
          />
          <Text style={{ marginTop: -25, marginLeft: 35 }}>
            Is Default Expense
          </Text>
          <Label
            textValue="Spent To"
            styleValue={{ height: 30, marginTop: 10 }}
          />
          <View
            style={{
              backgroundColor: "#ebe9f5",
              borderStyle: "solid",
              height: 200,
              marginBottom: 10,
            }}
          >
            <FlatList
              showsHorizontalScrollIndicator={true}
              data={spentToData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={(event) => flatListHandler(event, item)}
                  >
                    <View
                      style={
                        item.checkedValue
                          ? styles.viewSelected
                          : styles.viewNotSelected
                      }
                    >
                      <Text>{item.value}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              }}
            />
          </View>
          <Button
            titleValue="Submit"
            onPressHandler={submitHandler()}
            styleValue={{ marginTop: 10 }}
          />
        </View>
      </ScrollView>
    );
  } else {
    expenseDetails = (
      <ScrollView>
        <Header navigation={props.navigation} />
        <View
          style={{
            flex: 1,
            marginLeft: 10,
            marginTop: 10,
            marginBottom: 10,
            marginRight: 10,
          }}
        >
          <Button
            titleValue={buttonValue}
            onPressHandler={addExpenseHandler()}
            styleValue={{ marginBottom: 25, marginTop: 25 }}
          />
          <DataTableDetail
            headerData={headerData}
            innerData={expenseData}
            viewDetailsHandler={(obj) => viewHandler(obj)}
            deleteDetailsHandler={(obj) => deleteExpenseHandler(obj)}
          />
        </View>
        <Modal isVisible={isModalVisible} style={{ justifyContent: "center" }}>
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
            <FlatList
              showsHorizontalScrollIndicator={true}
              keyExtractor={(item) => item}
              data={spentTo}
              renderItem={({ item }) => {
                return <Text style={{ height: 35 }}>{item}</Text>;
              }}
            />
            <Button
              titleValue="Close"
              onPressHandler={() => {
                setisModalVisible(false);
              }}
            />
          </View>
        </Modal>
      </ScrollView>
    );
  }
  return expenseDetails;
};

const styles = StyleSheet.create({
  viewNotSelected: {
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
    height: 50,
    alignItems: "center",
    backgroundColor: "#fc827e",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  viewSelected: {
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
    height: 50,
    alignItems: "center",
    backgroundColor: "#87f571",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default ManageExpenseScreen;
