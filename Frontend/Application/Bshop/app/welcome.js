import { StatusBar } from "expo-status-bar";
import { enableExpoCliLogging } from "expo/build/logs/Logs";
import React, { useEffect, useState } from "react";
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

const Welcome = ({ navigation }) => {
  const pressLogin = () => navigation.navigate("Login");
  const pressSignUp = () => navigation.navigate("Signup");

  return (
    <View>
      <Image style={styles.image} source={require("../assets/cart.png")} />
      <Text style={styles.text}>
        اگر قبلا ثبت نام کرده اید وارد حساب کاربری خود شوید.
        {"\n"}
        در غیر اینصورت برای شروعی هیجان انگیز ثبت نام کنید
      </Text>
      <Text style={styles.text} onPress={pressLogin}>
        ورود به حساب کاربری
      </Text>
      <Text style={styles.text} onPress={pressSignUp}>
        ثبت حساب کاربری
      </Text>
    </View>
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
    width: "80%",
    height: "75%",
    alignSelf: "center",
    resizeMode: "contain",
    marginTop: -35,
  },
  text: {
    color: "#b31414",
    fontSize: 18,
    textAlign: "center",
    marginTop: 30,
  },
  text1: {
    textAlign: "center",
    color: "black",
    fontSize: 18,
  },
});

export default Welcome;
