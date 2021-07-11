import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useIsFocused } from "@react-navigation/native";
import LikedItem from "./likedItem";
// BarCodeScanner = require("expo-barcode-scanner");

const Scan = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [item, setItem] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
      setItem(null);
    })();
  }, [isFocused]);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    //fetch to get item detail
    var url = "http://eunoia-bshop.ir:8000/" + data;
    console.log("used this url", url);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setItem(result);
        console.log("qr fetch result", result);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  //   console.log("scanned", scanned);
  //   console.log("hasperm", hasPermission);
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan"} onPress={() => setScanned(false)} />
      )}

      {item && (
        <View style={styles.result}>
          <LikedItem
            name={item.name}
            image={item.photo}
            price={item.price}
            discount={item.discount}
            index={item.id}
            shop={item.ItemShop}
            onSelect={() => {
              navigation.navigate("ItemDetail", item);
            }}
          ></LikedItem>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: "2%",
  },
  result: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: "135%",
  },
});
export default Scan;
