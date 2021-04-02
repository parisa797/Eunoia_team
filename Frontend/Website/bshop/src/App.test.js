import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
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


test("default theme", async () => {
  var fakeUser = {
    username: "uwu",
    email: "sb@gmail.com",
    role: "buyer",
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );
  var page;
  await act(async () => {
    page = await render(<App />);
  });
  //default is light
  expect(page.queryByTestId("nav-theme-toggle")).toHaveTextContent("☀");

});

test("user's preferred theme(light)", async () => {
  var fakeUser = {
    username: "uwu",
    email: "sb@gmail.com",
    role: "buyer",
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );
  var page;
  await act(async () => {
    localStorage.setItem("mode", "l");
    page = await render(<App />);
  })
  expect(page.queryByTestId("nav-theme-toggle")).toHaveTextContent("☀");

});

test("user's preferred theme(light)", async () => {
  var fakeUser = {
    username: "uwu",
    email: "sb@gmail.com",
    role: "buyer",
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );
  var page;

  await act(async () => {
    localStorage.setItem("mode", "d");
    page = await render(<App />);
  })
  expect(page.queryByTestId("nav-theme-toggle")).toHaveTextContent("🌙");

});

// test('renders learn react link', () => {
//   render(<App />);
//   // const linkElement = screen.getByText(/learn react/i);
//   // expect(linkElement).toBeInTheDocument();
// });
