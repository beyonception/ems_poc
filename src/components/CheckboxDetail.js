import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

class CheckBoxDetail extends Component {
  render() {
    return (
      <CheckBox
        value={this.props.IsSelected}
        onChange={this.props.valueChanged}
      />
    );
  }
}

export default CheckBoxDetail;
