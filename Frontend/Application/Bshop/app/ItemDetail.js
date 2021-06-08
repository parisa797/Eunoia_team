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
  console.log(route.params);

  var image = !route.params.photo ? null : route.params.photo;
  var price = `${route.params.price} تومان`;
  var discounted = `با تخفیف: ${route.params.price_with_discount} تومان`;
  var count =
    route.params.count != 0 ? `موجودی: ${route.params.count} عدد` : "ناموجود";
  var brand = !route.params.brand ? "برند نامشخص" : route.params.brand;
  const categories = {
    "Spices and condiments and food side dishes": "ادویه، چاشنی و مخلفات غذا",
    Cosmetics: "بهداشت و مراقبت پوست",
    "Makeup and trimming": "آرایش و پیرایش",
    Protein: "پروتئینی",
    "Junk Food": "تنقلات",
    Nuts: "خشکبار",
    "Sweets and desserts": "شیرینیجات و دسرها",
    perfume: "عطر، ادکلن و اسپری",
    "Fruits and vegetables": "غذا، کنسرو و سبزیجات",
    Dairy: "لبنیات",
    Drinks: "نوشیدنیها",
    "Washing and Cleaning Equipment": "وسایل شستشو و نظافت",
    others: "متفرقه",
  };
  var category = `دسته بندی: ${categories[route.params.category]}`;
  var manufacture = `تاریخ تولید: ${route.params.manufacture_jalali}`;
  var expire = `تاریخ انقضا: ${route.params.Expiration_jalali}`;

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
        {/* <Image style={styles.image} /> */}
        {image == null && (
          <Image
            resizeMode="contain"
            style={styles.image}
            source={require("../assets/no-image.png")}
          />
        )}
        {image && (
          <Image
            resizeMode="contain"
            style={styles.image}
            source={{ uri: "http://eunoia-bshop.ir:8000" + image }}
          />
        )}
      </View>
      <View style={styles.shop}>
        <View style={styles.details}>
          <Text style={styles.title}>{route.params.name} </Text>
          {/* <View style={styles.icon}>
              
              <Text style={styles.address}></Text>
            </View> */}
          <Text style={styles.title}>{route.params.description}</Text>
          <Text style={styles.title}>{brand}</Text>
          <Text style={styles.title}>{manufacture}</Text>
          <Text style={styles.title}>{expire}</Text>
          <Text style={styles.title}>{price} </Text>
          {route.params.price != route.params.price_with_discount && (
            <Text style={styles.title}>{discounted} </Text>
          )}
          <Text style={styles.title}>{category} </Text>
          <Text style={styles.title}>{count}</Text>
          <View>
            <StarRating
              starSize={25}
              disabled={true}
              fullStarColor={"#b31414"}
              rating={
                route.params.rate_value == 0 ? 0 : route.params.rate_value
              }
            ></StarRating>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.SignUpBtn}
        // onPress={() => navigation.navigate("Comment", route.params.id)}
      >
        <Text style={styles.SignUpText}> مشاهده نظرات این محصول</Text>
      </TouchableOpacity>
      {/* </View> */}

      <Text style={{ fontWeight: "bold" }}></Text>

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
    height: 380,
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
    height: "48%",
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
