import React, { useState, useEffect } from "react";
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
import * as SecureStore from "expo-secure-store";

const Shop = (props) => {
  // console.log("props for shop", props);
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState();
  var like_url =
    "http://eunoia-bshop.ir:8000/api/v1/shops/" + props.index + "/likes";

  const shop_name = props.title.includes("فروشگاه")
    ? props.title
    : "فروشگاه " + props.title;
  const shop_add = "آدرس: " + props.address;

  var photo = props.image
    ? props.image.includes("http://eunoia-bshop.ir:8000")
      ? props.image
      : "http://eunoia-bshop.ir:8000" + props.image
    : null;

  useEffect(() => {
    const getUser = async () => {
      var myHeaders = new Headers();
      let t = await SecureStore.getItemAsync("token");
      var authorization = "Token " + t;
      myHeaders.append("Authorization", authorization);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      fetch("http://eunoia-bshop.ir:8000/users/profile", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setUser(result);
          // console.log("user's info", result);
        })
        .catch((error) => console.log("error", error));
    };
    getUser();
  }, []);

  const getLikes = async () => {
    var myHeaders = new Headers();
    let t = await SecureStore.getItemAsync("token");
    var authorization = "Token " + t;
    myHeaders.append("Authorization", authorization);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(like_url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.length != 0) {
          var likers = result[0].Liked_By;
          for (var i = 0; i < likers.length; i++) {
            if (likers[i].email == user.email) {
              // console.log("i found it!");
              setLiked(true);
              break;
            }
          }
        }
      })
      .catch((error) => console.log("like fetch error", error));
  };

  useEffect(() => {
    getLikes();
  }, [user, liked]);

  const postLike = async () => {
    var myHeaders = new Headers();
    let t = await SecureStore.getItemAsync("token");
    var authorization = "Token " + t;
    myHeaders.append("Authorization", authorization);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(like_url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLiked(!liked);
        console.log("like post fetch result", result);
      })
      .catch((error) => console.log("like post fetch error", error));
  };

  return (
    <View style={styles.shop}>
      <Pressable
        onPress={() => {
          console.log("like state before change", liked);
          postLike();
        }}
      >
        <MaterialCommunityIcons
          name={liked ? "heart" : "heart-outline"}
          size={32}
          color={liked ? "red" : "black"}
        />
      </Pressable>
      <TouchableOpacity
        testID={"shop-" + props.index}
        onPress={props.onSelect}
        useForeground
      >
        <View style={styles.name_logo}>
          <View style={styles.imageContainer}>
            {photo && (
              <Image
                testID={"shop-image-" + props.index}
                style={styles.image}
                source={{ uri: photo }}
              />
            )}
            {!photo && (
              <Image
                testID={"shop-noimage-" + props.index}
                style={styles.image}
                source={require("../assets/no-image.png")}
              />
            )}
          </View>
          <View style={styles.name_star}>
            <Text testID={"shop-name-" + props.index} style={styles.title}>
              {shop_name}
            </Text>
            <View style={styles.setare}>
              <StarRating
                starSize={25}
                disabled={true}
                fullStarColor={"#b31414"}
                rating={props.rate_value == 0 ? 3 : props.rate_value}
              ></StarRating>
            </View>
          </View>
        </View>
        <View style={styles.details}>
          <Text testID={"shop-add-" + props.index} style={styles.address}>
            {shop_add}
          </Text>
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
  setare: {
    width: 30,
    marginLeft: "20%",
  },
  shop: {
    height: 260,
    width: "90%",
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
    marginTop: -30,
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
