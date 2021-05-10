import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Register from './register';
import '@testing-library/jest-dom';
import * as Snackbar from 'notistack';
import * as api from "./api";
import { RepeatOneSharp } from "@material-ui/icons";

let container = null;
const enqueueSnackbarMock = jest.fn()
const closeSnackbarMock = jest.fn()
const flushPromises = () => new Promise(setImmediate)
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);

  //mocking snackbar
  jest.spyOn(Snackbar, 'useSnackbar').mockImplementation(() => ({enqueueSnackbar:enqueueSnackbarMock, closeSnackbar:closeSnackbarMock}))

  //mocking createUser in './api' which has an api call with axios inside
  const createUserMock = jest.fn().mockImplementation((_body) => {
    const usernamesInDatabase = ['hahaa', 'mannam']
    const emailsInDatabase = ['email@mail.mail', 'mmm@mmm.mm']
    let response = []
    if (usernamesInDatabase.includes(_body?.username)) {
      response.push(["MyUser with this username already exists."])
    }
    if (emailsInDatabase.includes(_body?.email)) {
      response.push(["A user is already registered with this e-mail address."])
    }
    if(_body?.password1.length < 8){
      response.push(["This password is too short. It must contain at least 8 characters."])
    }
    if(_body?.password1.match(/^\d+$/) !== null){
      response.push(["This password is entirely numeric."])
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
      status: 201,
      data: () => ({ detail: "Verification e-mail sent." })
    })

  })
  jest.spyOn(api, 'createUser').mockImplementation(createUserMock)

});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});


test("register users by username", async () => {

  var page;
  var username;
  var btn;
  await act(async () => {
      page = await render(<Register />);
      username = await page.getByTestId("register-username")
      btn = await page.getByTestId("register-button")
      await fireEvent.change(await page.getByTestId("register-email"), { target: { value: 'aaaaa@aaa.aa' } });
      await fireEvent.change(await page.getByTestId("register-password"), { target: { value: 'hahahaaaa' } });
  });

  await act(async () => {
    await username.focus();
    expect(username).toHaveValue("");

    await fireEvent.change(username, { target: { value: 'a' } });
    expect(username).toHaveValue("a");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(1);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})

    await fireEvent.change(username, { target: { value: 'ab' } });
    expect(username).toHaveValue("ab");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(2);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})

    await fireEvent.change(username, { target: { value: 'lsjfaie' } });
    expect(username).toHaveValue('lsjfaie');
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(2);

    await fireEvent.change(username, { target: { value: 'hahaa' } });
    expect(username).toHaveValue("hahaa");
    await btn.click();
    await flushPromises()
    expect(enqueueSnackbarMock).toBeCalledTimes(3);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("کاربری با این نام وجود دارد", { variant: 'error',})
  })
});

test("register users by email", async () => {
  var page;
  var email;
  var btn;
  await act(async () => {
      page = await render(<Register />);
      email = await page.getByTestId("register-email")
      btn = await page.getByTestId("register-button")
      await fireEvent.change(await page.getByTestId("register-username"), { target: { value: 'aaaaaa' } });
      await fireEvent.change(await page.getByTestId("register-password"), { target: { value: 'hahahaaaa' } });
  });

  await act(async () => {
    await email.focus();
    expect(email).toHaveValue("");
    await fireEvent.change(email, { target: { value: 'a' } });
    expect(email).toHaveValue("a");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(1);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})

    await fireEvent.change(email, { target: { value: 'ab' } });
    expect(email).toHaveValue("ab");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(2);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})

    await fireEvent.change(email, { target: { value: 'ایمیلم؟؟' } });
    expect(email).toHaveValue('ایمیلم؟؟');
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(3);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})

    await fireEvent.change(email, { target: { value: 'abaa@aaa' } });
    expect(email).toHaveValue("abaa@aaa");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(4);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})

    await fireEvent.change(email, { target: { value: 'abaa.aaa' } });
    expect(email).toHaveValue("abaa.aaa");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(5);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})

    await fireEvent.change(email, { target: { value: 'fj.1403@gmail.com' } });
    expect(email).toHaveValue('fj.1403@gmail.com');
    await btn.click();
    await flushPromises()
    expect(enqueueSnackbarMock).toBeCalledTimes(5);

    await fireEvent.change(email, { target: { value: 'email@mail.mail' } });
    expect(email).toHaveValue('email@mail.mail');
    await btn.click();
    await flushPromises()
    expect(enqueueSnackbarMock).toBeCalledTimes(6);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("کاربری با این ایمیل وجود دارد", { variant: 'error',})
  })
});


test("register users password", async () => {
  var page;
  var password;
  var btn;
  await act(async () => {
      page = await render(<Register />);
      password = await page.getByTestId("register-password")
      btn = await page.getByTestId("register-button")
      await fireEvent.change(await page.getByTestId("register-username"), { target: { value: 'aaaaaa' } });
      await fireEvent.change(await page.getByTestId("register-email"), { target: { value: 'hahaha@haha.hah' } });
  });
  await act(async () => {
    await password.focus();
    expect(password).toHaveValue("");
    await fireEvent.change(password, { target: { value: '1' } });
    expect(password).toHaveValue("1");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(1);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})
    
    await fireEvent.change(password, { target: { value: '12' } });
    expect(password).toHaveValue("12");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(2);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})
    
    await fireEvent.change(password, { target: { value: 'setare78' } });
    expect(password).toHaveValue('setare78');
    await btn.click();
    await flushPromises()
    expect(enqueueSnackbarMock).toBeCalledTimes(2);

    await fireEvent.change(password, { target: { value: '787878' } });
    expect(password).toHaveValue('787878');
    await btn.click();
    await flushPromises()
    expect(enqueueSnackbarMock).toBeCalledTimes(4);
    expect(enqueueSnackbarMock).nthCalledWith(3,"حداقل ۸ کاراکتر باید داشته باشد.", { variant: 'error',})
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("حداقل یک حرف وارد کنید.", { variant: 'error',})

  })
});
