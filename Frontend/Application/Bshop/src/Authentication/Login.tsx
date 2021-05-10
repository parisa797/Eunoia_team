import React, { useRef, useState } from "react";
// import { TextInput as RNTextInput } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { BorderlessButton } from "react-native-gesture-handler";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Button, Box } from "../components";
import { AuthNavigationProps } from "../components/Navigation";
// import TextInput from "../components/Form/TextInput";
import Checkbox from "../components/Form/Checkbox";
import Footer from "./components/Footer";

import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
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
} from "react-native";
// import { useSelector, useDispatch } from "react-redux";
// const LoginSchema = Yup.object().shape({
//   email: Yup.string().email("Invalid email").required("Required"),
//   password: Yup.string()
//     .min(2, "بسیار کوتاهه! دوباره تلاش کن")
//     .max(50, "خیلی طولانیه! دوباره تلاش کن")
//     .required("Required"),
// });

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

const Login = ({ navigation }: AuthNavigationProps<"Login">) => {
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");

  // const count = useSelector((state) => state.counter.value);
  // const count = useSelector((state) => state.isLoggedin.value);
  // console.log(count);

  // const dispatch = useDispatch();

  const HandleLogin = (email, pass) => {
    // const dispatch = useDispatch();
    console.log("in handle login");
    console.log(email);
    // console.log(dispatch(increment()));
    // if (email == undefined && pass == undefined) {
    if (email.length == 0 && pass.length == 0) {
      showMessage({
        message: "لطفا اطلاعات کاربری خود را وارد کنید.",
        type: "warning",
        backgroundColor: "#f1f1f2", // background color
        color: "#000", // text color
        statusBarHeight: "8",
        titleStyle: {
          fontSize: 15,
        },
      });
    } else {
      if (email.length == 0) {
        // alert("Please enter your email");
        showMessage({
          message: "لطفا ایمیل خود را وارد کنید.",
          type: "warning",
          backgroundColor: "#f1f1f2", // background color
          color: "#000", // text color
          statusBarHeight: "8",
          titleStyle: {
            fontSize: 15,
          },
        });
        // jest.spyOn(Alert, "alert");
      } else {
        if (pass.length == 0) {
          // alert("Please enter your password");
          showMessage({
            message: "لطفا پسورد خود را وارد کنید.",
            type: "warning",
            backgroundColor: "#f1f1f2", // background color
            color: "#000", // text color
            statusBarHeight: "8",
            titleStyle: {
              fontSize: 15,
            },
          });
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
        if (response.status == 200) {
          alert("You've logged in successfully");
        } else alert("Incorrect email or password");

        return response.json();
      })
      .then(async (result) => {
        console.log("hi", result);
        if (result.key != undefined) {
          save("token", result.key);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }],
            })
          );
        }
      })
      .catch((error) => console.log("error", error));
  };
  const pressSignUp = () => {
    navigation.navigate("SignUp"); //this line
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
        {/* <Image
          style={styles.image}
          source={require("../assets/Login-amico.png")}
        /> */}
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

        <Text style={{ fontSize: 20 }}>حساب کاربری ندارید؟</Text>
        <Text style={{ color: "#b31414", fontSize: 20 }} onPress={pressSignUp}>
          ثبت نام
        </Text>

        <FlashMessage position="top" />
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

  // image: {
  //   marginBottom: "10%",
  //   // marginTop: "-20%",
  //   width: "80%",
  //   height: "50%",

  //   // position: "absolute",
  //   // marginTop: 10,
  //   // resizeMode: "center",
  //   // marginTop: 20,
  //   // alignContent: "stretch",
  //   // alignSelf: "center",
  // },

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
