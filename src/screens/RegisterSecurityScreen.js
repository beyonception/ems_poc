import React, { useState, useEffect } from "react";
import { GalioProvider } from "galio-framework";
import { View, StyleSheet, AsyncStorage, BackHandler } from "react-native";
import Textbox from "../components/Textbox";
import ToastIndicator from "../components/ToastIndicator";
import Label from "../components/Label";
import SubmitButton from "../components/Button";

const RegisterSecurityScreen = (props) => {
  const [isShow, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [confirmSecurityCode, setConfirmSecurityCode] = useState("");
  const customTheme = {
    SIZES: { BASE: 18 },
  };

  const onBackButtonPressed = () => {
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", onBackButtonPressed);
  }, []);

  submitHandler = async () => {
    if (securityCode !== confirmSecurityCode) {
      setShow(true);
      setErrorMessage("Both should be same");
      setTimeout(() => {
        setShow(false);
        setErrorMessage("");
      }, 5000);
    } else if (securityCode === "" || securityCode === null) {
      setShow(true);
      setErrorMessage("Security Code is mandatory");
      setTimeout(() => {
        setShow(false);
        setErrorMessage("");
      }, 5000);
    } else if (confirmSecurityCode === "" || confirmSecurityCode === null) {
      setShow(true);
      setErrorMessage("Security Code is mandatory");
      setTimeout(() => {
        setShow(false);
        setErrorMessage("");
      }, 5000);
    } else {
      await AsyncStorage.setItem(
        "security",
        JSON.stringify({ securityCode: securityCode }),
        () => {
          AsyncStorage.getItem("security", (err, result) => {
            props.navigation.navigate("Home");
          });
        }
      );
    }
  };

  return (
    <GalioProvider theme={customTheme}>
      <ToastIndicator
        isShowValue={isShow}
        position="top"
        colorValue="error"
        value={errorMessage}
      ></ToastIndicator>
      <View style={styles.viewStyle}>
        <Textbox
          labeValue="New Security Code"
          textValue={securityCode}
          onChangedTextHandler={(text) => {
            setSecurityCode(text);
          }}
          textStyle={{ backgroundColor: "white", marginBottom: 10 }}
          keyBoardTypeValue="numeric"
          maxLengthValue={4}
        />
        
        <Textbox
          labeValue="Confirm Security Code"
          textValue={confirmSecurityCode}
          onChangedTextHandler={(text) => {
            setConfirmSecurityCode(text);
          }}
          textStyle={{ backgroundColor: "white", marginBottom: 10 }}
          keyBoardTypeValue="numeric"
          maxLengthValue={4}
        />
        <SubmitButton
          titleValue="Confirm"
          modeType="contained"
          colorValue="blue"
          iconValue="content-save-all"
          handler={submitHandler}
          styleValue={{ width: 200, marginTop: 10 }}
        />
      </View>
    </GalioProvider>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    margin: 30,
    marginTop: 200,
    justifyContent: "center",
  },
});

export default RegisterSecurityScreen;
