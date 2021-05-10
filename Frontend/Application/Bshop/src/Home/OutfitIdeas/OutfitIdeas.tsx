import { sub } from "react-native-reanimated";
import { useTiming } from "react-native-redash";
import { Box, Header } from "../../components";
import { HomeNavigationProps } from "../../components/Navigation";
import Background from "./Background";
import Categories from "./Categories";
import { StatusBar } from "expo-status-bar";
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
// import ShopDetail from "./shopDetails";
// const ShopHandler = (title, address, manager, online) => {
//   props.navigation.navigate("ShopDetail", {
//     // productId: id,
//     title: title,
//     address: address,
//     manager: manager,
//     online: online,
//   });
// };

const OutfitIdeas = ({ navigation }: HomeNavigationProps<"OutfitIdeas">) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedIndex = useTiming(currentIndex);
  const [shops, setShops] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadProducts = useEffect(() => {
    setError(null);
    setIsRefreshing(true);

    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://iust-bshop.herokuapp.com/api/v1/shops/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // setShops([]);
        setShops(result);
        console.log(result);
      })
      .catch((error) => {
        setError(error.message);
        console.log("error", error);
      });
    setIsRefreshing(false);
  }, [setIsLoading, setError]);
  return (
    <Box flex={1} backgroundColor="background">
      <Header
        title="خوش آمدید"
        left={{ icon: "menu", onPress: () => navigation.openDrawer() }}
        right={{ icon: "shopping-bag", onPress: () => true }}
      />
      <Categories />
      <ScrollView nestedScrollEnabled={true} style={styles.container}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="جستجو"
            placeholderTextColor="#000"
          />
        </View>

        <FlatList
          nestedScrollEnabled={true}
          onRefresh={loadProducts}
          refreshing={isRefreshing}
          data={shops}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(itemData) => (
            <Shop
              title={itemData.item.title}
              address={itemData.item.address}
              image={itemData.item.logo}
              rate_value={itemData.item.rate_value}
              online={itemData.item.online}
              onSelect={() => {
                navigation.navigate("ShopDetail", itemData.item);
              }}
            ></Shop>
          )}
        />
      </ScrollView>
    </Box>
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

export default OutfitIdeas;
