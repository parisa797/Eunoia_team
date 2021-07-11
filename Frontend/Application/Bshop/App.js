import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SecureStore from "expo-secure-store";

import { Sidebar } from "./app/navigation";
import Welcome from "./app/welcome";
import Login from "./app/login";
import SignUp from "./app/signup";

const Stack = createStackNavigator();

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
          <Stack.Screen name="Login">
            {(props) => <Login {...props} extraData={setlogin} />}
          </Stack.Screen>
          <Stack.Screen name="Signup" component={SignUp} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          {/* <Stack.Screen
            name="BShop"
            component={Sidebar}
          /> */}
          <Stack.Screen name="BShop">
            {(props) => <Sidebar {...props} extraData={setlogin} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
