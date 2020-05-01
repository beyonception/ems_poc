import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Block, Text, theme } from "galio-framework";

import Icon from "./Icon";
import appTheme from "../constants/Theme";

class DrawerItem extends React.Component {
  renderIcon = () => {
    const { title, focused } = this.props;

    switch (title) {
      case "Dashboard":
        return (
          <Icon
            name="shop"
            family="fontExtra"
            size={14}
            color={focused ? "white" : appTheme.COLORS.PRIMARY}
          />
        );
      case "Manage Expense":
        return (
          <Icon
            name="calendar-date"
            family="fontExtra"
            size={14}
            color={focused ? "white" : appTheme.COLORS.PRIMARY}
          />
        );
      case "Manage Users":
        return (
          <Icon
            name="spaceship"
            family="fontExtra"
            size={14}
            color={focused ? "white" : appTheme.COLORS.PRIMARY}
          />
        );
      case "Reports":
        return (
          <Icon
            name="chart-pie-35"
            family="fontExtra"
            size={14}
            color={focused ? "white" : appTheme.COLORS.PRIMARY}
          />
        );
      case "Sign out":
        return (
          <Icon
            name="palette"
            family="es"
            size={14}
            color={focused ? "white" : appTheme.COLORS.WARNING}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { focused, title, navigation } = this.props;

    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null
    ];

    return (
      <TouchableOpacity
        style={{ height: 60 }}
        onPress={() =>navigation.navigate(title)}
      >
        <Block flex row style={containerStyles}>
          <Block middle flex={0.1} style={{ marginRight: 5 }}>
            {this.renderIcon()}
          </Block>
          <Block row center flex={0.9}>
            <Text
              size={15}
              bold={focused ? true : false}
              color={focused ? "white" : "rgba(0,0,0,0.5)"}
            >
              {title}
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16
  },
  activeStyle: {
    backgroundColor: appTheme.COLORS.ACTIVE,
    borderRadius: 4
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default DrawerItem;
