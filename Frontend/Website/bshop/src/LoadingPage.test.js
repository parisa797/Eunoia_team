import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import LoadingPage from './LoadingPage';
import '@testing-library/jest-dom';
const fetchMock = require('fetch-mock-jest');



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

test("loading page for unsigned users", async () => {

  const shops = [{ title: "shop1", id: 1, address: "addressssss", logo: "" }
    , { title: "shop2", id: 2, address: "addressssss", logo: "" }
    , { title: "shop3", id: 3, address: "addressssss", logo: "" }
    , { title: "shop4", id: 4, address: "addressssss", logo: "" }
  ];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(shops)
    })
  );
  var page;
  await act(async () => {
    page = await render(<LoadingPage />);
  });
  expect(page.queryByTestId("loading-text")).toBeNull(); //loading ends and goes to landing page
});

test("loading page for signed users", async () => {
  localStorage.setItem("token", "kjldkjf");
  localStorage.setItem("role", "buyer")

  let newUserInfo = { role: "seller", user_name: "lkfje" }

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 404,
      json: () => Promise.resolve(newUserInfo)
    })
  );
  fetchMock
    .get("http://127.0.0.1:8000/users/profile", newUserInfo)
    .get("http://127.0.0.1:8000/api/v1/shops/user/", {})
    .get("http://127.0.0.1:8000/api/v1/shops/", [])
  var page;
  await act(async () => {
    page = await render(<LoadingPage />);
  });
  expect(page.queryByTestId("loading-text")).toBeNull(); //loading ends and goes to landing page
  expect(localStorage.getItem("role")).toBe(newUserInfo.role);
  expect(localStorage.getItem("username")).toBe(newUserInfo.user_name);
  fetchMock.mockReset();
});

test("loading page when it's not connected to backend server", async () => {
  localStorage.setItem("token", "kjldkjf");
  localStorage.setItem("role", "buyer")

  let newUserInfo = { role: "seller", user_name: "lkfje" }

  fetchMock
    .get("http://127.0.0.1:8000/users/profile", 404)
    .get("http://127.0.0.1:8000/api/v1/shops/user/", {})
    .get("http://127.0.0.1:8000/api/v1/shops/", [])
  var page;
  await act(async () => {
    page = await render(<LoadingPage />);
  });
  expect(page.queryByTestId("loading-text")).toHaveTextContent("ارتباط با سرور ممکن نیست، دوباره امتحان کنید."); //loading ends and goes to landing page
  expect(localStorage.getItem("role")).toBeNull();
  expect(localStorage.getItem("username")).toBeNull();
  fetchMock.mockReset();
});