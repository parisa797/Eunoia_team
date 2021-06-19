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

export default FilterPage = ({ navigation }) => {
  const [shopFilter, setShopFilter] = useState("score"); //shop filter type
  const [region, setRegion] = useState();
  const [category, setCategory] = useState("all");
  const [itemFilter, setItemFilter] = useState("expensive");

  const isFocused = useIsFocused();

  //convert persian numbers to english
  const p2e = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.container}>
      <View style={styles.rows}>
        {/* {/ <View style={styles.rows2}> /} */}
        <View style={styles.selector}>
          <Text style={styles.filterText1}>فیلتر فروشگاه بر اساس </Text>
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
        </View>
        <TouchableOpacity
          style={styles.Btn}
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
        {/* {/ </View> /} */}

        {shopFilter == "region" && (
          <TextInput
            value={region}
            onChangeText={(r) => setRegion(r)}
            style={styles.TextInput}
            placeholder="منطقه را وارد کنید"
            placeholderTextColor="#000"
          />
        )}

        {/* {/ <View style={styles.rows2}> /} */}
        <View style={styles.selector}>
          <Text style={styles.filterText}>فیلتر آیتم بر اساس </Text>
          <View style={styles.container2}>
            {itemFilter != "category" && (
              <Picker
                selectedValue={category}
                style={{ height: 50, width: 150, color: "white" }}
                onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
              >
                {/* {/ {itemFilter != "category" && ( /}
<Picker.Item label="همه" value="all" />
{/ )} /} */}
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
          <View style={styles.container2}>
            <Picker
              selectedValue={itemFilter}
              style={{ height: 50, width: 150, color: "white" }}
              onValueChange={(itemValue, itemIndex) => setItemFilter(itemValue)}
            >
              <Picker.Item label="گران ترین" value="expensive" />
              <Picker.Item label="ارزان ترین" value="cheap" />
              <Picker.Item label="جدیدترین" value="new" />
              <Picker.Item label="دسته بندی" value="category" />
              <Picker.Item label="تخفیف دار" value="discount" />
            </Picker>
          </View>
        </View>
        <TouchableOpacity
          style={styles.Btn}
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
        {/* {/ </View> /} */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // switchh: {
  // width: "100%",
  // },
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    marginLeft: -50,
  },
  loginText: {
    alignItems: "center",
    fontSize: 18,
  },
  filterText: {
    paddingTop: -30,
    alignItems: "center",
    marginLeft: 30,
  },
  selector: {
    paddingTop: 140,
    alignItems: "center",
    color: "black",
  },
  filterText1: {
    color: "black",
    fontSize: 20,
    marginTop: 200,
  },
  filterText: {
    color: "black",
    fontSize: 20,
    marginTop: 200,
  },
  container2: {
    marginTop: -80,
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
    marginTop: -100,
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
    marginTop: 0,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    backgroundColor: "#b31414",
    height: 570,
    width: 370,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 25,
  },

  rowstext: {
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
    width: "96%",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 68,
    marginBottom: 20,
    backgroundColor: "white",
    marginLeft: 6,
  },
});
