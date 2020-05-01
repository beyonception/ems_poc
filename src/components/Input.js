import React from "react";
import { StyleSheet } from "react-native";
import PropTypes from 'prop-types';

import { Input } from "galio-framework";

import Icon from './Icon';
import appTheme from "../constants/Theme"

class AppInput extends React.Component {
  render() {
    const { shadowless, success, error } = this.props;

    const inputStyles = [
      styles.input,
      !shadowless && styles.shadow,
      success && styles.success,
      error && styles.error,
      {...this.props.style}
    ];

    return (
      <Input
        placeholder="write something here"
        placeholderTextColor={appTheme.COLORS.MUTED}
        style={inputStyles}
        color={appTheme.COLORS.HEADER}
        iconContent={
          <Icon
            size={14}
            color={appTheme.COLORS.ICON}
            name="link"
            family="AntDesign"
          />
        }
        {...this.props}
      />
    );
  }
}

Input.defaultProps = {
  shadowless: false,
  success: false,
  error: false
};

Input.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 4,
    borderColor: appTheme.COLORS.BORDER,
    height: 44,
    backgroundColor: '#FFFFFF'
  },
  success: {
    borderColor: appTheme.COLORS.INPUT_SUCCESS,
  },
  error: {
    borderColor: appTheme.COLORS.INPUT_ERROR,
  },
  shadow: {
    shadowColor: appTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.05,
    elevation: 2,
  }
});

export default AppInput;
