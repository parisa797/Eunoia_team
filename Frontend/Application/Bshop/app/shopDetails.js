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
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import StarRating from "react-native-star-rating";

// // export default class ShopDetail extends React.Component {
// //   constructor(props) {
// //     super(props);
// //     this.state = {
// //       exampleData: [
// //         {const Product_kind_one = [{
// //     name : 'Nice cloth',
// //     price : '2,999',
// //     image : ('../imgs/1.jpg')
// // },{
// //     name : 'Orange cloth',
// //     price : '3,999',
// //     image : ('../imgs/2.jpg')
// // },},
// //         { name: "Big Watch", price: "888" },
// //         { name: "Expensive Watch", price: "999999" },
// //         { name: "Donald Trump", price: "-1" },
// //       ],
// //     };
// //   }
// //   render() {

// // const ShopDetail = ({ navigation }) => {
// //   const ShopDetail = [
// //     {
// //       name: "Nice cloth",
// //       price: "2,999",
// //       image: ("../assets/lemon.jpg"),
// //     },
// //     {
// //       name: "Orange cloth",
// //       price: "3,999",
// //       image: ("../assets/lemon.jpg"),
// //     },
// //     {
// //       name: "Pink cloth",
// //       price: "2,999",
// //       image: ("../assets/lemon.jpg"),
// //     },
// //     {
// //       name: "Colory cloth",
// //       price: "1,999",
// //       image: ("../assets/lemon.jpg"),
// //     },
// //     {
// //       name: "Dark High Heels",
// //       price: "0,999",
// //       image: ("../assets/lemon.jpg"),
// //     },
// //     {
// //       name: "Blue Nice Shoes",
// //       price: "3,599",
// //       image: ("../assets/lemon.jpg"),
// //     },
// //     {
// //       name: "Women Blue Bag",
// //       price: "2,299",
// //       image: ("../assets/lemon.jpg"),
// //     },
// //   ];

// //   return (
// //     <View>
// //       <Text style={{ fontWeight: "bold" }}>محصولات این فروشگاه</Text>
// //       <FlatList
// //         horizontal
// //         data={Product_kind_one}
// //         renderItem={({ item }) => (
// //           <View style={{ padding: 10 }}>
// //             <View
// //               style={{
// //                 backgroundColor: "white",
// //                 borderWidth: 0,
// //                 borderColor: "#626262",
// //                 borderRadius: 20,
// //                 height: 200,
// //                 width: 150,
// //               }}
// //             />
// //             <Text>{item.name}</Text>
// //             <Text>{item.price}</Text>
// //           </View>
// //         )}
// //       />
// //     </View>
// //   );
// // };

// // export default ShopDetail;

//   return (
//     <View style={styles.container}>
//       <ImageBackground
//         source={("../assets/lemon.jpg")}
//         style={styles.imagebackk}
//       >
//         <View style={styles.product}>
//           {/* <View style={styles.touchable}> */}
//           {/* <TouchableOpacity onPress={props.onSelect} useForeground> */}
//           <View>
//             <View style={styles.imageContainer}>
//               <Image style={styles.image} source={{ uri: route.params.logo }} />
//             </View>
//             <View style={styles.details}>
//               <Text style={styles.title}>فروشگاه {route.params.title}</Text>
//               <Text style={styles.address}>
//                 واقع شده در منطقه {route.params.mantaghe}
//               </Text>
//               <Text style={styles.address}>
//                 با مدیریت {route.params.manager}
//               </Text>
//               <Text style={styles.address}>آدرس: {route.params.address}</Text>
//               {route.params.online == true && (
//                 <View style={styles.online_icon}>
//                   <Icon name="check-circle" size={20} color="green"></Icon>
//                   <Text style={{ fontSize: 20 }}> فروش آنلاین دارد</Text>
//                 </View>
//               )}
//               {route.params.online == false && (
//                 <View style={styles.online_icon}>
//                   <Icon name="times-circle" size={20} color="red"></Icon>
//                   <Text style={{ fontSize: 20 }}> فروش آنلاین ندارد</Text>
//                 </View>
//               )}
//               <View>
//                 <StarRating
//                   starSize={25}
//                   disabled={true}
//                   fullStarColor={"yellow"}
//                   rating={
//                     route.params.rate_value == 0 ? 3 : route.params.rate_value
//                   }
//                 ></StarRating>
//               </View>
//             </View>
//             {/* <View style={styles.actions}>{props.children}</View> */}
//           </View>
//           {/* </TouchableOpacity> */}
//           {/* </View> */}
//         </View>
//       </ImageBackground>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   product: {
//     height: 200,
//     margin: 20,
//     borderRadius: 20,
//   },

