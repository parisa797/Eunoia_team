// import { StatusBar } from "expo-status-bar";
// import React from "react";
// import { StyleSheet, Text, View } from "react-native";
// import Navigations from "./app/navigation";

// export default function App() {
//   return (
//     // <View style={styles.container}>
//     //   <Text>Open up App.js to start working on your app!</Text>
//     //   <StatusBar style="auto" />
//     // </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Welcome from "./app/welcome";
import Login from "./app/login";
import SignUp from "./app/signup";
import Home from "./app/homepage";
import ShopDetail from "./app/shopDetails";

// import { SnackbarProvider } from "notistack";
const Stack = createStackNavigator();

export default function App() {
  return (
    // <SnackbarProvider maxSnack={3}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          // options={{ title: "خوش" }}
          name="Welcome"
          component={Welcome}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={SignUp} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ShopDetail" component={ShopDetail} />
      </Stack.Navigator>
    </NavigationContainer>
    // </SnackbarProvider>
  );
}
