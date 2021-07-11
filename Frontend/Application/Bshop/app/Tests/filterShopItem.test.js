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

import FilterShopItem from "../filterShopItem";
// jest.mock("@react-navigation/native", () => {
//   return {
//     useIsFocused: () => true,
//   };
// });

describe("testing shop items filter", () => {
  it("renders correctly", () => {
    const push = jest.fn();

    var params = {
      filterType: "category",
      shopID: 1,
      category: "Nuts",
    };
    const tree = renderer.create(
      <filterShopItem navigation={{ push }} route={{ params }} />
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

  it("filter shopitem category test", async () => {
    const push = jest.fn();
    var params = {
      filterType: "category",
      shopID: 1,
      category: "Washing and Cleaning Equipment",
    };

    const fetchMock = require("fetch-mock-jest");
    var url =
      "http://eunoia-bshop.ir:8000/items/category/" +
      params.shopID +
      "?q=Washing and Cleaning Equipment";
    // console.log("url test", url);
    fetchMock.get(url, items);

    const { getByTestId, queryByTestId } = await render(
      <FilterShopItem navigation={{ push }} route={{ params }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetchMock).toHaveFetched(
      "http://eunoia-bshop.ir:8000/items/category/1?q=Washing and Cleaning Equipment",
      "get"
    );

    expect(getByTestId("items-list").props.data.length).toBe(items.length);

    for (var i = 0; i < items.length; i++) {
      //check item name
      expect(getByTestId("item-name-" + i).props.children).toBe(items[i].name);

      //check item shop name
      expect(getByTestId("item-shopname-" + i).props.children).toBe(
        items[i].ItemShop.title
      );

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

  it("filter shopitem test without category", async () => {
    const push = jest.fn();
    var params = {
      filterType: "new",
      shopID: 1,
      category: "all",
    };

    const fetchMock = require("fetch-mock-jest");
    var url =
      "http://eunoia-bshop.ir:8000/items/" +
      params.filterType +
      "/" +
      params.shopID;
    // console.log("url test", url);
    fetchMock.get(url, items);

    const { getByTestId, queryByTestId } = await render(
      <FilterShopItem navigation={{ push }} route={{ params }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetchMock).toHaveFetched(
      "http://eunoia-bshop.ir:8000/items/new/1",
      "get"
    );

    expect(getByTestId("items-list").props.data.length).toBe(items.length);

    for (var i = 0; i < items.length; i++) {
      //check item name
      expect(getByTestId("item-name-" + i).props.children).toBe(items[i].name);

      //check item shop name
      expect(getByTestId("item-shopname-" + i).props.children).toBe(
        items[i].ItemShop.title
      );

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

  it("filter shopitem test with category", async () => {
    const push = jest.fn();
    var params = {
      filterType: "new",
      shopID: 1,
      category: "Sweets and desserts",
    };

    const fetchMock = require("fetch-mock-jest");
    var url =
      "http://eunoia-bshop.ir:8000/items/category/" +
      params.filterType +
      "/" +
      params.shopID +
      "?q=" +
      params.category;
    // console.log("url test", url);
    fetchMock.get(url, items);

    const { getByTestId, queryByTestId } = await render(
      <FilterShopItem navigation={{ push }} route={{ params }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetchMock).toHaveFetched(
      "http://eunoia-bshop.ir:8000/items/category/new/1?q=Sweets and desserts",
      "get"
    );

    expect(getByTestId("items-list").props.data.length).toBe(items.length);

    for (var i = 0; i < items.length; i++) {
      //check item name
      expect(getByTestId("item-name-" + i).props.children).toBe(items[i].name);

      //check item shop name
      expect(getByTestId("item-shopname-" + i).props.children).toBe(
        items[i].ItemShop.title
      );

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
