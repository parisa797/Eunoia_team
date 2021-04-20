import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ShopList from './ShopList';
import '@testing-library/jest-dom';



let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});



test("shoplist for unsigned users", async () => {

  const shops = [{ title: "shop1", rate_value: 2, id: 1, address: "addressssss", logo: "" }
    , { title: "shop2", rate_value: 2, id: 2, address: "addressssss", logo: "" }
    , { title: "shop3", rate_value: 2, id: 3, address: "addressssss", logo: "" }
    , { title: "shop4", rate_value: 2, id: 4, address: "addressssss", logo: "" }
  ];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => shops
    })
  );
  var page;
  await act(async () => {
    page = await render(<ShopList />);
  });
  expect(page.queryByTestId("shops")).not.toBeNull();
  expect(page.queryByTestId("myshops")).toBeNull();
});

test("shoplist for signed (buyer) users", async () => {
  localStorage.setItem("username", "sflejfl");
  localStorage.setItem("role", "buyer");
  const shops = [{ title: "shop1", rate_value: 2, id: 1, address: "addressssss", logo: "" }
    , { title: "shop2", rate_value: 2, id: 2, address: "addressssss", logo: "" }
    , { title: "shop3", rate_value: 2, id: 3, address: "addressssss", logo: "" }
    , { title: "shop4", rate_value: 2, id: 4, address: "addressssss", logo: "" }
  ];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => shops
    })
  );
  var page;
  await act(async () => {
    page = await render(<ShopList />);
  });
  expect(page.queryByTestId("shops")).not.toBeNull();
  expect(page.queryByTestId("myshops")).toBeNull();
});

test("shoplist for signed superusers(sellers)", async () => {
  localStorage.setItem("username", "sflejfl");
  localStorage.setItem("role", "seller");
  const shops = [{ title: "shop1", rate_value: 2, id: 1, address: "addressssss", logo: "" }
    , { title: "shop2", rate_value: 2, id: 2, address: "addressssss", logo: "" }
    , { title: "shop3", rate_value: 2, id: 3, address: "addressssss", logo: "" }
    , { title: "shop4", rate_value: 2, id: 4, address: "addressssss", logo: "" }
  ];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => shops
    })
  );
  var page;
  await act(async () => {
    page = await render(<ShopList />);
  });
  expect(page.queryByTestId("shops")).not.toBeNull();
  expect(page.queryByTestId("myshops")).not.toBeNull();
});

test("shoplist shops contents", async () => {
  localStorage.setItem("username", "sflejfl");
  localStorage.setItem("role", "seller");
  const shops = [{ title: "shop1", rate_value: 0, rate_count: 10, id: 0, address: "ادرس ادرس آدرسسسسس", logo: "sljfleij.png" }
    , { title: "shop2-سینمتبمث", rate_value: 1.23482394, id: 1, address: "", logo: "" }
    , { title: "شاپ3", rate_value: 2.3, rate_count: 11, id: 2, address: "a", logo: null }
    , { title: "", rate_value: 5, id: 3, address: "addressssss sdfe", logo: "" }
  ];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => shops
    })
  );
  var page;
  await act(async () => {
    page = await render(<ShopList />);
  });
  expect(page.queryByTestId("shops")).not.toBeNull();
  expect(page.queryByTestId("myshops")).not.toBeNull();
  for (let i in [1, 2, 3, 4].keys()) {
    expect(page.queryByTestId('myshop' + i)).not.toBeNull();
    expect(page.queryByTestId("myshop-title-" + i)).toHaveTextContent(shops[i].address);
    expect(page.queryByTestId("myshop-address-" + i)).toHaveTextContent(shops[i].address);
    expect(page.queryByTestId("myshop-rate-count" + i)).toHaveTextContent(shops[i].rate_count)
    expect(page.queryByTestId('shop' + i)).not.toBeNull();
    expect(page.queryByTestId("shop-title-" + i)).toHaveTextContent(shops[i].address);
    expect(page.queryByTestId("shop-address-" + i)).toHaveTextContent(shops[i].address);
    expect(page.queryByTestId("shop-rate-count" + i)).toHaveTextContent(shops[i].rate_count)
  }
  expect(page.queryByTestId("shop-img-" + 0)).toHaveAttribute("src", shops[0].logo);
});