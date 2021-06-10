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
import Ionicon from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/FontAwesome";
import AntIcon from "react-native-vector-icons/AntDesign";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import StarRating from "react-native-star-rating";
import Item from "./item";

const ItemDetail = ({ route, navigation }) => {
  const [liked, setLiked] = useState(false);
  const [shopitems, setItems] = useState();

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.container}>
      {/* <ImageBackground
        source={require("../assets/lemon.jpg")}
        style={styles.imagebackk}
      > */}
      {/* <View style={styles.shop}> */}

      <View style={styles.imageContainer}>
        <Pressable onPress={() => setLiked((isLiked) => !isLiked)}>
          <MaterialCommunityIcons
            name={liked ? "heart" : "heart-outline"}
            size={32}
            color={liked ? "red" : "black"}
          />
        </Pressable>
        <Image style={styles.image} />
      </View>
      <View style={styles.shop}>
        <View style={styles.details}>
          <Text style={styles.title}>شیر پگاه </Text>
          {/* <View style={styles.icon}>
              
              <Text style={styles.address}></Text>
            </View> */}
          <Text style={styles.title}>برند محصول </Text>
          <Text style={styles.title}>30.000 </Text>
          <Text style={styles.title}>این محصول در دسته ----- قرار دارد </Text>
          <Text style={styles.title}>موجودی : </Text>
          <View>
            <StarRating
              starSize={25}
              disabled={true}
              fullStarColor={"#b31414"}
              // rating={
              //   route.params.rate_value == 0 ? 3 : route.params.rate_value
              // }
            ></StarRating>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.SignUpBtn}
        onPress={() => navigation.navigate("Comment", route.params.id)}
      >
        <Text style={styles.SignUpText}> مشاهده نظرات این محصول</Text>
      </TouchableOpacity>
      {/* </View> */}

      <Text style={{ fontWeight: "bold" }}></Text>
      {shopitems && (
        <FlatList
          // testID={"items-list" + props.index}
          nestedScrollEnabled={true}
          style={{ marginTop: -30 }}
          horizontal
          data={shopitems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(itemData) => {
            // console.log("item is", itemData.item);
            return (
              <Item
                name={itemData.item.name}
                image={itemData.item.photo}
                price={itemData.item.price}
                discount={itemData.item.discount}
                index={itemData.item.id}
                onPress={() => {
                  console.log("click me");
                  navigation.navigate("Home");
                }}
              ></Item>
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
    borderRadius: 10,
    height: 40,
    width: 370,
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: "#b31414",
  },
  SignUpText: {
    color: "white",
    fontSize: 20,
    marginTop: 5,
    textAlign: "center",
  },

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
    backgroundColor: "white",
    height: 220,
    width: 370,
    marginLeft: 12,
    marginTop: 15,
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
    marginLeft: 12,
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
    width: "95%",
    height: 300,
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
    marginLeft: 11,
    marginTop: 8,

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
export default ItemDetail;
