import { render as Render, unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ProfilePage from './ProfilePage';
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

test("after sign up profile page", async () => {
  localStorage.setItem('username', 'uwu')
  const fakeUser = {
    username: "uwu",
    email: "sb@gmail.com",
    role: "buyer",
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => fakeUser
    })
  );
  await act(async () => {

    Render(<ProfilePage />, container);
  });
  //all inputs except email should have their default value
  expect(
    container.querySelector('[data-testid="email"]').getAttribute('value')
  ).toEqual(fakeUser.email);
  expect(
    container.querySelector('[data-testid="first-name"]').getAttribute('value')
  ).toEqual("نام خود را وارد کنید...");
  expect(
    container.querySelector('[data-testid="last-name"]').getAttribute('value')
  ).toEqual("نام خانوادگی خود را وارد کنید...");
  expect(
    container.querySelector('[data-testid="phone"]').getAttribute('value')
  ).toEqual("شماره تلفن همراه را وارد کنید...");
  expect(
    container.querySelector('[data-testid="address"]').textContent
  ).toEqual("آدرس را وارد کنید...");
  //since the user's a buyer, the below div shoud be there
  expect(
    container.querySelector('[data-testid="become-a-seller"]')
  ).not.toBeNull();
  //no save/cancel buttons shoud appear rn
  expect(
    container.querySelector('[data-testid="save-button"]')
  ).toBeNull();
  expect(
    container.querySelector('[data-testid="cancel-button"]')
  ).toBeNull();
});

test("first name input in all possible ways", async () => {
  localStorage.setItem('username', 'uwu')
  const fakeUser = {
    username: "uwu",
    email: "sb@gmail.com",
    role: "buyer",
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => fakeUser
    })
  );
  var page;
  var fname;
  var save;
  await act(async () => {
    page = await render(<ProfilePage />);
    fname = await page.getByTestId("first-name");
    save = await page.queryByTestId("save-button");
  });
  expect(fname).toHaveValue("نام خود را وارد کنید...");
  expect(save).toBeNull();

  await act(async () => {
    await fname.focus();
    save = await page.queryByTestId("save-button");
    expect(save).not.toBeNull();
    expect(fname).toHaveValue("");
    await fireEvent.change(fname, { target: { value: 's' } });
    expect(fname).toHaveValue("s");
    await fireEvent.change(fname, { target: { value: 'sm' } });
    expect(fname).toHaveValue("sm");
    await fireEvent.change(fname, { target: { value: 'lsjfaiejfailejiajfeijflaeij' } });
    expect(fname).toHaveValue('lsjfaiejfailejiajfeijflaeij');
    await fireEvent.change(fname, { target: { value: '' } });
    expect(fname).toHaveValue('');
    await fname.blur();
    expect(fname).toHaveValue("نام خود را وارد کنید...");
    await fname.focus();
    expect(fname).toHaveValue("");
    await fireEvent.change(fname, { target: { value: 's' } });
    expect(fname).toHaveValue("s");
    await fname.blur();
    expect(fname).toHaveValue("s");
    await fname.focus();
    expect(fname).toHaveValue("s");
  })
});

test("last name input in all possible ways", async () => {
  localStorage.setItem('username', 'uwu')
  const fakeUser = {
    username: "uwu",
    email: "sb@gmail.com",
    role: "buyer",
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => fakeUser
    })
  );
  var page;
  var lname;
  var save;
  await act(async () => {
    page = await render(<ProfilePage />);
    lname = await page.getByTestId("last-name");
    save = await page.queryByTestId("save-button");
  });
  expect(lname).toHaveValue("نام خانوادگی خود را وارد کنید...");
  expect(save).toBeNull();

  await act(async () => {
    await lname.focus();
    save = await page.queryByTestId("save-button");
    expect(save).not.toBeNull();
    expect(lname).toHaveValue("");
    await fireEvent.change(lname, { target: { value: 'من' } });
    expect(lname).toHaveValue("من");
    await fireEvent.change(lname, { target: { value: 'sm' } });
    expect(lname).toHaveValue("sm");
    await fireEvent.change(lname, { target: { value: 'lsjfaiejfailejiajfeijflaeij' } });
    expect(lname).toHaveValue('lsjfaiejfailejiajfeijflaeij');
    await fireEvent.change(lname, { target: { value: '' } });
    expect(lname).toHaveValue('');
    await lname.blur();
    expect(lname).toHaveValue("نام خانوادگی خود را وارد کنید...");
    await lname.focus();
    expect(lname).toHaveValue("");
    await fireEvent.change(lname, { target: { value: 's' } });
    expect(lname).toHaveValue("s");
    await lname.blur();
    expect(lname).toHaveValue("s");
    await lname.focus();
    expect(lname).toHaveValue("s");
  })
});

