import React, { useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import Header from "../components/Header"
import CameraView from "../components/CameraView"

const CameraScreen = ({ navigation }) => {

  const [isOpenCamera, setIsOpenCamera] = useState(false)

  renderCamera = () => {
    const openStatus = isOpenCamera ? false : true
    setIsOpenCamera(openStatus)
  }

  onPictureSaved = photo => {
    console.log(photo);
  }

  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      {isOpenCamera && 
        <CameraView 
          onCapture={onPictureSaved}
        />
      }
      <Button
          title= { isOpenCamera ? "Close Camera" : "Open Camera" }
          color="#000000"
          onPress={renderCamera}
        />
    </View>
  );
}

export default CameraScreen;