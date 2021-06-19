import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
import StarRating from "react-native-star-rating";
import * as SecureStore from "expo-secure-store";
import Item from "./item";

const ShopDetail = ({ route, navigation }) => {
  // console.log(route.params);
  const [search, setSearch] = useState();
  const isFocused = useIsFocused();
  const [shopitems, setItems] = useState();
  const [star_rates, setRates] = useState(route.params.rate_value);
  const [user, setUser] = useState();
  var rated = false;
  var url =
    "http://eunoia-bshop.ir:8000/api/v1/shops/rate/list/" + route.params.id;

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
        console.log("fetching again in shop detail page");
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [isFocused]);

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
    form_post.append("shop", route.params.id);

    var form_put = new FormData();
    form_put.append("rate", rating);

    var rated_id;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        for (var i = 0; i < result.length; i++) {
          // console.log("this is email", user.email);
          if (result[i].user.email == user.email) {
            method_todo = "PUT";
            rated_id = result[i].id;
            // console.log(result);
            break;
          }
        }

        console.log("method:", method_todo);
        var post_url = "http://eunoia-bshop.ir:8000/api/v1/shops/rate/create/";
        var put_url =
          "http://eunoia-bshop.ir:8000/api/v1/shops/rate/" + rated_id;
        var fetch_url = method_todo == "PUT" ? put_url : post_url;
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
            console.log("result after user rate", result);
            //after fetching user's rate, get the item rate in order to update stars
            requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: "follow",
            };
            var u =
              "http://eunoia-bshop.ir:8000/api/v1/shops/" + route.params.id;

            fetch(u, requestOptions)
              .then((response) => response.json())
              .then((result) => {
                // console.log(result);
                setRates(result.rate_value);
                console.log(result.rate_value);
              })
              .catch((error) => console.log("error", error));
          })
          .catch((error) => console.log("error", error));
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          value={search}
          onChangeText={(s) => setSearch(s)}
          style={styles.TextInput}
          placeholder="جستجو"
          placeholderTextColor="#000"
        />
      </View>
      <TouchableOpacity
        style={styles.Btn}
        onPress={() => {
          var x = { searchString: search, shopID: route.params.id };
          setSearch(undefined);
          navigation.navigate("SearchResult", x);
        }}
      >
        <Text style={styles.loginText}>بگرد</Text>
      </TouchableOpacity>
      <View>
        {/* <ImageBackground
        source={require("../assets/lemon.jpg")}
        style={styles.imagebackk}
      > */}
        <View style={styles.shop}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: route.params.logo }} />
          </View>
          {/* <TouchableOpacity
            style={styles.naghsheBtn}
            onPress={() => navigation.navigate("Comment", route.params.id)}
          >
            <Text style={styles.naghsheText}> نقشه</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.SignUpBtn}
            onPress={() => navigation.navigate("Comment", route.params.id)}
          >
            <Text style={styles.SignUpText}> نظرات</Text>
          </TouchableOpacity>

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
                // disabled={true}
                fullStarColor={"#b31414"}
                // rating={route.params.rate_value}
                rating={star_rates}
                selectedStar={(rating) => onStarRatingPress(rating)}
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
            // testID={"items-list" + props.index}
            nestedScrollEnabled={true}
            style={{ marginTop: -30 }}
            horizontal
            data={shopitems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={(itemData) => (
              <Item
                name={itemData.item.name}
                image={itemData.item.photo}
                price={itemData.item.price}
                discount={itemData.item.discount}
                index={itemData.item.id}
                onSelect={() => {
                  navigation.navigate("ItemDetail", itemData.item);
                }}
              ></Item>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  SignUpBtn: {
    width: 70,
    borderRadius: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -60,
    marginBottom: 20,
    backgroundColor: "#b31414",
    marginLeft: 10,
  },
  inputView: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "95%",
    height: 45,
    marginTop: "0%",
    marginBottom: "5%",
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    // marginLeft: 20,
    fontSize: 20,
  },
  SignUpText: {
    color: "white",
  },
  // naghsheBtn: {
  //   width: 70,
  //   borderRadius: 100,
  //   height: 40,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   marginTop: -60,
  //   marginBottom: 20,
  //   backgroundColor: "#b31414",
  //   marginLeft: 10,
  // },
  // naghsheText: {
  //   color: "white",
  // },
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
  Btn: {
    width: "40%",
    borderRadius: 20,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#b31414",
  },
});
export default ShopDetail;
