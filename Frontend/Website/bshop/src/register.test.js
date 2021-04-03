import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Register from './register';
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


test("register users", async () => {
    const Register = {
        email: "fj.1403@yahoo.com",
        password: "12345",
        username: "setare1"
    };
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
        json: () => Promise.resolve(Register)
        })
    );
    var page;
    await act(async () => {
        page = await render(<register />);
    });
});