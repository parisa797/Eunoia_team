import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Shop from './Shop';
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



test("shop and shop ratings for unsigned users", async () => {

    const shop = { title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "", comment_count: 0, online: "True" }

    // fetchMock.mockIf(/^http?:\/\/127.0.0.1:8000*$/, req => {
    //     if (req.url.endsWith("/api/v1/shops/user/")) {
    //         return {
    //             status: 401,
    //             body: "another response body"
    //         }
    //     } else if (req.url.endsWith("/api/v1/shops/rate/list/")) {
    //         return {
    //             status: 401,
    //             body: "another response body",
    //             headers: {
    //                 "X-Some-Response-Header": "Some header value"
    //             }
    //         }
    //     } else if (req.url.endsWith("/api/v1/shops/")) {
    //         return {
    //             status: 200,
    //             body: shop,
    //             headers: {
    //                 "X-Some-Response-Header": "Some header value"
    //             }
    //         }
    //     }
    // })

    var page;
    fetchMock
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/user/", [])
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis",[])
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/comment/list/1", [])
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/rate/list/1", [])
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/1", shop)
        .get("http://eunoia-bshop.ir:8000/shops/1/items/", [])
        .get("http://eunoia-bshop.ir:8000/items/category/1?q=Fruits and vegetables", [])
    await act(async () => {
        // const flushPromises = () => new Promise(setImmediate);
        page = await render(<Shop  userState={"u"}/>);
        //await jest.runAllTimers()
    });
    fetchMock.mockReset();
    expect(page.queryByTestId("shop-title")).toHaveTextContent(shop.title);
    expect(page.queryByTestId("shop-address")).toHaveTextContent(shop.address);
    expect(page.queryByTestId("shop-rate-count")).toHaveTextContent("(" + shop.rate_count + ")");
    expect(page.queryByTestId("shop-logo")).toHaveAttribute("src", "/shop-default-logo.png");
    expect(page.queryByTestId("shop-comment-count")).toHaveTextContent("نظرات: " + shop.comment_count);
    expect(page.queryByTestId("shop-online")).toHaveTextContent("امکان خرید آنلاین دارد");
    expect(page.queryByTestId("shop-phone")).toBeNull()
    expect(page.queryByTestId("shop-edit-buttons")).toBeNull() //can't edit shop
});

test("shop and shop ratings for signed (buyer) users", async () => {
    localStorage.setItem("token", "sflejfl");
    localStorage.setItem("role", "buyer");
    const shop = { title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "logo.png", comment_count: 0, online: false, shop_phone: "09901223333" }

    const usersShops = [{ title: "shop1", rate_value: 2, rate_count: 20, id: 3, address: "addressssss", logo: "logo.png", comment_count: 0, online: "True" },
    { title: "shop1", rate_value: 2, rate_count: 20, id: 2, address: "addressssss", logo: "logo.png", comment_count: 0, online: "True" }]

    var page;
    fetchMock
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/user/", usersShops)
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis",[])
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/comment/list/1", [])
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/rate/list/1", [])
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/1", shop)
        .get("http://eunoia-bshop.ir:8000/items/category/1?q=Fruits and vegetables", [])
        .get("http://eunoia-bshop.ir:8000/shops/1/items/", [])
    await act(async () => {
        page = await render(<Shop  userState={"l"}/>);
    });
    fetchMock.mockReset();
    expect(page.queryByTestId("shop-title")).toHaveTextContent(shop.title);
    expect(page.queryByTestId("shop-address")).toHaveTextContent(shop.address);
    expect(page.queryByTestId("shop-rate-count")).toHaveTextContent("(" + shop.rate_count + ")");
    expect(page.queryByTestId("shop-logo")).toHaveAttribute("src", shop.logo);
    expect(page.queryByTestId("shop-comment-count")).toHaveTextContent("نظرات: " + shop.comment_count);
    expect(page.queryByTestId("shop-online")).toBeNull() //offline
    expect(page.queryByTestId("shop-phone")).toHaveTextContent(shop.shop_phone)
    expect(page.queryByTestId("shop-edit-buttons")).toBeNull() //can't edit shop
});

test("shop and shop ratings for shop owner", async () => {
    localStorage.setItem("token", "sflejfl");
    localStorage.setItem("role", "seller");

    const shop = { title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "logo.png", comment_count: 0, online: false, shop_phone: "09901223333" }

    const usersShops = [{ title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "logo.png", comment_count: 0, online: "True" },
    { title: "shop1", rate_value: 2, rate_count: 20, id: 2, address: "addressssss", logo: "logo.png", comment_count: 0, online: "True" }]

    var page;
    fetchMock
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/user/", usersShops)
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis",[])
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/comment/list/1", [])
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/rate/list/1", [])
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/1", shop)
        .get("http://eunoia-bshop.ir:8000/shops/1/items/", [])
        .get("http://eunoia-bshop.ir:8000/items/category/1?q=Fruits and vegetables", [])
    await act(async () => {
        page = await render(<Shop userState={"m"}/>);
    });
    fetchMock.mockReset();
    expect(page.queryByTestId("shop-title")).toHaveTextContent(shop.title);
    expect(page.queryByTestId("shop-address")).toHaveTextContent(shop.address);
    expect(page.queryByTestId("shop-rate-count")).toHaveTextContent("(" + shop.rate_count + ")");
    expect(page.queryByTestId("shop-logo")).toHaveAttribute("src", shop.logo);
    expect(page.queryByTestId("shop-comment-count")).toHaveTextContent("نظرات: " + shop.comment_count);
    expect(page.queryByTestId("shop-online")).toBeNull() //offline
    expect(page.queryByTestId("shop-phone")).toHaveTextContent(shop.shop_phone)
    expect(page.queryByTestId("shop-edit-buttons")).not.toBeNull() //CAN edit shop
});