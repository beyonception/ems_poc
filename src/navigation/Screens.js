import React from "react";
import { Easing, Animated, Dimensions } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { Block } from "galio-framework";

// screens
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import SecurityScreen from "../screens/SecurityScreen";
import RegisterSecurityScreen from '../screens/RegisterSecurityScreen';
import ExpenseScreen from '../screens/ExpenseScreen';
import AddExpense from '../screens/AddExpense';

// drawer
import MenuItems from "./Menu";

// header for screens
import Icon from "../components/Icon";
import Header from "../components/Header"

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();1

function HomeStack(props) {
    return (
        <Stack.Navigator mode="card" headerMode="screen">
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    header: ({ navigation, scene }) => (
                        <Header
                            title="Home"
                            search
                            options
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    cardStyle: { backgroundColor: "#F8F9FE" }
                }}
            />
        </Stack.Navigator>
    );
}

function ExpenseStack(props) {
    return (
        <Stack.Navigator mode="card" headerMode="screen">
            <Stack.Screen
                name="Expense"
                component={ExpenseScreen}
                options={{
                    header: ({ navigation, scene }) => (
                        <Header
                            title="Expense"
                            search
                            options
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    cardStyle: { backgroundColor: "#F8F9FE" }
                }}
            />
        </Stack.Navigator>
    );
}

function AddExpenseStack(props) {
    return (
        <Stack.Navigator mode="card" headerMode="screen">
            <Stack.Screen
                name="AddExpense"
                component={AddExpense}
                options={{
                    header: ({ navigation, scene }) => (
                        <Header
                            title="Expense"
                            search
                            options
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    cardStyle: { backgroundColor: "#F8F9FE" }
                }}
            />
        </Stack.Navigator>
    );
}

function CameraStack(props) {
    return (
        <Stack.Navigator mode="card" headerMode="screen">
            <Stack.Screen
                name="Camera"
                component={CameraScreen}
                options={{
                    header: ({ navigation, scene }) => (
                        <Header
                            title="Camera Screen"
                            back
                            white
                            transparent
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    headerTransparent: true
                }}
            />
        </Stack.Navigator>
    );
}

export default function AppStack(props) {
    return (
        <Drawer.Navigator
            style={{ flex: 1 }}
            drawerContent={props => <MenuItems {...props} />}
            drawerStyle={{
                backgroundColor: "white",
                width: width * 0.8
            }}
            drawerContentOptions={{
                activeTintcolor: "white",
                inactiveTintColor: "#000",
                activeBackgroundColor: "transparent",
                itemStyle: {
                    width: width * 0.75,
                    backgroundColor: "transparent",
                    paddingVertical: 16,
                    paddingHorizonal: 12,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    overflow: "hidden"
                },
                labelStyle: {
                    fontSize: 18,
                    marginLeft: 12,
                    fontWeight: "normal"
                }
            }}
            initialRouteName="Login"
        >
            <Drawer.Screen name="Home" component={HomeStack} />
            <Drawer.Screen name="Manage Expense" component={ExpenseStack} />
            <Drawer.Screen name="Reports" component={HomeStack} />
            <Drawer.Screen name="Dashboard" component={HomeStack} />
            <Drawer.Screen name="Manage Users" component={CameraScreen} />
            <Drawer.Screen name="Login" component={LoginScreen} />
            <Drawer.Screen name="Sign out" component={LoginScreen} />
            <Drawer.Screen name="Security" component={SecurityScreen} />
            <Drawer.Screen name="RegisterSecurity" component={RegisterSecurityScreen} />
            <Drawer.Screen name="AddExpense" component={AddExpenseStack} />
        </Drawer.Navigator>
    );
}

