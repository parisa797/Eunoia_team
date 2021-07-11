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
import * as SecureStore from "expo-secure-store";
import { useIsFocused } from "@react-navigation/native";
import LikedItem from "./likedItem";

const FavoriteItems = ({ navigation }) => {
  // console.log(route.params);
  const [shopitems, setItems] = useState();
  const isFocused = useIsFocused();

  useEffect(() => {
    const getLikedItems = async () => {
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
        "http://eunoia-bshop.ir:8000/users/profile/likeditems",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setItems(result);
          console.log(result);
        })
        .catch((error) => console.log("error", error));
    };
    getLikedItems();
  }, [isFocused]);

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.container}>
      {shopitems && (
        <FlatList
          testID={"fav-items-list"}
          nestedScrollEnabled={true}
          style={{ marginTop: -40 }}
          data={shopitems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(itemData) => {
            // console.log("item is", itemData.item);
            // var u = "http://eunoia-bshop.ir:8000" + itemData.item.photo;
            return (
              <LikedItem
                name={itemData.item.name}
                image={itemData.item.photo}
                price={itemData.item.price}
                discount={itemData.item.discount}
                index={itemData.item.id}
                shop={itemData.item.ItemShop}
                rate={itemData.item.rate_value}
                onSelect={() => {
                  navigation.navigate("ItemDetail", itemData.item);
                }}
              ></LikedItem>
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

  icon: {
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    alignItems: "baseline",
  },
  hozuri: { fontSize: 20, color: "red" },
  online: { fontSize: 20, color: "green" },

  uppage: {
    borderRadius: 10,
    marginTop: 10,
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
  uppagetext: {
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
export default FavoriteItems;
