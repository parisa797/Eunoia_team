import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Register from './register';
import '@testing-library/jest-dom';

const register = () => {
  const [values, setValues] = useState({
    username: "",
    password: "",
    email: ""
  });
}

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


test("register users by username", async () => {
  jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
      json: () => Promise.resolve(Register)
      })
  );
  var page;
  var username;
  await act(async () => {
      page = await render(<Register />);
      username = await page.getByTestId("register-username")
  });
  await act(async () => {
    await username.focus();
    expect(username).toHaveValue("");
    await fireEvent.change(username, { target: { value: 'a' } });
    expect(username).toHaveValue("a");
    await fireEvent.change(username, { target: { value: 'ab' } });
    expect(username).toHaveValue("ab");
    await fireEvent.change(username, { target: { value: 'lsjfaie' } });
    expect(username).toHaveValue('lsjfaie');
    await fireEvent.change(username, { target: { value: '' } });
    expect(username).toHaveValue('');
  })
});

test("register users by email", async () => {
  jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
      json: () => Promise.resolve(Register)
      })
  );
  var page;
  var email;
  await act(async () => {
      page = await render(<Register />);
      email = await page.getByTestId("register-email")
  });
  await act(async () => {
    await email.focus();
    expect(email).toHaveValue("");
    await fireEvent.change(email, { target: { value: 'a' } });
    expect(email).toHaveValue("a");
    await fireEvent.change(email, { target: { value: 'ab' } });
    expect(email).toHaveValue("ab");
    await fireEvent.change(email, { target: { value: 'fj.1403@gmail.com' } });
    expect(email).toHaveValue('fj.1403@gmail.com');
    await fireEvent.change(email, { target: { value: '' } });
    expect(email).toHaveValue('');
  })
});


test("register users password", async () => {
  jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
      json: () => Promise.resolve(Register)
      })
  );
  var page;
  var password;
  await act(async () => {
      page = await render(<Register />);
      password = await page.getByTestId("register-password")
  });
  await act(async () => {
    await password.focus();
    expect(password).toHaveValue("");
    await fireEvent.change(password, { target: { value: '1' } });
    expect(password).toHaveValue("1");
    await fireEvent.change(password, { target: { value: '12' } });
    expect(password).toHaveValue("12");
    await fireEvent.change(password, { target: { value: 'setare78' } });
    expect(password).toHaveValue('setare78');
    await fireEvent.change(password, { target: { value: '' } });
    expect(password).toHaveValue('');
  })
});
