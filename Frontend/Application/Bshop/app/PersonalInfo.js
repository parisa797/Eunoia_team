import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  TextInput,
  Text,
  Image,
  View,
  Alert,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  Container,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

const PersonalInfo = ({ navigation }) => {
  const [info, setinfo] = useState("");

  const [name, setname] = useState();
  const [familyname, setfamilyname] = useState();
  const [phone, setphone] = useState();
  const [address, setaddress] = useState();

  const phoneLenght = (text) => {
    let pattern = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
    return pattern.test(String(text));
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    const getResult = async () => {
      var myHeaders = new Headers();
      let t = await SecureStore.getItemAsync("token");
      var authorization = "Token " + t;
      myHeaders.append("Authorization", authorization);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      fetch("http://eunoia-bshop.ir:8000/users/profile", requestOptions)
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
    };

    getResult();
  }, [isFocused]);

  //update user's info when pressing update button
  async function UpdateInfo() {
    // console.log("beruzresani");
    var myHeaders = new Headers();
    let t = await SecureStore.getItemAsync("token");
    var authorization = "Token " + t;
    // console.log("result is" + result);
    myHeaders.append("Authorization", authorization);
    // myHeaders.append("Content-Type", "multipart/form-data");
    var formdata = new FormData();
    formdata.append("email", info.email);
    formdata.append("FirstName", name);
    formdata.append("LastName", familyname);
    formdata.append("address", address);
    formdata.append("phone", phone);
    // formdata.append("files", []);
    console.log(formdata);
    // console.log("formdata");
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
    };

    fetch("http://eunoia-bshop.ir:8000/users/profile", requestOptions)
      .then((response) => {
        console.log("status is,", response.status);
        if (response.status == 200) {
          ToastAndroid.show(
            "اطلاعات شما با موفقیت به روز رسانی شد.",
            ToastAndroid.SHORT
          );
          return response.json();
        }
      })
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  const SureDelete = () => {
    console.log("button pressed");
    Alert.alert("", "آیا از حذف حساب کاربری خود اطمینان دارید؟", [
      {
        text: "خیر",
        onPress: () => console.log("NO Pressed"),
        // style: "cancel",
      },
      { text: "بله", onPress: () => DeleteAccount() },
    ]);
  };
  async function DeleteAccount() {
    var myHeaders = new Headers();
    let t = await SecureStore.getItemAsync("token");
    var authorization = "Token " + t;
    myHeaders.append("Authorization", authorization);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch("http://eunoia-bshop.ir:8000/users/profile", requestOptions)
      .then(async (response) => {
        console.log(response.status);
        if (response.status == 204) await SecureStore.deleteItemAsync("token");
        response.json();
      })
      .then((result) => {
        console.log("result", result);
        //delete token from expo cache
        //then navigate to signup page  how??? with authcontext
        //so for now navigate to shop page
      })
      .catch((error) => console.log("error", error));
  }

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.kooft}>
      <View style={styles.container}>
        {/* <Image style={styles.image} source={require("../assets/profile.png")} /> */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            value={name}
            // icon="user"
            placeholder="نام"
            autoCapitalize="none"
            autoCompleteType="name"
            textAlign="center"
            testID={"namepersonal_check"}
            onChangeText={setname}
            onBlur={() => {
              if (name == "") placeholder = "نام";
            }}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            // icon="user"
            placeholder="نام خانوادگی"
            autoCapitalize="none"
            // autoCompleteType="familyname"
            textAlign="center"
            value={familyname}
            testID={"family_check"}
            onChangeText={setfamilyname}
            onBlur={() => {
              if (familyname == "") placeholder = "نام خانوادگی";
            }}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            // icon="phone"
            placeholder="شماره تلفن"
            // autoCompleteType="phone"
            autoCapitalize="none"
            textAlign="center"
            value={phone}
            testID={"phone_check"}
            onChangeText={setphone}
            onBlur={() => {
              if (phone.length == 0) placeholder = "شماره تلفن";
              else {
                if (!phoneLenght(phone))
                  ToastAndroid.show(
                    "لطفا شماره تلفن همراه خود را به صورت کامل وارد کنید. الگو : 091*******25",
                    ToastAndroid.SHORT
                  );
              }
            }}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            // icon="map-pin"
            placeholder="آدرس"
            autoCapitalize="none"
            textAlign="center"
            value={address}
            testID={"address_check"}
            onChangeText={setaddress}
            onBlur={() => {
              if (address == "") placeholder = "آدرس";
            }}
            // autoCompleteType="street-address"
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            // icon="email"
            placeholder="ایمیل"
            // autoCompleteType="email"
            autoCapitalize="none"
            textAlign="center"
            value={info.email}
            readonly={true}
          />
        </View>
        <View style={styles.kenareham}>
          <TouchableOpacity style={styles.Btn} onPress={() => UpdateInfo()}>
            <Text>ذخیره اطلاعات </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Btn} onPress={() => SureDelete()}>
            <Text>حذف حساب کاربری </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  kooft: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    marginTop: "5%",
    // width: "50%",
    // height: "50%",
    marginBottom: "5%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: "40%",
  },
  Btn: {
    width: 130,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 5,
    backgroundColor: "#b31414",
  },
  bazgasht: {
    width: 130,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 5,
    backgroundColor: "#b31414",
  },
  kenareham: {
    justifyContent: "space-between",
    flexDirection: "row-reverse",
  },
  image: {
    width: "50%",
    height: "20%",
    marginTop: -35,
  },
});
export default PersonalInfo;
