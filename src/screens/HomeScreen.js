import React, { useEffect} from 'react';
import { Dimensions, StatusBar, StyleSheet } from 'react-native';
import { Block, Text, theme } from "galio-framework"
import appTheme from "../constants/Theme";

const { width } = Dimensions.get('screen');

const HomeScreen = (props) => {

    return (
        <Block flex style={styles.container}>
            <StatusBar backgroundColor="#dfdfdf" barStyle='dark-content' />
            <Text size={30}>
                Dashboard
            </Text>
        </Block>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.COLORS.WHITE
    },
});

export default HomeScreen;