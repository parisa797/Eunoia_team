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
import { useIsFocused } from "@react-navigation/native";

const FilterResult = ({ navigation, route }) => {
  console.log("filtered this:", route.params);
  const [shops, setShops] = useState();
  const [items, setItems] = useState();
  const [noResult, setNoResult] = useState(false);
  const isFocused = useIsFocused();

  var fetch_url;

  //route.params.searchType == false --> item
  //route.params.searchType == true --> shop

  const FilterShop = async () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    // var url = "http://eunoia-bshop.ir:8000/api/v1/shops/top";
    fetch(fetch_url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.length == 0) setNoResult(true);
        setShops(result);
        console.log("filter shop result:", result);
      })
      .catch((error) => console.log("error", error));
  };

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
        console.log("filter item result:", result);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    setShops();
    setItems();
    switch (route.params.shop_item) {
      case "shop":
        switch (route.params.filterType) {
          case "score":
            fetch_url = "http://eunoia-bshop.ir:8000/api/v1/shops/top";
            FilterShop();
            break;

          case "region":
            fetch_url =
              "http://eunoia-bshop.ir:8000/api/v1/shops/region/?q=" +
              route.params.region;
            FilterShop();
            break;

          default:
            console.log(
              "sth bad happened in switching between filter of shops"
            );
            break;
        }
        break;

      case "item":
        fetch_url =
          "http://eunoia-bshop.ir:8000/items/" + route.params.filterType + "/";

        var c =
          route.params.filterType == "category" &&
          route.params.category == "all"
            ? "Spices and condiments and food side dishes"
            : route.params.category;
        if (c != "all") {
          fetch_url += "?q=" + c;
        }
        console.log("this is get url", fetch_url);
        FilterItem();
        break;

      default:
        console.log("sth bad happened in switching between shop and item");
        break;
    }
  }, [isFocused]);

  return (
    <View>
      {noResult && <Text> هیچ نتیجه ای یافت نشد</Text>}

      {!noResult && shops && (
        <FlatList
          testID={"shops-list"}
          nestedScrollEnabled={true}
          data={shops}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(itemData) => (
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
          )}
        />
      )}

      {!noResult && items && (
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

export default FilterResult;
