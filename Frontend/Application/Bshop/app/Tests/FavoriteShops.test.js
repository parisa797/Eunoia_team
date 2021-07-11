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

import FavoriteShops from "../FavoriteShops";
jest.mock("@react-navigation/native", () => {
  return {
    useIsFocused: () => true,
  };
});

describe("testing user favorite shops", () => {
  it("renders correctly", () => {
    const push = jest.fn();
    const tree = renderer.create(<FavoriteShops navigation={{ push }} />);
    expect(tree).toMatchSnapshot();
  });

  it("favorite shops fetch test", async () => {
    const fetchMock = require("fetch-mock-jest");
    const favorite_shop = [
      {
        title: "فروشگاه سر کوچه",
        address: "مرزداران",
        logo: "sare-kooche",
        rate_value: 2.3,
        online: true,
        phone: "09123456789",
        id: 0,
      },
      {
        title: "جانبو",
        address: "سعادت آباد",
        logo: null,
        rate_value: 3,
        online: false,
        phone: "09123456784",
        id: 1,
      },
      {
        title: "افق کوروش",
        address: "میدون شوش",
        logo: "shoosh",
        rate_value: 4.2,
        online: false,
        phone: "09156456789",
        id: 2,
      },
    ];

    var url = "http://eunoia-bshop.ir:8000/users/profile/likedshops";
    fetchMock.get(url, favorite_shop);

    const push = jest.fn();
    const { getByTestId, queryByTestId } = await render(
      <FavoriteShops navigation={{ push }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetchMock).toHaveFetched(
      "http://eunoia-bshop.ir:8000/users/profile/likedshops",
      "get"
    );
    // console.log(getByTestId("favorite_shop-list").props);
    expect(getByTestId("fav-shops-list").props.data.length).toBe(
      favorite_shop.length
    );

    for (var i = 0; i < favorite_shop.length; i++) {
      const shop_name = favorite_shop[i].title.includes("فروشگاه")
        ? favorite_shop[i].title
        : "فروشگاه " + favorite_shop[i].title;
      var address = "آدرس: " + favorite_shop[i].address;

      //check shop name
      expect(getByTestId("shop-name-" + i).props.children).toBe(shop_name);

      //check shop address
      expect(getByTestId("shop-add-" + i).props.children).toBe(address);

      // // if item has image, show its own image
      // if (favorite_shop[i].photo) {
      //   var ph = "http://eunoia-bshop.ir:8000" + favorite_shop[i].photo;
      //   expect(queryByTestId("shop-image-" + i).props.source.uri).toBe(ph);
      //   // expect(queryByTestId("item-noimage-" + i)).toBeNull();
      // }
      // // else show default image
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
