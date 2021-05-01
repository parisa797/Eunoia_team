import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import AddItem from './AddItem';
import '@testing-library/jest-dom';
const fetchMock = require('fetch-mock-jest');

// jest.useFakeTimers()
let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    global.window = Object.create(window);
    const url = "/Item/3";
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

//   test("category input in all ways", async () => {
//     localStorage.setItem('username', 'abc')
//     jest.spyOn(global, "fetch").mockImplementation(() =>
//       Promise.resolve({
//         status: 201
//       })
// );
