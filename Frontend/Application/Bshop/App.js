import * as React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
// import { DrawerActions } from "react-navigation";
import * as SecureStore from "expo-secure-store";

import Welcome from "./app/welcome";
import Login from "./app/login";
import SignUp from "./app/signup";
import Home from "./app/homepage";
import ShopDetail from "./app/shopDetails";
import PersonalInfo from "./app/PersonalInfo";
// import { AuthStack, AppStack } from "./app/navigation";

// import { SnackbarProvider } from "notistack";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

//Structure for the navigatin Drawer
const NavigationDrawerStructure = (props) => {
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.openDrawer();
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity onPress={toggleDrawer}>
        {/*Donute Button Image */}
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png",
          }}
          style={{ width: 25, height: 25, marginLeft: 15 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const AppStack = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: " ", //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: "#780909", //Set Header color
          },
          headerTintColor: "#fff", //Set Header text color
          // headerTitleStyle: {
          //   fontWeight: "bold", //Set Header text style
          // },
        }}
      />
      <Stack.Screen
        name="ShopDetail"
        component={ShopDetail}
        options={{ title: "اطلاعات فروشگاه" }}
      />
    </Stack.Navigator>
  );
};

const Sidebar = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="homepage"
        options={{
          drawerLabel: "صفحه اصلی",
          activeTintColor: "#e91e63",
        }}
        component={AppStack}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: "پروفایل",
          activeTintColor: "#e91e63",
        }}
        component={PersonalInfo}
      />
    </Drawer.Navigator>
  );
};

export default function App({ navigation }) {
  const [loggedin, setlogin] = React.useState(false);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      token = await SecureStore.getItemAsync("token");
      if (token) setlogin(true);
    };
    bootstrapAsync();
  }, []);

  console.log(loggedin);

  return (
    //state in not working true
    <NavigationContainer>
      {loggedin == false ? (
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={SignUp} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="drawer-stack"
            component={Sidebar}
            options={{ title: " " }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
