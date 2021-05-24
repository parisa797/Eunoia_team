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
import * as ImagePicker from "expo-image-picker";
import { Avatar } from "react-native-paper";

const PersonalInfo = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(false);

  const [info, setinfo] = useState("");

  const [name, setname] = useState();
  const [familyname, setfamilyname] = useState();
  const [phone, setphone] = useState();
  const [address, setaddress] = useState();

  const isFocused = useIsFocused();

  const phoneLenght = (text) => {
    let pattern = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
    return pattern.test(String(text));
  };

  //access to gallery
  useEffect(() => {
    (async () => {
      // if (Platform.OS !== 'web') {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
      // }
    })();
  }, []);

  //get info when user navigates to page
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
          setImage(result.urls[0].uploaded_file);
          console.log(result);
          // console.log("iside urls:", result.urls[0].uploaded_file);
        })
        .catch((error) => console.log("error", error));
    };

    getResult();
  }, [isFocused]);

  async function pickImage() {
    setNewImage(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  async function UpdateWithImage() {
    var fields = image.split("/");
    var image_name = fields[fields.length - 1];
    var f = image_name.split(".");
    var type = f[f.length - 1];

    var myHeaders = new Headers();
    let t = await SecureStore.getItemAsync("token");
    var authorization = "Token " + t;
    myHeaders.append("Authorization", authorization);
    myHeaders.append("Content-Type", "multipart/form-data");
    myHeaders.append("Accept", "application/json");

    var form = new FormData();
    form.append("uploaded_file", {
      uri: image,
      type: "image/" + type, // or photo.type
      name: image_name,
    });
    // form.append("uploaded_file", image);
    var requestOptions1 = {
      method: "POST",
      headers: myHeaders,
      body: form,
    };
    fetch(
      "http://eunoia-bshop.ir:8000/users/profile/upload-file",
      requestOptions1
    )
      .then((response) => {
        console.log("image status is,", response.status);
        return response.json();
      })
      .then((result) => {
        console.log("result of image", result);
        var image_id = result.id;
        var formdata = new FormData();
        formdata.append("email", info.email);
        formdata.append("FirstName", name);
        formdata.append("LastName", familyname);
        formdata.append("address", address);
        formdata.append("phone", phone);
        formdata.append("files", image_id);
        // formdata.append("files", []);
        // console.log(formdata);
        // console.log("formdata");
        var requestOptions2 = {
          method: "PUT",
          headers: myHeaders,
          body: formdata,
        };

        fetch("http://eunoia-bshop.ir:8000/users/profile", requestOptions2)
          .then((response) => {
            console.log("info status is,", response.status);
            if (response.status == 200) {
              ToastAndroid.show(
                "اطلاعات شما با موفقیت به روز رسانی شد.",
                ToastAndroid.SHORT
              );
              return response.json();
            }
          })
          .then((result) => console.log("result of info and image", result))
          .catch((error) => console.log("error3", error));
      })
      .catch((error) => console.log("error1", error));
  }

  //update user's info when pressing update button
  async function UpdateInfo() {
    var myHeaders = new Headers();
    let t = await SecureStore.getItemAsync("token");
    var authorization = "Token " + t;
    myHeaders.append("Authorization", authorization);

    console.log("image", image);
    console.log("user uploaded a new photo", newImage);
    //fetch photo if exists
    if (image && newImage) {
      UpdateWithImage();
    } else {
      // myHeaders.append("Content-Type", "multipart/form-data");
      var formdata = new FormData();
      formdata.append("email", info.email);
      formdata.append("FirstName", name);
      formdata.append("LastName", familyname);
      formdata.append("address", address);
      formdata.append("phone", phone);
      var requestOptions2 = {
        method: "PUT",
        headers: myHeaders,
        body: formdata,
      };

      fetch("http://eunoia-bshop.ir:8000/users/profile", requestOptions2)
        .then((response) => {
          console.log("info status is,", response.status);
          if (response.status == 200) {
            ToastAndroid.show(
              "اطلاعات شما با موفقیت به روز رسانی شد.",
              ToastAndroid.SHORT
            );
            return response.json();
          }
        })
        .then((result) => console.log("result of info", result))
        .catch((error) => console.log("error2", error));
    }
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
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && (
          // <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
          <Avatar.Image size={200} source={{ uri: image }} />
        )}
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
            // onBlur={() => {
            //   if (name == "") placeholder = "نام";
            // }}
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
