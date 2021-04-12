import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Login from "./loginScreen";
import Signup from "./signup";
import Profile from "./profile";
export default function App() {
  // return <Login></Login>;
  // return <Signup></Signup>;
  return <Profile></Profile>;
}
