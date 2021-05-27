import React, { useRef, useState } from "react";

import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
// import FlashMessage from "react-native-flash-message";
// import { showMessage, hideMessage } from "react-native-flash-message";
// import Snackbar from "react-native-snackbar";
// import SnackBar from "react-native-snackbar-component";
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
// import { useSnackbar } from "notistack";
// import { withSnackbar } from 'notistack';

const SignUp = ({ navigation }) => {
  const [user, setUsername] = useState("");
  const [pass, setPassword] = useState("");
  const [confpass, setconferm_Password] = useState("");
  const [eml, setemail] = useState("");

  const pressLogin = () => {
    console.log("im in kuft method");
    navigation.navigate("Login");
  };

  const validateEmail = (text) => {
    console.log("text is", text);
    let pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(String(text).toLowerCase());
  };

  const validateUser = (text) => {
    if (text.length == 0) {
      ToastAndroid.show(
        "فیلد نام کاربری نمی تواند خالی باشد.",
        ToastAndroid.SHORT
      );
      return;
    }

    console.log("text is", text, "salam");
    let pattern = /[a-zA-Z]/;
    return pattern.test(String(text).toLowerCase());
  };

  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const HandleSignup = () => {
    Keyboard.dismiss();

    if (
      user.length == 0 ||
      eml.length == 0 ||
      pass.length == 0 ||
      confpass.length == 0
    ) {
      // enqueueSnackbar("sth");

      // enqueueSnackbar("I love hooks");
      // enqueueSnackbar("I  hooks");

      ToastAndroid.show(
        "لطفا اطلاعات کاربری خود را کامل وارد کنید.",
        ToastAndroid.SHORT
      );
    } else {
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify({
          username: user,
          password1: pass,
          password2: confpass,
          email: eml,
        }),
      };
      fetch(
        "http://eunoia-bshop.ir:8000/rest-auth/registration/",
        requestOptions
      )
        .then((response) => {
          console.log("this is response", response);
          return response.json();
        })
        .then((result) => {
          console.log("this is result", result);
          var keys = Object.keys(result);
          console.log("keys are:", keys);

          if (keys.some((x) => x == "username")) {
            console.log("in include");
            if (
              result["username"].includes(
                "MyUser with this username already exists."
              )
            )
              ToastAndroid.show(
                "این نام کاربری قبلا ثبت شده است. لطفا از نام کاربری دیگری استفاده کنید.",
                ToastAndroid.SHORT
              );
          }

          if (keys.some((x) => x == "password1")) {
            if (
              result["password1"].includes(
                "This password is too short. It must contain at least 8 characters."
              )
            )
              ToastAndroid.show(
                "رمز عبور باید شامل حداقل هشت کارکتر باشد.",
                ToastAndroid.SHORT
              );
            if (result["password1"].includes("This password is too common."))
              ToastAndroid.show(
                "رمز عبور باید پیچیده باشد.(لطفا از رمز عبور های رایج استفاده نکنید.)",
                ToastAndroid.LONG
              );
            if (
              result["password1"].includes("This password is entirely numeric.")
            )
              ToastAndroid.show(
                "رمز عبور شما باید شامل اعداد و حروف باشد.",
                ToastAndroid.SHORT
              );
          }

          if (keys.some((x) => x == "email")) {
            if (
              result["email"].includes(
                "A user is already registered with this e-mail address."
              )
            )
              ToastAndroid.show(
                "این ایمیل قبلا ثبت شده است. لطفا از ایمیل دیگری استفاده کنید.",
                ToastAndroid.SHORT
              );
          }

          if (keys.some((x) => x == "detail")) {
            ToastAndroid.show(
              "ثبت نام شما با موفقیت انجام شد ! لطفا جهت ادامه و ورود ایمیل ارسالی را تایید کنید",
              ToastAndroid.SHORT
            );
            navigation.navigate("Login");
          }
        })
        .catch((error) => {
          console.log("something bad happened.", error);
        });
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <Image style={styles.image} source={require("../assets/signup.png")} />

        <View style={styles.inputView}>
          <TextInput
            value={user}
            style={styles.input}
            placeholder="نام کاربری"
            autoCapitalize="none"
            placeholderTextColor="#000"
            testID={"user_check"}
            onChangeText={(user) => setUsername(user)}
            onBlur={() => {
              const v = validateUser(user);
              console.log(v);
              if (v == false)
                // alert(
                //   "نام کاربری نمیتواند شامل ارقام باشد! لطفا از ترکیبی از حرف و عدد استفاده کنید."
                // );
                ToastAndroid.show(
                  "نام کاربری نمیتواند تنها شامل ارقام باشد! لطفا از ترکیبی از حرف و عدد استفاده کنید.",
                  ToastAndroid.SHORT
                );
            }}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            value={pass}
            style={styles.input}
            placeholder="رمز عبور"
            secureTextEntry={true}
            autoCapitalize="none"
            testID={"pass_check"}
            placeholderTextColor="#000"
            onChangeText={(pass) => setPassword(pass)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            value={confpass}
            style={styles.input}
            testID={"confpass_check"}
            placeholder="تکرار رمز عبور"
            secureTextEntry={true}
            autoCapitalize="none"
            placeholderTextColor="#000"
            onChangeText={(confpass) => setconferm_Password(confpass)}
            onBlur={() => {
              if (pass != confpass)
                // alert("رمزعبورهای وارد شده باید با هم مطابقت داشته باشند.");
                ToastAndroid.show(
                  "رمزعبورهای وارد شده باید با هم مطابقت داشته باشند.",
                  ToastAndroid.SHORT
                );
            }}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            value={eml}
            style={styles.input}
            placeholder="ایمیل"
            autoCapitalize="none"
            testID={"eml_check"}
            placeholderTextColor="#000"
            onChangeText={(eml) => setemail(eml)}
            onBlur={() => {
              const v = validateEmail(eml);
              console.log(v);
              if (v == false)
                //  alert("لطفا یک ایمیل معتبر وارد کنید.");
                ToastAndroid.show(
                  "لطفا یک ایمیل معتبر وارد کنید.",
                  ToastAndroid.SHORT
                );
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.SignUpBtn}
          onPress={() => HandleSignup()}
        >
          <Text style={styles.SignUpText}>ثبت نام</Text>
        </TouchableOpacity>

        <Text
          style={{ color: "#b31414", fontSize: 20, marginTop: -15 }}
          onPress={pressLogin}
        >
          <Text style={{ fontSize: 20, color: "black" }}>
            حساب کاربری دارید؟
          </Text>
          ورود
        </Text>
      </View>
    </TouchableWithoutFeedback>
    // {/* </Container> */}
  );
};

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 55,
    backgroundColor: "#f1f1f2",
    marginBottom: 20,
    padding: 8,
    color: "black",
    borderRadius: 14,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginTop: -10,
  },
  // downpage: {
  //   marginBottom: 40,
  // },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: "-5%",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    fontSize: 20,
  },
  image: {
    width: "80%",
    height: "50%",
    marginTop: -35,
  },

  SignUpBtn: {
    width: 90,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#b31414",
  },
});

export default SignUp;
