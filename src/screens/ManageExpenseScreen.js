import React, {Component} from 'react';
import {
  View,
  AsyncStorage,
  FlatList,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import Header from '../components/Header';
import Label from '../components/Label';
import Axios from 'axios';
import config from '../config';
import DropDown from '../components/DropDown';
import Textbox from '../components/Textbox';
import Button from '../components/Button';
import CheckBoxDetail from '../components/CheckboxDetail';
import DataTable from '../components/Datatable';
import Modal from 'react-native-modal';

class ManageExpenseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spentByUserData: [],
      userLeftData: [],
      userData: [],
      SpentBy: '0',
      ExpenseName: '',
      expenseData: [],
      ExpenseDescription: '',
      Amount: 0,
      IsDefaultExpense: false,
      IsAddExpense: false,
      isModalVisible: false,
      spentTo: [],
      buttonValue: 'Add Expense',
    };
  }

  authenticateWithRefreshToken = async userAuth => {
    await Axios.post(
      config.AUTH_SERVICE + 'authenticateWithrefreshtoken',
      userAuth,
    )
      .then(res => {
        AsyncStorage.setItem('userAuth', JSON.stringify(res.data));
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  decodeToken = async userAuth => {
    let userAuth1 = await AsyncStorage.getItem('userAuth');
    await Axios.post(config.AUTH_SERVICE + 'decodeToken', userAuth)
      .then(res => {
        if (res.data.status === 403) {
          userAuth = {
            refresh_token: JSON.parse(userAuth1).refresh_token,
          };
        }
      })
      .catch(err => {
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

  getUsers = async () => {
    let userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
        .access_token,
    };
    let isAuthorised = await this.decodeToken(userAuth);
    if (!isAuthorised) {
      userAuth = {
        refresh_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
          .refresh_token,
      };
      await this.authenticateWithRefreshToken(userAuth);
      userAuth = {
        access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
          .access_token,
      };
      await this.decodeToken(userAuth);
    }
    userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
        .access_token,
    };
    Axios.defaults.headers.common['Authorization'] =
      'bearer ' + userAuth.access_token;
    await Axios.get(config.USER_SERVICE + 'getUsers')
      .then(res => {
        if (res.data !== null || res.data !== undefined) {
          let organisedData = [];
          res.data.map(data => {
            organisedData.push({
              id: data._id,
              value: data.FirstName + ' ' + data.LastName,
              checkedValue: false,
            });
          });
          this.setState({
            spentByUserData: organisedData,
            spentToData: organisedData,
            userData: organisedData,
          });
        }
      })
      .catch(err => {
        if (err.response !== undefined && err.response.status === 400)
          console.log(err.response.data.message);
      });
  };

  componentDidMount = async () => {
    this.getUsers();
    this.getExpenses();
  };

  changedHandler = value => {
    this.setState({SpentBy: value});
  };

  flatListHandler = (event, item) => {
    let spentData = this.state.spentToData;
    spentData.map(data => {
      if (data.id === item.id) {
        if (item.checkedValue) {
          data.checkedValue = false;
        } else {
          data.checkedValue = true;
        }
      }
    });
    this.setState({spentToData: spentData});
  };

  submitHandler = async () => {
    let userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
        .access_token,
    };
    let isAuthorised = await this.decodeToken(userAuth);
    if (!isAuthorised) {
      userAuth = {
        refresh_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
          .refresh_token,
      };
      await this.authenticateWithRefreshToken(userAuth);
      userAuth = {
        access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
          .access_token,
      };
      await this.decodeToken(userAuth);
    }
    userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
        .access_token,
    };
    Axios.defaults.headers.common['Authorization'] =
      'bearer ' + userAuth.access_token;
    let spentToValue = [];
    if (this.state.spentToData.length > 0) {
      this.state.spentToData.map(data => {
        if (data.checkedValue) {
          spentToValue.push(data.id);
        }
      });
    }
    let expenseDetails = {
      spentBy: this.state.SpentBy,
      spentTo: spentToValue,
      expenseName: this.state.ExpenseName,
      expenseDescription: this.state.ExpenseDescription,
      defaultExpense: this.state.IsDefaultExpense,
      amount: this.state.Amount.toString(),
    };
    await Axios.post(config.EXPENSE_SERVICE + 'createExpense', expenseDetails)
      .then(res => {
        if (res.data !== null || res.data !== undefined) {
          if (res.data._id !== ' ' && res.data._id !== undefined) {
            this.setState({
              SpentBy: '0',
              ExpenseName: '',
              ExpenseDescription: '',
              IsDefaultExpense: false,
              Amount: '0',
              IsAdd: true,
              UserButtonValue: 'Add Expense',
              IsAddExpense: false
            });
            this.getUsers();
            this.getExpenses();
            ToastAndroid.showWithGravityAndOffset(
              'Expense added successfully',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'Error in saving the Expense',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          }
        }
      })
      .catch(err => {
        if (err.response.status === 400) {
          ToastAndroid.showWithGravityAndOffset(
            err.response.data.message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
      });
  };

  checkedHandler = () => {
    if (this.state.IsDefaultExpense) {
      this.setState({IsDefaultExpense: false});
    } else {
      this.setState({IsDefaultExpense: true});
    }
  };

  getExpenses = async () => {
    let userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
        .access_token,
    };
    let isAuthorised = await this.decodeToken(userAuth);
    if (!isAuthorised) {
      userAuth = {
        refresh_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
          .refresh_token,
      };
      await this.authenticateWithRefreshToken(userAuth);
      userAuth = {
        access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
          .access_token,
      };
      await this.decodeToken(userAuth);
    }
    userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
        .access_token,
    };
    Axios.defaults.headers.common['Authorization'] =
      'bearer ' + userAuth.access_token;
    await Axios.get(config.EXPENSE_SERVICE + 'getExpenses')
      .then(res => {
        if (res.data !== null || res.data !== undefined) {
          this.setState({
            expenseData: res.data,
            IsLoaded: true,
          });
        }
      })
      .catch(err => {
        if (err.response !== undefined && err.response.status === 400)
        ToastAndroid.showWithGravityAndOffset(
          err.response.data.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      });
  };

  viewHandler = obj => {
    let spentByDetails = [];
    let spentByValue = '';
    this.state.userData.map(data => {
      obj.spentTo.map(spent => {
        if (data.id === spent) {
          spentByDetails.push(data.value);
        }
      });
      if (data.id === obj.spentBy) {
        spentByValue = data.value;
      }
    });
    this.setState({
      isModalVisible: true,
      ExpenseName: obj.expenseName,
      ExpenseDescription: obj.expenseDescription,
      IsDefaultExpense: obj.defaultExpense,
      Amount: obj.amount,
      SpentBy: spentByValue,
      spentTo: spentByDetails,
    });
  };

  addExpenseHandler = () => {
    if (this.state.IsAddExpense) {
      this.setState({IsAddExpense: false, buttonValue: 'Add Expense'});
      this.getExpenses();
    } else {
      this.setState({IsAddExpense: true, buttonValue: 'View Expense'});
    }
  };

  deleteExpenseHandler = async obj => {
    let userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
        .access_token,
    };
    let isAuthorised = await this.decodeToken(userAuth);
    if (!isAuthorised) {
      userAuth = {
        refresh_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
          .refresh_token,
      };
      await this.authenticateWithRefreshToken(userAuth);
      userAuth = {
        access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
          .access_token,
      };
      await this.decodeToken(userAuth);
    }
    userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
        .access_token,
    };
    Axios.defaults.headers.common['Authorization'] =
      'bearer ' + userAuth.access_token;
    await Axios.delete(config.EXPENSE_SERVICE + 'deleteExpense?id=' + obj._id)
      .then(res => {
        if (res.data !== null || res.data !== undefined) {
          if (
            res.data.message !== ' ' &&
            res.data.message !== undefined &&
            res.data.message.toString().toLowerCase() === 'deleted successfully'
          ) {
            this.setState({
              buttonValue: 'Add Expense',
              _id: '',
              SpentBy: '',
              userLeftData: [],
              userRightData: [],
              Description: '',
              isDefaultExpense: false,
              ExpenseName: '',
              Amount: '0',
              IsAdd: true,
            });
            this.getExpenses();
            ToastAndroid.showWithGravityAndOffset(
              res.data.message,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'Error in deleting the user',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          }
        }
      })
      .catch(err => {
        if (err.response.status === 400) {
          ToastAndroid.showWithGravityAndOffset(
            err.response.data.message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
      });
  };

  render() {
    let expenseDetails;
    let headerData = ['Expense Name', 'Amount', '', ''];
    if (this.state.IsAddExpense) {
      expenseDetails = (
        <ScrollView>
          <Header navigation={this.props.navigation} />
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              marginTop: 10,
              marginBottom: 10,
              marginRight: 10,
            }}>
            <Button
              titleValue={this.state.buttonValue}
              onPressHandler={this.addExpenseHandler}
              styleValue={{marginBottom: 25, marginTop: 25}}
            />
            <Label textValue="Expense Name" styleValue={{height: 25}} />
            <Textbox
              secureText={false}
              textStyle={{
                height: 40,
                backgroundColor: '#ebe9f5',
                marginBottom: 10,
              }}
              textValue={this.state.ExpenseName}
              keyBoardTypeValue="default"
              onChangedTextHandler={text => {
                this.setState({ExpenseName: text});
              }}
            />
            <Label textValue="Expense Description" styleValue={{height: 25}} />
            <Textbox
              secureText={false}
              textStyle={{
                height: 40,
                backgroundColor: '#ebe9f5',
                marginBottom: 10,
              }}
              textValue={this.state.ExpenseDescription}
              keyBoardTypeValue="default"
              onChangedTextHandler={text => {
                this.setState({ExpenseDescription: text});
              }}
            />
            <Label textValue="Amount" styleValue={{height: 25}} />
            <Textbox
              secureText={false}
              textStyle={{
                height: 40,
                backgroundColor: '#ebe9f5',
                marginBottom: 10,
              }}
              textValue={this.state.Amount}
              keyBoardTypeValue="numeric"
              onChangedTextHandler={text => {
                this.setState({Amount: text});
              }}
            />
            <Label textValue="Spent By" styleValue={{height: 25}} />
            <DropDown
              dataValue={this.state.spentByUserData}
              selectedStyle={{
                height: 40,
                backgroundColor: '#ebe9f5',
                marginBottom: 10,
              }}
              selectedValue={this.state.SpentBy}
              valueChanged={this.changedHandler}
              defaultValue="Select Spent By"
            />
            <CheckBoxDetail
              IsSelected={this.state.IsDefaultExpense}
              textValue="Default Expense"
              valueChanged={this.checkedHandler}
            />
            <Text style={{marginTop: -25, marginLeft: 35}}>
              Is Default Expense
            </Text>
            <Label
              textValue="Spent To"
              styleValue={{height: 30, marginTop: 10}}
            />
            <View
              style={{
                backgroundColor: '#ebe9f5',
                borderStyle: 'solid',
                height: 200,
                marginBottom: 10,
              }}>
              <FlatList
                showsHorizontalScrollIndicator={true}
                data={this.state.spentToData}
                keyExtractor= {(item) => item.id}
                renderItem={({item}) => {
                  return (
                    <TouchableWithoutFeedback
                      onPress={event => this.flatListHandler(event, item)}>
                      <View
                        style={
                          item.checkedValue
                            ? styles.viewSelected
                            : styles.viewNotSelected
                        }>
                        <Text>{item.value}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                }}
              />
            </View>
            <Button
              titleValue="Submit"
              onPressHandler={this.submitHandler}
              styleValue={{marginTop: 10}}
            />
          </View>
        </ScrollView>
      );
    } else {
      expenseDetails = (
        <ScrollView>
          <Header navigation={this.props.navigation} />
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              marginTop: 10,
              marginBottom: 10,
              marginRight: 10,
            }}>
            <Button
              titleValue={this.state.buttonValue}
              onPressHandler={this.addExpenseHandler}
              styleValue={{marginBottom: 25, marginTop: 25}}
            />
            <DataTable
              headerData={headerData}
              innerData={this.state.expenseData}
              viewDetailsHandler={obj => this.viewHandler(obj)}
              deleteDetailsHandler = {obj => this.deleteExpenseHandler(obj)}
            />
          </View>
          <Modal
            isVisible={this.state.isModalVisible}
            style={{justifyContent: 'center'}}>
            <View style={{flex: 1, backgroundColor: 'white', padding: 10}}>
              <Text style={{height:40}}>Expense Name : {this.state.ExpenseName}</Text>
              <Text style={{height:40}}>Expense Description : {this.state.ExpenseDescription}</Text>
              <Text style={{height:40}}>SpentBy : {this.state.SpentBy}</Text>
              <Text style={{height:40}}>
                Is Default Expense :{' '}
                {this.state.IsDefaultExpense ? 'Yes' : 'No'}
              </Text>
              <Text style={{height:40}}>Amount : {this.state.Amount}</Text>
              <Text style={{height:40}}>Spent To :</Text>
              <FlatList
                showsHorizontalScrollIndicator={true}
                keyExtractor= {(item) => item}
                data={this.state.spentTo}
                renderItem={({item}) => {
                  return <Text style={{height:35}}>{item}</Text>;
                }}
              />
              <Button
                titleValue="Close"
                onPressHandler={() => {
                  this.setState({isModalVisible: false});
                }}
              />
            </View>
          </Modal>
        </ScrollView>
      );
    }
    return expenseDetails;
  }
}

const styles = StyleSheet.create({
  viewNotSelected: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    height: 50,
    alignItems: 'center',
    backgroundColor: '#fc827e',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  viewSelected: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    height: 50,
    alignItems: 'center',
    backgroundColor: '#87f571',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default ManageExpenseScreen;
