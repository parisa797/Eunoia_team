import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ItemsListPage from './ItemsListPage';
import '@testing-library/jest-dom';
const fetchMock = require('fetch-mock-jest');


let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    global.window = Object.create(window);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

test("all shop's newest items filter", async () => {
    const url = "/items/newest";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    var page;
    const items = [
        {
        price: 200000,
        discount: 0,
        photo: "/sth.png",
        Expiration_jalali: "1400-03-09",
        manufacture_jalali: "1400-02-31",
        category: 'Dairy'
    }];
    fetchMock
        .get("http://eunoia-bshop.ir:8000/items/new/", items)
    await act(async () => {
        page = await render(<ItemsListPage />);
    });
    fetchMock.mockReset();
    expect(page.queryByTestId("header")).toHaveTextContent("همه کالاها");
    expect(page.queryByTestId("no-items")).toBeNull();
});
