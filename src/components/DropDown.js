import React from 'react';
import {Picker } from 'react-native';

const DropDown= (props) => {
    let pickerValues = [];
    
    if (props.dataValue.length > 0) {
      pickerValues.push(
        <Picker.Item label={props.defaultValue} key="0" value="0" />,
      );
      props.dataValue.map(data => {
        pickerValues.push(<Picker.Item label={data.value} key={data.id} value={data.id} />);
      });
    }
    return (
        <Picker
          selectedValue={props.selectedValue}
          style={props.selectedStyle}
          onValueChange={props.valueChanged}>
          {pickerValues}
        </Picker>
      
    );
}

export default DropDown;
