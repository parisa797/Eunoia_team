import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-test-renderer";
import Login from "../login";

import { ToastAndroid } from "react-native";
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
} from "react-native-testing-library";

describe("Login component be tested", () => {
  //snapshot test
  it("renders correctly", () => {
    const tree = renderer.create(<Login />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  //things to test:
  // email state changes by inputtext
  it("check email input", async () => {
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <Login navigation={{ push }} />
    );
    const email = "hi@gmail.com";
    await fireEvent.changeText(getByTestId("email_check"), email);
    expect(getByTestId("email_check").props.value).toBe(email);
  });

  //pass state changes by inputtext
  it("check pass input", async () => {
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <Login navigation={{ push }} />
    );
    const pass = "salamThisis234";
    await fireEvent.changeText(getByTestId("pass_check"), pass);
    expect(getByTestId("pass_check").props.value).toBe(pass);
  });

  // mocking ToastAndroid
  const showMock = jest.fn();
  jest.spyOn(ToastAndroid, "show").mockImplementation(showMock);
  //empty email
  it("check empty email", async () => {
    showMock.mockClear();

    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <Login navigation={{ push }} />
    );

    const empty_mail = "لطفا ایمیل خود را وارد کنید.";
    const email = "";
    console.log("this is email test length", email.length);
    await fireEvent.changeText(getByTestId("email_check"), email);
    const pass = "salamThisis234";
    await fireEvent.changeText(getByTestId("pass_check"), pass);
    await fireEvent.press(getByTestId("login-button"));
    expect(showMock).toHaveBeenLastCalledWith(empty_mail, undefined);
  });

  // //empty password
  it("check empty password", async () => {
    showMock.mockClear();

    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <Login navigation={{ push }} />
    );

    const empty_pass = "لطفا پسورد خود را وارد کنید.";
    const pass = "";
    await fireEvent.changeText(getByTestId("pass_check"), pass);
    const email = "gh@yahoo.com";
    await fireEvent.changeText(getByTestId("email_check"), email);
    await fireEvent.press(getByTestId("login-button"));
    expect(showMock).toHaveBeenLastCalledWith(empty_pass, undefined);
  });

  //empty email and password
  it("check empty email & password", async () => {
    showMock.mockClear();

    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <Login navigation={{ push }} />
    );

    const message = "لطفا اطلاعات کاربری خود را وارد کنید.";
    const pass = "";
    await fireEvent.changeText(getByTestId("pass_check"), pass);
    const email = "";
    await fireEvent.changeText(getByTestId("email_check"), email);
    await fireEvent.press(getByTestId("login-button"));
    expect(showMock).toHaveBeenLastCalledWith(message, undefined);
  });
});

describe("test Login fetch", () => {
  var _ = require("lodash");
  //make fake data for DB
  const database_users = [
    { email: "gh@ac.ir", password: "thisIsme567" },
    { email: "shrbi@iust.ac.ir", password: "shrb5678SJ" },
    { email: "kasra@gmail.com", password: "Iamkasra83" },
  ];

  const notConfirmed = ["habib@yahoo.com", "marya@gmail.com"];

  const contains = (value, other) => {
    for (var i = 0; i < other.length; i++) {
      if (_.isEqual(value, other[i])) return true;
    }
    return false;
  };

  //mock fetch
  const fetchMock = require("fetch-mock-jest");
  fetchMock.post(
    "http://eunoia-bshop.ir:8000/rest-auth/login/",
    // { status: 200, body: JSON.stringify("successfull login") }
    (url, options) => {
      var dict = JSON.parse(options.body);

      //if user has not confirmed email, should see a toastandroid
      if (notConfirmed.includes(dict.email)) {
        return {
          status: 400,
          body: JSON.stringify({
            non_field_errors: ["E-mail is not verified."],
          }),
        };
      }

      if (contains(dict, database_users)) {
        console.log("reached here");
        let random = Math.random().toString(36).substring(7);
        return {
          status: 200,
          body: JSON.stringify({
            key: random,
          }),
        };
      }
      // console.log("reached bad!");
      // ToastAndroid.show(
      //   "ایمیل یا رمزعبور خود را به درستی وارد نکرده اید. لطفا مجددا تلاش کنید.",
      //   ToastAndroid.SHORT
      // );
      return {
        status: 400,
        body: JSON.stringify({
          non_field_errors: ["Unable to log in with provided credentials."],
        }),
      };
    }
  );

  // auth successfull
  it("successful auth", async () => {
    // const SecureStore = require("expo-secure-store");
    // let mockSetItemAsync = jest.fn();
    // mockSetItemAsync = jest
    //   .spyOn(SecureStore, "setItemAsync")
    //   .mockImplementation(() => Promise.resolve({ success: true }));
    // SecureStore.setItemAsync = mockSetItemAsync;

    // jest.mock("expo-secure-store", () => ({
    //   setItemAsync: jest.fn(),
    // }));
    // const fetchMock = require("fetch-mock-jest");

    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <Login navigation={{ push }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    const pass = "thisIsme567";
    await fireEvent.changeText(getByTestId("pass_check"), pass);
    const email = "gh@ac.ir";
    await fireEvent.changeText(getByTestId("email_check"), email);
    await fireEvent.press(getByTestId("login-button"));

    expect(fetchMock).toHaveLastFetched(
      "http://eunoia-bshop.ir:8000/rest-auth/login/",
      {
        // url: "http://iust-bshop.herokuapp.com/rest-auth/login/",
        // options: { body: dict },
        options: {
          body: JSON.stringify({
            email: email,
            password: pass,
          }),
        },
      },
      "post"
    );
    // expect(mockSetItemAsync).toHaveBeenCalled();
    // expect(setItemAsync).toHaveBeenLastCalledWith("token", "asalkak");
  });

  //mocking ToastAndroid
  // const showMock = jest.fn();
  // jest.spyOn(ToastAndroid, "show").mockImplementation(showMock);
  // showMock.mockClear();

  //authentication failed
  it("failed auth", async () => {
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <Login navigation={{ push }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    const pass = "sharifizahra87T";
    await fireEvent.changeText(getByTestId("pass_check"), pass);
    const email = "zahra@gmail.ir";
    await fireEvent.changeText(getByTestId("email_check"), email);
    await fireEvent.press(getByTestId("login-button"));

    expect(fetchMock).toHaveLastFetched(
      "http://eunoia-bshop.ir:8000/rest-auth/login/",
      {
        options: {
          body: JSON.stringify({
            email: email,
            password: pass,
          }),
        },
      },
      "post"
    );

    var message =
      "ایمیل یا رمزعبور خود را به درستی وارد نکرده اید. لطفا مجددا تلاش کنید.";
    // expect(showMock).toHaveBeenLastCalledWith(message, undefined);
  });
});
