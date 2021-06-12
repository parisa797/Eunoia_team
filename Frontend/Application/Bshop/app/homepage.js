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
  // Picker,
} from "react-native";
import Shop from "./shop";
import { useIsFocused } from "@react-navigation/native";
import ToggleSwitch from "rn-toggle-switch";

export default Home = ({ navigation }) => {
  const [shops, setShops] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState();
  const [searchType, setSearchType] = useState(true);
  // const [selectedValue, setSelectedValue] = useState("java");
  const isFocused = useIsFocused();

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
        // console.log("homepage resu:", result);
      })
      .catch((error) => {
        // setError(error.message);
        console.log("error", error);
      });
    // setIsRefreshing(false);
    // }, [setIsLoading, setError]);
  }, [isFocused]);

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.container}>
      <View style={styles.rows}>
        <ToggleSwitch
          text={{
            on: "فروشگاه",
            off: "آیتم",
            activeTextColor: "#780909",
            inactiveTextColor: "#780909",
          }}
          textStyle={{ fontWeight: "bold" }}
          color={{
            indicator: "#780909",
            active: "white",
            inactive: "white",
            activeBorder: "#780909",
            inactiveBorder: "#780909",
          }}
          active={true}
          disabled={false}
          width={80}
          radius={25}
          onValueChange={(val) => {
            // console.log("actual", val);
            setSearchType(val);
            // console.log("state type", searchType);
          }}
        />
        {/* <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => {
          console.log("actual", itemValue);
          setSelectedValue(itemValue);
          console.log("state:", selectedValue);
        }}
      >
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker> */}

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
            var x = { searchString: search, searchType };
            setSearch(undefined);
            navigation.navigate("SearchResult", x);
          }}
        >
          <Text style={styles.loginText}>بگرد</Text>
        </TouchableOpacity>
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
            phone={itemData.item.phone}
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
  // switchh: {
  //   width: "100%",
  // },
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
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "76%",
    height: 50,
    marginTop: "1%",
    marginBottom: "5%",
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center",
    marginLeft: 80,
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
    height: 130,
    width: 370,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 25,
  },
  rowstext: {
    color: "white",
    fontSize: 20,
    marginTop: 5,
    textAlign: "center",
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
  Btn: {
    width: "20%",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -68,
    marginBottom: 20,
    backgroundColor: "white",
    marginLeft: 6,
  },
});
