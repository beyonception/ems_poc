import React from "react";
import { useSafeArea } from "react-native-safe-area-context";
import {
    ScrollView,
    StyleSheet,
    Image
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import Images from "../constants/Images";
import DrawerItem from '../components/DrawerItem';

function MenuItems({ drawerPosition, navigation, profile, focused, state, ...rest }) {
    const insets = useSafeArea();
    const screens = [
        "Dashboard",
        "Manage Expense",
        "Manage Users",
        "Reports",
        "Sign out"
    ];
    return (
        <Block
            style={styles.container}
            forceInset={{ top: 'always', horizontal: 'never' }}
        >
            <Block flex={0.06} style={styles.header}>
                <Image styles={styles.logo} source={Images.profileImg} />
                <Text
                    size={15}
                    bold={true}
                    color="rgba(0,0,0,0.5)"
                >
                    Ananthprasad Narayanan
                </Text>
            </Block>
            <Block style={{ margin: 5, borderColor: "rgba(0,0,0,0.2)", width: '100%', borderWidth: StyleSheet.hairlineWidth }} />

            <Block flex style={{ paddingLeft: 8, paddingRight: 14 }}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {screens.map((item, index) => {
                        return (
                            <DrawerItem
                                title={item}
                                key={index}
                                navigation={navigation}
                                focused={state.index === index ? true : false}
                            />
                        );
                    })}
                    <Block flex style={{ marginTop: 24, marginVertical: 8, paddingHorizontal: 8 }}>
                        <Block style={{ borderColor: "rgba(0,0,0,0.2)", width: '100%', borderWidth: StyleSheet.hairlineWidth }} />
                    </Block>
                    <DrawerItem title="Help & Support" navigation={navigation} />
                    <DrawerItem title="Submit a Ticket" navigation={navigation} />
                </ScrollView>
            </Block>
        </Block>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 28,
        paddingBottom: theme.SIZES.BASE,
        paddingTop: theme.SIZES.BASE * 3,
        justifyContent: 'center'
    },
    logo: {
        width: 5,
        height: 5
    }
});

export default MenuItems;
