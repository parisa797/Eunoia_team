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

const SignUp = ({ navigation }: AuthNavigationProps<"SignUp">) => {
  const [user, setUsername] = useState("");
  const [pass, setPassword] = useState("");
  const [confpass, setconferm_Password] = useState("");
  const [eml, setemail] = useState("");

  const password = useRef<RNTextInput>(null);
  const confirmPassword = useRef<RNTextInput>(null);

  const pressLogin = () => {
    console.log("im in kuft method");
    navigation.navigate("Login");
  };

  const validateEmail = (text) => {
    console.log("text is", text);
    let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(String(text).toLowerCase());
  };

  const validateUser = (text) => {
    console.log("text is", text);
    let pattern = /[a-zA-Z]/;
    return pattern.test(String(text).toLowerCase());
  };

  const HandleSignup = () => {
    if (
      user.lenght == 0 ||
      eml.length == 0 ||
      pass.length == 0 ||
      confpass.lengh == 0
    ) {
      showMessage({
        message: "لطفا اطلاعات کاربری خود را کامل وارد کنید.",
        type: "warning",
        backgroundColor: "#f1f1f2",
        color: "#000",
        statusBarHeight: "8",
        titleStyle: {
          fontSize: 15,
        },
      });
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
        "http://iust-bshop.herokuapp.com/rest-auth/registration/",
        requestOptions
      )
        .then((response) => {
          console.log("this is response", response);
          return response.json();
        })
        .then((result) => {
          console.log("this is result", result);
          var keys = Object.keys(result);
          if (keys.some((x) => x == "password1")) {
            alert(
              "توجه" +
                "\n" +
                "*رمز عبور باید شامل حداقل هشت کارکتر باشد." +
                "*رمز عبور شما باید شامل اعداد و حروف باشید." +
                "*رمز عبور باید پیچیده باشد.(لطفا از رمز عبور های رایج استفاده نکنید.)"
            );
          } else {
            if (keys.some((x) => x == "detail")) {
              alert(
                "ثبت نام شما با موفقیت انجام شد ! لطفا جهت ادامه و ورود ایمیل ارسالی را تایید کنید"
              );
              pressLogin();
            }
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
        {/* <Image style={styles.image} source={require("./assets/signup.png")}/> */}

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
                alert(
                  "نام کاربری نمیتواند شامل ارقام باشد! لطفا از ترکیبی از حرف و عدد استفاده کنید."
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
                alert("رمزعبورهای وارد شده باید با هم مطابقت داشته باشند.");
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
              if (v == false) alert("لطفا ایمیل خود را درست وارد کنید.");
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.SignUpBtn}
          onPress={() => HandleSignup()}
        >
          <Text style={styles.SignUpText}>ثبت نام</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20 }}>حساب کاربری دارید؟</Text>
        <Text style={{ color: "#b31414", fontSize: 20 }} onPress={pressLogin}>
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
  // image:{
  // width: "90%",
  // height:"50%",
  // },

  SignUpBtn: {
    width: 90,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#b31414",
  },
});

export default SignUp;
