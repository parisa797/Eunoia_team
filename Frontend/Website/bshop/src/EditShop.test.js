import { render as Render, unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import EditShop from './EditShop';
import '@testing-library/jest-dom';


let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  const url = "/store/1";
  Object.defineProperty(window, 'location', {
    value: {
      href: url,
      pathname: url
    }
  });
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("edit shop page", async () => {
  localStorage.setItem('username', 'uwu')
  const shop = [{
    title: "فروشگاه",
    phone: "09900000000",
    id: 1
  }];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => shop
    })
  );
  await act(async () => {

    Render(<EditShop />, container);
  });
  expect(
    container.querySelector('[data-testid="edit-shop-title"]').getAttribute('value')
  ).toEqual(shop[0].title);
  expect(
    container.querySelector('[data-testid="edit-shop-shop-phone"]').getAttribute('value')
  ).toEqual("شماره تلفن فروشگاه را وارد کنید...");
  expect(
    container.querySelector('[data-testid="edit-shop-manager"]').getAttribute('value')
  ).toEqual("نام مدیر فروشگاه را وارد کنید...");
  expect(
    container.querySelector('[data-testid="edit-shop-phone"]').getAttribute('value')
  ).toEqual(shop[0].phone);
  expect(
    container.querySelector('[data-testid="edit-shop-address"]').textContent
  ).toEqual("آدرس را وارد کنید...");
});

test("title input in all possible ways", async () => {
  localStorage.setItem('username', 'uwu')
  const shop = [{
    phone: "09900000000",
    id: 1
  }];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => shop
    })
  );
  var page;
  var title;
  await act(async () => {
    page = await render(<EditShop />);
    title = await page.getByTestId("edit-shop-title");
  });
  expect(title).toHaveValue("عنوان فروشگاه را وارد کنید...");

  await act(async () => {
    await title.focus();
    expect(title).toHaveValue("");
    await fireEvent.change(title, { target: { value: 's' } });
    expect(title).toHaveValue("s");
    await fireEvent.change(title, { target: { value: 'sm' } });
    expect(title).toHaveValue("sm");
    await fireEvent.change(title, { target: { value: 'lsjfaiejfailejiajfeijflaeij' } });
    expect(title).toHaveValue('lsjfaiejfailejiajfeijflaeij');
    await fireEvent.change(title, { target: { value: '' } });
    expect(title).toHaveValue('');
    await title.blur();
    expect(title).toHaveValue("عنوان فروشگاه را وارد کنید...");
    await title.focus();
    expect(title).toHaveValue("");
    await fireEvent.change(title, { target: { value: 's' } });
    expect(title).toHaveValue("s");
    await title.blur();
    expect(title).toHaveValue("s");
    await title.focus();
    expect(title).toHaveValue("s");
  })
});

test("manager name input in all possible ways", async () => {
  localStorage.setItem('username', 'uwu')
  const shop = [{
    title: "kjfslfjlk",
    phone: "09900000000",
    address: "ناکجاآباد",
    id: 1
  }];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => shop
    })
  );
  var page;
  var manager;
  await act(async () => {
    page = await render(<EditShop />);
    manager = await page.getByTestId("edit-shop-manager");
  });
  expect(manager).toHaveValue("نام مدیر فروشگاه را وارد کنید...");

  await act(async () => {
    await manager.focus();
    expect(manager).toHaveValue("");
    await fireEvent.change(manager, { target: { value: 'من' } });
    expect(manager).toHaveValue("من");
    await fireEvent.change(manager, { target: { value: 'sm' } });
    expect(manager).toHaveValue("sm");
    await fireEvent.change(manager, { target: { value: 'lsjfaiejfailejiajfeijflaeij' } });
    expect(manager).toHaveValue('lsjfaiejfailejiajfeijflaeij');
    await fireEvent.change(manager, { target: { value: '' } });
    expect(manager).toHaveValue('');
    await manager.blur();
    expect(manager).toHaveValue("نام مدیر فروشگاه را وارد کنید...");
    await manager.focus();
    expect(manager).toHaveValue("");
    await fireEvent.change(manager, { target: { value: 's' } });
    expect(manager).toHaveValue("s");
    await manager.blur();
    expect(manager).toHaveValue("s");
    await manager.focus();
    expect(manager).toHaveValue("s");
  })
});

