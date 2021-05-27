import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import RegisterStore from './registerStore';
import '@testing-library/jest-dom';
import * as Snackbar from 'notistack';
import * as api from "./api";

const enqueueSnackbarMock = jest.fn()
const closeSnackbarMock = jest.fn()
const flushPromises = () => new Promise(setImmediate)
let container = null;
beforeEach(() => {
  
  //mocking snackbar
  jest.spyOn(Snackbar, 'useSnackbar').mockImplementation(() => ({enqueueSnackbar:enqueueSnackbarMock, closeSnackbar:closeSnackbarMock}))

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

test("register shop code length ", async () => {
  var page;
  var code;
  var btn;
  
  await act(async () => {
      page = await render(<RegisterStore />);
      code = await page.getByTestId("register-shop-name");
      btn = await page.getByTestId("register-shop-button");
      await fireEvent.change(await page.getByTestId("register-shop-name"), { target: { value: 'janbooo' } });
      await fireEvent.change(await page.getByTestId("register-shop-ownername"), { target: { value: 'shaghayegh joon' } });
      await fireEvent.change(await page.getByTestId("register-shop-phone"), { target: { value: '09122112525' } });
      await fireEvent.change(await page.getByTestId("register-shop-address"), { target: { value: 'khoneyeshaghayegh joon' } });
      // await fireEvent.change(await page.getByTestId("register-shop-image"));
    
  });

  await act(async () => {
    await fireEvent.change(code, { target: { value: '1' } });
    expect(code).toHaveValue("1");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(1);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})


    await fireEvent.change(code, { target: { value: '12' } });
    expect(code).toHaveValue("12");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(2);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})


    await fireEvent.change(code, { target: { value: '023' } });
    expect(code).toHaveValue("023");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(3);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})


    await fireEvent.change(code, { target: { value: 'عدد' } });
    expect(code).toHaveValue("عدد");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(4);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})


    await fireEvent.change(code, { target: { value: '12-8' } });
    expect(code).toHaveValue("12-8");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(5);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})


    
  })
});

test("register for store", async () => {
  var page;
  await act(async () => {
    page = await render(<RegisterStore />);
  });
});

test("register shop storename ", async () => {
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

test("register shop storename ", async () => {
  var page;
  var storename;
  await act(async () => {
      page = await render(<RegisterStore />);
      storename = await page.getByTestId("register-shop-name");
  });

  await act(async () => {
    await storename.focus();
    expect(storename).toHaveValue("");
    await fireEvent.change(storename, { target: { value: 'setare' } });
    expect(storename).toHaveValue("setare");
    await fireEvent.change(storename, { target: { value: 'ستاره' } });
    expect(storename).toHaveValue('ستاره');
    await fireEvent.change(storename, { target: { value: '' } });
    expect(storename).toHaveValue('');
  })
});

test("register shop phone ", async () => {
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
  var page;
  var region;
  await act(async () => {
      page = await render(<RegisterStore />);
      region = await page.getByTestId("register-shop-region");
  });
  await act(async () => {
    // await region.focus();
    // expect(region).toHaveValue("");
    await fireEvent.change(region, { target: { value: '22' } });
    expect(region).toHaveValue("22");
    await fireEvent.change(region, { target: { value: '' } });
    expect(region).toHaveValue('');
  })
});

test("register shop address length ", async () => {
  var page;
  var address;
  var btn;
  await act(async () => {
      page = await render(<RegisterStore />);
      address = await page.getByTestId("register-shop-address");
      btn = await page.getByTestId("register-shop-button");
      await fireEvent.change(await page.getByTestId("register-shop-name"), { target: { value: 'janbooo' } });
      await fireEvent.change(await page.getByTestId("register-shop-code"), { target: { value: '123456778' } });
      await fireEvent.change(await page.getByTestId("register-shop-phone"), { target: { value: '09122112525' } });
      await fireEvent.change(await page.getByTestId("register-shop-ownername"), { target: { value: 'shaghayegh joon' } });
  });

  await act(async () => {
    await fireEvent.change(address, { target: { value: 'a' } });
    expect(address).toHaveValue("a");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(1);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})

  })
});

test("register shop ownerName length ", async () => {
  var page;
  var ownerName;
  var btn;
  await act(async () => {
      page = await render(<RegisterStore />);
      ownerName = await page.getByTestId("register-shop-ownername");
      btn = await page.getByTestId("register-shop-button");
      await fireEvent.change(await page.getByTestId("register-shop-name"), { target: { value: 'janbooo' } });
      await fireEvent.change(await page.getByTestId("register-shop-code"), { target: { value: '123456778' } });
      await fireEvent.change(await page.getByTestId("register-shop-phone"), { target: { value: '09122112525' } });
      await fireEvent.change(await page.getByTestId("register-shop-address"), { target: { value: 'khoneyeshaghayegh joon' } });
  });

  await act(async () => {
    await fireEvent.change(ownerName, { target: { value: 'a' } });
    expect(ownerName).toHaveValue("a");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(1);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})



  })
});

test("register shop storeName length ", async () => {
  var page;
  var storeName;
  var btn;
  await act(async () => {
      page = await render(<RegisterStore />);
      storeName = await page.getByTestId("register-shop-name");
      btn = await page.getByTestId("register-shop-button");
      await fireEvent.change(await page.getByTestId("register-shop-ownername"), { target: { value: 'janbooo' } });
      await fireEvent.change(await page.getByTestId("register-shop-code"), { target: { value: '123456778' } });
      await fireEvent.change(await page.getByTestId("register-shop-phone"), { target: { value: '09122112525' } });
      await fireEvent.change(await page.getByTestId("register-shop-address"), { target: { value: 'khoneyeshaghayegh joon' } });
  });

  await act(async () => {
    await fireEvent.change(storeName, { target: { value: 'a' } });
    expect(storeName).toHaveValue("a");
    await btn.click();
    expect(enqueueSnackbarMock).toBeCalledTimes(1);
    expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.', { variant: 'error',})

  })
});

