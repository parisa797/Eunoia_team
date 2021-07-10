import React, { useState } from "react";
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

const Item = (props) => {
  var photo = props.image
    ? props.image.includes("http://eunoia-bshop.ir:8000")
      ? props.image
      : "http://eunoia-bshop.ir:8000" + props.image
    : null;

  var newPrice = ((100 - props.discount) * props.price) / 100;
  //   console.log("this is new price", newPrice);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={props.onSelect} useForeground>
        <View style={styles.items}>
          {props.image && (
            <Image
              testID={"item-image-" + props.index}
              style={styles.image}
              source={{ uri: photo }}
            />
          )}
          {!props.image && (
            <Image
              style={styles.image}
              source={require("../assets/no-image.png")}
            />
          )}
        </View>
        <Text
          testID={"item-name-" + props.index}
          style={{ fontSize: 20, fontWeight: "bold" }}
        >
          {props.name}
        </Text>

        {/* <View style={styles.rows}> */}
        {props.discount != 0 && (
          <Text
            testID={"item-price0-" + props.index}
            style={{
              textDecorationLine: "line-through",
              textAlign: "right",
              fontSize: 15,
              color: "grey",
            }}
          >
            قیمت:
            {props.price}
          </Text>
        )}
        {props.discount == 0 && (
          <Text
            testID={"item-price1-" + props.index}
            style={{
              textAlign: "right",
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            قیمت:
            {props.price}
          </Text>
        )}

        {props.discount != 0 && (
          <Text
            testID={"item-discounted-" + props.index}
            style={{ fontSize: 15, fontWeight: "bold" }}
          >
            قیمت با تخفیف: {newPrice}
          </Text>
        )}
        {/* </View> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // borderRadius: 10,
    marginTop: "12%",
    backgroundColor: "white",
  },
  //   rows: {
  //     borderRadius: 10,
  //     marginTop: 15,
  //     borderRadius: 10,
  //     shadowColor: "black",
  //     shadowOpacity: 0.26,
  //     shadowOffset: { width: 0, height: 2 },
  //     elevation: 5,
  //     backgroundColor: "red",
  //     height: 40,
  //     width: 150,
  //     marginLeft: 18,
  //     fontWeight: "bold",
  //     fontSize: 25,
  //   },

  items: {
    height: 210,
    width: 165,
    borderRadius: 10,
    marginTop: 15,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 1, height: 3 },
    elevation: 5,
    backgroundColor: "white",
    marginLeft: 12,
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
});
export default Item;
