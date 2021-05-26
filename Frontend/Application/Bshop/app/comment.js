import React, { Component, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useIsFocused } from "@react-navigation/native";

const OneComment = (props) => {
  var date = props.date.slice(0, 16);
  // console.log(date);

  var user_photo =
    props.avatar.length == 0 ? null : props.avatar[0].uploaded_file;
  console.log("photo:", user_photo);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {user_photo == null && (
          <Image
            resizeMode="contain"
            style={styles.avatar}
            // source={{ uri: props.avatar }}
            source={require("../assets/avatar.jpg")}
          />
        )}
        {user_photo && (
          <Image
            resizeMode="contain"
            style={styles.avatar}
            source={{ uri: user_photo }}
          />
        )}
      </View>
      <View style={styles.contentContainer}>
        <Text>
          <Text style={[styles.text, styles.name]}>{props.name}</Text>{" "}
          <Text style={styles.text}>{props.content}</Text>
        </Text>
        <Text style={[styles.text, styles.created]}>{date}</Text>
      </View>
    </View>
  );
};

const Comment = ({ route, navigation }) => {
  // console.log("this is route", route.params);
  const [comments, setComments] = useState();
  const [newComment, setNew] = useState();
  var noComment = undefined;
  const isFocused = useIsFocused();

  useEffect(() => {
    const getComments = async () => {
      var myHeaders = new Headers();
      let t = await SecureStore.getItemAsync("token");
      var authorization = "Token " + t;
      myHeaders.append("Authorization", authorization);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      var url =
        "http://eunoia-bshop.ir:8000/api/v1/shops/comment/list/" + route.params;
      // console.log(url);
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setComments(result);
          console.log("this is fethc res", result);
          if (result.length == 0)
            noComment =
              "هنوز هیچ نظری ثبت نشده است. اولین نفری باشید که نظر می دهید!";
          console.log("zero comment is", noComment);
        })
        .catch((error) => {
          // setError(error.message);
          console.log("error", error);
        });
    };
    getComments();
  }, [isFocused]);
  console.log("this is comments state", comments);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboard}>
        {/* {noComment && <Text>{noComment}</Text>} */}
        {/* {comments.length != 0 && ( */}
        <FlatList
          style={styles.list}
          //   extraData={this.state}
          data={comments}
          keyExtractor={(item) => {
            return item.id.toString();
          }}
          renderItem={(itemData) => {
            // console.log(itemData);
            // console.log(itemData.text);
            return (
              <OneComment
                avatar={itemData.item.user.urls}
                name={itemData.item.user.user_name}
                content={itemData.item.text}
                date={itemData.item.date_jalali}
              ></OneComment>
            );
          }}
        />
        {/* )} */}

        {/* <View style={styles.row}>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={this.handlePress}>
                <Image
                  style={styles.icon}
                  source={{
                    uri:
                      "https://img.icons8.com/color/70/000000/facebook-like.png",
                  }}
                />
              </TouchableOpacity>
              <Text style={styles.iconFonts}>44</Text>
            </View>
          </View> */}
        <View style={styles.input}>
          {/* <TextInput
            style={{ flex: 1 }}
            value={this.state.msg}
            placeholderTextColor="black"
            onChangeText={(msg) => this.setState({ msg })}
            blurOnSubmit={false}
            onSubmitEditing={() => this.send()}
            placeholder="محل درج نظرات"
            returnKeyType="ارسال"
          /> */}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Comment;
const { width, height } = Dimensions.get("window");
// export default class ShopDetail extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       msg: "",
//       messages: [
//         {
//           id: 1,
//           sent: true,
//           msg: "سلام محصولات فروشگاه و کیفیت آنها بسیار عالی است.",
//           image: "https://www.bootdey.com/img/Content/avatar/avatar1.png",
//         },
//         // {
//         //   id: 2,
//         //   sent: true,
//         //   msg: "sit amet, consectetuer",
//         //   image: "https://www.bootdey.com/img/Content/avatar/avatar1.png",
//         // },
//         // {
//         //   id: 3,
//         //   sent: false,
//         //   msg: "adipiscing elit. Aenean ",
//         //   image: "https://www.bootdey.com/img/Content/avatar/avatar6.png",
//         // },
//         // {
//         //   id: 4,
//         //   sent: true,
//         //   msg: "commodo ligula eget dolor.",
//         //   image: "https://www.bootdey.com/img/Content/avatar/avatar1.png",
//         // },
//         // {
//         //   id: 5,
//         //   sent: false,
//         //   msg:
//         //     "Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes",
//         //   image: "https://www.bootdey.com/img/Content/avatar/avatar6.png",
//         // },
//         // {
//         //   id: 6,
//         //   sent: true,
//         //   msg:
//         //     "nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo",
//         //   image: "https://www.bootdey.com/img/Content/avatar/avatar1.png",
//         // },
//         // {
//         //   id: 7,
//         //   sent: false,
//         //   msg: "rhoncus ut, imperdiet",
//         //   image: "https://www.bootdey.com/img/Content/avatar/avatar6.png",
//         // },
//         // {
//         //   id: 8,
//         //   sent: false,
//         //   msg: "a, venenatis vitae",
//         //   image: "https://www.bootdey.com/img/Content/avatar/avatar6.png",
//         // },
//       ],
//     };
//     this.send = this.send.bind(this);
//     this.reply = this.reply.bind(this);
//     this.renderItem = this._renderItem.bind(this);
//   }

