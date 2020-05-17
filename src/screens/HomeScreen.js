import React, { useState, useEffect} from 'react';
import { Dimensions, View, StatusBar,TouchableOpacity, StyleSheet, ScrollView, AsyncStorage  } from 'react-native';
import { Block, Text, theme } from "galio-framework"
import appTheme from "../constants/Theme";
import { Card } from 'react-native-elements';
import { Picker } from 'react-native-picker-dropdown'
import Axios from "axios";
import config from '../config';
const { width } = Dimensions.get('screen');



const HomeScreen = (props) => {
  const [CurrentMonth, setCurrentMonth] = useState("");
  const [CurrentMonthExpenseAmount, setCurrentMonthExpenseAmount] = useState(0);
  const [RegisteredUserCount, setRegisteredUserCount] = useState("0");
  const [ExpenseData, setExpenseData] = useState([]);
  const [MonthInfo, setMonthInfo] = useState([]);
  const[IsLoaded, setIsLoaded] = useState(false);
  
//   const  onPickerValueChange =  ()=>{
// setCurrentMonth(this.value);
//   }
let MonthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MonthData  =() => {
    let data = [];
    
    let today = new Date();
    
    data.push({MonthText:MonthArray[today.getMonth()], Month:today.getMonth()+1, Year: today.getFullYear()})
    setCurrentMonth((today.getMonth()+1) +','+today.getFullYear())
    const perviousMonth = new Date();
    const newMonth = perviousMonth.getMonth() - 1;
    if(newMonth < 0){
        newMonth += 12;
        perviousMonth.setYear(d.getYear() - 1);
    }
    perviousMonth.setMonth(newMonth);
    data.push({MonthText:MonthArray[perviousMonth.getMonth()], Month:perviousMonth.getMonth()+1, Year: perviousMonth.getFullYear()})

    const perviousMonth1 = new Date();
    const newMonth_1 = perviousMonth1.getMonth() - 2;
    if(newMonth_1 < 0){
      newMonth_1 += 12;
        perviousMonth1.setYear(d.getYear() - 1);
    }
    perviousMonth1.setMonth(newMonth_1);
    data.push({MonthText:MonthArray[perviousMonth1.getMonth()], Month:perviousMonth1.getMonth()+1, Year: perviousMonth1.getFullYear()})
setMonthInfo(data);
// console.log(data);
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
  

  getUsers = async () => {
    let userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
        .access_token,
    };
    let isAuthorised = await decodeToken(userAuth);
    if (!isAuthorised) {
      userAuth = {
        refresh_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
          .refresh_token,
      };
      await authenticateWithRefreshToken(userAuth);
      userAuth = {
        access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
          .access_token,
      };
      await decodeToken(userAuth);
    }
    userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
        .access_token,
    };
    Axios.defaults.headers.common['Authorization'] =
      'bearer ' + userAuth.access_token;
    await Axios.get(config.USER_SERVICE + 'getUsers')
      .then(res => {
        let count =[];
        if (res.data !== null || res.data !== undefined) {
           count = res.data.filter((item) => {
            return item.IsActive == true
         });
         setRegisteredUserCount(count.length); 
        }
      })
      .catch(err => {
        if (err.response !== undefined && err.response.status === 400)
          console.log(err.response.data.message);
      });
  };

  const getExpenses = async () => {
    let userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
        .access_token,
    };
    let isAuthorised = await decodeToken(userAuth);
    if (!isAuthorised) {
      userAuth = {
        refresh_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
          .refresh_token,
      };
      await authenticateWithRefreshToken(userAuth);
      userAuth = {
        access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
          .access_token,
      };
      await decodeToken(userAuth);
    }
    userAuth = {
      access_token: JSON.parse(await AsyncStorage.getItem('userAuth'))
        .access_token,
    };
    Axios.defaults.headers.common['Authorization'] =
      'bearer ' + userAuth.access_token;
      // console.log(config.EXPENSE_SERVICE + 'getDashboardBasedOnMonth?month='+CurrentMonth.split(',')[0]+'&year='+CurrentMonth.split(',')[1]+'')
      
    await Axios.get(config.EXPENSE_SERVICE + 'getDashboardBasedOnMonth?month='+CurrentMonth.split(',')[0]+'&year='+CurrentMonth.split(',')[1]+'')
      .then(res => {
        // console.log(res);
        if (res.data !== null || res.data !== undefined) {
          setExpenseData(res.data);
          setIsLoaded(true);
          const currentMonthAmount = res.data.reduce((totalAmount, data) => totalAmount + parseInt(data.TotalAmount, 0), 0);
          setCurrentMonthExpenseAmount(currentMonthAmount);
          // console.log(currentMonthAmount);
          // console.log(res.data);
          // setState({
          //   expenseData: res.data,
          //   IsLoaded: true,
          // });
          // console.log("Test");
        }
        // consoleconsole.log(ExpenseData[0].UserName);
      })
      .catch(err => {
        // if (err.response !== undefined && err.response.status === 400)
        // ToastAndroid.showWithGravityAndOffset(
        //   err.response.data.message,
        //   // ToastAndroid.LONG,
        //   // ToastAndroid.BOTTOM,
        //   25,
        //   50,
        // );
      });
  };


  // componentDidMount = async () => {
  //   getUsers();
  //   // this.getExpenses();
  // };
  useEffect(() => {
    getUsers();
    getExpenses();
    MonthData();
    // console.log("ExpenseData");
  }, []);
  
    return (
      
        <ScrollView style={styles.container}>
        <Card containerStyle={styles.CardViewContainer}>
        {/*react-native-elements Card*/}
        <View style={styles.CardViewBody}>
          <Text style={styles.MainText}>
            {CurrentMonthExpenseAmount} INR
          </Text>
          <Text  style={styles.SubText}>
            Month ({MonthArray[CurrentMonth.split(',')[0]-1]})
          </Text>
          </View>
          <View style={styles.FooterView}>
          <Text style={styles.FooterViewText}>
            More Info
          </Text>
          </View>
        </Card>

        <Card containerStyle={styles.CardViewContainer1}>
        {/*react-native-elements Card*/}
        <View style={styles.CardViewBody}>
          <Text style={styles.MainText1}>
            {RegisteredUserCount}
          </Text>
          <Text  style={styles.SubText1}>
            User Registrations
          </Text>
          </View>
          <View style={styles.FooterView1}>
          <Text style={styles.FooterViewText1}>
            More Info
          </Text>
          </View>
        </Card>
        
        {/* <Card containerStyle={styles.CardViewContainer2}>
        
        <View style={styles.CardViewBody}>
          <Text style={styles.MainText}>
            65
          </Text>
          <Text  style={styles.SubText}>
            Unique Visitors
          </Text>
          </View>
          <View style={styles.FooterView2}>
          <Text style={styles.FooterViewText}>
            More Info
          </Text>
          </View>
        </Card> */}
     
  <Picker
          selectedValue={CurrentMonth}
          //  onValueChange={onPickerValueChange.bind(this)}
           onValueChange={(text) => {
            setCurrentMonth(text);
            setExpenseData([]);
            setCurrentMonthExpenseAmount(0);
            getExpenses();
          }}
          mode="dialog"
          textStyle={styles.pickerText}
          style={{paddingRight :20, paddingLeft:20}}
        >
          {
          MonthInfo.map((item,index)=>(
            <Picker.Item label={item.MonthText+', '+ item.Year} value={item.Month+','+item.Year} />
          ))
        }
        </Picker>
        <View>
            {
               ExpenseData.map((item, index) => (
                  <TouchableOpacity
                     key = {item.UserName}
                    //  style = {styles.container}
                     >
                       
                <Card containerStyle={styles.CardViewUserContainer}>
        {/*react-native-elements Card*/}
        <View style={styles.CardViewBody}>
        <View style={{flex:1, flexDirection:'column', justifyContent:'center'}}>
                <View style={{flexDirection:'row'}}>
               <Text style={{flex:0.8, height:20}}>{item.UserName}</Text>
                    <Text style={{flex:0.2, textAlign:"right"}}>{item.TotalAmount} INR</Text> 
                    
                </View>
                </View>
                </View>
        </Card>
            
                  </TouchableOpacity>
               ))
            }
         </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#EDF6FF"
    },
    CardViewContainer:{
      backgroundColor:'#17a3b8', 
      padding:0
    },
    CardViewContainer1:{
      backgroundColor:'#FFC107', 
      padding:0
    },
    CardViewContainer2:{
      backgroundColor:'#DC3545', 
      padding:0
    },
    CardViewUserContainer:{
      backgroundColor:'#FFFFFF', 
      padding:0
    },
    
    CardStype:{
        backgroundColor:'#17a3b8'
    },
    MainText:{
      color:theme.COLORS.WHITE,
      fontSize:18,
      fontWeight:"bold"
      
    },
    SubText:{
      color:theme.COLORS.WHITE,
      fontSize:15,
      paddingTop:10,
      paddingBottom:10
      
    },
    FooterView:{
      backgroundColor:'#1592A5',
      padding:5,
    },
    FooterViewText:{
      color:theme.COLORS.WHITE,
      textAlign:"center",
      fontSize:15,
    
    },
    MainText1:{
      fontSize:18,
      fontWeight:"bold"
      
    },
    SubText1:{
      fontSize:15,
      paddingTop:10,
      paddingBottom:10
      
    },
    FooterView1:{
      backgroundColor:'#E5AD06',
      padding:5,
    },
    FooterView2:{
      backgroundColor:'#C6303E',
      padding:5,
    },
    FooterViewText1:{
      textAlign:"center",
      fontSize:15,
    
    },
    
    CardViewBody:{
      padding:15
    },
    pickerText:{
      paddingTop:15,
      textAlign:"center",
      fontSize:15,
      fontWeight:"bold"
    }
    
});

export default HomeScreen;