test("shop phone input in all possible ways", async () => {
  localStorage.setItem('username', 'uwu')
  const shop = [{
    id: 1
  }];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => shop
    })
  );
  var page;
  var phone;
  var save;
  await act(async () => {
    page = await render(<EditShop />);
    phone = await page.getByTestId("edit-shop-shop-phone");
  });
  expect(phone).toHaveValue("شماره تلفن فروشگاه را وارد کنید...");
  expect(page.queryByTestId("edit-shop-shop-phone-err")).toBeNull();

  await act(async () => {
    await phone.focus();
    expect(page.queryByTestId("edit-shop-shop-phone-err")).toBeNull();
    expect(phone).toHaveValue("0");

    await fireEvent.change(phone, { target: { value: phone.value + 'من' } });
    expect(phone).toHaveValue("0من");
    await phone.blur();
    expect(page.queryByTestId("edit-shop-shop-phone-err")).not.toBeNull();
    expect(page.queryByTestId("edit-shop-shop-phone-err")).toHaveTextContent("تنها عدد وارد کنید");

    await phone.focus();
    await fireEvent.change(phone, { target: { value: '0sm1' } });
    expect(phone).toHaveValue("0sm1");
    await phone.blur();
    expect(page.queryByTestId("edit-shop-shop-phone-err")).not.toBeNull();
    expect(page.queryByTestId("edit-shop-shop-phone-err")).toHaveTextContent("تنها عدد وارد کنید");

    await phone.focus();
    await fireEvent.change(phone, { target: { value: '099' } });
    expect(phone).toHaveValue("099");
    await phone.blur();
    expect(page.queryByTestId("edit-shop-shop-phone-err")).not.toBeNull();
    expect(page.queryByTestId("edit-shop-shop-phone-err")).toHaveTextContent("شماره همراه درست نیست!");

    await phone.focus();
    await fireEvent.change(phone, { target: { value: '093480234' } });
    expect(phone).toHaveValue("093480234");
    await phone.blur();
    expect(page.queryByTestId("edit-shop-shop-phone-err")).not.toBeNull();
    expect(page.queryByTestId("edit-shop-shop-phone-err")).toHaveTextContent("شماره همراه درست نیست!");

    await phone.focus();
    await fireEvent.change(phone, { target: { value: '' } });
    expect(phone).toHaveValue('0');
    await phone.blur();
    expect(page.queryByTestId("edit-shop-shop-phone-err")).toBeNull();
    expect(phone).toHaveValue("شماره تلفن فروشگاه را وارد کنید...");

    await phone.focus();
    expect(phone).toHaveValue("0");
    await fireEvent.change(phone, { target: { value: phone.value + '9111111111' } });
    expect(phone).toHaveValue("09111111111");
    await phone.blur();
    expect(page.queryByTestId("edit-shop-shop-phone-err")).toBeNull();
    expect(phone).toHaveValue("09111111111");
  })
});

test("manager's phone input in all possible ways", async () => {
  localStorage.setItem('username', 'uwu')
  const shop = [{
    id: 1
  }];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => shop
    })
  );
  var page;
  var phone;
  var save;
  await act(async () => {
    page = await render(<EditShop />);
    phone = await page.getByTestId("edit-shop-phone");
  });
  expect(phone).toHaveValue("شماره تلفن همراه مدیر را وارد کنید...");
  expect(page.queryByTestId("edit-shop-phone-err")).toBeNull();

  await act(async () => {
    await phone.focus();
    expect(page.queryByTestId("edit-shop-phone-err")).toBeNull();
    expect(phone).toHaveValue("0");

    await fireEvent.change(phone, { target: { value: phone.value + 'من' } });
    expect(phone).toHaveValue("0من");
    await phone.blur();
    expect(page.queryByTestId("edit-shop-phone-err")).not.toBeNull();
    expect(page.queryByTestId("edit-shop-phone-err")).toHaveTextContent("تنها عدد وارد کنید");

    await phone.focus();
    await fireEvent.change(phone, { target: { value: '0sm1' } });
    expect(phone).toHaveValue("0sm1");
    await phone.blur();
    expect(page.queryByTestId("edit-shop-phone-err")).not.toBeNull();
    expect(page.queryByTestId("edit-shop-phone-err")).toHaveTextContent("تنها عدد وارد کنید");

    await phone.focus();
    await fireEvent.change(phone, { target: { value: '099' } });
    expect(phone).toHaveValue("099");
    await phone.blur();
    expect(page.queryByTestId("edit-shop-phone-err")).not.toBeNull();
    expect(page.queryByTestId("edit-shop-phone-err")).toHaveTextContent("شماره همراه درست نیست!");

    await phone.focus();
    await fireEvent.change(phone, { target: { value: '093480234' } });
    expect(phone).toHaveValue("093480234");
    await phone.blur();
    expect(page.queryByTestId("edit-shop-phone-err")).not.toBeNull();
    expect(page.queryByTestId("edit-shop-phone-err")).toHaveTextContent("شماره همراه درست نیست!");

    await phone.focus();
    await fireEvent.change(phone, { target: { value: '' } });
    expect(phone).toHaveValue('0');
    await phone.blur();
    expect(page.queryByTestId("edit-shop-phone-err")).toBeNull();
    expect(phone).toHaveValue("شماره تلفن همراه مدیر را وارد کنید...");

    await phone.focus();
    expect(phone).toHaveValue("0");
    await fireEvent.change(phone, { target: { value: phone.value + '9111111111' } });
    expect(phone).toHaveValue("09111111111");
    await phone.blur();
    expect(page.queryByTestId("edit-shop-phone-err")).toBeNull();
    expect(phone).toHaveValue("09111111111");
  })
});