//   reply() {
//     var messages = this.state.messages;
//     messages.push({
//       id: Math.floor(Math.random() * 99999999999999999 + 1),
//       sent: false,
//       msg: this.state.msg,
//       image: "https://www.bootdey.com/img/Content/avatar/avatar6.png",
//     });
//     this.setState({ msg: "", messages: messages });
//   }

//   send() {
//     if (this.state.msg.length > 0) {
//       var messages = this.state.messages;
//       messages.push({
//         id: Math.floor(Math.random() * 99999999999999999 + 1),
//         sent: true,
//         msg: this.state.msg,
//         image: "https://www.bootdey.com/img/Content/avatar/avatar1.png",
//       });
//       this.setState({ messages: messages });
//       setTimeout(() => {
//         this.reply();
//       }, 2000);
//     }
//   }

//   _renderItem = ({ item }) => {
//     if (item.sent === false) {
//       return (
//         <View style={styles.eachMsg}>
//           <Image source={{ uri: item.image }} style={styles.userPic} />
//           <View style={styles.msgBlock}>
//             <Text style={styles.msgTxt}>{item.msg}</Text>
//           </View>
//         </View>
//       );
//     } else {
//       return (
//         <View style={styles.rightMsg}>
//           <View style={styles.rightBlock}>
//             <Text style={styles.rightTxt}>{item.msg}</Text>
//           </View>
//           <Image source={{ uri: item.image }} style={styles.userPic} />
//         </View>
//       );
//     }
//   };

//   render() {
//     return (
//       <View style={{ flex: 1 }}>
//         <KeyboardAvoidingView behavior="padding" style={styles.keyboard}>
//           <FlatList
//             style={styles.list}
//             extraData={this.state}
//             data={this.state.messages}
//             keyExtractor={(item) => {
//               return item.id;
//             }}
//             renderItem={this.renderItem}
//           />
//           {/* <View style={styles.row}>
//             <View style={styles.iconContainer}>
//               <TouchableOpacity onPress={this.handlePress}>
//                 <Image
//                   style={styles.icon}
//                   source={{
//                     uri:
//                       "https://img.icons8.com/color/70/000000/facebook-like.png",
//                   }}
//                 />
//               </TouchableOpacity>
//               <Text style={styles.iconFonts}>44</Text>
//             </View>
//           </View> */}
//           <View style={styles.input}>
//             <TextInput
//               style={{ flex: 1 }}
//               value={this.state.msg}
//               placeholderTextColor="black"
//               onChangeText={(msg) => this.setState({ msg })}
//               blurOnSubmit={false}
//               onSubmitEditing={() => this.send()}
//               placeholder="محل درج نظرات"
//               returnKeyType="ارسال"
//             />
//           </View>
//         </KeyboardAvoidingView>
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  avatarContainer: {
    alignItems: "center",
    marginLeft: 5,
    paddingTop: 10,
    width: 40,
  },
  contentContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#EEE",
    padding: 5,
  },
  avatar: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 13,
    width: 26,
    height: 26,
  },
  text: {
    color: "#000",
    // fontFamily: "Avenir",
    fontSize: 15,
  },
  name: {
    fontWeight: "bold",
  },
  created: {
    color: "#BBB",
  },
  keyboard: {
    flex: 1,
    justifyContent: "center",
  },
  icon: {
    width: 30,
    height: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 40,
    marginTop: 30,
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
  },
  iconFonts: {
    color: "#b31414",
  },
  image: {
    width,
    height,
  },
  header: {
    height: 65,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#075e54",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  right: {
    flexDirection: "row",
  },
  chatTitle: {
    color: "#fff",
    fontWeight: "600",
    margin: 10,
    fontSize: 20,
  },
  chatImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
  },
  input: {
    flexDirection: "row",
    alignSelf: "flex-end",
    padding: 10,
    height: 40,
    width: width - 20,
    backgroundColor: "#fff",
    margin: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    borderColor: "#696969",
    borderWidth: 0.5,
    borderRadius: 10,
  },
  eachMsg: {
    flexDirection: "row",
    alignItems: "flex-end",
    margin: 5,
  },
  rightMsg: {
    flexDirection: "row",
    alignItems: "flex-end",
    margin: 5,
    alignSelf: "flex-end",
  },
  userPic: {
    height: 40,
    width: 40,
    margin: 5,
    borderRadius: 20,
    backgroundColor: "#f8f8f8",
  },
  msgBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    padding: 10,
    shadowColor: "#3d3d3d",
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  rightBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: "#b31414",
    padding: 10,
    shadowColor: "#3d3d3d",
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  msgTxt: {
    fontSize: 20,
    color: "#555",
    fontWeight: "600",
    color: "#b31414",
  },
  rightTxt: {
    fontSize: 15,
    color: "white",
    fontWeight: "700",
  },
});
