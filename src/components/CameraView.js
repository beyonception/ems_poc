import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

const CameraView = ({ onCapture }) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    capture = async () => {
        if (this.camera1) {
            let photo = await this.camera1.takePictureAsync({ onCapture: this.onPictureSaved });
        }
    };

    return (
        <Camera
            style={{ flex: 1 }}
            type={type}
            ref={ref => {
                this.camera1 = ref;
            }}
        >
            <View
                style={{
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                }}>
                <Button
                    title="Flip Camera"
                    color="#000000"
                    onPress={() => {
                        setType(
                            type === Camera.Constants.Type.back
                                ? Camera.Constants.Type.front
                                : Camera.Constants.Type.back
                        );
                    }}>
                </Button>
                <Button
                    title="Capture"
                    color="#000000"
                    onPress={capture}>
                </Button>
            </View>
        </Camera>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 40
    }
})

export default CameraView;