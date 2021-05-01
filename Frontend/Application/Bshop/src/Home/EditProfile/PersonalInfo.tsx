import React, { useEffect, useState } from "react";
import { ScrollView, Button } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Box, Text } from "../../components";
import TextInput from "../../components/Form/TextInput";
import CheckboxGroup from "./CheckboxGroup";
import { AuthNavigationProps } from "../components/Navigation";

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  // if (result) {
  //   console.log(" Here's your value  \n" + result);
  // } else {
  //   console.log('No values stored under that key.');
  // }
  // inja
  console.log("hello");
  console.log(result);
  return result;
}

const PersonalInfo = ({ navigation }) => {
  // const Token = getValueFor("token")
  // console.log("i in personal")
  // console.log(Token)
  const pakkardan = async () => {
    fetch("http://iust-bshop.herokuapp.com/users/profile", {
      method: "DELETE",
      headers: {
        Authorization: "Token " + (await SecureStore.getItemAsync("token")),
      },
    }).then((res) => {
      if (res.status == 204) {
        navigation.navigate("SignUp");
      }
    });
  };
  const update = async () => {
    var myHeaders = new Headers();
    let result = await SecureStore.getItemAsync("token");
    var SaveInfo = "Token " + result;
    console.log("result is" + result);
    myHeaders.append("Authorization", SaveInfo);

    var formdata = new FormData();
    formdata.append("email", info.email);
    formdata.append("FirstName", name);
    formdata.append("LastName", familyname);
    formdata.append("address", address);
    formdata.append("phone", phone);
    formdata.append("files", []);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("http://iust-bshop.herokuapp.com/users/profile", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  const [info, setinfo] = useState("");

  const [name, setname] = useState();
  const [familyname, setfamilyname] = useState();
  const [phone, setphone] = useState();
  const [address, setaddress] = useState();
  // const getinfo=()=>{
  useEffect(async () => {
    //  async function fetchdata() {

    var myHeaders = new Headers();
    let result = await SecureStore.getItemAsync("token");
    var SaveInfo = "Token " + result;
    // var SaveInfo ="Token " + getValueFor("token")
    // console.log(SaveInfo)
    myHeaders.append("Authorization", SaveInfo);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    // getValueFor("token")
    fetch("http://iust-bshop.herokuapp.com/users/profile", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setinfo(result);
        setname(result.FirstName);
        setfamilyname(result.LastName);
        setphone(result.phone);
        setaddress(result.address);
        console.log(result);
      })
      .catch((error) => console.log("error", error));
    //  }
    //  fetchdata()
  }, []);

  // }
  return (
    <ScrollView>
      <Box padding="m">
        <Text variant="body" marginBottom="m">
          اطلاعات حساب
        </Text>
        <Box marginBottom="m">
          <TextInput
            icon="user"
            placeholder="نام"
            autoCapitalize="none"
            autoCompleteType="name"
            textAlign="center"
            value={name}
            onChangeText={setname}
          />
        </Box>
        <Box marginBottom="m">
          <TextInput
            icon="user"
            placeholder="نام خانوادگی"
            autoCapitalize="none"
            // autoCompleteType="familyname"
            textAlign="center"
            value={familyname}
            onChangeText={setfamilyname}
          />
        </Box>
        <Box marginBottom="m">
          <TextInput
            icon="phone"
            placeholder="شماره تلفن"
            // autoCompleteType="phone"
            autoCapitalize="none"
            textAlign="center"
            value={phone}
            onChangeText={setphone}
          />
        </Box>
        <Box marginBottom="m">
          <TextInput
            icon="map-pin"
            placeholder="آدرس"
            autoCapitalize="none"
            textAlign="center"
            value={address}
            onChangeText={setaddress}
            // autoCompleteType="street-address"
          />
        </Box>
        <Box marginBottom="m">
          <TextInput
            // icon="email"
            placeholder="ایمیل"
            // autoCompleteType="email"
            autoCapitalize="none"
            textAlign="center"
            value={info.email}
            readonly={true}
          />
        </Box>
        <Button title="ذخیره اطلاعات  " onPress={() => update()} />

        <Button title="حذف حساب کاربری " onPress={() => pakkardan()} />
      </Box>
    </ScrollView>
  );
};

export default PersonalInfo;
