import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Login from './login';
import '@testing-library/jest-dom';


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