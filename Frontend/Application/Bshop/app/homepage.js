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
  Picker,
  SafeAreaView,
  SafeAreaProvider,
  FlatList,
  ScrollView,
  ToastAndroid,
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
  const [shopFilter, setShopFilter] = useState("score"); //shop filter type
  const [region, setRegion] = useState();
  const [category, setCategory] = useState("all");
  const [itemFilter, setItemFilter] = useState("expensive");

  const isFocused = useIsFocused();
  // const [change, setchange] = useState(isFocused);
  console.log("focus home", isFocused);

  //convert persian numbers to english
  const p2e = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

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
        <View style={styles.choose}>
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
        </View>

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
          style={styles.Find}
          onPress={() => {
            var x = { searchString: search, searchType };
            setSearch(undefined);
            navigation.navigate("SearchResult", x);
          }}
        >
          <Text style={styles.loginText}>بگرد</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.rows2}> */}
      <View style={styles.rows}>
        <View style={styles.selector}>
          <Text style={styles.filterText}>فیلتر فروشگاه بر اساس </Text>
          <View style={styles.container2}>
            <Picker
              selectedValue={shopFilter}
              style={{ height: 50, width: 150, color: "white" }}
              onValueChange={(itemValue, itemIndex) =>
                // setSelectedValue(itemValue)
                setShopFilter(itemValue)
              }
            >
              <Picker.Item label="امتیاز" value="score" />
              <Picker.Item label="منطقه" value="region" />
            </Picker>
          </View>
          <TouchableOpacity
            style={styles.filter}
            onPress={() => {
              var e = region ? p2e(region) : 0;
              console.log("english number:", e);
              if (
                shopFilter == "region" &&
                !(parseInt(e) < 23 && parseInt(e) > 0)
              ) {
                ToastAndroid.show(
                  "منطقه وارد شده نامعتبر است. لطفا عددی بین 1 تا 22 وارد نمایید.",
                  ToastAndroid.SHORT
                );
              } else {
                var x = {
                  filterType: shopFilter,
                  shop_item: "shop",
                  region: !region ? region : p2e(region),
                };
                setRegion(undefined);
                navigation.navigate("Filter", x);
              }
            }}
          >
            <Text style={styles.loginText}>فیلتر</Text>
          </TouchableOpacity>
          {/* </View> */}

          {shopFilter == "region" && (
            <TextInput
              value={region}
              onChangeText={(r) => setRegion(r)}
              style={styles.TextInput}
              placeholder="منطقه را وارد کنید"
              placeholderTextColor="#000"
            />
          )}
        </View>
      </View>
      <View style={styles.rows}>
        <View style={styles.selector}>
          <Text style={styles.filterText}>فیلتر آیتم بر اساس </Text>
          <View style={styles.container2}>
            {itemFilter != "category" && (
              <Picker
                selectedValue={category}
                style={{ height: 50, width: 150, color: "white" }}
                onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
              >
                {/* {itemFilter != "category" && ( */}
                <Picker.Item label="همه" value="all" />
                {/* )} */}
                <Picker.Item
                  label="ادویه، چاشنی و مخلفات غذا"
                  value="Spices and condiments and food side dishes"
                />
                <Picker.Item label="بهداشت و مراقبت پوست" value="Cosmetics" />
                <Picker.Item
                  label="آرایش و پیرایش"
                  value="Makeup and trimming"
                />
                <Picker.Item label="پروتئینی" value="Protein" />
                <Picker.Item label="تنقلات" value="Junk Food" />
                <Picker.Item label="خشکبار" value="Nuts" />
                <Picker.Item
                  label="شیرینیجات و دسرها"
                  value="Sweets and desserts"
                />
                <Picker.Item label="عطر، ادکلن و اسپری" value="perfume" />
                <Picker.Item
                  label="غذا، کنسرو و سبزیجات"
                  value="Fruits and vegetables"
                />
                <Picker.Item label="لبنیات" value="Dairy" />
                <Picker.Item label="نوشیدنیها" value="Drinks" />
                <Picker.Item
                  label="وسایل شستشو و نظافت"
                  value="Washing and Cleaning Equipment"
                />
                <Picker.Item label="متفرقه" value="others" />
              </Picker>
            )}

            {itemFilter == "category" && (
              <Picker
                selectedValue={category}
                style={{ height: 50, width: 150, color: "white" }}
                onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
              >
                <Picker.Item
                  label="ادویه، چاشنی و مخلفات غذا"
                  value="Spices and condiments and food side dishes"
                />
                <Picker.Item label="بهداشت و مراقبت پوست" value="Cosmetics" />
                <Picker.Item
                  label="آرایش و پیرایش"
                  value="Makeup and trimming"
                />
                <Picker.Item label="پروتئینی" value="Protein" />
                <Picker.Item label="تنقلات" value="Junk Food" />
                <Picker.Item label="خشکبار" value="Nuts" />
                <Picker.Item
                  label="شیرینیجات و دسرها"
                  value="Sweets and desserts"
                />
                <Picker.Item label="عطر، ادکلن و اسپری" value="perfume" />
                <Picker.Item
                  label="غذا، کنسرو و سبزیجات"
                  value="Fruits and vegetables"
                />
                <Picker.Item label="لبنیات" value="Dairy" />
                <Picker.Item label="نوشیدنیها" value="Drinks" />
                <Picker.Item
                  label="وسایل شستشو و نظافت"
                  value="Washing and Cleaning Equipment"
                />
                <Picker.Item label="متفرقه" value="others" />
              </Picker>
            )}
          </View>
          <View style={styles.container1}>
            <Picker
              selectedValue={itemFilter}
              style={{ height: 50, width: 150, color: "white" }}
              onValueChange={(itemValue, itemIndex) => setItemFilter(itemValue)}
            >
              <Picker.Item label="گران ترین" value="expensive" />
              <Picker.Item label="ارزان ترین" value="cheap" />
              <Picker.Item label="جدیدترین" value="new" />
              <Picker.Item label="دسته بندی" value="category" />
              <Picker.Item label="تخفیف" value="discount" />
            </Picker>
          </View>
        </View>
        <TouchableOpacity
          style={styles.filter}
          onPress={() => {
            var x = {
              filterType: itemFilter,
              shop_item: "item",
              category,
            };
            navigation.navigate("Filter", x);
          }}
        >
          <Text style={styles.loginText}>فیلتر</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        testID={"shops-list"}
        // nestedScrollEnabled={true}
        // onRefresh={loadProducts}
        // refreshing={isRefreshing}
        data={shops}
        keyExtractor={(item) => item.id.toString()}
        // extraData={isFocused}
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
    paddingTop: 40,
    alignItems: "center",
    marginLeft: -50,
  },
  filterText: {
    paddingTop: 40,
    alignItems: "center",
    marginLeft: 30,
    color: "white",
  },
  container2: {
    // flex: 1,
    marginTop: -30,
    alignItems: "center",
    marginLeft: -40,
    color: "white",
  },
  container1: {
    // flex: 1,
    marginTop: -10,
    alignItems: "center",
    marginLeft: -40,
    color: "white",
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
  choose: {
    marginLeft: 220,
  },
  selector: {
    marginLeft: 10,
    marginTop: -30,
    color: "white",
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
    height: "5%",
    width: 370,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 25,
  },
  rows2: {
    borderRadius: 10,
    marginTop: 5,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    backgroundColor: "#b31414",
    height: 50,
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
    height: "30%",
    flex: 1,
    // padding: 10,
    // marginLeft: 20,
    fontSize: 20,
    fontSize: 15,
    // marginTop: -5,
  },
  title: {
    fontSize: 32,
  },
  loginText: {
    color: "black",
  },
  Find: {
    width: "20%",
    borderRadius: 10,
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -70,
    marginBottom: 20,
    backgroundColor: "white",
    marginLeft: 6,
  },
  filter: {
    width: "20%",
    borderRadius: 10,
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -45,
    marginBottom: 20,
    backgroundColor: "white",
    marginLeft: 6,
  },
});
