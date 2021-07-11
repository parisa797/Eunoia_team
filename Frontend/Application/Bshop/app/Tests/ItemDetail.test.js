import React from "react";
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  act,
} from "react-native-testing-library";
import renderer from "react-test-renderer";

import ItemDetail from "../ItemDetail";
// import * as Focus from "@react-navigation/native";

// const mockedFocused = jest.fn();
// jest.mock("@react-navigation/native", () => ({
//   ...jest.requireActual("@react-navigation/native"),
//   useIsFocused: () => mockedFocused,
// }));

describe("ItemDetail be tested", () => {
  // jest.mock("@react-navigation/native");
  const params = {
    rate_value: 2,
    photo: "kasd",
    price: 300,
    price_with_discount: 349,
    brand: null,
    category: "Protein",
    manufacture_jalali: "1400-04-12",
    Expiration_jalali: "1400-04-16",
    shop_id: 3,
    id: 0,
    name: "pofak",
    description: "sth",
  };

  it("renders correctly", () => {
    const push = jest.fn();

    const tree = renderer
      .create(<ItemDetail route={{ params }} navigation={{ push }} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("test components inside itemdetail", async () => {
    const push = jest.fn();
    const { getByTestId, queryByTestId } = await render(
      <ItemDetail navigation={{ push }} route={{ params }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    var i = params.id;
    var name = [params.name, " "];
    var image = params.photo
      ? params.photo.includes("http://eunoia-bshop.ir:8000")
        ? params.photo
        : "http://eunoia-bshop.ir:8000" + params.photo
      : null;

    var price = `${params.price} ریال`;
    var discounted = `با تخفیف: ${params.price_with_discount} ریال`;
    var count = params.count != 0 ? `موجودی: ${params.count} عدد` : "ناموجود";
    var brand = !params.brand ? "برند نامشخص" : params.brand;
    const categories = {
      "Spices and condiments and food side dishes": "ادویه، چاشنی و مخلفات غذا",
      Cosmetics: "بهداشت و مراقبت پوست",
      "Makeup and trimming": "آرایش و پیرایش",
      Protein: "پروتئینی",
      "Junk Food": "تنقلات",
      Nuts: "خشکبار",
      "Sweets and desserts": "شیرینیجات و دسرها",
      perfume: "عطر، ادکلن و اسپری",
      "Fruits and vegetables": "غذا، کنسرو و سبزیجات",
      Dairy: "لبنیات",
      Drinks: "نوشیدنیها",
      "Washing and Cleaning Equipment": "وسایل شستشو و نظافت",
      others: "متفرقه",
    };
    var category = `دسته بندی: ${categories[params.category]}`;

    var manufacture = `تاریخ تولید: 12 تیر 1400`;
    var expire = `تاریخ انقضا: 16 تیر 1400`;

    // check item photo
    if (params.photo) {
      const photo = params.photo.includes("http://eunoia-bshop.ir:8000")
        ? params.photo
        : "http://eunoia-bshop.ir:8000" + params.photo;

      expect(getByTestId("item-detail-image-" + i).props.source.uri).toBe(
        photo
      );
      expect(queryByTestId("item-detail-noimage-" + i)).toBeNull();
    } else {
      expect(queryByTestId("item-detail-image-" + i)).toBeNull();
      expect(queryByTestId("item-detail-noimage-" + i)).not.toBeNull();
    }
    expect(getByTestId("item-detail-name-" + i).props.children).toStrictEqual(
      name
    );
    expect(getByTestId("item-detail-description-" + i).props.children).toBe(
      params.description
    );

    expect(getByTestId("item-detail-brand-" + i).props.children).toBe(brand);
    expect(getByTestId("item-detail-manufacture-" + i).props.children).toBe(
      manufacture
    );
    expect(getByTestId("item-detail-expire-" + i).props.children).toBe(expire);
    expect(getByTestId("item-detail-price-" + i).props.children).toStrictEqual([
      price,
      " ",
    ]);
    if (params.price != params.price_with_discount) {
      expect(
        getByTestId("item-detail-discounted-" + i).props.children
      ).toStrictEqual([discounted, " "]);
    } else {
      expect(queryByTestId("item-detail-discounted-" + i)).toBeNull();
    }

    expect(
      getByTestId("item-detail-category-" + i).props.children
    ).toStrictEqual([category, " "]);

    expect(getByTestId("item-detail-count-" + i).props.children).toBe(count);
  });
});
