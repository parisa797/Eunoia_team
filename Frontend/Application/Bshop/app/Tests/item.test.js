import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  act,
} from "react-native-testing-library";
import renderer from "react-test-renderer";

import ShopDetail from "../shopDetails";
import Item from "../item";

const mockedFocused = jest.fn();
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useIsFocused: () => mockedFocused,
}));

describe("testing shop detail, items part", () => {
  it("renders correctly", () => {
    // const params = jest.fn();
    const params = {
      id: 3,
      logo: "hi.png",
      title: "myshop",
      address: "myStreet",
      phone: "09123456789",
      online: true,
      rate_value: 3,
    };
    const tree = renderer.create(<ShopDetail route={{ params }} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("fetch test", async () => {
    const fetchMock = require("fetch-mock-jest");
    const shopitems = [
      {
        name: "پف پفی شیبابا",
        price: 80000,
        photo: "/pofpofi.png",
        id: 0,
        discount: 0,
      },
      {
        name: "پفک طلایی چی توز",
        price: 100000,
        photo: "pofak.png",
        id: 1,
        discount: 10,
      },
      {
        name: "پاستیل شیبابا",
        price: 50000,
        photo: "pastil.jpg",
        id: 2,
        discount: 20,
      },
      {
        name: "رب گوجه آتا",
        price: 300000,
        photo: "rob.png",
        id: 3,
        discount: 0,
      },
    ];

    var params = {
      id: 3,
      logo: "hi.png",
      title: "myshop",
      address: "myStreet",
      phone: "09123456789",
      online: true,
      rate_value: 3,
    };
    var url = "http://eunoia-bshop.ir:8000/shops/" + params.id + "/items/";
    fetchMock.get(url, shopitems);

    const { getByTestId, queryByTestId } = await render(
      <ShopDetail route={{ params }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetchMock).toHaveFetched(
      "http://eunoia-bshop.ir:8000/shops/3/items/",
      "get"
    );
    expect(getByTestId("items-list").props.data.length).toBe(shopitems.length);

    for (var i = 0; i < shopitems.length; i++) {
      expect(getByTestId("item-name-" + i).props.children).toBe(
        shopitems[i].name
      );

      var expected_image = "http://eunoia-bshop.ir:8000" + shopitems[i].photo;
      expect(getByTestId("item-image-" + i).props.source.uri).toBe(
        expected_image
      );

      // if item has some discount
      if (shopitems[i].discount != 0) {
        console.log("disc wasn't zero");
        var price = ["قیمت:", shopitems[i].price];
        var newPrice = [
          "قیمت با تخفیف: ",
          // (
          ((100 - shopitems[i].discount) * shopitems[i].price) / 100,
          // ).toString(),
        ];
        expect(queryByTestId("item-price1-" + i)).toBeNull();
        expect(queryByTestId("item-price0-" + i).props.children).toStrictEqual(
          price
        );
        expect(
          queryByTestId("item-discounted-" + i).props.children
        ).toStrictEqual(newPrice);
      } else {
        var price = ["قیمت:", shopitems[i].price];

        expect(queryByTestId("item-price0-" + i)).toBeNull();
        expect(queryByTestId("item-price1-" + i).props.children).toStrictEqual(
          price
        );
        expect(queryByTestId("item-discounted-" + i)).toBeNull();
      }
    }

    fetchMock.mockClear();
  });
});
