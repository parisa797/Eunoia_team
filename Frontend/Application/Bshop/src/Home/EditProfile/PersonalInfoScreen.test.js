import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-test-renderer";
import PersonalInfo from "./PersonalInfo";
// import { getByTestId } from "@testing-library/dom";
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react-native";
import ReactDOM from "react-dom";
import { Alert } from "react-native";
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

describe("PersonalInfo component be tested", () => {
  // afterEach(cleanup);

  it("renders correctly", () => {
    const tree = renderer.create(<PersonalInfo />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  //   it("check email input", async () => {
  //     const push = jest.fn();
  //     const { getByTestId, getByPlaceholderText } = await render(
  //       <PersonalInfo navigation={{ push }} />
  //     );
  //     const eml = "hi@gmail.com";
  //     await fireEvent.changeText(getByTestId("eml_check"), eml);
  //     expect(getByTestId("eml_check").props.value).toBe(eml);
  //   });

  it("check namepersonal input", async () => {
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <PersonalInfo navigation={{ push }} />
    );
    const name = "hojat";
    await fireEvent.changeText(getByTestId("namepersonal_check"), name);
    expect(getByTestId("namepersonal_check").props.value).toBe(name);
  });

  it("check family_check input", async () => {
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <PersonalInfo navigation={{ push }} />
    );
    const familyname = "amini";
    await fireEvent.changeText(getByTestId("family_check"), familyname);
    expect(getByTestId("family_check").props.value).toBe(familyname);
  });

  it("check phone_check input", async () => {
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <PersonalInfo navigation={{ push }} />
    );
    const phone = "09125831292";
    await fireEvent.changeText(getByTestId("phone_check"), phone);
    expect(getByTestId("phone_check").props.value).toBe(phone);
  });

  it("check address_check input", async () => {
    const push = jest.fn();
    const { getByTestId, getByPlaceholderText } = await render(
      <PersonalInfo navigation={{ push }} />
    );
    const address = "mirdamad";
    await fireEvent.changeText(getByTestId("address_check"), address);
    expect(getByTestId("address_check").props.value).toBe(address);
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
  //     await fireEvent.changeText(getByTestId("user_cheak"), cheakboathuserform);
  //     // expect(getByTestId("eml_check").props.value).toBe(emailvalidation);
  //     // expect(Alert.alert).toHaveBeenCalledWith(errorMessageText);
  //   });
});
