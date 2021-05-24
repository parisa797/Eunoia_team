import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Pressable,
} from "react-native";
import StarRating from "react-native-star-rating";
import Icon from "react-native-vector-icons/FontAwesome";
import AntIcon from "react-native-vector-icons/AntDesign";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Shop = (props) => {
  const [liked, setLiked] = useState(false);
  const shop_name = props.title.includes("فروشگاه")
    ? props.title
    : "فروشگاه " + props.title;

  return (
    <View style={styles.shop}>
      <Pressable onPress={() => setLiked((isLiked) => !isLiked)}>
        <MaterialCommunityIcons
          name={liked ? "heart" : "heart-outline"}
          size={32}
          color={liked ? "red" : "black"}
        />
      </Pressable>
      <TouchableOpacity onPress={props.onSelect} useForeground>
        <View style={styles.name_logo}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: props.image }} />
          </View>
          <View style={styles.name_star}>
            <Text style={styles.title}>{shop_name}</Text>
            <StarRating
              starSize={25}
              disabled={true}
              fullStarColor={"#b31414"}
              rating={props.rate_value == 0 ? 3 : props.rate_value}
            ></StarRating>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.address}>آدرس: {props.address}</Text>
          {props.online == true && (
            <View style={styles.online_icon}>
              <Icon name="check-circle" size={20} color="green"></Icon>
              <Text style={styles.online}> آنلاین</Text>
            </View>
          )}
          {props.online == false && (
            <View style={styles.online_icon}>
              <Icon name="check-circle" size={20} color="red"></Icon>
              <Text style={styles.hozuri}> حضوری</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  hozuri: { fontSize: 20, color: "red" },
  online: { fontSize: 20, color: "green" },
  shop: {
    height: 260,
    width: 360,
    margin: 20,
    borderRadius: 20,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    backgroundColor: "#f1f1f2",
    marginLeft: 17,

    //right to left
    // justifyContent: "space-between",
    // flexDirection: "row-reverse",
  },

  name_logo: {
    backgroundColor: "#f1f1f2",
    justifyContent: "space-evenly",
    flexDirection: "row-reverse",
    borderRadius: 20,
    marginLeft: 6,
    marginTop: -2,
  },

  imageContainer: {
    backgroundColor: "white",
    // objectFit: ""
    width: "40%",
    height: "75%",
    alignSelf: "center",
    borderRadius: 20,
    marginTop: -20,
    marginLeft: 20,
  },
  image: {
    // backgroundColor: "#f1f1f2",
    width: "100%",
    height: "100%",
    marginTop: "1%",
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center",
    // paddingBottom: "1",
  },
  name_star: {
    justifyContent: "center",
    // flexGrow: 0.1,
    flexShrink: 0.5,
    marginTop: -18,
  },
  details: {
    alignItems: "center",
    height: "10%",
    padding: 30,
    marginTop: -18,
  },
  title: {
    // fontFamily: "open-sans-bold",
    fontSize: 20,
    marginVertical: 2,
    alignSelf: "center",
    // paddingTop: 3,
    // marginTop: "0%",
  },
  online_icon: {
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    backgroundColor: "white",
    alignItems: "baseline",
  },
  // heart: {
  //   justifyContent: "space-between",
  //   flexDirection: "row-reverse",
  //   backgroundColor: "transparent",
  //   alignItems: "baseline",
  //   marginTop: -190,
  //   marginLeft: 280,
  // },
  address: {
    // fontFamily: "open-sans",
    fontSize: 21,
    color: "#2B1214",
  },
});
export default Shop;
