import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ToastAndroid,
  AsyncStorage,
  Image,
} from "react-native";
import SubmitButton from "../components/Button";
import Textbox from "../components/Textbox";

import Label from "../components/Label";
import config from "../config";
import Axios from "axios";
import { GalioProvider } from "galio-framework";
import ToastIndicator from "../components/ToastIndicator";

LoginScreen = (props) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isShow, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [gotFromSignOut, setGotFromSignOut] = useState(false);

  const decodeUser = async (token) =>{
    const userDetails = {
      access_token: token
    };
    await Axios.post(config.AUTH_SERVICE + "decodeToken", userDetails)
      .then(async (res) => {
        if(res.data !== undefined){
          await AsyncStorage.setItem("userName", (res.data.user.FirstName + " " + res.data.user.LastName));
        }
      })
      .catch((err) => {
        if (err.response !== undefined && err.response.status === 400) {
         
        }
      });
  }

  submitHandler = async () => {
    const userDetails = {
      UserName: userName,
      Password: password,
    };
    await Axios.post(config.USER_SERVICE + "authenticateUser", userDetails)
      .then((res) => {
        AsyncStorage.setItem("userAuth", JSON.stringify(res.data));
        decodeUser(res.data.access_token);
        setUserName("");
        setPassword("");
        props.navigation.navigate("RegisterSecurity");
      })
      .catch((err) => {
        if (err.response !== undefined && err.response.status === 400) {
          setShow(true);
          setTimeout(() => {
            setShow(false);
            setErrorMessage("");
          }, 5000);
          setErrorMessage(err.response.data.message);
        }
      });
  };

  useEffect(async () => {
    if (props.route.name === "Sign out") {
      AsyncStorage.removeItem("security", (err, result) => {
        console.log("removed");
      });
      AsyncStorage.removeItem("userAuth", (err, result) => {
        console.log("removed");
      });
      AsyncStorage.removeItem("userName", (err, result) => {
        console.log("removed");
      });
    } else {
      await AsyncStorage.getItem("security", (err, result) => {
        if (result !== null) {
          const resultValue = JSON.parse(result);
          console.log(resultValue.securityCode);
          if (resultValue.securityCode === undefined) {
            props.navigation.navigate("Login");
          } else if (
            resultValue.securityCode !== "" ||
            resultValue.securityCode !== undefined
          ) {
            props.navigation.navigate("Security");
          } else {
            AsyncStorage.removeItem("userAuth", (err, result) => {
              props.navigation.navigate("Login");
            });
          }
        }
      });
    }
  }, []);

  const customTheme = {
    SIZES: { BASE: 18 },
  };

  return (
    <View theme={customTheme}>
      <ToastIndicator
        isShowValue={isShow}
        position="top"
        colorValue="error"
        value={errorMessage}
      ></ToastIndicator>
      <View style={styles.viewStyle}>
        <Image
          source={require("../assets/images/logo.png")}
          style={{
            height: 100,
            width: 100,
            alignSelf: "center",
            marginTop: 45,
          }}
        />
        
        <Textbox
            labeValue="User Name"
            secureText={false}
            textValue={userName}
            onChangedTextHandler={(text) => {
              setUserName(text);
            }}
            textStyle={{ backgroundColor: "white",marginBottom:10 }}
          />
          <Textbox
            labeValue="Password"
            secureText={true}
            textValue={password}
            onChangedTextHandler={(text) => {
              setPassword(text);
            }}
            textStyle={{ backgroundColor: "white",marginBottom:10 }}
          />
        
        <SubmitButton
          titleValue="Login"
          handler={submitHandler}
          styleValue={{ width: 200, marginTop: 10 }}
          modeType="contained"
          colorValue="blue"
          iconValue="content-save-all"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    margin: 30,
    marginTop: 100,
    justifyContent: "center",
  },
});

export default LoginScreen;
