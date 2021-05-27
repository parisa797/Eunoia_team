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
import Icon from "react-native-vector-icons/FontAwesome";
import StarRating from "react-native-star-rating";

const ShopDetail = ({ route, navigation }) => {
  console.log(route.params);
  return (
    <View style={styles.product}>
      {/* <View style={styles.touchable}> */}
      {/* <TouchableOpacity onPress={props.onSelect} useForeground> */}
      <View>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: route.params.logo }} />
        </View>
        <View style={styles.details}>
          <Text style={styles.title}>فروشگاه {route.params.title}</Text>
          <Text style={styles.address}>
            واقع شده در منطقه {route.params.mantaghe}
          </Text>
          <Text style={styles.address}>با مدیریت {route.params.manager}</Text>
          <Text style={styles.address}>آدرس: {route.params.address}</Text>
          {route.params.online == true && (
            <View style={styles.online_icon}>
              <Icon name="check-circle" size={20} color="green"></Icon>
              <Text style={{ fontSize: 20 }}> فروش آنلاین دارد</Text>
            </View>
          )}
          {route.params.online == false && (
            <View style={styles.online_icon}>
              <Icon name="times-circle" size={20} color="red"></Icon>
              <Text style={{ fontSize: 20 }}> فروش آنلاین ندارد</Text>
            </View>
          )}
          <View>
            <StarRating
              starSize={25}
              disabled={true}
              fullStarColor={"yellow"}
              rating={
                route.params.rate_value == 0 ? 3 : route.params.rate_value
              }
            ></StarRating>
          </View>
        </View>
        {/* <View style={styles.actions}>{props.children}</View> */}
      </View>
      {/* </TouchableOpacity> */}
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  product: {
    height: 200,
    margin: 20,
    borderRadius: 20,
  },

  imageContainer: {
    backgroundColor: "white",
    // objectFit: ""
    width: "50%",
    height: "70%",
    // alignItems: "center",
    // justifyContent: "center",
    // alignContent: "center",
    alignSelf: "center",

    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
    borderRadius: 10,

    // overflow: "hidden",
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
  details: {
    alignItems: "center",
    height: "17%",
    padding: 10,
  },
  title: {
    // fontFamily: "open-sans-bold",
    fontSize: 25,
    marginVertical: 2,
    // paddingTop: 3,
  },
  online_icon: {
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    backgroundColor: "#f1f1f2",
    alignItems: "baseline",
  },
  address: {
    // fontFamily: "open-sans",
    fontSize: 21,
    color: "black",
  },
});
export default ShopDetail;