test("address input in all possible ways", async () => {
  localStorage.setItem('username', 'uwu')
  const shop = [{
    id: 1
  }];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => shop
    })
  );
  var page;
  var address;
  await act(async () => {
    page = await render(<EditShop />);
    address = await page.getByTestId("edit-shop-address");
  });
  expect(address).toHaveTextContent("آدرس را وارد کنید...");

  await act(async () => {
    await address.focus();
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

test("sell-online checkbox input in all possible ways", async () => {
  localStorage.setItem('username', 'uwu')
  const shop = [{
    id: 1
  }];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => shop
    })
  );
  var page;
  var sellOnline;
  await act(async () => {
    page = await render(<EditShop />);
    sellOnline = await page.getByTestId("edit-shop-checkbox");
  });
  expect(sellOnline).toHaveProperty('checked', false);

  await act(async () => {
    sellOnline.checked = !sellOnline.checked;
    expect(sellOnline).toHaveProperty('checked', true);
  })
});

test("cancel button", async () => {
  localStorage.setItem('username', 'uwu')
  const shop = [{
    phone: "09900000000",
    shop_phone: "09990000000",
    manager: "مدیر مدیر",
    title: "فروشگاه",
    address: "آدرس من",
    online: false,
    id: 1
  }];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => shop
    })
  );

  var page;
  await act(async () => {
    page = await render(<EditShop />);
  });
  var title = page.getByTestId("edit-shop-title");
  expect(title).toHaveValue(shop[0].title);
  var manager = page.getByTestId("edit-shop-manager");
  expect(manager).toHaveValue(shop[0].manager);
  var shop_phone = page.getByTestId("edit-shop-shop-phone");
  expect(shop_phone).toHaveValue(shop[0].shop_phone);
  var phone = page.getByTestId("edit-shop-phone");
  expect(phone).toHaveValue(shop[0].phone);
  var address = page.getByTestId("edit-shop-address");
  expect(address).toHaveValue(shop[0].address);
  var sellOnline = page.getByTestId("edit-shop-checkbox");
  expect(sellOnline).toHaveProperty('checked', false);

  await act(async () => {
    await title.focus();
    await fireEvent.change(title, { target: { value: "عنوان دیگر" } });
    await title.blur();
    expect(title).toHaveValue("عنوان دیگر");
    await manager.focus();
    await fireEvent.change(manager, { target: { value: 'اسم دیگر' } });
    expect(manager).toHaveValue("اسم دیگر");
    await phone.focus();
    await fireEvent.change(phone, { target: { value: "09106666666" } });
    expect(phone).toHaveValue("09106666666");
    await shop_phone.focus();
    await fireEvent.change(shop_phone, { target: { value: "09106666666" } });
    expect(shop_phone).toHaveValue("09106666666");
    await address.focus();
    await fireEvent.change(address, { target: { value: 'کوچه ...' } });
    expect(address).toHaveValue("کوچه ...");
    sellOnline.checked = !sellOnline.checked;
    expect(sellOnline).toHaveProperty('checked', true);
  })
})

test("region input in all possible ways", async () => {
  localStorage.setItem('username', 'uwu')
  const shop = [{
    title: "kjfslfjlk",
    phone: "09900000000",
    address: "ناکجاآباد",
    id: 1
  }];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => shop
    })
  );
  var page;
  var manager;
  await act(async () => {
    page = await render(<EditShop />);
    manager = await page.getByTestId("edit-shop-mantaghe");
  });
  expect(manager).toHaveValue("منطقه فروشگاه را وارد کنید...");

  await act(async () => {
    await manager.focus();
    expect(manager).toHaveValue("");
    await fireEvent.change(manager, { target: { value: 'من' } });
    expect(manager).toHaveValue("من");
    await fireEvent.change(manager, { target: { value: '13' } });
    expect(manager).toHaveValue("13");
    await fireEvent.change(manager, { target: { value: 'lsjfaiejfailejiajfeijflaeij' } });
    expect(manager).toHaveValue('lsjfaiejfailejiajfeijflaeij');
    await fireEvent.change(manager, { target: { value: '' } });
    expect(manager).toHaveValue('');
    await manager.blur();
    expect(manager).toHaveValue("منطقه فروشگاه را وارد کنید...");
    await manager.focus();
    expect(manager).toHaveValue("");
    await fireEvent.change(manager, { target: { value: '1' } });
    expect(manager).toHaveValue("1");
    await manager.blur();
    expect(manager).toHaveValue("1");
    await manager.focus();
    expect(manager).toHaveValue("1");
  })
});