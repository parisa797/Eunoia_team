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
  expect(title).toHaveValue("a");
  await fireEvent.change(name, { target: { value: 'ab' } });
  expect(name).toHaveValue("ab");
  await fireEvent.change(name, { target: { value: 'lsjfaiejfailejiajfeijflaeij' } });
  expect(name).toHaveValue('lsjfaiejfailejiajfeijflaeij');
  await fireEvent.change(name, { target: { value: '' } });
  expect(name).toHaveValue('');
})
});

// test("add item to table", async() => {
//     const item = {name: "test1"};

//     var page;
//     fetchMock.("http://127.0.0.1:8000/shops/1/items", item)
//     await act(async() => {
//         page = await render(<AddItem />);
//     });
//     console.log(item);
//     fetchMock.mockReset();
//     expect(page.queryByTestId("name")).toHaveTextContent(item.name);
// })})
