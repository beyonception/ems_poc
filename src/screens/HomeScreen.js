import React from 'react';
import { View, StatusBar } from 'react-native';
import Header from '../components/Header';

const HomeScreen = (props) => {
    return (
        <View>
            <StatusBar backgroundColor="#f3f2f5" barStyle="dark-content" />
            <Header navigation={props.navigation} />
        </View>
    );
}

export default HomeScreen;