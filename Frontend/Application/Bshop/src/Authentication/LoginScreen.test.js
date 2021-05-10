import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-test-renderer";
import Login from "./Login";

import {
  render,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react-native";
import ReactDOM from "react-dom";
// import { TouchableOpacity } from "react-native";
import FlashMessage from "react-native-flash-message";
import { showMessage } from "react-native-flash-message";

// global.fetch = jest.fn();

// // mocking an API success response once
// fetch.mockResponseIsSuccess = (body) => {
// fetch.mockImplementationForOnce(() =>
// Promise.resolve({ json: () => Promise.resolve(JSON.parse(body)) })
// );
// };

// // mocking an API failure response for once
// fetch.mockResponseIsFailure = (error) => {
// fetch.mockImplementationForOnce(() => Promise.reject(error));
// };

describe("Login component be tested", () => {
  jest.mock("react-native-flash-message");

  // jest.mock(
  //   "react-native/Libraries/Components/Touchable/TouchableOpacity.js",
  //   () => {
  //     const { TouchableHighlight } = require("react-native");
  //     const MockTouchable = (props) => {
  //       return <TouchableHighlight {...props} />;
  //     };
  //     MockTouchable.displayName = "TouchableOpacity";

  //     return MockTouchable;
  //   }
  // );
  // jest.mock(
  //   "react-native/Libraries/Components/Touchable/TouchableOpacity",
  //   () => "TouchableOpacity"
  // );
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

  //empty email
  it("check empty email", async () => {
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <Login navigation={{ push }} />
    );

    const empty_mail = "لطفا ایمیل خود را وارد کنید.";
    // showMessage.mockResolvedValue(empty_mail);

    FlashMessage.showMessage = jest.fn().mockResolvedValue(empty_mail);
    // jest.spyOn(FlashMessage, "showMessage").mockResolvedValueOnce(empty_mail);

    const email = "";
    console.log("this is email test length", email.length);
    await fireEvent.changeText(getByTestId("email_check"), email);
    await fireEvent.press(getByTestId("login-button"));
    // expect(FlashMessage.showMessage).toHaveBeenCalled();
    //   // expect(getByTestId("pass_check").props.value).toBe(email);
  });

  // //empty password
  // it("check empty email", async () => {
  //   const push = jest.fn();
  //   const { getByTestId, getByPlaceholderText } = await render(
  //     <Login navigation={{ push }} />
  //   );
  //   const pass = "";
  //   await fireEvent.changeText(getByTestId("pass_check"), pass);
  //   expect(getByTestId("pass_check").props.value).toBe(pass);
  // });

  //empty email and password

  //authentication failed

  //auth successfull
});
