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
import LikedItem from "./likedItem";
// import { useIsFocused } from "@react-navigation/native";

const FilterShopItem = ({ navigation, route }) => {
  console.log("filtered this:", route.params);
  const [items, setItems] = useState();
  const [noResult, setNoResult] = useState(false);
  // const isFocused = useIsFocused();

  var fetch_url;

  const FilterItem = async () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(fetch_url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.length == 0) setNoResult(true);
        setItems(result);
        // console.log("filter item result:", result);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    if (route.params.filterType == "category") {
      var c =
        route.params.category == "all"
          ? "Spices and condiments and food side dishes"
          : route.params.category;

      fetch_url =
        "http://eunoia-bshop.ir:8000/items/category/" +
        route.params.shopID +
        "?q=" +
        c;
    } else {
      if (route.params.category != "all") {
        fetch_url =
          "http://eunoia-bshop.ir:8000/items/category/" +
          route.params.filterType +
          "/" +
          route.params.shopID +
          "?q=" +
          route.params.category;
      } else {
        fetch_url =
          "http://eunoia-bshop.ir:8000/items/" +
          route.params.filterType +
          "/" +
          route.params.shopID;
      }
    }
    FilterItem();
    console.log("this is get url", fetch_url);
  }, []);

  return (
    <View>
      {noResult && <Text> هیچ نتیجه ای یافت نشد</Text>}

      {!noResult && items && (
        <FlatList
          testID={"items-list"}
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

export default FilterShopItem;
