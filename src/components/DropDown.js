import React, {Component} from 'react';
import {Picker, View} from 'react-native';

class DropDown extends Component {
  render() {
    let pickerValues = [];
    if (this.props.dataValue.length > 0) {
      pickerValues.push(
        <Picker.Item label={this.props.defaultValue} key="0" value="0" />,
      );
      this.props.dataValue.map(data => {
        pickerValues.push(<Picker.Item label={data.value} key={data.id} value={data.id} />);
      });
    }
    return (
        <Picker
          selectedValue={this.props.selectedValue}
          style={this.props.selectedStyle}
          onValueChange={this.props.valueChanged}>
          {pickerValues}
        </Picker>
      
    );
  }
}

export default DropDown;
