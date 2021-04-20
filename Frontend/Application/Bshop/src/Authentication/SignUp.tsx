import React, { useRef , useEffect, useState } from 'react';
// import { TextInput as RNTextInput } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Container, Button, Box } from "../components";
import { AuthNavigationProps } from '../components/Navigation';
// import TextInput  from '../components/Form/TextInput';
import Footer from './components/Footer';


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

    // const { 
    //     handleChange, handleBlur, handleSubmit,
    //     errors, touched 
    // } = useFormik({
    //     validationSchema: SignUpSchema,
    //     initialValues: { email: '', password: '', confirmPassword: '' },
    //     onSubmit: () => navigation.navigate('Home')
    // });
    const password = useRef<RNTextInput>(null);
    const confirmPassword = useRef<RNTextInput>(null);
    const footer = <Footer style={styles.downpage} title="آیا قبلا ثبت نام کرده اید؟" action="ورود" onPress={() => navigation.navigate('Login')} />

    return (
        <Container pattern={1} {...{footer}}>
            {/* <Text variant="title1" textAlign="center" marginBottom="l">ثبت کاربر جدید</Text>
            <Text variant="body" textAlign="center" marginBottom="l">
                همین حالا ثبت نام کنید ! کافیه ازلاعاتت رو وارد کنی.
            </Text>
       */}
            <TouchableWithoutFeedback
            onPress ={() => {
                Keyboard.dismiss();
                console.log("dismissed keyboard");
            }}
            >
            <View style={styles.container}>
                {/* <Image style={styles.image} source={require("./assets/signup.png")}/> */}

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
                    style={styles.SignUpBtn}
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
                        fetch("http://10.0.2.2:8000/rest-auth/registration/", {
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
                            if (response.status == 201) 
                            {
                            alert("you SignUp successfully");
                            navigation.navigate("Login")
                            }
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
                    <Text style={styles.SignUpText}>ثبت نام</Text>
                </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
        </Container>
    )

};

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
        downpage:{
            marginBottom: 40,
        },
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            marginTop:"-5%"
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
            backgroundColor: "#b31414",
        },
    });

export default SignUp;