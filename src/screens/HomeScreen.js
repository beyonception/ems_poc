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