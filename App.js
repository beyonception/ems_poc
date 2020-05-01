import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Block, GalioProvider } from "galio-framework";
import Screens from "./src/navigation/Screens"
import { enableScreens } from "react-native-screens";
enableScreens();

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#66bb6a'
  }
}

export default function App() {
  return (
    <NavigationContainer>
      <GalioProvider theme={appTheme}>
        <Block flex>
          <Screens />
        </Block>
      </GalioProvider>
    </NavigationContainer>

  );
}
