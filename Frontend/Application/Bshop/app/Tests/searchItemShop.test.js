import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  act,
} from "react-native-testing-library";
import renderer from "react-test-renderer";
import { useIsFocused } from "@react-navigation/native";

import SearchItemShop from "../serchItemShop";
// jest.mock("@react-navigation/native", () => {
//   return {
//     useIsFocused: () => true,
//   };
// });

describe("testing shopitems search", () => {
  it("renders correctly", () => {
    const push = jest.fn();

    var params = {
      shopID: 10,
      searchString: "چیپس",
    };
    const tree = renderer.create(
      <SearchItemShop navigation={{ push }} route={{ params }} />
    );
    expect(tree).toMatchSnapshot();
  });
  const items = [
    {
      name: "ماست",
      photo: "mihan-yog",
      price: 200,
      discount: 0,
      ItemShop: {
        title: "فروشگاه سر کوچه",
      },
      rate_value: 2,
      id: 0,
    },
    {
      name: "چیپس خوشمزه",
      photo: null,
      price: 100,
      discount: 10,
      ItemShop: {
        title: "هایپراستار",
      },
      rate_value: 3,
      id: 1,
    },
    {
      name: "عطر نوید محمدزاده",
      photo: "http://eunoia-bshop.ir:8000/eu-de-perfume",
      price: 20000,
      discount: 0,
      ItemShop: {
        title: "خونه نوید",
      },
      rate_value: 2,
      id: 0,
      id: 2,
    },
  ];

  it("search items test", async () => {
    const push = jest.fn();
    var params = {
      shopID: 12,
      searchString: "پاستی",
    };

    const fetchMock = require("fetch-mock-jest");
    var url =
      "http://eunoia-bshop.ir:8000/shops/" +
      params.shopID +
      "/items/search/?q=" +
      params.searchString;
    fetchMock.get(url, items);

    const { getByTestId, queryByTestId } = await render(
      <SearchItemShop navigation={{ push }} route={{ params }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetchMock).toHaveFetched(
      "http://eunoia-bshop.ir:8000/shops/12/items/search/?q=پاستی",
      "get"
    );

    expect(getByTestId("items-list").props.data.length).toBe(items.length);

    for (var i = 0; i < items.length; i++) {
      //check item name
      expect(getByTestId("item-name-" + i).props.children).toBe(items[i].name);

      //check item price
      // if item has some discount
      if (items[i].discount != 0) {
        // console.log("disc wasn't zero");
        var price = ["قیمت:", items[i].price];
        var newPrice = [
          "قیمت با تخفیف: ",
          // (
          ((100 - items[i].discount) * items[i].price) / 100,
          // ).toString(),
        ];
        expect(queryByTestId("item-price1-" + i)).toBeNull();
        expect(queryByTestId("item-price0-" + i).props.children).toStrictEqual(
          price
        );
        expect(
          queryByTestId("item-discounted-" + i).props.children
        ).toStrictEqual(newPrice);
      }
      //item has no discount
      else {
        var price = ["قیمت:", items[i].price];

        expect(queryByTestId("item-price0-" + i)).toBeNull();
        expect(queryByTestId("item-price1-" + i).props.children).toStrictEqual(
          price
        );
        expect(queryByTestId("item-discounted-" + i)).toBeNull();
      }

      // if item has image, show its own image
      if (items[i].photo) {
        var ph = items[i].photo.includes("http://eunoia-bshop.ir:8000")
          ? items[i].photo
          : "http://eunoia-bshop.ir:8000" + items[i].photo;
        expect(queryByTestId("item-image-" + i).props.source.uri).toBe(ph);
        expect(queryByTestId("item-noimage-" + i)).toBeNull();
      }
      // else show default image
      else {
        expect(queryByTestId("item-noimage-" + i)).not.toBeNull();
        expect(queryByTestId("item-image-" + i)).toBeNull();
      }
    }

    fetchMock.mockClear();
  });
});
