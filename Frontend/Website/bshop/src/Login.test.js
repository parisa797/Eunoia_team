import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Login from './login';
import '@testing-library/jest-dom';
import * as Snackbar from 'notistack';
import * as api from "./api";



let container = null;
const enqueueSnackbarMock = jest.fn()
const closeSnackbarMock = jest.fn()
const flushPromises = () => new Promise(setImmediate)
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);

  //mocking snackbar
  jest.spyOn(Snackbar, 'useSnackbar').mockImplementation(() => ({ enqueueSnackbar: enqueueSnackbarMock, closeSnackbar: closeSnackbarMock }))

  //mocking loginUser in './api' which has an api call with axios inside
  const loginUserMock = jest.fn().mockImplementation((_body) => {
    console.log(_body.email)
    console.log(_body.password)
    const usersInDatabase = [{ email: "mailll@mail.mai", password: "hahaha22" }, { email: "aaa@aaa.aa", password: "22hah222" }]
    const usersNotVerified = [{ email: "nooo@verify.not", password: "hahaha22" }]
    let response = []
    if (usersNotVerified.some(e => e.email === _body.email && e.password === _body.password)) {
      response.push("E-mail is not verified.")
    }
    else if (!usersInDatabase.some(e => e.email === _body.email && e.password === _body.password)) {
      response.push("Unable to log in with provided credentials.")
    }
    if (response.length > 0) {
      return Promise.reject({
        response: {
          status: 400,
          data: response
        }
      })
    }
    else return Promise.resolve({
      status: 200,
      data: () => ({ key: "lsjflekjfifilsijflj" })
    })

  })
  jest.spyOn(api, 'loginUser').mockImplementation(loginUserMock)

});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("handling errors from backend", async () => {
  var page;
  var btn;
  var email;
  var password;
  await act(async () => {
    page = await render(<Login />);
    btn = await page.getByTestId("login-button")
    email = await page.getByTestId("login-email")
    password = await page.getByTestId("login-password");

    await fireEvent.change(email, { target: { value: "sthnotindb@mail.mai" } });
    await fireEvent.change(password, { target: { value: "hahaha22" } });
    await btn.click();
    await flushPromises()
    expect(enqueueSnackbarMock).toBeCalledTimes(1);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("کاربری با مشخصات وارد شده وجود ندارد", { variant: 'error', })

    await fireEvent.change(email, { target: { value: "nooo@verify.not" } });
    await fireEvent.change(password, { target: { value: "hahaha22" } });
    await btn.click();
    await flushPromises()
    expect(enqueueSnackbarMock).toBeCalledTimes(2);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("لطفا ابتدا ایمیلتان را تایید کنید.", { variant: 'error', })

    await fireEvent.change(email, { target: { value: "mailll@mail.mai" } });
    await fireEvent.change(password, { target: { value: "hahaha22" } });
    await btn.click();
    await flushPromises()
    expect(enqueueSnackbarMock).toBeCalledTimes(2);
  });

});



test("login user with email", async () => {
  var page;
  var email;
  var pass;
  var btn;
  await act(async () => {
    page = await render(<Login />);
    btn = await page.getByTestId("login-button")
    email = await page.getByTestId("login-email")
    await fireEvent.change(await page.getByTestId("login-password"), { target: { value: 'hahahaaaa' } });

  });
  await act(async () => {
    await email.focus();
    expect(email).toHaveValue("");
    await fireEvent.change(email, { target: { value: 'a' } });
    expect(email).toHaveValue("a");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(1);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error', })

    await fireEvent.change(email, { target: { value: 'ab' } });
    expect(email).toHaveValue("ab");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(2);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error', })

    await fireEvent.change(email, { target: { value: 'ایمیلم؟؟' } });
    expect(email).toHaveValue('ایمیلم؟؟');
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(3);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error', })

    await fireEvent.change(email, { target: { value: 'abaa@aaa' } });
    expect(email).toHaveValue("abaa@aaa");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(4);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error', })

    await fireEvent.change(email, { target: { value: 'abaa.aaa' } });
    expect(email).toHaveValue("abaa.aaa");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(5);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error', })
  });
});

test("login user with psdd", async () => {
  var page;
  var btn;
  var password;
  await act(async () => {
    page = await render(<Login />);
    btn = await page.getByTestId("login-button")
    password = await page.getByTestId("login-password");
    await fireEvent.change(await page.getByTestId("login-email"), { target: { value: 'aaa@aaa.aa' } });
  });
  await act(async () => {
    await password.focus();
    expect(password).toHaveValue("");
    await fireEvent.change(password, { target: { value: '1' } });
    expect(password).toHaveValue("1");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(1);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error', })

    await fireEvent.change(password, { target: { value: '12' } });
    expect(password).toHaveValue("12");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(2);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error', })

    await fireEvent.change(password, { target: { value: 'wer' } });
    expect(password).toHaveValue("wer");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(3);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error', })
  })
});
