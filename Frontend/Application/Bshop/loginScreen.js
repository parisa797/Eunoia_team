import { StatusBar } from "expo-status-bar";
import { enableExpoCliLogging } from "expo/build/logs/Logs";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function Login() {
  const [user, setUsername] = useState("");
  const [pass, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("./assets/shop.jpg")} />

      <StatusBar style="auto" />

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="username"
          placeholderTextColor="#FBB3AE"
          onChangeText={(user) => setUsername(user)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="password"
          placeholderTextColor="#FBB3AE"
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
          // console.log(user);
          if (user.length == 0) alert("Please enter your username");
          else {
            if (pass.length == 0) alert("Please enter your password");
            else {
              // fetch("http://127.0.0.1:8000/rest-auth/login/", requestOptions)
              //instead of 127 put 192.168.1.6!!!
              fetch("http://192.168.1.4:8000/rest-auth/login/", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Headers": "*",
                },
                body: JSON.stringify({
                  username: user,
                  password: pass,
                }),
              })
                .then((response) => {
                  // console.log(response);
                  console.log(response.status);
                  if (response.status == 200)
                    alert("You've logged in successfully");
                  else alert("Incorrect username or password");

                  return response.json();
                })
                .then((result) => console.log(result))
                .catch((error) => console.log("error", error));
            }
          }
        }}
      >
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginBottom: 40,
  },

  inputView: {
    backgroundColor: "#B96A9D",
    borderRadius: 10,
    width: "80%",
    height: 45,
    marginBottom: 20,

    alignItems: "center",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  // forgot_button: {
  //   height: 30,
  //   marginBottom: 30,
  // },

  loginText: {
    color: "#fff",
  },

  loginBtn: {
    width: "40%",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#945798",
  },
});
