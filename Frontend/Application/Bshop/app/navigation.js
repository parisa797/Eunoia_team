import * as React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as SecureStore from "expo-secure-store";

import Home from "./homepage";
import ShopDetail from "./shopDetails";
import ItemDetail from "./ItemDetail";
import PersonalInfo from "./PersonalInfo";
import FavoriteItems from "./Favorite";
import FavoriteShops from "./FavoriteShops";
import Comment from "./comment";
import ItemComment from "./itemComment";
import SearchResult from "./search";
import SearchItemShop from "./serchItemShop";
import FilterResult from "./filter";
import FilterShopItem from "./filterShopItem";
import Scan from "./qrScan";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

//Structure for the navigatin Drawer
const NavigationDrawerStructure = (props) => {
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.openDrawer();
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity onPress={toggleDrawer}>
        {/*Donute Button Image */}
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png",
          }}
          style={{ width: 25, height: 25, marginLeft: 15 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const AppStack = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: " ", //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: "#780909", //Set Header color
          },
          headerTintColor: "#fff", //Set Header text color
          // headerTitleStyle: {
          //   fontWeight: "bold", //Set Header text style
          // },
        }}
      />
      <Stack.Screen
        name="ShopDetail"
        component={ShopDetail}
        options={{ title: "اطلاعات فروشگاه" }}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetail}
        options={{ title: "اطلاعات محصول" }}
      />
      <Stack.Screen
        name="Comment"
        component={Comment}
        options={{ title: "نظرات" }}
      />
      <Stack.Screen
        name="ItemComment"
        component={ItemComment}
        options={{ title: "نظرات" }}
      />
      <Stack.Screen
        name="SearchResult"
        component={SearchResult}
        options={{ title: "نتایج جستجو" }}
      />
      <Stack.Screen
        name="SearchShopItems"
        component={SearchItemShop}
        options={{ title: "نتایج جستجو" }}
      />
      <Stack.Screen
        name="Filter"
        component={FilterResult}
        options={{ title: "نتایج فیلتر" }}
      />
      <Stack.Screen
        name="FilterShopItem"
        component={FilterShopItem}
        options={{ title: "نتایج فیلتر" }}
      />
    </Stack.Navigator>
  );
};

const Profile = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="profile"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: "#780909", //Set Header color
        },
        headerTintColor: "#fff", //Set Header text color
        headerTitleStyle: {
          fontWeight: "bold", //Set Header text style
        },
      }}
    >
      <Stack.Screen
        name="پروفایل کاربر"
        component={PersonalInfo}
        options={{
          title: " ", //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const Favoritelist = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="favorite"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: "#780909", //Set Header color
        },
        headerTintColor: "#fff", //Set Header text color
        headerTitleStyle: {
          fontWeight: "bold", //Set Header text style
        },
      }}
    >
      <Stack.Screen
        name="کالا های موردعلاقه"
        component={FavoriteItems}
        options={{
          title: " ", //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const FavoriteShopsPage = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="favoriteShops"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: "#780909", //Set Header color
        },
        headerTintColor: "#fff", //Set Header text color
        headerTitleStyle: {
          fontWeight: "bold", //Set Header text style
        },
      }}
    >
      <Stack.Screen
        name="فروشگاه های موردعلاقه"
        component={FavoriteShops}
        options={{
          title: " ", //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const QR = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="scan"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: "#780909", //Set Header color
        },
        headerTintColor: "#fff", //Set Header text color
        headerTitleStyle: {
          fontWeight: "bold", //Set Header text style
        },
      }}
    >
      <Stack.Screen
        name="اسکنر بارکد"
        component={Scan}
        options={{
          title: " ", //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

export const Sidebar = () => {
  return (
    // <Drawer.Navigator drawerPosition="right">
    <Drawer.Navigator>
      <Drawer.Screen
        name="homepage"
        options={{
          drawerLabel: "صفحه اصلی",
          activeTintColor: "#e91e63",
        }}
        component={AppStack}
      />
      <Drawer.Screen
        name="profilepage"
        options={{
          drawerLabel: "پروفایل",
          activeTintColor: "#e91e63",
        }}
        component={Profile}
      />
      <Drawer.Screen
        name="favorite"
        options={{
          drawerLabel: "کالا های موردعلاقه",
          activeTintColor: "#e91e63",
        }}
        component={Favoritelist}
      />
      <Drawer.Screen
        name="favoriteShopspage"
        options={{
          drawerLabel: "فروشگاه های موردعلاقه",
          activeTintColor: "#e91e63",
        }}
        component={FavoriteShopsPage}
      />
      <Drawer.Screen
        name="qrscanner"
        options={{
          drawerLabel: "اسکنر بارکد",
          activeTintColor: "#e91e63",
        }}
        component={QR}
      />
    </Drawer.Navigator>
  );
};

// export const Router = () => {
//   //More explanations about "authData" below
//   return (
//     <NavigationContainer>
//       {authData ? <AppStack /> : <AuthStack />}
//     </NavigationContainer>
//   );
// };
