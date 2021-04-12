import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

export default function Signup() {
  const [user, setUsername] = useState("");
  const [pass, setPassword] = useState("");
  const [confpass, setconferm_Password] = useState("");
  const [eml, setemail] = useState("");

  // export default class SignUp extends React.Component {
  //   state = {
  //     username: '', password: '', conferm_password: '',email: ''
  //   }
  //   onChangeText = (key, val) => {
  //     this.setState({ [key]: val })
  //   }
  //   signUp = async () => {
  //     const { username, password, conferm_password, email } = this.state
  //     try {
  //       // here place your signup logic
  //       console.log('user successfully signed up!: ', success)
  //     } catch (err) {
  //       console.log('error signing up: ', err)
  //     }
  //   }

  // render() {
  return (
    <TouchableWithoutFeedback
      onPress ={() => {
        Keyboard.dismiss();
        console.log("dismissed keyboard");
      }}
    >
      <View style={styles.container}>
        <Image style={styles.image} source={require("./assets/signup.png")}/>

        <View style={styles.container}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="نام کاربری"
              autoCapitalize="none"
              placeholderTextColor="#000"
              onChangeText={(user) => setUsername(user)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="رمز عبور"
              secureTextEntry={true}
              autoCapitalize="none"
              placeholderTextColor="#000"
              onChangeText={(pass) => setPassword(pass)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="تکرار رمز عبور"
              secureTextEntry={true}
              autoCapitalize="none"
              placeholderTextColor="#000"
              onChangeText={(confpass) => setconferm_Password(confpass)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="ایمیل"
              autoCapitalize="none"
              placeholderTextColor="#000"
              onChangeText={(eml) => setemail(eml)}
            />
          </View>
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => {
              console.log(user);
              if (user.lenght == 0) alert("please enter your username");
              else {
                if (pass.lenght == 0) alert("please enter your password");
                else {
                  if (confpass.lenght == 0) alert("please confirm your password");
                  else {
                    if (eml.lenght == 0) alert("please enter vaild email");
                    else {
                    }
                  }
                }

                // fetch
                fetch("http://192.168.149.72:8000/rest-auth/registration/", {
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
                })
                  .then((response) => {
                    console.log(response);
                    console.log(response.status);
                    if (response.status == 201) alert("you signup successfully");
                    else
                      alert(
                        "please choose another username or password is too short"
                      );
                    return response.json();
                  })
                  .then((result) => console.log(result))
                  .catch((error) => console.log("error", error));
              }
            }}
          >
            <Text style={styles.signupText}>ثبت نام</Text>
          </TouchableOpacity>
        </View>
      </View>
 </TouchableWithoutFeedback>);
  
}

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 55,
    backgroundColor: "#f1f1f2",
    marginBottom:20,
    padding: 8,
    color: "white",
    borderRadius: 14,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",

  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop:"-5%"
  },

  image:{
  width: "90%",
  height:"50%",
  },

  signupBtn: {
    width: 90,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#b31414",
  },
});
