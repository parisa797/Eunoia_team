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
import { ToastAndroid } from "react-native";

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
  afterEach(cleanup);

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

  it("check invalid email", async () => {
    const showMock = jest.fn();
    jest.spyOn(ToastAndroid, "show").mockImplementation(showMock);

    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <SignUp navigation={{ push }} />
    );

    const message = "لطفا یک ایمیل معتبر وارد کنید.";
    var email = "higmail.com";
    await fireEvent.changeText(getByTestId("eml_check"), email);
    await fireEvent(getByTestId("eml_check"), "blur");
    expect(showMock).toHaveBeenLastCalledWith(message, undefined);

    email = "hi@gmailcom";
    await fireEvent.changeText(getByTestId("eml_check"), email);
    await fireEvent(getByTestId("eml_check"), "blur");
    expect(showMock).toHaveBeenLastCalledWith(message, undefined);
  });

  it("check valid email, not to call toastAndroid", async () => {
    const showMock = jest.fn();
    jest.spyOn(ToastAndroid, "show").mockImplementation(showMock);
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <SignUp navigation={{ push }} />
    );

    var email = "hi@gmail.com";
    await fireEvent.changeText(getByTestId("eml_check"), email);
    await fireEvent(getByTestId("eml_check"), "blur");
    expect(showMock).toHaveBeenCalledTimes(0);
  });

  it("check numeric username", async () => {
    const showMock = jest.fn();
    jest.spyOn(ToastAndroid, "show").mockImplementation(showMock);
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <SignUp navigation={{ push }} />
    );

    const message =
      "نام کاربری نمیتواند تنها شامل ارقام باشد! لطفا از ترکیبی از حرف و عدد استفاده کنید.";
    var username = "1234";
    await fireEvent.changeText(getByTestId("user_check"), username);
    await fireEvent(getByTestId("user_check"), "blur");
    expect(showMock).toHaveBeenLastCalledWith(message, undefined);
  });

  it("check empty username", async () => {
    const showMock = jest.fn();
    jest.spyOn(ToastAndroid, "show").mockImplementation(showMock);
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <SignUp navigation={{ push }} />
    );

    const message = "فیلد نام کاربری نمی تواند خالی باشد.";
    var username = "";
    await fireEvent.changeText(getByTestId("user_check"), username);
    await fireEvent(getByTestId("user_check"), "blur");
    expect(showMock).toHaveBeenLastCalledWith(message, undefined);
  });

  it("check whether pass1 == pass2", async () => {
    const showMock = jest.fn();
    jest.spyOn(ToastAndroid, "show").mockImplementation(showMock);
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <SignUp navigation={{ push }} />
    );

    const message = "رمزعبورهای وارد شده باید با هم مطابقت داشته باشند.";
    var pass1 = "boredfromtest";
    var pass2 = "boredfromtest";
    await fireEvent.changeText(getByTestId("pass_check"), pass1);
    await fireEvent.changeText(getByTestId("confpass_check"), pass2);
    await fireEvent(getByTestId("confpass_check"), "blur");
    expect(showMock).toHaveBeenCalledTimes(0);

    pass2 = "boredfromtes";
    await fireEvent.changeText(getByTestId("confpass_check"), pass2);
    await fireEvent(getByTestId("confpass_check"), "blur");
    expect(showMock).toHaveBeenLastCalledWith(message, undefined);
  });
});
