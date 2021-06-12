import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
import StarRating from "react-native-star-rating";
import { useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import Shop from "./shop";

const FavoriteShops = ({ navigation }) => {
  const [shops, setShops] = useState();
  const isFocused = useIsFocused();

  useEffect(() => {
    const getLikedShops = async () => {
      console.log("yes in shops!");
      var myHeaders = new Headers();
      let t = await SecureStore.getItemAsync("token");
      var authorization = "Token " + t;
      myHeaders.append("Authorization", authorization);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      fetch(
        "http://eunoia-bshop.ir:8000/users/profile/likedshops",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setShops(result);
          console.log(result);
        })
        .catch((error) => console.log("error", error));
    };
    getLikedShops();
  }, [isFocused]);

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.container}>
      {shops && (
        <FlatList
          // testID={"items-list" + props.index}
          nestedScrollEnabled={true}
          style={{ marginTop: -30 }}
          data={shops}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(itemData) => {
            // console.log("item is", itemData.item);
            return (
              <Shop
                title={itemData.item.title}
                address={itemData.item.address}
                image={itemData.item.logo}
                rate_value={itemData.item.rate_value}
                online={itemData.item.online}
                phone={itemData.item.phone}
                index={itemData.item.id}
                onSelect={() => {
                  navigation.navigate("ShopDetail", itemData.item);
                }}
              ></Shop>
            );
          }}
        />
      )}

      {/* </ImageBackground> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  SignUpBtn: {
    width: 70,
    borderRadius: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -60,
    marginBottom: 20,
    backgroundColor: "#b31414",
    marginLeft: 10,
  },
  SignUpText: {
    color: "white",
  },
  // naghsheBtn: {
  //   width: 70,
  //   borderRadius: 100,
  //   height: 40,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   marginTop: -60,
  //   marginBottom: 20,
  //   backgroundColor: "#b31414",
  //   marginLeft: 10,
  // },
  // naghsheText: {
  //   color: "white",
  // },
  icon: {
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    alignItems: "baseline",
  },
  hozuri: { fontSize: 20, color: "red" },
  online: { fontSize: 20, color: "green" },
  shop: {
    borderRadius: 10,
    marginTop: 1,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    backgroundColor: "#f1f1f2",
    height: 300,
    width: 370,
    marginLeft: 18,
  },
  rows: {
    borderRadius: 10,
    marginTop: 15,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    backgroundColor: "#b31414",
    height: 40,
    width: 370,
    marginLeft: 18,
    fontWeight: "bold",
    fontSize: 25,
  },
  rowstext: {
    color: "white",
    fontSize: 20,
    marginTop: 5,
    textAlign: "center",
  },
  imagebackk: {
    width: 400,
    height: 700,
    marginTop: -20,
    marginLeft: -7,
  },
  items: {
    backgroundColor: "white",
    height: 210,
    width: 165,
    borderRadius: 10,
    marginTop: 15,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 1, height: 3 },
    elevation: 5,
    backgroundColor: "#f1f1f2",
    marginLeft: 12,
  },
  imageContainer: {
    backgroundColor: "white",
    // objectFit: ""
    width: "39%",
    height: "40%",
    // alignItems: "center",
    // justifyContent: "center",
    // alignContent: "center",
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
    borderRadius: 10,
    marginLeft: 110,
    marginTop: 10,

    // overflow: "hidden",
  },
  image: {
    // backgroundColor: "#f1f1f2",
    width: "80%",
    height: "80%",
    marginTop: "12%",
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center",
    // paddingBottom: "1",
    marginLeft: 12,
  },
  details: {
    alignItems: "center",
    height: "38%",
    padding: 10,
  },
  title: {
    // fontFamily: "open-sans-bold",
    fontSize: 20,
    marginVertical: 5,
    // paddingTop: 3,
    marginLeft: "-1%",
    marginTop: "1%",
  },
  online_icon: {
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    backgroundColor: "transparent",
    alignItems: "baseline",
  },
  address: {
    // fontFamily: "open-sans",
    fontSize: 20,
    color: "black",
  },
  mantaghee: {
    fontSize: 21,
    color: "black",
    marginLeft: 20,
  },
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    marginTop: "5%",
    // width: "50%",
    // height: "50%",
    marginBottom: "5%",
  },
});
export default FavoriteShops;
