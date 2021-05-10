import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  act,
} from "react-native-testing-library";
import renderer from "react-test-renderer";

import Home from "../homepage";
import Shop from "../shop";

describe("Home page with shops be tested", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Home />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("fetch test", async () => {
    const fetchMock = require("fetch-mock-jest");
    const shops = [
      {
        title: "رفاه",
        rate_value: 0,
        rate_count: 10,
        id: 0,
        address: "ادرس ادرس آدرسسسسس",
        logo: "sljfleij.png",
      },
      {
        title: "شهروند",
        rate_value: 1.23482394,
        id: 1,
        address: "",
        logo: "",
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
        rate_value: 5,
        id: 3,
        address: "addressssss sdfe",
        logo: "",
      },
    ];

    fetchMock.get("http://iust-bshop.herokuapp.com/api/v1/shops/", shops);

    const push = jest.fn();
    const { getByTestId, queryByTestId } = await render(
      <Home navigation={{ push }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetchMock).toHaveFetched(
      "http://iust-bshop.herokuapp.com/api/v1/shops/",
      "get"
    );
    expect(getByTestId("shops-list").props.data.length).toBe(shops.length);

    for (var i = 0; i < 4; i++) {
      const shop_name = shops[i].title.includes("فروشگاه")
        ? shops[i].title
        : "فروشگاه " + shops[i].title;
      const shop_add = "آدرس: " + shops[i].address;
      expect(getByTestId("shop-name-" + i).props.children).toBe(shop_name);
      expect(getByTestId("shop-add-" + i).props.children).toBe(shop_add);
      expect(getByTestId("shop-image-" + i).props.source.uri).toBe(
        shops[i].logo
      );
    }

    expect(queryByTestId("shop-name-4")).toBeNull();
    expect(queryByTestId("shop-name-4")).toBeNull();
    expect(queryByTestId("shop-image-4")).toBeNull();

    fetchMock.mockClear();
  });
});
