import Icon from "react-native-vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  BackHandler,
  AsyncStorage,
} from "react-native";
import ReactNativePinView from "react-native-pin-view";
import ToastIndicator from "../components/ToastIndicator";
import { LocalAuthentication } from "expo";

const SecurityScreen = (props) => {
  const pinView = useRef(null);
  const [isShow, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [showCompletedButton, setShowCompletedButton] = useState(false);

  const onBackButtonPressed = () => {
    return true;
  };

  useEffect(() => {
    if (enteredPin.length > 0) {
      setShowRemoveButton(true);
    } else {
      setShowRemoveButton(false);
    }
    if (enteredPin.length === 4) {
      setShowCompletedButton(true);
    } else {
      setShowCompletedButton(false);
    }
    BackHandler.addEventListener("hardwareBackPress", onBackButtonPressed);
  }, [enteredPin]);

  validatePassCode = async () => {
    await AsyncStorage.getItem("security", (err, result) => {
      if (result !== null) {
        const resultValue = JSON.parse(result);
        if (resultValue.securityCode === "") {
          setShow(true);
          setErrorMessage("Security code should not be empty");
          pinView.current.clear();
          pinView.current.clear();
          pinView.current.clear();
          pinView.current.clear();
          setTimeout(() => {
            setShow(false);
            setErrorMessage("");
          }, 5000);
        } else if (resultValue.securityCode !== enteredPin) {
          console.log(resultValue);
          setShow(true);
          setErrorMessage("Security code invalid");
          pinView.current.clear();
          pinView.current.clear();
          pinView.current.clear();
          pinView.current.clear();
          setTimeout(() => {
            setShow(false);
            setErrorMessage("");
          }, 5000);
        } else {
          pinView.current.clear();
          pinView.current.clear();
          pinView.current.clear();
          pinView.current.clear();
          props.navigation.navigate("Home");
        }
      }
    });
  };

  submitHandler = async (value) =>{
    setEnteredPin(value);
    if(enteredPin.length === 4){
      validatePassCode();
    }
  }

  return (
    <>
      <ToastIndicator
        isShowValue={isShow}
        position="top"
        colorValue="error"
        value={errorMessage}
      ></ToastIndicator>
      <StatusBar barStyle="light-content" />
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ReactNativePinView
          inputSize={32}
          ref={pinView}
          pinLength={4}
          buttonSize={60}
          onValueChange={(value) => {submitHandler(value)}}
          buttonAreaStyle={{
            marginTop: 24,
          }}
          inputAreaStyle={{
            marginBottom: 24,
          }}
          inputViewEmptyStyle={{
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#000",
          }}
          inputViewFilledStyle={{
            backgroundColor: "black",
          }}
          buttonViewStyle={{
            borderWidth: 1,
            borderColor: "#000",
          }}
          buttonTextStyle={{
            color: "#000",
          }}
          onButtonPress={(key) => {
            if (key === "custom_left") {
              pinView.current.clear();
            }
            if (key === "custom_right") {
              validatePassCode();
            }
            if (enteredPin.length === 4) {
              validatePassCode();
            }
          }}
          customLeftButton={
            showRemoveButton ? (
              <Icon name={"ios-backspace"} size={36} color={"#000"} />
            ) : undefined
          }
          customRightButton={
            showCompletedButton ? (
              <Icon name={"ios-unlock"} size={36} color={"#000"} />
            ) : undefined
          }
        />
      </SafeAreaView>
    </>
  );
};
export default SecurityScreen;
