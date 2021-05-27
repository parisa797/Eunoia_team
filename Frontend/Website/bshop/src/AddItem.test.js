import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import AddItem from './AddItem';
import '@testing-library/jest-dom';
import * as Snackbar from 'notistack';
import * as api from "./api";
const fetchMock = require('fetch-mock-jest');

// jest.useFakeTimers()
let container = null;
const enqueueSnackbarMock = jest.fn()
const closeSnackbarMock = jest.fn()
const flushPromises = () => new Promise(setImmediate)
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    global.window = Object.create(window);
    
    //mocking snackbar
    jest.spyOn(Snackbar, 'useSnackbar').mockImplementation(() => ({ enqueueSnackbar: enqueueSnackbarMock, closeSnackbar: closeSnackbarMock }))

    const url = "/Item/3";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    //mocking loginUser in './api' which has an api call with axios inside
  const AddItemmock = jest.fn().mockImplementation((_body) => {
    console.log(_body.name)
    console.log(_body.manufacture_Date)
    console.log(_body.Expiration_Date)
    console.log(_body.count)
    console.log(_body.price)
    console.log(_body.category)

  })
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

test("name input in all ways", async () => {
    localStorage.setItem('username', 'abc')
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        status: 201
      })
);
    var page;
    var name;
    await act(async () => {
    page = await render(<AddItem />);
    name = await page.getByTestId("add-item-name");
    });

await act(async () => {
  await name.focus();
  expect(name).toHaveValue("");
  await fireEvent.change(name, { target: { value: 'a' } });
  expect(name).toHaveValue("a");
  await fireEvent.change(name, { target: { value: 'ab' } });
  expect(name).toHaveValue("ab");
  await fireEvent.change(name, { target: { value: 'lsjfaiejfailejiajfeijflaeij' } });
  expect(name).toHaveValue('lsjfaiejfailejiajfeijflaeij');
  await fireEvent.change(name, { target: { value: '' } });
  expect(name).toHaveValue('');
})
});

