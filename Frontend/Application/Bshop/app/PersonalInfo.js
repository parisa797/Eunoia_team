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
    console.log("text is", text, "09125831292");
    let pattern = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
    return pattern.test(String(text));
  };

  //get user's info
  // useEffect(async () => {
  //   // (async () => {
  //   var myHeaders = new Headers();
  //   let result = await SecureStore.getItemAsync("token");
  //   console.log("result");
  //   var SaveInfo = "Token " + result;
  //   // var SaveInfo ="Token " + getValueFor("token")
  //   console.log("token is:");
  //   console.log(SaveInfo);
  //   myHeaders.append("Authorization", SaveInfo);

  //   var requestOptions = {
  //     method: "GET",
  //     headers: myHeaders,
  //     redirect: "follow",
  //   };
  //   getValueFor("token")
  //   fetch("http://iust-bshop.herokuapp.com/users/profile", requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       setinfo(result);
  //       setname(result.FirstName);
  //       setfamilyname(result.LastName);
  //       setphone(result.phone);
  //       setaddress(result.address);
  //       console.log(result);
  //     })
  //     .catch((error) => console.log("error", error));
  //   })();
  // }, []);
  const isFocused = useIsFocused();

  useEffect(() => {
    const getResult = async () => {
      var myHeaders = new Headers();
      let result = await SecureStore.getItemAsync("token");
      console.log("result");
      var SaveInfo = "Token " + result;
      // var SaveInfo ="Token " + getValueFor("token")
      console.log("token is:");
      console.log(SaveInfo);
      myHeaders.append("Authorization", SaveInfo);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      fetch("http://eunoia-bshop.ir:8000/users/profile", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("hey");
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
  async function beruzresani() {
    console.log("beruzresani");
    var myHeaders = new Headers();
    let result = await SecureStore.getItemAsync("token");
    var SaveInfo = "Token " + result;
    console.log("result is" + result);
    myHeaders.append("Authorization", SaveInfo);
    myHeaders.append("Content-Type", "multipart/form-data");
    var formdata = new FormData();
    formdata.append("email", info.email);
    formdata.append("FirstName", name);
    formdata.append("LastName", familyname);
    formdata.append("address", address);
    formdata.append("phone", phone);
    formdata.append("files", []);
    console.log(formdata);
    console.log("formdata");
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
    };

    fetch("http://eunoia-bshop.ir:8000/users/profile", requestOptions)
      .then((response) => {
        console.log("parisaaa");
        if (response.status == 200) {
          alert("heeeeeeelo");
          return response.json();
        }
      })
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  // const response = await axios
  //   .put("http://eunoia-bshop.ir:8000/users/profile", formdata, {
  //     headers: {
  //       "Content-Type":
  //         "multipart/form-data; boundary=<calculated when request is sent>",
  //       Authorization:
  //         "Token " + (await SecureStore.getItemAsync("token")).toString(),
  //     },
  //   })
  //   .then(function (response) {
  //     console.log("setayesh");
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
  // }

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.kooft}>
      <View style={styles.container}>
        {/* <Image style={styles.image} source={require("../assets/profile.png")} /> */}
        <View style={styles.inputView}>
          {/* <View style={styles.bazgasht}>
            <TouchableOpacity
              style={styles.Btn}
              onPress={navigation.navigate("Home")}
            >
              <Text>بازگشت </Text>
            </TouchableOpacity>
          </View> */}
          <TextInput
            style={styles.input}
            value={name}
            icon="user"
            placeholder="نام"
            autoCapitalize="none"
            autoCompleteType="name"
            textAlign="center"
            testID={"namepersonal_check"}
            onChangeText={setname}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            icon="user"
            placeholder="نام خانوادگی"
            autoCapitalize="none"
            // autoCompleteType="familyname"
            textAlign="center"
            value={familyname}
            testID={"family_check"}
            onChangeText={setfamilyname}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            icon="phone"
            placeholder="شماره تلفن"
            // autoCompleteType="phone"
            autoCapitalize="none"
            textAlign="center"
            value={phone}
            testID={"phone_check"}
            onChangeText={setphone}
            onBlur={() => {
              if (!phoneLenght(phone))
                ToastAndroid.show(
                  "لطفا شماره تلفن همراه خود را به صورت کامل وارد کنید. الگو : 091*******25",
                  ToastAndroid.SHORT
                );
            }}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            icon="map-pin"
            placeholder="آدرس"
            autoCapitalize="none"
            textAlign="center"
            value={address}
            testID={"address_check"}
            onChangeText={setaddress}
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
          <TouchableOpacity style={styles.Btn} onPress={() => beruzresani()}>
            <Text>ذخیره اطلاعات </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Btn}>
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
