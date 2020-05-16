import React from "react";
import Axios from "axios";
import { AsyncStorage } from 'react-native';
import config from "./config";

const authenticateWithRefreshToken = async (userAuth) => {
  await Axios.post(
    config.AUTH_SERVICE + "authenticateWithrefreshtoken",
    userAuth
  )
    .then((res) => {
      AsyncStorage.setItem("userAuth", JSON.stringify(res.data));
      return true;
    })
    .catch((err) => {
      console.log(err.response);
    });
};

const decodeToken = async (userAuth) => {
  let userAuth1 = await AsyncStorage.getItem("userAuth");
  await Axios.post(config.AUTH_SERVICE + "decodeToken", userAuth)
    .then((res) => {
      if (res.data.status === 403) {
        (userAuth = {
          refresh_token: JSON.parse(userAuth1).refresh_token,
        });
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const IsAuthenticated = async () => {
    
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
  }
  userAuth = {
    access_token: JSON.parse(await AsyncStorage.getItem("userAuth"))
      .access_token,
  };
  Axios.defaults.headers.common["Authorization"] =
    "bearer " + userAuth.access_token;
  return true;
};

export default IsAuthenticated;
