import React, { useState } from 'react';
import { StyleSheet, View, ToastAndroid, AsyncStorage, Image } from 'react-native';
import SubmitButton from '../components/Button';
import Textbox from '../components/Textbox';
import Label from '../components/Label';
import config from '../config';
import Axios from 'axios';

LoginScreen = (props) =>{
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    submitHandler = async () => {
        const userDetails = {
            UserName: userName,
            Password: password,
          };
          await Axios.post(config.USER_SERVICE + 'authenticateUser', userDetails)
            .then(res => {
              AsyncStorage.setItem('userAuth', JSON.stringify(res.data));
              props.navigation.navigate('Home');
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
    }

    return (
        <View style={styles.viewStyle}>
        <Image source={require('../../assets/imgs/logo.png')} style={{height:100,width:100, alignSelf:'center', marginTop:45}} />
        <Label textValue="User Name" />
        <Textbox
          secureText={false}
          textStyle={{
            height: 40,
            backgroundColor: '#ebe9f5',
            marginBottom: 10,
            paddingLeft:5
          }}
          textValue={userName}
          placeHolderValue="User Name"
          onChangedTextHandler={text => {
            setUserName(text);
          }}
        />
        <Label textValue="Password" />
        <Textbox
          secureText={true}
          textStyle={{
            height: 40,
            backgroundColor: '#ebe9f5',
            marginBottom: 10,
            paddingLeft:5
          }}
          textValue={password}
          placeHolderValue="Password"
          onChangedTextHandler={text => {
            setPassword(text);
          }}
        />
        <SubmitButton titleValue="Login" onPressHandler={submitHandler} color="#1E6738" />
      </View>
    );
}

const styles = StyleSheet.create({
    viewStyle: {
      marginTop: 30,
      marginLeft: 30,
      marginRight: 30,
      justifyContent:'center'
    },
  });

  export default LoginScreen;