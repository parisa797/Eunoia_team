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

import FilterResult from "../filter";
// jest.mock("@react-navigation/native", () => {
//   return {
//     useIsFocused: () => true,
//   };
// });

describe("testing homepage filter", () => {
  it("renders correctly", () => {
    const push = jest.fn();

    var params = {
      filterType: "category",
      shop_item: "item",
      category: "all",
    };
    const tree = renderer.create(
      <FilterResult navigation={{ push }} route={{ params }} />
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

  const shops = [
    {
      title: "رفاه",
      rate_value: 5,
      rate_count: 10,
      id: 0,
      address: "ادرس ادرس آدرسسسسس",
      logo: "sljfleij.png",
    },
    {
      title: "شهروند",
      rate_value: 4.23,
      id: 1,
      address: "",
      logo: "http://eunoia-bshop.ir:8000/shahr",
    },
    {
      title: "فروشگاه شاپ3",
      rate_value: 2.3,
      rate_count: 11,
      id: 2,
      address: "a",
      logo: null,
    },
    {
      title: "هایپر استار",
      rate_value: 1.2,
      id: 3,
      address: "addressssss sdfe",
      logo: null,
    },
  ];

  it("filter shop score test", async () => {
    const fetchMock = require("fetch-mock-jest");

    var url = "http://eunoia-bshop.ir:8000/api/v1/shops/top";
    fetchMock.get(url, shops);

    const push = jest.fn();
    var params = {
      filterType: "score",
      shop_item: "shop",
    };
    const { getByTestId, queryByTestId } = await render(
      <FilterResult navigation={{ push }} route={{ params }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetchMock).toHaveFetched(
      "http://eunoia-bshop.ir:8000/api/v1/shops/top",
      "get"
    );

    expect(getByTestId("shops-list").props.data.length).toBe(shops.length);
    expect(queryByTestId("items-list")).toBeNull();

    for (var i = 0; i < shops.length; i++) {
      const shop_add = "آدرس: " + shops[i].address;
      const shop_name = shops[i].title.includes("فروشگاه")
        ? shops[i].title
        : "فروشگاه " + shops[i].title;

      //check shop name
      expect(getByTestId("shop-name-" + i).props.children).toBe(shop_name);

      //check shop address
      expect(getByTestId("shop-add-" + i).props.children).toBe(shop_add);

      // if shop has image, show its own image
      if (shops[i].logo) {
        var ph = shops[i].logo.includes("http://eunoia-bshop.ir:8000")
          ? shops[i].logo
          : "http://eunoia-bshop.ir:8000" + shops[i].logo;
        expect(queryByTestId("shop-image-" + i).props.source.uri).toBe(ph);
        expect(queryByTestId("shop-noimage-" + i)).toBeNull();
      }
      // else show default image
      else {
        expect(queryByTestId("shop-noimage-" + i)).not.toBeNull();
        expect(queryByTestId("shop-image-" + i)).toBeNull();
      }
    }

    fetchMock.mockClear();
  });

  it("filter shop region test", async () => {
    const push = jest.fn();
    var params = {
      filterType: "region",
      shop_item: "shop",
      region: 12,
    };

    const fetchMock = require("fetch-mock-jest");
    var url =
      "http://eunoia-bshop.ir:8000/api/v1/shops/region/?q=" + params.region;
    fetchMock.get(url, shops);

    const { getByTestId, queryByTestId } = await render(
      <FilterResult navigation={{ push }} route={{ params }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetchMock).toHaveFetched(
      "http://eunoia-bshop.ir:8000/api/v1/shops/region/?q=12",
      "get"
    );

    expect(getByTestId("shops-list").props.data.length).toBe(shops.length);
    expect(queryByTestId("items-list")).toBeNull();

    for (var i = 0; i < shops.length; i++) {
      const shop_add = "آدرس: " + shops[i].address;
      const shop_name = shops[i].title.includes("فروشگاه")
        ? shops[i].title
        : "فروشگاه " + shops[i].title;

      //check shop name
      expect(getByTestId("shop-name-" + i).props.children).toBe(shop_name);

      //check shop address
      expect(getByTestId("shop-add-" + i).props.children).toBe(shop_add);

      // if shop has image, show its own image
      if (shops[i].logo) {
        var ph = shops[i].logo.includes("http://eunoia-bshop.ir:8000")
          ? shops[i].logo
          : "http://eunoia-bshop.ir:8000" + shops[i].logo;
        expect(queryByTestId("shop-image-" + i).props.source.uri).toBe(ph);
        expect(queryByTestId("shop-noimage-" + i)).toBeNull();
      }
      // else show default image
      else {
        expect(queryByTestId("shop-noimage-" + i)).not.toBeNull();
        expect(queryByTestId("shop-image-" + i)).toBeNull();
      }
    }

    fetchMock.mockClear();
  });

  it("filter item category test", async () => {
    const push = jest.fn();
    var params = {
      filterType: "category",
      shop_item: "item",
      category: "Protein",
    };

    const fetchMock = require("fetch-mock-jest");
    var url =
      "http://eunoia-bshop.ir:8000/items/category/?q=" + params.category;
    fetchMock.get(url, items);

    const { getByTestId, queryByTestId } = await render(
      <FilterResult navigation={{ push }} route={{ params }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetchMock).toHaveFetched(
      "http://eunoia-bshop.ir:8000/items/category/?q=Protein",
      "get"
    );

    expect(getByTestId("items-list").props.data.length).toBe(items.length);
    expect(queryByTestId("shops-list")).toBeNull();

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

  it("filter item test without category", async () => {
    const push = jest.fn();
    var params = {
      filterType: "expensive",
      shop_item: "item",
      category: "all",
    };

    const fetchMock = require("fetch-mock-jest");
    var url = "http://eunoia-bshop.ir:8000/items/" + params.filterType + "/";
    fetchMock.get(url, items);

    const { getByTestId, queryByTestId } = await render(
      <FilterResult navigation={{ push }} route={{ params }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetchMock).toHaveFetched(
      "http://eunoia-bshop.ir:8000/items/expensive/",
      "get"
    );

    expect(fetchMock).not.toHaveFetched(
      "http://eunoia-bshop.ir:8000/items/cheap/",
      "get"
    );

    expect(getByTestId("items-list").props.data.length).toBe(items.length);
    expect(queryByTestId("shops-list")).toBeNull();

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

  it("filter item test cheap with category", async () => {
    const push = jest.fn();
    var params = {
      filterType: "cheap",
      shop_item: "item",
      category: "Fruits and vegetables",
    };

    const fetchMock = require("fetch-mock-jest");
    var url =
      "http://eunoia-bshop.ir:8000/items/category/" +
      params.filterType +
      "/?q=" +
      params.category;
    fetchMock.get(url, items);

    const { getByTestId, queryByTestId } = await render(
      <FilterResult navigation={{ push }} route={{ params }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetchMock).toHaveFetched(
      "http://eunoia-bshop.ir:8000/items/category/cheap/?q=Fruits and vegetables",
      "get"
    );

    expect(fetchMock).not.toHaveFetched(
      "http://eunoia-bshop.ir:8000/items/cheap/",
      "get"
    );

    expect(getByTestId("items-list").props.data.length).toBe(items.length);
    expect(queryByTestId("shops-list")).toBeNull();

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
