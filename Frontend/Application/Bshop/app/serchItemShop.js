import { StatusBar } from "expo-status-bar";
import { enableExpoCliLogging } from "expo/build/logs/Logs";
import React, { useEffect, useState } from "react";
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
  FlatList,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Shop from "./shop";
import LikedItem from "./likedItem";

const SearchItemShop = ({ navigation, route }) => {
  console.log("searched this:", route.params);
  const [items, setItems] = useState();

  //route.params.searchType == false --> item
  //route.params.searchType == true --> shop
  useEffect(() => {
    const SearchItem = async () => {
      var myHeaders = new Headers();
      let t = await SecureStore.getItemAsync("token");
      var authorization = "Token " + t;
      myHeaders.append("Authorization", authorization);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      var url =
        "http://eunoia-bshop.ir:8000/shops/" +
        route.params.shopID +
        "/items/search?q=" +
        route.params.searchString;
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setShops(result);
          console.log("shop res:", result);
        })
        .catch((error) => console.log("error", error));
    };

    SearchItem();
  }, []);

  return (
    <View>
      {items && (
        <FlatList
          nestedScrollEnabled={true}
          style={{ marginTop: -40 }}
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(itemData) => {
            return (
              <LikedItem
                name={itemData.item.name}
                image={itemData.item.photo}
                price={itemData.item.price}
                discount={itemData.item.discount}
                index={itemData.item.id}
                shop={itemData.item.ItemShop}
                onSelect={() => {
                  navigation.navigate("ItemDetail", itemData.item);
                }}
              ></LikedItem>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "80%",
    height: "75%",
    alignSelf: "center",
    resizeMode: "contain",
    marginTop: -35,
  },
  text: {
    color: "#b31414",
    fontSize: 18,
    textAlign: "center",
    marginTop: 30,
  },
  text1: {
    textAlign: "center",
    color: "black",
    fontSize: 18,
  },
});

export default SearchItemShop;
