// import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  SafeAreaProvider,
  FlatList,
  ScrollView,
} from "react-native";
import Shop from "./shop";

export default Home = ({ navigation }) => {
  const [shops, setShops] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadProducts = useEffect(() => {
    // setError(null);
    // setIsRefreshing(true);

    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://eunoia-bshop.ir:8000/api/v1/shops/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setShops(result);
        console.log(result);
      })
      .catch((error) => {
        // setError(error.message);
        console.log("error", error);
      });
    // setIsRefreshing(false);
    // }, [setIsLoading, setError]);
  }, []);
  return (
    <ScrollView nestedScrollEnabled={true} style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="جستجو"
          placeholderTextColor="#000"
        />
      </View>

      <FlatList
        testID={"shops-list"}
        nestedScrollEnabled={true}
        // onRefresh={loadProducts}
        // refreshing={isRefreshing}
        data={shops}
        keyExtractor={(item) => item.id.toString()}
        renderItem={(itemData) => (
          <Shop
            title={itemData.item.title}
            address={itemData.item.address}
            image={itemData.item.logo}
            rate_value={itemData.item.rate_value}
            online={itemData.item.online}
            index={itemData.item.id}
            onSelect={() => {
              navigation.navigate("ShopDetail", itemData.item);
            }}
          ></Shop>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    marginTop: "5%",
    // width: "50%",
    // height: "50%",
    marginBottom: "5%",
  },
  card: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
  inputView: {
    backgroundColor: "#f1f1f2",
    borderRadius: 10,
    width: "90%",
    height: 45,
    marginTop: "10%",
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
  title: {
    fontSize: 32,
  },
});
