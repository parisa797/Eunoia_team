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

import FavoriteItems from "../Favorite";
jest.mock("@react-navigation/native", () => {
  return {
    useIsFocused: () => true,
  };
});

describe("testing favorite items", () => {
  it("renders correctly", () => {
    const push = jest.fn();
    const tree = renderer.create(<FavoriteItems navigation={{ push }} />);
    expect(tree).toMatchSnapshot();
  });

  it("favorite item fetch test", async () => {
    const fetchMock = require("fetch-mock-jest");
    const favorite_item = [
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

    var url = "http://eunoia-bshop.ir:8000/users/profile/likeditems";
    // console.log("the get url", url);
    fetchMock.get(url, favorite_item);

    const push = jest.fn();
    const { getByTestId, queryByTestId } = await render(
      <FavoriteItems navigation={{ push }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetchMock).toHaveFetched(
      "http://eunoia-bshop.ir:8000/users/profile/likeditems",
      "get"
    );
    // console.log(getByTestId("favorite_item-list").props);
    expect(getByTestId("fav-items-list").props.data.length).toBe(
      favorite_item.length
    );

    for (var i = 0; i < favorite_item.length; i++) {
      //check item name
      expect(getByTestId("item-name-" + i).props.children).toBe(
        favorite_item[i].name
      );

      //check item shopname
      expect(getByTestId("item-shopname-" + i).props.children).toBe(
        favorite_item[i].ItemShop.title
      );

      // if item has some discount
      if (favorite_item[i].discount != 0) {
        // console.log("disc wasn't zero");
        var price = ["قیمت:", favorite_item[i].price];
        var newPrice = [
          "قیمت با تخفیف: ",
          // (
          ((100 - favorite_item[i].discount) * favorite_item[i].price) / 100,
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
        var price = ["قیمت:", favorite_item[i].price];

        expect(queryByTestId("item-price0-" + i)).toBeNull();
        expect(queryByTestId("item-price1-" + i).props.children).toStrictEqual(
          price
        );
        expect(queryByTestId("item-discounted-" + i)).toBeNull();
      }

      // if item has image, show its own image
      if (favorite_item[i].photo) {
        var ph = favorite_item[i].photo.includes("http://eunoia-bshop.ir:8000")
          ? favorite_item[i].photo
          : "http://eunoia-bshop.ir:8000" + favorite_item[i].photo;
        expect(queryByTestId("item-image-" + i).props.source.uri).toBe(ph);
        expect(queryByTestId("item-noimage-" + i)).toBeNull();
      }
      // else show default image
      //   else {
      //     console.log("this is image id", i);
      //     console.log(queryByTestId("item-noimage-" + i));
      //     // expect(queryByTestId("item-noimage-" + i)).not.toBeNull();
      //     // expect(queryByTestId("item-image-" + i)).toBeNull();
      //   }
    }

    fetchMock.mockClear();
  });
});
