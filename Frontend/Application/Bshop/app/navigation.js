import * as React from "react";
// import { View, Text } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";

import Welcome from "./welcome";
import Login from "./login";
import SignUp from "./signup";

import Home from "./homepage";
import shopDetail from "./shopDetails";

// const Stack = createStackNavigator();

// export default Navigations = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Welcome">
//         <Stack.Screen name="Welcome" component={Welcome} />
//         <Stack.Screen name="Login" component={Login} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ShopDetail" component={ShopDetail} />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

// export const Router = () => {
//   //More explanations about "authData" below
//   return (
//     <NavigationContainer>
//       {authData ? <AppStack /> : <AuthStack />}
//     </NavigationContainer>
//   );
// };