test("phone input in all possible ways", async () => {
  localStorage.setItem('username', 'uwu')
  const fakeUser = {
    user_name: "uwu",
    email: "sb@gmail.com",
    role: "buyer",
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => fakeUser
    })
  );
  var page;
  var phone;
  var save;
  await act(async () => {
    page = await render(<ProfilePage />);
    phone = await page.getByTestId("phone");
    save = await page.queryByTestId("save-button");
  });
  expect(phone).toHaveValue("شماره تلفن همراه را وارد کنید...");
  expect(page.queryByTestId("phone-err")).toBeNull();
  expect(save).toBeNull();

  await act(async () => {
    await phone.focus();
    save = await page.queryByTestId("save-button");
    expect(page.queryByTestId("phone-err")).toBeNull();
    expect(save).not.toBeNull();
    expect(phone).toHaveValue("0");

    await fireEvent.change(phone, { target: { value: phone.value + 'من' } });
    expect(phone).toHaveValue("0من");
    await phone.blur();
    expect(page.queryByTestId("phone-err")).not.toBeNull();
    expect(page.queryByTestId("phone-err")).toHaveTextContent("تنها عدد وارد کنید");

    await phone.focus();
    await fireEvent.change(phone, { target: { value: '0sm1' } });
    expect(phone).toHaveValue("0sm1");
    await phone.blur();
    expect(page.queryByTestId("phone-err")).not.toBeNull();
    expect(page.queryByTestId("phone-err")).toHaveTextContent("تنها عدد وارد کنید");

    await phone.focus();
    await fireEvent.change(phone, { target: { value: '099' } });
    expect(phone).toHaveValue("099");
    await phone.blur();
    expect(page.queryByTestId("phone-err")).not.toBeNull();
    expect(page.queryByTestId("phone-err")).toHaveTextContent("شماره همراه درست نیست!");

    await phone.focus();
    await fireEvent.change(phone, { target: { value: '093480234' } });
    expect(phone).toHaveValue("093480234");
    await phone.blur();
    expect(page.queryByTestId("phone-err")).not.toBeNull();
    expect(page.queryByTestId("phone-err")).toHaveTextContent("شماره همراه درست نیست!");

    await phone.focus();
    await fireEvent.change(phone, { target: { value: '' } });
    expect(phone).toHaveValue('0');
    await phone.blur();
    expect(page.queryByTestId("phone-err")).toBeNull();
    expect(phone).toHaveValue("شماره تلفن همراه را وارد کنید...");

    await phone.focus();
    expect(phone).toHaveValue("0");
    await fireEvent.change(phone, { target: { value: phone.value + '9111111111' } });
    expect(phone).toHaveValue("09111111111");
    await phone.blur();
    expect(page.queryByTestId("phone-err")).toBeNull();
    expect(phone).toHaveValue("09111111111");
  })
});

