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

  //mocking ToastAndroid
  const showMock = jest.fn();
  jest.spyOn(ToastAndroid, "show").mockImplementation(showMock);
  //empty email
  it("check empty email", async () => {
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

  auth successfull
  it("failed auth", async () => {
    const fetchMock = require("fetch-mock-jest");

    const database_users = [
      { email: "gh@iust.ac.ir", password: "thisIsme567" },
      { email: "gh@ac.ir", password: "thisIme567" },
    ];
    await fetchMock.post(
      "http://iust-bshop.herokuapp.com/rest-auth/login/",
      (url, options) => {
        // if (typeof options.body.name === 'string') {
        // 	users.push(options.body);
        // 	return 201;
        // }
        // return 400;
        // console.log(JSON.stringify(options.body));
        var e = "email";
        console.log("body is: ", options.body);
        // console.log(options.body.e);
        console.log(options.body["email"]);
        // console.log(options.body.get("email"));

        // var dict = [{ hi: "pleas" }];
        // console.log(dict["hi"]);
        // console.log(dict[0]["hi"]);
        console.log("here here", options.body.email);

        if (
          database_users.includes({
            email: options.body.get("email"),
            password: options.body.get("password"),
          })
        ) {
          console.log("reached here");
          return 200;
        }
        console.log("raeched bad!");
        return 400;
      }
    );
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <Login navigation={{ push }} />
    );
    await new Promise((resolve) => setImmediate(resolve));

    const pass = "thisIme567";
    await fireEvent.changeText(getByTestId("pass_check"), pass);
    const email = "gh@ac.ir";
    await fireEvent.changeText(getByTestId("email_check"), email);
    await fireEvent.press(getByTestId("login-button"));
    // var bdy = JSON.stringify({ email: mail, password: pass });
    // console.log(bdy);
    var dict = {
      email: email,
      password: pass,
    };
    expect(fetchMock).toHaveLastFetched(
      "http://iust-bshop.herokuapp.com/rest-auth/login/",
      {
        // url: "http://iust-bshop.herokuapp.com/rest-auth/login/",
        options: { body: dict },
      },

      // {
      //   url: "http://iust-bshop.herokuapp.com/rest-auth/login/",
      //   options: { body: JSON.stringify({ email: email, password: pass }) },
      // },
      "post"
    );
  });

  //authentication failed
});