//   imageContainer: {
//     backgroundColor: "white",
//     // objectFit: ""
//     width: "55%",
//     height: "70%",
//     // alignItems: "center",
//     // justifyContent: "center",
//     // alignContent: "center",
//     alignSelf: "center",

//     // borderTopLeftRadius: 10,
//     // borderTopRightRadius: 10,
//     borderRadius: 10,
//     marginTop: 70,

//     // overflow: "hidden",
//   },
//   image: {
//     // backgroundColor: "#f1f1f2",
//     width: "100%",
//     height: "100%",
//     marginTop: "1%",
//     resizeMode: "cover",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 10,

//     // paddingBottom: "1",
//   },
//   details: {
//     alignItems: "center",
//     height: "17%",
//     padding: 10,
//     marginTop: 10,
//   },
//   title: {
//     // fontFamily: "open-sans-bold",
//     fontSize: 40,
//     marginVertical: 10,
//     // paddingTop: 3,
//   },
//   online_icon: {
//     justifyContent: "space-between",
//     flexDirection: "row-reverse",
//     backgroundColor: "#f1f1f2",
//     alignItems: "baseline",
//   },
//   address: {
//     // fontFamily: "open-sans",
//     fontSize: 20,
//     marginVertical: 5,
//     color: "black",
//   },
//   container: {
//     flex: 1,
//     // width: "100%",
//     // height: "100%",
//     flexDirection: "column",
//   },
//   imagebackk: {
//     width: 400,
//     height: 700,
//     marginTop: -20,
//     marginLeft: -7,
//   },
// });

const ShopDetail = ({ route, navigation }) => {
  console.log(route.params);

  const shopitems = [
    {
      name: "پفک طلایی چی توز",
      price: "7.000",
      image: require("../assets/pofak.png"),
      id: 1,
    },
    {
      name: "پاستیل شیبابا",
      price: "9.000",
      image: require("../assets/pastil.jpg"),
      id: 2,
    },
    {
      name: "رب گوجه آتا",
      price: "15.100",
      image: require("../assets/rob.png"),
      id: 3,
    },
    {
      name: "پف پفی شیبابا",
      price: "7.000",
      image: require("../assets/pufpuf.jpg"),
      id: 4,
    },
    {
      name: "پودینگ کوپا",
      price: "10.500",
      image: require("../assets/pudding.png"),
      id: 5,
    },
    {
      name: "چیپس قارچ و خامه چی توز",
      price: "8.000",
      image: require("../assets/chips.png"),
      id: 6,
    },
    {
      name: "پودر شکلات پارمیدا",
      price: "33.800",
      image: require("../assets/pudrchocolate.jpg"),
      id: 7,
    },
  ];
  return (
    <View>
      <View style={styles.shop}>
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
              <Text>{item.price}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  shop: {
    borderRadius: 20,
    marginTop: 10,
    borderRadius: 20,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    backgroundColor: "white",
    height: 250,
    width: 370,
    marginLeft: 10,
  },
  rows: {
    borderRadius: 20,
    marginTop: 10,
    borderRadius: 20,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    backgroundColor: "#b31414",
    height: 50,
    width: 370,
    marginLeft: 12,
    fontWeight: "bold",
    fontSize: 25,
  },
  rowstext: {
    color: "#fff",
    fontSize: 22,
  },
  items: {
    backgroundColor: "white",
    height: 200,
    width: 150,
    borderRadius: 20,
    marginTop: 10,
    borderRadius: 20,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    backgroundColor: "white",
  },
  imageContainer: {
    backgroundColor: "white",
    // objectFit: ""
    width: "30%",
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
    marginLeft: 245,
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
    height: "17%",
    padding: 10,
  },
  title: {
    // fontFamily: "open-sans-bold",
    fontSize: 19,
    marginVertical: 65,
    // paddingTop: 3,
    marginLeft: "-35%",
    marginTop: "-30%",
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
});
export default ShopDetail;
