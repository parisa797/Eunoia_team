import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-test-renderer";
import SignUp from "../signup";
// import { getByTestId } from "@testing-library/dom";
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
} from "react-native-testing-library";
// import ReactDOM from "react-dom";
// import { Alert } from "react-native";
// import "jest-dom/extend-expect";

global.fetch = jest.fn();

// mocking an API success response once
fetch.mockResponseIsSuccess = (body) => {
  fetch.mockImplementationForOnce(() =>
    Promise.resolve({ json: () => Promise.resolve(JSON.parse(body)) })
  );
};

// mocking an API failure response for once
fetch.mockResponseIsFailure = (error) => {
  fetch.mockImplementationForOnce(() => Promise.reject(error));
};

describe("SignUp component be tested", () => {
  // afterEach(cleanup);

  it("renders correctly", () => {
    const tree = renderer.create(<SignUp />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("check email input", async () => {
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <SignUp navigation={{ push }} />
    );
    const eml = "hi@gmail.com";
    await fireEvent.changeText(getByTestId("eml_check"), eml);
    expect(getByTestId("eml_check").props.value).toBe(eml);
  });

  it("check user_check input", async () => {
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <SignUp navigation={{ push }} />
    );
    const user = "hojat";
    await fireEvent.changeText(getByTestId("user_check"), user);
    expect(getByTestId("user_check").props.value).toBe(user);
  });

  it("check pass_check input", async () => {
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <SignUp navigation={{ push }} />
    );
    const pass = "13799731p";
    await fireEvent.changeText(getByTestId("pass_check"), pass);
    expect(getByTestId("pass_check").props.value).toBe(pass);
  });

  it("check confpass_check input", async () => {
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <SignUp navigation={{ push }} />
    );
    const confpass = "13799731p";
    await fireEvent.changeText(getByTestId("confpass_check"), confpass);
    expect(getByTestId("confpass_check").props.value).toBe(confpass);
  });

  //   it("check email validation", async () => {
  //     const push = jest.fn();
  //     const { getByTestId, getByPlaceholderText } = await render(
  //       <SignUp navigation={{ push }} />
  //     );

  //     errorMessageText = "لطفا ایمیل خود را درست وارد کنید.";
  //     Alert.alert = jest.fn().mockResolvedValue(errorMessageText);
  //     // jest.spyOn(Alert, "alert");

  //     const emailvalidation = "phj.com";
  //     await fireEvent.changeText(getByTestId("eml_check"), emailvalidation);
  //     // expect(getByTestId("eml_check").props.value).toBe(emailvalidation);
  //     // expect(Alert.alert).toHaveBeenCalledWith(errorMessageText);
  //   });

  //   it("check same pass and confpass", async () => {
  //     const push = jest.fn();
  //     const { getByTestId, getByPlaceholderText } = await render(
  //       <SignUp navigation={{ push }} />
  //     );

  //     errorMessageText = "رمزعبورهای وارد شده باید با هم مطابقت داشته باشند.";
  //     Alert.alert = jest.fn().mockResolvedValue(errorMessageText);
  //     // jest.spyOn(Alert, "alert");
  //     const pass = "13799731p";
  //     await fireEvent.changeText(getByTestId("pass_check"), pass);
  //     const samepass = "13799731pp";
  //     await fireEvent.changeText(getByTestId("confpass_check"), samepass);
  //     // expect(getByTestId("eml_check").props.value).toBe(emailvalidation);
  //     // expect(Alert.alert).toHaveBeenCalledWith(errorMessageText);
  //   });

  //   it("check username has number and alphabet", async () => {
  //     const push = jest.fn();
  //     const { getByTestId, getByPlaceholderText } = await render(
  //       <SignUp navigation={{ push }} />
  //     );

  //     errorMessageText =
  //       "نام کاربری نمیتواند شامل ارقام باشد! لطفا از ترکیبی از حرف و عدد استفاده کنید.";
  //     Alert.alert = jest.fn().mockResolvedValue(errorMessageText);
  //     // jest.spyOn(Alert, "alert");

  //     const cheakboathuserform = "1254";
  //     await fireEvent.changeText(getByTestId("user_check"), cheakboathuserform);
  //     // expect(getByTestId("eml_check").props.value).toBe(emailvalidation);
  //     // expect(Alert.alert).toHaveBeenCalledWith(errorMessageText);
  //   });
});