test("description input in all ways", async () => {
    localStorage.setItem('username', 'abc')
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        status: 201
      })
);
var page;
var name;
await act(async () => {
  page = await render(<AddItem />);
  description = await page.getByTestId("add-item-description");
});

    await act(async () => {
      await description.focus();
      expect(description).toHaveValue("");
      await fireEvent.change(description, { target: { value: 'ماست' } });
      expect(description).toHaveValue("ماست");
      await fireEvent.change(description, { target: { value: 'sm' } });
      expect(description).toHaveValue("sm");
      await fireEvent.change(description, { target: { value: 'lsjfaiejfailejiajfeijflaeij' } });
      expect(description).toHaveValue('lsjfaiejfailejiajfeijflaeij');
      await fireEvent.change(description, { target: { value: '' } });
      expect(description).toHaveValue('');
    })
  });
  
  test("manufacture_Date input in all ways", async () => {
    localStorage.setItem('username', 'abc')
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        status: 201
      })
);
    var page;
    var manufacture_Date;
    await act(async () => {
      page = await render(<AddItem />);
      manufacture_Date = await page.getByTestId("add-item-manufacture_Date");
    });
  
    await act(async () => {
 
      await fireEvent.change(manufacture_Date, { target: { value: manufacture_Date.value + '1400/01/01' } });
      expect(manufacture_Date).toHaveValue("1400/01/01");
 
      await manufacture_Date.focus();
      await fireEvent.change(manufacture_Date, { target: { value: '1401/01/' } });
      expect(manufacture_Date).toHaveValue("1401/01/");
      
      await manufacture_Date.focus();
      await fireEvent.change(manufacture_Date, { target: { value: '1401//01' } });
      expect(manufacture_Date).toHaveValue("1401//01");
       
      await manufacture_Date.focus();
      await fireEvent.change(manufacture_Date, { target: { value: '/01/01' } });
      expect(manufacture_Date).toHaveValue("/01/01");

      await manufacture_Date.focus();
      await fireEvent.change(manufacture_Date, { target: { value: '1400/0/0' } });
      expect(manufacture_Date).toHaveValue("1400/0/0");

      await manufacture_Date.focus();
      await fireEvent.change(manufacture_Date, { target: { value: '' } });
      expect(manufacture_Date).toHaveValue('');
    
      await manufacture_Date.focus();
      await fireEvent.change(manufacture_Date, { target: { value: "0" } });
      expect(manufacture_Date).toHaveValue("0");

    })
  });

  test("Expiration_Date input in all ways", async () => {
    localStorage.setItem('username', 'abc')
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        status: 201
      })
);
    var page;
    var Expiration_Date;
    await act(async () => {
      page = await render(<AddItem />);
      Expiration_Date = await page.getByTestId("add-item-Expiration_Date");
    });
  
    await act(async () => {
 
      await fireEvent.change(Expiration_Date, { target: { value: Expiration_Date.value + '1400/01/01' } });
      expect(Expiration_Date).toHaveValue("1400/01/01");
      await Expiration_Date.focus();
      await fireEvent.change(Expiration_Date, { target: { value: '1401/01/' } });
      expect(Expiration_Date).toHaveValue("1401/01/");
      await Expiration_Date.focus();
      await fireEvent.change(Expiration_Date, { target: { value: '1401//01' } });
      expect(Expiration_Date).toHaveValue("1401//01");
      await Expiration_Date.focus();
      await fireEvent.change(Expiration_Date, { target: { value: '/01/01' } });
      expect(Expiration_Date).toHaveValue("/01/01");
      await Expiration_Date.focus();
      await fireEvent.change(Expiration_Date, { target: { value: '1400/0/0' } });
      expect(Expiration_Date).toHaveValue("1400/0/0");
      await Expiration_Date.focus();
      await fireEvent.change(Expiration_Date, { target: { value: '' } });
      expect(Expiration_Date).toHaveValue('');
      await Expiration_Date.focus();
      await fireEvent.change(Expiration_Date, { target: { value: "0" } });
      expect(Expiration_Date).toHaveValue("0");

    })
  });
  

  test("count input in all ways", async () => {
    localStorage.setItem('username', 'abc')
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        status: 201
      })
);
    var page;
    var count;
    await act(async () => {
    page = await render(<AddItem />);
    count = await page.getByTestId("add-item-count");
    });

    await act(async () => {
      await count.focus();
      expect(count).toHaveValue("");
      await fireEvent.change(count, { target: { value: '2' } });
      expect(count).toHaveValue("2");
      await fireEvent.change(count, { target: { value: '22' } });
      expect(count).toHaveValue("22");
      await fireEvent.change(count, { target: { value: '235468498161635' } });
      expect(count).toHaveValue('235468498161635');
      await fireEvent.change(count, { target: { value: '' } });
      expect(count).toHaveValue('');
    })
  });

  test("price input in all ways", async () => {
    localStorage.setItem('username', 'abc')
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        status: 201
      })
);
    var page;
    var price;
    await act(async () => {
    page = await render(<AddItem />);
    price = await page.getByTestId("add-item-price");
    });

    await act(async () => {
      await price.focus();
      expect(price).toHaveValue("");
      await fireEvent.change(price, { target: { value: '2' } });
      expect(price).toHaveValue("2");
      await fireEvent.change(price, { target: { value: '2200' } });
      expect(price).toHaveValue("2200");
      await fireEvent.change(price, { target: { value: '235468498161635' } });
      expect(price).toHaveValue('235468498161635');
      await fireEvent.change(price, { target: { value: '' } });
      expect(price).toHaveValue('');
    })
  });

  test("discount input in all ways", async () => {
    localStorage.setItem('username', 'abc')
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        status: 201
      })
);
    var page;
    var discount;
    await act(async () => {
    page = await render(<AddItem />);
    discount = await page.getByTestId("add-item-discount");
    });

    await act(async () => {
      await discount.focus();
      expect(discount).toHaveValue("");
      await fireEvent.change(discount, { target: { value: '2' } });
      expect(discount).toHaveValue("2");
      await fireEvent.change(discount, { target: { value: '22' } });
      expect(discount).toHaveValue("22");
      await fireEvent.change(discount, { target: { value: '235468498161635' } });
      expect(discount).toHaveValue('235468498161635');
      await fireEvent.change(discount, { target: { value: '' } });
      expect(discount).toHaveValue('');
    })
  });

  test("errors handeling for additem name", async () => {
    var page;
    var btn;
    var name;

    await act(async () => {
      page = await render(<AddItem />);
      btn = await page.getByTestId("additem-btn")
      name = await page.getByTestId("add-item-name")


      await fireEvent.change(price, { target: { value: "2300" } });
      await fireEvent.change(manufacture_Date, { target: { value: "1400-03-30" } });
      await fireEvent.change(Expiration_Date, { target: { value: "1401-03-30" } });
      await fireEvent.change(count, { target: { value: "100" } });

      await btn.click();
      await flushPromises()
      expect(enqueueSnackbarMock).toBeCalledTimes(1);
      expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("نام محصول را وارد کنید", { variant: 'error', })

  });
  });
  
  test("errors handeling for additem price", async () => {
    var page;
    var btn;
    var price;
    var name;

    await act(async () => {
      page = await render(<AddItem />);
      btn = await page.getByTestId("additem-btn")
      price = await page.getByTestId("add-item-price")
      name = await page.getByTestId("add-item-name")

    
      await fireEvent.change(discount, { target: { value: "10" } });
      await fireEvent.change(manufacture_Date, { target: { value: "1400-03-30" } });
      await fireEvent.change(Expiration_Date, { target: { value: "1401-03-30" } });
      await fireEvent.change(count, { target: { value: "100" } });
      await fireEvent.change(name, { target: { value: " ماست ترش" } });

      await btn.click();
      await flushPromises()
      expect(enqueueSnackbarMock).toBeCalledTimes(1);
      expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('قیمت محصول را وارد کنید', { variant: 'error', })

  });
  });
  
  test("errors handeling for additem count", async () => {
    var page;
    var btn;
    var count;
    var name;

    await act(async () => {
      page = await render(<AddItem />);
      btn = await page.getByTestId("additem-btn")
      count = await page.getByTestId("add-item-count")
      name = await page.getByTestId("add-item-name")

      await fireEvent.change(name, { target: { value: "ماست" } });
      await fireEvent.change(price, { target: { value: "10000" } });
      await fireEvent.change(discount, { target: { value: "10" } });
      await fireEvent.change(manufacture_Date, { target: { value: "1400-03-30" } });
      await fireEvent.change(Expiration_Date, { target: { value: "1401-03-30" } });

      await btn.click();
      await flushPromises()
      expect(enqueueSnackbarMock).toBeCalledTimes(1);
      expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('تعداد محصول را وارد کنید', { variant: 'error', })

  });
  });
  
  test("errors handeling for additem manufacture_Date", async () => {
    var page;
    var btn;
    var manufacture_Date;
    var name;

    await act(async () => {
      page = await render(<AddItem />);
      btn = await page.getByTestId("additem-btn")
      manufacture_Date = await page.getByTestId("add-item-manufacture_Date")
      name = await page.getByTestId("add-item-name")

    
      await fireEvent.change(price, { target: { value: "10000" } });
      await fireEvent.change(discount, { target: { value: "10" } });
      await fireEvent.change(Expiration_Date, { target: { value: "1401-03-30" } });
      await fireEvent.change(count, { target: { value: "100" } });
      await fireEvent.change(name, { target: { value: "  و خوشمزسسسسسس" } });

      await btn.click();
      await flushPromises()
      expect(enqueueSnackbarMock).toBeCalledTimes(1);
      expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('تاریخ تولید را وارد کنید', { variant: 'error', })

  });
  });

  test("errors handeling for additem Expiration_Date ", async () => {
    var page;
    var btn;
    var Expiration_Date;
    var name;

    await act(async () => {
      page = await render(<AddItem />);
      btn = await page.getByTestId("additem-btn")
      Expiration_Date = await page.getByTestId("add-item-Expiration_Date")
      name = await page.getByTestId("add-item-name")

    
      await fireEvent.change(price, { target: { value: "10000" } });
      await fireEvent.change(discount, { target: { value: "10" } });
      await fireEvent.change(manufacture_Date, { target: { value: "1401-03-30" } });
      await fireEvent.change(count, { target: { value: "100" } });
      await fireEvent.change(name, { target: { value: "  و خوشمزسسسسسس" } });

      await btn.click();
      await flushPromises()
      expect(enqueueSnackbarMock).toBeCalledTimes(1);
      expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('تاریخ انقضا را وارد کنید', { variant: 'error', })

  });
  });

  test("errors handeling for additem discount", async () => {
    var page;
    var btn;
    var discount;
    var name;

    await act(async () => {
      page = await render(<AddItem />);
      btn = await page.getByTestId("additem-btn")
      discount = await page.getByTestId("add-item-discount")
      name = await page.getByTestId("add-item-name")

      await fireEvent.change(price, { target: { value: "10000" } });
      await fireEvent.change(discount, { target: { value: "101" } });
      await fireEvent.change(manufacture_Date, { target: { value: "1400-03-30" } });
      await fireEvent.change(Expiration_Date, { target: { value: "1401-03-30" } });
      await fireEvent.change(count, { target: { value: "100" } });
      await fireEvent.change(name, { target: { value: "  و خوشمزسسسسسس" } });

      await btn.click();
      await flushPromises()
      expect(enqueueSnackbarMock).toBeCalledTimes(1);
      expect(enqueueSnackbarMock).toHaveBeenLastCalledWith('درصد تخفیف باید عددی کمتر از ۱۰۰ باشد', { variant: 'error', })

  });
  });

  