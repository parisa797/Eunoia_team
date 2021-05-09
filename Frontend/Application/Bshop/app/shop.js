import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import StarRating from "react-native-star-rating";
import Icon from "react-native-vector-icons/FontAwesome";

const Shop = (props) => {
  const shop_name = props.title.includes("فروشگاه")
    ? props.title
    : "فروشگاه " + props.title;
  const shop_add = "آدرس: " + props.address;
  return (
    <View style={styles.shop}>
      <TouchableOpacity
        testID={"shop-" + props.index}
        onPress={props.onSelect}
        useForeground
      >
        <View style={styles.name_logo}>
          <View style={styles.imageContainer}>
            <Image
              testID={"shop-image-" + props.index}
              style={styles.image}
              source={{ uri: props.image }}
            />
          </View>
          <View style={styles.name_star}>
            <Text testID={"shop-name-" + props.index} style={styles.title}>
              {shop_name}
            </Text>
            <StarRating
              starSize={25}
              disabled={true}
              fullStarColor={"#b31414"}
              rating={props.rate_value == 0 ? 0 : props.rate_value}
            ></StarRating>
          </View>
        </View>
        <View style={styles.details}>
          <Text testID={"shop-add-" + props.index} style={styles.address}>
            {shop_add}
          </Text>
          {props.online == true && (
            <View style={styles.online_icon}>
              <Icon name="check-circle" size={20} color="green"></Icon>
              <Text style={{ fontSize: 20 }}> فروش آنلاین دارد</Text>
            </View>
          )}
          {props.online == false && (
            <View style={styles.online_icon}>
              <Icon name="times-circle" size={20} color="red"></Icon>
              <Text style={{ fontSize: 20 }}> فروش آنلاین ندارد</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  shop: {
    height: 220,
    margin: 20,
    borderRadius: 20,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    backgroundColor: "#f1f1f2",
    //right to left
    // justifyContent: "space-between",
    // flexDirection: "row-reverse",
  },

  name_logo: {
    backgroundColor: "#f1f1f2",
    justifyContent: "space-evenly",
    flexDirection: "row-reverse",
    borderRadius: 20,
  },

  imageContainer: {
    backgroundColor: "white",
    // objectFit: ""
    width: "40%",
    height: "70%",
    alignSelf: "center",
    borderRadius: 10,
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
    borderRadius: 10,
  },
  name_star: {
    justifyContent: "center",
    // flexGrow: 0.1,
    flexShrink: 0.5,
  },
  details: {
    alignItems: "center",
    height: "10%",
    padding: 10,
  },
  title: {
    // fontFamily: "open-sans-bold",
    fontSize: 25,
    marginVertical: 2,
    alignSelf: "center",
    // paddingTop: 3,
  },
  online_icon: {
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    backgroundColor: "white",
    alignItems: "baseline",
  },
  address: {
    // fontFamily: "open-sans",
    fontSize: 21,
    color: "#2B1214",
  },
});
export default Shop;
