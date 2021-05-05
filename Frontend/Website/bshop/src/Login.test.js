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
    const usersInDatabase = [{email:"mailll@mail.mai", password:"hahaha22"},{email:"aaa@aaa.aa", password:"22hah222"}]
    let response = []
    if (!usersInDatabase.includes({email:_body.email,password:_body.password})) {
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

test("login user", async () => {
  var page;
  var btn;
  await act(async () => {
      page = await render(<Login />);
      btn = await page.getByTestId("login-button")
      await fireEvent.change(await page.getByTestId("login-email"), { target: { value: 'aaaaa@aaa.aa' } });
      await fireEvent.change(await page.getByTestId("login-password"), { target: { value: 'hahahaaaa' } });
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
      pass = await page.getByTestId("login-password")
  });

});

test("login user with psdd", async () => {
  var page;
  await act(async () => {
    page = await render(<Login />);
  });

});

// test("login name input in all possible ways", async () => {
//   // localStorage.setItem('username', 'uwu')
//   const Login = [{
//     email: "setare@gmail.com",
//     password: "1378"
//   }];
//   jest.spyOn(global, "fetch").mockImplementation(() =>
//     Promise.resolve({
//       // status: 200,
//       json: () => Login
//     })
//   );
//   var page;
//   // var email;
//   await act(async () => {
//     page = await render(<loginUser />);
//     // email = await page.getByTestId("login-user");
//   });
//   // expect(email).toHaveValue("ایمیل خود را وارد کنید");
//   expect(page.queryByTestId("login-email")).not.toBeNull();
//   // expect(page.queryByTestId("item-Expiration_jalali")).not.toBeNull();

// });