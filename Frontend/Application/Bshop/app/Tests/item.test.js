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

  // it("fetch test", async () => {
  //   const fetchMock = require("fetch-mock-jest");
  //   const shopitems = [
  //     {
  //       name: "پفک طلایی چی توز",
  //       price: "7.000 : قیمت ",
  //       image: "pofak.png",
  //       id: 1,
  //     },
  //     {
  //       name: "پاستیل شیبابا",
  //       price: "9.000 : قیمت ",
  //       image: "pastil.jpg",
  //       id: 2,
  //     },
  //     {
  //       name: "رب گوجه آتا",
  //       price: "15.100 : قیمت ",
  //       image: "rob.png",
  //       id: 3,
  //     },
  //     {
  //       name: "پف پفی شیبابا",
  //       price: "7.000 : قیمت ",
  //       image: "pufpuf.jpg",
  //       id: 4,
  //     },
  //   ];

  //   fetchMock.get("http://eunoia-bshop.ir:8000/shops/3/items/", shopitems);

  //   // jest.mock("@react-navigation/native", () => ({
  //   //   ...jest.requireActual("@react-navigation/native"),

  //   //   // useRoute: () => ({
  //   //   //   params: {
  //   //   //     id: 3,
  //   //   //     logo: "hi.png",
  //   //   //     title: "myshop",
  //   //   //     address: "myStreet",
  //   //   //     phone: "09123456789",
  //   //   //     online: true,
  //   //   //     rate_value: 3,
  //   //   //   },
  //   //   // }),
  //   //   params: {
  //   //     id: 3,
  //   //     logo: "hi.png",
  //   //     title: "myshop",
  //   //     address: "myStreet",
  //   //     phone: "09123456789",
  //   //     online: true,
  //   //     rate_value: 3,
  //   //   },
  //   // }));
  //   // const push = jest.fn();
  //   var params = {
  //     id: 3,
  //     logo: "hi.png",
  //     title: "myshop",
  //     address: "myStreet",
  //     phone: "09123456789",
  //     online: true,
  //     rate_value: 3,
  //   };

  //   const { getByTestId, queryByTestId } = await render((params) => (
  //     <ShopDetail {...params} route={{ params }} />
  //   ));
  //   await new Promise((resolve) => setImmediate(resolve));

  //   expect(fetchMock).toHaveFetched(
  //     "http://eunoia-bshop.ir:8000/shops/3/items/",
  //     "get"
  //   );
  //   expect(getByTestId("items-list").props.data.length).toBe(shopitems.length);

  //   for (var i = 1; i < 5; i++) {
  //     // const shop_name = shops[i].title.includes("فروشگاه")
  //     //   ? shops[i].title
  //     //   : "فروشگاه " + shops[i].title;
  //     // const shop_add = "آدرس: " + shops[i].address;
  //     expect(getByTestId("item-name-" + i).props.children).toBe(
  //       shopitems[i].name
  //     );
  //     expect(getByTestId("item-image-" + i).props.source.uri).toBe(
  //       shopitems[i].image
  //     );
  //   }

  //   // expect(queryByTestId("shop-name-4")).toBeNull();
  //   // expect(queryByTestId("shop-name-4")).toBeNull();
  //   // expect(queryByTestId("shop-image-4")).toBeNull();

  //   fetchMock.mockClear();
  // });
});
