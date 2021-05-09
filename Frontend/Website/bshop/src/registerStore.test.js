import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import RegisterStore from './registerStore';
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

test("register for store", async () => {

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve("")
    })
  );
  var page;
  await act(async () => {
    page = await render(<RegisterStore />);
  });
});

test("register shop storename ", async () => {
  const Register = {
    storeName: "هایپراستار",
    ownerName: "setare",
    address: "khonamon",
    code: "123456",
    phone: "09122111111"
  };
  // jest.spyOn(global, "fetch").mockImplementation(() =>
  //     Promise.resolve({
  //     json: () => Promise.resolve(RegisterStore)
  //     })
  // );
  var page;
  var storeName;
  await act(async () => {
      page = await render(<RegisterStore />);
      storeName = await page.getByTestId("register-shop-name");
  });

  await act(async () => {
    await storeName.focus();
    expect(storeName).toHaveValue("");
    await fireEvent.change(storeName, { target: { value: 'هایپرمارکت' } });
    expect(storeName).toHaveValue("هایپرمارکت");
    await fireEvent.change(storeName, { target: { value: 'uygesdbz' } });
    expect(storeName).toHaveValue('uygesdbz');
    await fireEvent.change(storeName, { target: { value: '' } });
    expect(storeName).toHaveValue('');
  })
});

test("register shop username ", async () => {
  const Register = {
    storeName: "هایپراستار",
    ownerName: "setare",
    address: "khonamon",
    code: "123456",
    phone: "09122111111"
  };
  var page;
  var username;
  await act(async () => {
      page = await render(<RegisterStore />);
      username = await page.getByTestId("register-shop-ownername");
  });

  await act(async () => {
    await username.focus();
    expect(username).toHaveValue("");
    await fireEvent.change(username, { target: { value: 'setare' } });
    expect(username).toHaveValue("setare");
    await fireEvent.change(username, { target: { value: 'ستاره' } });
    expect(username).toHaveValue('ستاره');
    await fireEvent.change(username, { target: { value: '' } });
    expect(username).toHaveValue('');
  })
});

test("register shop phone ", async () => {
  const Register = {
    storeName: "هایپراستار",
    ownerName: "setare",
    address: "khonamon",
    code: "123456",
    phone: "09122111111"
  };
  var page;
  var phone;
  await act(async () => {
      page = await render(<RegisterStore />);
      phone = await page.getByTestId("register-shop-phone");
  });

  await act(async () => {
    await phone.focus();
    expect(phone).toHaveValue("");
    await fireEvent.change(phone, { target: { value: '09122111111' } });
    expect(phone).toHaveValue("09122111111");
    await fireEvent.change(phone, { target: { value: '091222222222' } });
    expect(phone).toHaveValue('091222222222');
    await fireEvent.change(phone, { target: { value: '' } });
    expect(phone).toHaveValue('');
  })
});


test("register shop code ", async () => {
  const Register = {
    storeName: "هایپراستار",
    ownerName: "setare",
    address: "khonamon",
    code: "123456",
    phone: "09122111111"
  };
  var page;
  var code;
  await act(async () => {
      page = await render(<RegisterStore />);
      code = await page.getByTestId("register-shop-code");
  });

  await act(async () => {
    await code.focus();
    expect(code).toHaveValue("");
    await fireEvent.change(code, { target: { value: '123456' } });
    expect(code).toHaveValue("123456");
    await fireEvent.change(code, { target: { value: '' } });
    expect(code).toHaveValue('');
  })
});

test("register shop region ", async () => {
  const Register = {
    storeName: "هایپراستار",
    ownerName: "setare",
    address: "khonamon",
    code: "123456",
    phone: "09122111111",
    region:"22"
  };

  var page;
  var region;
  await act(async () => {
      page = await render(<RegisterStore />);
      region = await page.getByTestId("register-shop-region");
  });
  await act(async () => {
    await region.focus();
    expect(region).toHaveValue("");
    await fireEvent.change(region, { target: { value: '22' } });
    expect(region).toHaveValue("22");
    await fireEvent.change(region, { target: { value: '' } });
    expect(region).toHaveValue('');
  })
});

test("register shop address length ", async () => {
  const Register = {
    storeName: "هایپراستار",
    ownerName: "setare",
    address: "onja",
    code: "123456",
    phone: "09122111111"
  };
  var page;
  var address;
  await act(async () => {
      page = await render(<RegisterStore />);
      address = await page.getByTestId("register-shop-address");
  });

  await act(async () => {
    await fireEvent.change(username, { target: { value: 'a' } });
    expect(address).toHaveValue("a");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(1);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})

  })
});