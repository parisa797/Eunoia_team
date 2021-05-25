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
import Icon from "react-native-vector-icons/FontAwesome";
import StarRating from "react-native-star-rating";

const ShopDetail = ({ route, navigation }) => {
  console.log(route.params);

  const shopitems = [
    {
      name: "پفک طلایی چی توز",
      price: "7.000 : قیمت ",
      image: require("../assets/pofak.png"),
      id: 1,
    },
    {
      name: "پاستیل شیبابا",
      price: "9.000 : قیمت ",
      image: require("../assets/pastil.jpg"),
      id: 2,
    },
    {
      name: "رب گوجه آتا",
      price: "15.100 : قیمت ",
      image: require("../assets/rob.png"),
      id: 3,
    },
    {
      name: "پف پفی شیبابا",
      price: "7.000 : قیمت ",
      image: require("../assets/pufpuf.jpg"),
      id: 4,
    },
    {
      name: "پودینگ کوپا",
      price: "10.500 : قیمت ",
      image: require("../assets/pudding.png"),
      id: 5,
    },
    {
      name: "چیپس قارچ و خامه چی توز",
      price: "8.000 : قیمت ",
      image: require("../assets/chips.png"),
      id: 6,
    },
    {
      name: "پودر شکلات پارمیدا",
      price: "33.800 : قیمت ",
      image: require("../assets/pudrchocolate.jpg"),
      id: 7,
    },
  ];
  return (
    <ScrollView nestedScrollEnabled={true} style={styles.container}>
      <View>
        {/* <ImageBackground
        source={require("../assets/lemon.jpg")}
        style={styles.imagebackk}
      > */}
        <View style={styles.shop}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: route.params.logo }} />
          </View>

          <View style={styles.details}>
            <Text style={styles.title}>فروشگاه {route.params.title}</Text>

            <Text style={styles.address}>آدرس: {route.params.address}</Text>

            {route.params.online == true && (
              <View style={styles.online_icon}>
                <Icon name="check-circle" size={20} color="green"></Icon>
                <Text style={styles.online}>
                  {" "}
                  آنلاین
                  <Text style={styles.mantaghee}>
                    منطقه {route.params.mantaghe}
                  </Text>
                </Text>
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
        <FlatList
          style={{ marginTop: -30 }}
          horizontal
          data={shopitems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            console.log(item.image);
            console.log("item.image");
            return (
              <View style={{ padding: 10 }}>
                <View style={styles.items}>
                  <Image style={styles.image} source={item.image} />
                </View>
                <Text>{item.name}</Text>

                <View style={styles.row}>
                  <View style={styles.price}>
                    <Text
                      style={{
                        textDecorationLine: "line-through",
                        textDecorationStyle: "solid",
                        textDecorationColor: "#b31414",
                      }}
                    >
                      {item.price}
                    </Text>
                  </View>
                  <View style={styles.price}>
                    <Text>{item.price}بعد از تخفیف</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
        {/* </ImageBackground> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  hozuri: { fontSize: 20, color: "red" },
  online: { fontSize: 20, color: "green", marginLeft: 50 },
  shop: {
    borderRadius: 10,
    marginTop: 30,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    backgroundColor: "#f1f1f2",
    height: 250,
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
    fontSize: 19,
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
    fontSize: 21,
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
