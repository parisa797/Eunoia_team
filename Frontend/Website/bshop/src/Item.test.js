import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Item from './Item';
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


// test("titleItem input in all ways", async () => {
//     localStorage.setItem('username', 'abc')
//     jest.spyOn(global, "fetch").mockImplementation(() =>
//       Promise.resolve({
//         status: 200
//       })
// );
//     var page;
//     var name;
//     await act(async () => {
//     page = await render(<Item />);
//     name = await page.getByTestId("item");
//     });
//     await act(async () => {
//         await name.focus();
//         expect(name).toHaveValue("");
//         await fireEvent.change(name, { target: { value: 'a' } });
//         expect(name).toHaveValue("a");
//         await fireEvent.change(name, { target: { value: 'ab' } });
//         expect(name).toHaveValue("ab");
//         await fireEvent.change(name, { target: { value: 'lsjfaiejfailejiajfeijflaeij' } });
//         expect(name).toHaveValue('lsjfaiejfailejiajfeijflaeij');
//         await fireEvent.change(name, { target: { value: '' } });
//         expect(name).toHaveValue('');
//       })
//       });

    test("descriptionItem input in all ways", async () => {
    localStorage.setItem('username', 'abc')
    //Teste item ye farghi ba testaie ghablit dare, oonam inke avalesh gharare ba ye fetch zadan etelaate iteme ro begire mage na?
    //pas inja baraye fetchesh bayad ye body ham bezarim va ye iteme alaki dorost konim bedim behesh.
    //hamintor ke tooie payamaye skype goftam gharare id e shop va item ro baraye fetch kardan az window.location.pathname begire. pas bayad oon window.location.pathname ro joori konim ke in fetch ro betone anjam bede va toie Item.js error nade ke window.location nadari:
    global.window = Object.create(window);
    const url = "/store/1/item/1";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url //in url ro gozashtim toie window.location.pathname ke toie Item.js azash estefade kone
        }
    });

    //ye item misazim ke toie code Item.js in item ro az fetch begire va jash bezare
    const fakeItem = {
        name:"itemmm",
        Expiration_Date: "1400-03-03",
        manufacture_Date: "1400-02-13",
        price: "90000",
        discount: "5",
        count: 30
 }
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
        status: 200,
        json: () => fakeItem //hala fetchemon begheir az status ye json ham pas mide ke tosh fakeItemie ke sakhtim
        })
);
var page;
var description;
await act(async () => {
    page = await render(<Item />); //be jaie Item neveshte boodi item4 bara hamin asan componente drosti ro render nemikard
    description = await page.getByTestId("item");
});
expect(page.queryByTestId("item-name")).not.toBeNull();
expect(page.queryByTestId("item-description")).toBeNull();
expect(page.queryByTestId("item-name")).toHaveTextContent(fakeItem.name);

    // await act(async () => {
    //     await description.focus();
    //     expect(description).toHaveValue("");
    //     await fireEvent.change(description, { target: { value: 'ماست' } });
    //     expect(description).toHaveValue("ماست");
    //     await fireEvent.change(description, { target: { value: 'sm' } });
    //     expect(description).toHaveValue("sm");
    //     await fireEvent.change(description, { target: { value: 'lsjfaiejfailejiajfeijflaeij' } });
    //     expect(description).toHaveValue('lsjfaiejfailejiajfeijflaeij');
    //     await fireEvent.change(description, { target: { value: '' } });
    //     expect(description).toHaveValue('');
    // })
    });