test("email input in all possible ways", async () => {
  localStorage.setItem('username', 'uwu')
  const fakeUser = {
    user_name: "uwu",
    email: "sb@gmail.com",
    role: "buyer",
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => fakeUser
    })
  );
  var page;
  var email;
  var save;
  await act(async () => {
    page = await render(<ProfilePage />);
    email = await page.getByTestId("email");
    save = await page.queryByTestId("save-button");
  });
  expect(email).toHaveValue(fakeUser.email);
  expect(page.queryByTestId("email-err")).toBeNull();
  expect(save).toBeNull();

  await act(async () => {
    await email.focus();
    save = await page.queryByTestId("save-button");
    expect(page.queryByTestId("email-err")).toBeNull();
    expect(save).not.toBeNull();
    expect(email).toHaveValue(fakeUser.email);

    await fireEvent.change(email, { target: { value: "h" } });
    expect(email).toHaveValue("h");
    await email.blur();
    expect(email).toHaveValue("h");
    expect(page.queryByTestId("email-err")).not.toBeNull();
    expect(page.queryByTestId("email-err")).toHaveTextContent("ایمیل به درستی وارد نشده است!");

    await email.focus();
    await fireEvent.change(email, { target: { value: 'haha@lol' } });
    expect(email).toHaveValue("haha@lol");
    await email.blur();
    expect(email).toHaveValue("haha@lol");
    expect(page.queryByTestId("email-err")).not.toBeNull();
    expect(page.queryByTestId("email-err")).toHaveTextContent("ایمیل به درستی وارد نشده است!");

    await email.focus();
    await fireEvent.change(email, { target: { value: 'haha.lol@com' } });
    expect(email).toHaveValue("haha.lol@com");
    await email.blur();
    expect(email).toHaveValue("haha.lol@com");
    expect(page.queryByTestId("email-err")).not.toBeNull();
    expect(page.queryByTestId("email-err")).toHaveTextContent("ایمیل به درستی وارد نشده است!");

    await email.focus();
    await fireEvent.change(email, { target: { value: 'haha@lol.com' } });
    expect(email).toHaveValue("haha@lol.com");
    await email.blur();
    expect(email).toHaveValue("haha@lol.com");
    expect(page.queryByTestId("email-err")).toBeNull();

    await email.focus();
    await fireEvent.change(email, { target: { value: '' } });
    expect(email).toHaveValue('');
    await email.blur();
    expect(page.queryByTestId("email-err")).toBeNull();
    expect(email).toHaveValue(fakeUser.email);

    await email.focus();
    expect(email).toHaveValue(fakeUser.email);
    await email.blur();
    expect(page.queryByTestId("email-err")).toBeNull();
    expect(email).toHaveValue(fakeUser.email);
  })
});

test("address input in all possible ways", async () => {
  localStorage.setItem('username', 'uwu')
  const fakeUser = {
    user_name: "uwu",
    email: "sb@gmail.com",
    role: "buyer",
  };
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => fakeUser
    })
  );
  var page;
  var address;
  var save;
  await act(async () => {
    page = await render(<ProfilePage />);
    address = await page.getByTestId("address");
    save = await page.queryByTestId("save-button");
  });
  expect(address).toHaveTextContent("آدرس را وارد کنید...");
  expect(save).toBeNull();

  await act(async () => {
    await address.focus();
    save = await page.queryByTestId("save-button");
    expect(save).not.toBeNull();
    expect(address).toHaveTextContent("");
    await fireEvent.change(address, { target: { value: 'کوچه ...' } });
    expect(address).toHaveTextContent("کوچه ...");
    await fireEvent.change(address, { target: { value: 'sm' } });
    expect(address).toHaveTextContent("sm");
    await fireEvent.change(address, { target: { value: 'چه آدرس بلندیییییییییییییییییییییییییییییییییییییی' } });
    expect(address).toHaveTextContent('چه آدرس بلندیییییییییییییییییییییییییییییییییییییی');
    await fireEvent.change(address, { target: { value: '' } });
    expect(address).toHaveTextContent('');
    await address.blur();
    expect(address).toHaveTextContent("آدرس را وارد کنید...");
    await address.focus();
    expect(address).toHaveTextContent("");
    await fireEvent.change(address, { target: { value: 's' } });
    expect(address).toHaveTextContent("s");
    await address.blur();
    expect(address).toHaveTextContent("s");
    await address.focus();
    expect(address).toHaveTextContent("s");
  })
});