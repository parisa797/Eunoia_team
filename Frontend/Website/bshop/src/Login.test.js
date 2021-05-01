import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Login from './login';
import '@testing-library/jest-dom';
import { loginUser } from "./api";



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

test("login user", async () => {
        const Login = [{ username: "setare1",password: '12345'}
        ,{ username: "setare2",password: '00123'}
        ,{ username: "setare3",password: '02314'}
        ,{ username: "setare4",password: '35688'}
    ];
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(Login)
      })
    );
    var page;
  await act(async () => {
    page = await render(<loginUser />);
  });

});



test("login user with email", async () => {
  const Login = [{ username: "setare1",password: '12345'}
  ,{ username: "ستاره",password: '00123'}
  ,{ username: " ",password: '02314'}
];
jest.spyOn(global, "fetch").mockImplementation(() =>
Promise.resolve({
  json: () => Promise.resolve(Login)
})
);
var page;
await act(async () => {
page = await render(<loginUser />);
});

});

test("login user with psdd", async () => {
  const Login = [{ username: "setare1",password: '12345'}
  ,{ username: "setare1",password: ''}
  ,{ username: "setare1",password: 'setare666878'}
];
jest.spyOn(global, "fetch").mockImplementation(() =>
Promise.resolve({
  json: () => Promise.resolve(Login)
})
);
var page;
await act(async () => {
page = await render(<loginUser />);
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