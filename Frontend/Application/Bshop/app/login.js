import { StatusBar } from "expo-status-bar";
import { enableExpoCliLogging } from "expo/build/logs/Logs";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
// import FlashMessage from "react-native-flash-message";
// import { showMessage, hideMessage } from "react-native-flash-message";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
} from "react-native";

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");

  const HandleLogin = (email, pass) => {
    Keyboard.dismiss();

    if (email.length == 0 && pass.length == 0) {
      // showMessage({
      //   message: "لطفا اطلاعات کاربری خود را وارد کنید.",
      //   type: "warning",
      //   backgroundColor: "#f1f1f2", // background color
      //   color: "#000", // text color
      //   statusBarHeight: "8",
      //   titleStyle: {
      //     fontSize: 15,
      //   },
      // });
      // console.log("enter info");
      ToastAndroid.show(
        "لطفا اطلاعات کاربری خود را وارد کنید.",
        ToastAndroid.SHORT
      );
    } else {
      if (email.length == 0) {
        // alert("Please enter your email");
        // showMessage({
        //   message: "لطفا ایمیل خود را وارد کنید.",
        //   type: "warning",
        //   backgroundColor: "#f1f1f2", // background color
        //   color: "#000", // text color
        //   statusBarHeight: "8",
        //   titleStyle: {
        //     fontSize: 15,
        //   },
        // });
        // console.log("enter email");
        ToastAndroid.show("لطفا ایمیل خود را وارد کنید.", ToastAndroid.SHORT);
        // jest.spyOn(Alert, "alert");
      } else {
        if (pass.length == 0) {
          // alert("Please enter your password");
          // showMessage({
          //   message: "لطفا پسورد خود را وارد کنید.",
          //   type: "warning",
          //   backgroundColor: "#f1f1f2", // background color
          //   color: "#000", // text color
          //   statusBarHeight: "8",
          //   titleStyle: {
          //     fontSize: 15,
          //   },
          // });
          // console.log("enter pass");
          ToastAndroid.show("لطفا پسورد خود را وارد کنید.", ToastAndroid.SHORT);
        } else {
          LoginFetch(email, pass);
        }
      }
    }
  };

  const LoginFetch = (email, pass) => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({
        email: email, //change this!!!
        password: pass,
      }),
    };
    fetch("http://iust-bshop.herokuapp.com/rest-auth/login/", requestOptions)
      .then((response) => {
        console.log(response);
        console.log(response.status);
        // if (response.status == 200) {
        //   alert("You've logged in successfully");
        // } else alert("Incorrect email or password");

        return response.json();
      })
      .then(async (result) => {
        console.log("hi", result);
        // if (result.key != undefined) {
        //   save("token", result.key);
        //   navigation.navigate("Home");
        // }
        var keys = Object.keys(result);
        if (keys.some((x) => x == "non_field_errors")) {
          if (result["non_field_errors"].includes("E-mail is not verified."))
            ToastAndroid.show(
              "ایمیل خود را تائید نکرده اید. لطفا برای ورود، پس از تائید ایمیل دوباره مراجعه کنید.",
              ToastAndroid.SHORT
            );
          if (
            result["non_field_errors"].includes(
              "Unable to log in with provided credentials."
            )
          )
            ToastAndroid.show(
              "ایمیل یا رمزعبور خود را به درستی وارد نکرده اید. لطفا مجددا تلاش کنید.",
              ToastAndroid.SHORT
            );
        }
        if (keys.some((x) => x == "key")) {
          save("token", result.key);
          navigation.navigate("Home");
        }
      })
      .catch((error) => console.log("error", error));
  };
  const pressSignUp = () => {
    navigation.navigate("Signup"); //this line
    //navigation.push("signup")
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        // console.log("dismissed keyboard");
      }}
    >
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../assets/Login-amico.png")}
        />
        <StatusBar style="auto" />
        <View style={styles.inputView}>
          <TextInput
            // data-testID="usernameInput"
            style={styles.TextInput}
            placeholder="ایمیل"
            placeholderTextColor="#000"
            onChangeText={(email) => setEmail(email)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="رمز عبور"
            placeholderTextColor="#000"
            secureTextEntry={true}
            onChangeText={(pass) => setPassword(pass)}
          />
        </View>
        {/* <TouchableOpacity>
        <Text style={styles.forgot_button}>Forgot Password?</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
            // login();
            HandleLogin(email, pass);
            // const count = useSelector((state) => state.isLoggedin.value);
            // console.log(count);
          }}
        >
          <Text style={styles.loginText}>ورود</Text>
        </TouchableOpacity>

        <Text
          style={{ color: "#b31414", fontSize: 20, marginTop: -9 }}
          onPress={pressSignUp}
        >
          <Text style={{ fontSize: 20, color: "black" }}>
            حساب کاربری ندارید؟
          </Text>
          ثبت نام
        </Text>

        {/* <FlashMessage position="top" /> */}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginBottom: "10%",
    marginTop: "-5%",
    width: "85%",
    height: "50%",

    // position: "absolute",
    // marginTop: 10,
    // resizeMode: "center",
    // marginTop: 20,
    // alignContent: "stretch",
    // alignSelf: "center",
  },

  inputView: {
    backgroundColor: "#f1f1f2",
    borderRadius: 20,
    width: "80%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
    alignContent: "center",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    fontSize: 20,
    color: "black",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: "-5%",
  },

  // forgot_button: {
  //   height: 30,
  //   marginBottom: 30,
  // },

  loginText: {
    color: "#fff",
    fontSize: 20,
  },

  loginBtn: {
    width: "40%",
    borderRadius: 20,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#b31414",
  },
});

export default Login;
