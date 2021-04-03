import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import HomePage from './HomePage';
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

test("home page for unsigned users", async () => {

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
    page = await render(<HomePage />);
  });
  expect(page.queryByTestId("not-logged-header")).not.toBeNull();
  expect(page.queryByTestId("logged-header")).toBeNull();
});

test("home page for signed users", async () => {
  localStorage.setItem("token", "aljfleij")
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
    page = await render(<HomePage />);
  });
  expect(page.queryByTestId("not-logged-header")).toBeNull();
  expect(page.queryByTestId("logged-header")).not.toBeNull();
});