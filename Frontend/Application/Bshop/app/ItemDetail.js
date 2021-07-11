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
import * as SecureStore from "expo-secure-store";
import Item from "./item";

const ItemDetail = ({ route, navigation }) => {
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState();
  // const [rated, setRated] = useState(false);
  var rated = false;
  const [star_rates, setRates] = useState(route.params.rate_value);
  console.log("params given to me", route.params);

  // var image = !route.params.photo ? null : route.params.photo;
  var image = route.params.photo
    ? route.params.photo.includes("http://eunoia-bshop.ir:8000")
      ? route.params.photo
      : "http://eunoia-bshop.ir:8000" + route.params.photo
    : null;
  // console.log("this is image url", image);
  var price = `${route.params.price} ریال`;
  var discounted = `با تخفیف: ${route.params.price_with_discount} ریال`;
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
  const months = {
    "01": "فروردین",
    "02": "اردیبهشت",
    "03": "خرداد",
    "04": "تیر",
    "05": "مرداد",
    "06": "شهریور",
    "07": "مهر",
    "08": "آبان",
    "09": "آذر",
    10: "دی",
    11: "بهمن",
    12: "اسفند",
  };
  const month_string = (date) => {
    var fields = date.split("-");
    return fields[2] + " " + months[fields[1]] + " " + fields[0];
  };
  var manufacture = `تاریخ تولید: ${month_string(
    route.params.manufacture_jalali
  )}`;
  var expire = `تاریخ انقضا: ${month_string(route.params.Expiration_jalali)}`;

  var url =
    "http://eunoia-bshop.ir:8000/shops/" +
    route.params.shop_id +
    "/items/" +
    route.params.id +
    "/rates/";

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

    var like_url =
      "http://eunoia-bshop.ir:8000/shops/" +
      route.params.shop_id +
      "/items/" +
      route.params.id +
      "/likes";

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

    var like_url =
      "http://eunoia-bshop.ir:8000/shops/" +
      route.params.shop_id +
      "/items/" +
      route.params.id +
      "/likes";

    fetch(like_url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLiked(!liked);
        console.log("like post fetch result", result);
      })
      .catch((error) => console.log("like post fetch error", error));
  };

  const onStarRatingPress = async (rating) => {
    // console.log("star rates before", route.params.rate_value);

    var myHeaders = new Headers();
    let t = await SecureStore.getItemAsync("token");
    var authorization = "Token " + t;
    myHeaders.append("Authorization", authorization);

    // console.log("printing email here");
    // console.log(user.email);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    var method_todo = "POST";
    var form_post = new FormData();
    form_post.append("rate", rating);
    form_post.append("item", route.params.id);

    var form_put = new FormData();
    form_put.append("rate", rating);

    var rated_id;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log("check here");
        // console.log(user.email);
        for (var i = 0; i < result.length; i++) {
          if (result[i].user.email == user.email) {
            // setRated(true);
            // rated = true;
            method_todo = "PUT";
            rated_id = result[i].id;
            console.log(result);
            break;
          }
        }
        // console.log("rated state", rated);
        console.log("method:", method_todo);
        var fetch_url = method_todo == "POST" ? url : url + rated_id;
        console.log(fetch_url);
        var requestOptions = {
          method: method_todo,
          headers: myHeaders,
          body: method_todo == "POST" ? form_post : form_put,
        };

        fetch(fetch_url, requestOptions)
          .then((response) => {
            return response.json();
          })
          .then((result) => {
            //after fetching user's rate, get the item rate in order to update stars
            requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: "follow",
            };
            var u =
              "http://eunoia-bshop.ir:8000/shops/" +
              route.params.shop_id +
              "/items/" +
              route.params.id;

            fetch(u, requestOptions)
              .then((response) => response.json())
              .then((result) => {
                // console.log(result);
                setRates(result.rate_value);
                console.log(result.rate_value);
              })
              .catch((error) => console.log("error", error));

            console.log("result of fetch", result);
          })
          .catch((error) => console.log("error", error));
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.container}>
      {/* <ImageBackground
        source={require("../assets/lemon.jpg")}
        style={styles.imagebackk}
      > */}
      {/* <View style={styles.shop}> */}

      <View style={styles.imageContainer}>
        <Pressable
          onPress={() => {
            console.log("like state before change", liked);
            // setLiked(!liked);
            // console.log("liked state after change", liked);
            postLike();
          }}
        >
          <MaterialCommunityIcons
            name={liked ? "heart" : "heart-outline"}
            size={32}
            color={liked ? "red" : "black"}
          />
        </Pressable>
        {/* <Image style={styles.image} /> */}
        {!image && (
          <Image
            testID={"item-detail-noimage-" + route.params.id}
            resizeMode="contain"
            style={styles.image}
            source={require("../assets/no-image.png")}
          />
        )}
        {image && (
          <Image
            testID={"item-detail-image-" + route.params.id}
            resizeMode="contain"
            style={styles.image}
            source={{ uri: image }}
          />
        )}
      </View>
      <View style={styles.shop}>
        <View style={styles.details}>
          <Text
            testID={"item-detail-name-" + route.params.id}
            style={styles.title}
          >
            {route.params.name}{" "}
          </Text>
          {/* <View style={styles.icon}>
              
              <Text style={styles.address}></Text>
            </View> */}
          <Text
            testID={"item-detail-description-" + route.params.id}
            style={styles.title}
          >
            {route.params.description}
          </Text>
          <Text
            testID={"item-detail-brand-" + route.params.id}
            style={styles.title}
          >
            {brand}
          </Text>
          <Text
            testID={"item-detail-manufacture-" + route.params.id}
            style={styles.title}
          >
            {manufacture}
          </Text>
          <Text
            testID={"item-detail-expire-" + route.params.id}
            style={styles.title}
          >
            {expire}
          </Text>
          <Text
            testID={"item-detail-price-" + route.params.id}
            style={styles.title}
          >
            {price}{" "}
          </Text>
          {route.params.price != route.params.price_with_discount && (
            <Text
              testID={"item-detail-discounted-" + route.params.id}
              style={styles.title}
            >
              {discounted}{" "}
            </Text>
          )}
          <Text
            testID={"item-detail-category-" + route.params.id}
            style={styles.title}
          >
            {category}{" "}
          </Text>
          <Text
            testID={"item-detail-count-" + route.params.id}
            style={styles.title}
          >
            {count}
          </Text>
          <View>
            <StarRating
              starSize={25}
              disabled={false}
              fullStarColor={"#b31414"}
              // rating={route.params.rate_value}
              rating={star_rates}
              selectedStar={(rating) => onStarRatingPress(rating)}
            ></StarRating>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.SignUpBtn}
        onPress={() => {
          var ids = { shop: route.params.shop_id, item: route.params.id };
          // console.log("shop and item id", ids);
          navigation.navigate("ItemComment", ids);
        }}
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
    height: 350,
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
    height: "85%",
    marginTop: "-1%",
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center",
    // paddingBottom: "1",
    marginLeft: 35,
    backgroundColor: "transparent",
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
