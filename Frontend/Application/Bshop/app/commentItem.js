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
  ToastAndroid,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useIsFocused } from "@react-navigation/native";

const OneComment = (props) => {
  var date = props.date.slice(0, 16);
  // console.log(date);

  var user_photo =
    props.avatar.length == 0 ? null : props.avatar[0].uploaded_file;
  // console.log("photo:", user_photo);

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

const CommentItem = ({ route, navigation }) => {
  // console.log("this is route", route.params);
  const [comments, setComments] = useState();
  const [newComment, setNew] = useState();
  var noComment = undefined;
  const isFocused = useIsFocused();

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

  useEffect(() => {
    getComments();
  }, [isFocused]);
  // console.log("this is comments state", comments);

  async function postComment() {
    // console.log("in post comment method");
    if (!newComment) {
      ToastAndroid.show("لطفا ابتدا نظر خود را وارد کنید", ToastAndroid.SHORT);
      return;
    }
    var myHeaders = new Headers();
    let t = await SecureStore.getItemAsync("token");
    var authorization = "Token " + t;
    myHeaders.append("Authorization", authorization);

    var formdata = new FormData();
    formdata.append("text", newComment);
    formdata.append("shop", route.params);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    };

    fetch(
      "http://eunoia-bshop.ir:8000/api/v1/shops/comment/create/",
      requestOptions
    )
      .then((response) => {
        console.log("info status is,", response.status);
        return response.json();
      })
      .then((result) => {
        console.log("result of info", result);
        setNew();
        getComments();
      })
      .catch((error) => console.log("posting a new comment error", error));
  }

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

        <View style={styles.container2}>
          {/* Comment input field */}
          <TextInput
            placeholder="Add a comment..."
            keyboardType="twitter" // keyboard with no return button
            autoFocus={true} // focus and show the keyboard
            style={styles.input2}
            value={newComment}
            onChangeText={(newComment) => setNew(newComment)} // handle input changes
            // onSubmitEditing={() => postComment()} // handle submit event
          />
          {/* Post button */}
          <TouchableOpacity
            style={styles.button2}
            onPress={() => postComment()}
          >
            {/* Apply inactive style if no input */}
            <Text style={[styles.text2, !newComment ? styles.inactive2 : []]}>
              ارسال
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Comment;
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container2: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#EEE",
    alignItems: "center",
    paddingLeft: 15,
  },
  input2: {
    flex: 1,
    height: 40,
    fontSize: 15,
  },
  button2: {
    height: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inactive2: {
    color: "#CCC",
  },
  text2: {
    color: "#3F51B5",
    fontWeight: "bold",
    // fontFamily: "Avenir",
    textAlign: "center",
    fontSize: 15,
  },
  container: {
    flexDirection: "row",
  },
  avatarContainer: {
    alignItems: "center",
    marginLeft: 5,
    paddingTop: 10,
    width: 50,
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
    width: 38,
    height: 35,
    // borderRadius: 50,
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
});
