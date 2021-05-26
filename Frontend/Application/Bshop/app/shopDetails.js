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
import Item from "./item";

const ShopDetail = ({ route, navigation }) => {
  // console.log(route.params);
  // console.log("this is index", route.params.id);

  const [shopitems, setItems] = useState();
  const loadProducts = useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    var url =
      "http://eunoia-bshop.ir:8000/shops/" + route.params.id + "/items/";
    // console.log("used this url", url);
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setItems(result);
        // console.log(result);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.container}>
      <View>
        {/* <ImageBackground
        source={require("../assets/lemon.jpg")}
        style={styles.imagebackk}
      > */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Comment", route.params.id)}
        >
          <Text>press me</Text>
        </TouchableOpacity>

        <View style={styles.shop}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: route.params.logo }} />
          </View>
          <View style={styles.details}>
            <Text style={styles.title}>فروشگاه {route.params.title}</Text>
            <View style={styles.icon}>
              <Ionicon name="location-sharp" size={25} color="black"></Ionicon>
              <Text style={styles.address}>{route.params.address}</Text>
            </View>

            <View style={styles.icon}>
              <Icon name="phone" size={25} color="black"></Icon>
              <Text style={styles.address}>{route.params.phone}</Text>
            </View>

            {route.params.online == true && (
              <View style={styles.online_icon}>
                <Icon name="check-circle" size={20} color="green"></Icon>
                <Text style={styles.online}> آنلاین</Text>
              </View>
            )}
            {route.params.online == false && (
              <View style={styles.online_icon}>
                <Icon name="check-circle" size={20} color="red"></Icon>
                <Text style={styles.hozuri}> حضوری</Text>
              </View>
            )}
            <View>
              <StarRating
                starSize={25}
                disabled={true}
                fullStarColor={"#b31414"}
                rating={
                  route.params.rate_value == 0 ? 3 : route.params.rate_value
                }
              ></StarRating>
            </View>
          </View>
        </View>
        <View style={styles.rows}>
          <Text style={styles.rowstext}>محصولات فروشگاه</Text>
        </View>
        <Text style={{ fontWeight: "bold" }}></Text>
        {shopitems && (
          <FlatList
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
                ></Item>
              );
            }}
          />
        )}

        {/* </ImageBackground> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  icon: {
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    alignItems: "baseline",
  },
  hozuri: { fontSize: 20, color: "red" },
  online: { fontSize: 20, color: "green" },
  shop: {
    borderRadius: 10,
    marginTop: "3%",
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
export default ShopDetail;
