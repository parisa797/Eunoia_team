import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ShopsListPage from './ShopsListPage';
import '@testing-library/jest-dom';
const fetchMock = require('fetch-mock-jest');
import ServerURL from "./Constants";


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

test("newest shops filter", async () => {
    const url = "/stores/newest";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    const shops = [{ title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "" },
    { title: "فروشگاه جدییییییییید", rate_value: 4.5, rate_count: 1, id: 2, address: "ناکجا آباااا029380182د", logo: "sth.png" },
    { title: "shop1 @$21* سیب", rate_value: 0, rate_count: 0, id: 3, address: "یه place ای که نمیدانم 34 کجاست", logo: "عکس.jpg" }
    ]
    var page;
    fetchMock
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/top/", shops)
    await act(async () => {
        page = await render(<ShopsListPage />);
    });
    fetchMock.mockReset();
    expect(page.queryByTestId("top-shops-header")).toHaveTextContent("فروشگاه‌های برگزیده");
    expect(page.queryByTestId("no-shops")).toBeNull();
    for (let j in [1, 2, 3]) {
        let i = 1 + parseInt(j);
        expect(page.queryByTestId('shop' + i)).not.toBeNull();
        expect(page.queryByTestId("shop-title-" + i)).toHaveTextContent(shops[j].title);
        expect(page.queryByTestId("shop-address-" + i)).toHaveTextContent(shops[j].address);
        expect(page.queryByTestId("shop-rate-count" + i)).toHaveTextContent(shops[j].rate_count)
    }
    expect(page.queryByTestId("shop-img-" + 2)).toHaveAttribute("src", ServerURL + shops[1].logo);
    expect(page.queryByTestId("shop-img-" + 3)).toHaveAttribute("src", ServerURL + shops[2].logo);
});

test("shops filter with no shop", async () => {
    const url = "/stores/newest";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    var page;
    fetchMock
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/top/", [])
    await act(async () => {
        page = await render(<ShopsListPage />);
    });
    fetchMock.mockReset();
    expect(page.queryByTestId("top-shops-header")).toHaveTextContent("فروشگاه‌های برگزیده");
    expect(page.queryByTestId("no-shops")).not.toBeNull();
    expect(page.queryByTestId("no-shops")).toHaveTextContent("نتیجه‌ای یافت نشد!");
});

test("shops in a specific region filter", async () => {
    const url = "/stores/region?=12";
    window.location.pathname = url;
    window.location.href = url;
    const shops = [
        { title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "", region: "12" },
        { title: "فروشگاه جدییییییییید", rate_value: 4.5, rate_count: 1, id: 2, address: "ناکجا آباااا029380182د", logo: "sth.png", region: "12" },
        { title: "shop1 @$21* سیب", rate_value: 0, rate_count: 0, id: 3, address: "یه place ای که نمیدانم 34 کجاست", logo: "عکس.jpg", region: "4" },
        { title: "234289058", rate_value: 5, rate_count: 20, id: 4, address: "somewhere", logo: "", region: "12" },
        { title: "a very nice* shopp", rate_value: 4.009, rate_count: 200, id: 5, address: "nowhere", logo: "", region: "4" },
        { title: "فروشforoush", rate_value: "2", rate_count: 3, id: 6, address: "نبش خیابان sth و 394*", logo: "", region: "6" },
    ]
    var page;
    fetchMock
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/region/?q=12", shops.filter(s => s.region === "12"))
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/region/?q=1", shops.filter(s => s.region === "1"))
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/region/?q=", shops.filter(s => s.region === ""))
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/region/?q=sth", shops.filter(s => s.region === "sth"))
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/region/?q=4", shops.filter(s => s.region === "4"))
    await act(async () => {
        page = await render(<ShopsListPage />);
        await new Promise(resolve => setImmediate(resolve));
    });
    expect(page.queryByTestId("a-region-shops-header")).toHaveTextContent("فروشگاه های منطقه");
    expect(page.queryByTestId("no-shops")).toBeNull();
    //the page now has shops with region 12
    let shopsInRegion= shops.filter(s=>s.region==="12");
    for (let j in [1, 2, 3]) {
        let i = shopsInRegion[j].id;
        expect(page.queryByTestId('shop' + i)).not.toBeNull();
        expect(page.queryByTestId("shop-title-" + i)).toHaveTextContent(shopsInRegion[j].title);
        expect(page.queryByTestId("shop-address-" + i)).toHaveTextContent(shopsInRegion[j].address);
        expect(page.queryByTestId("shop-rate-count" + i)).toHaveTextContent(shopsInRegion[j].rate_count)
    }
    let region;
    await act( async()=>{
        region = await page.getByTestId("region-input");
        expect(region).toHaveValue("12")
        await fireEvent.change(region, { target: { value: '1' } });
        await new Promise(resolve => setImmediate(resolve));
        expect(region).toHaveValue("1")
    })
    //changed region to 1, which no shop is place in
    expect(page.queryByTestId("no-shops")).not.toBeNull();
    shopsInRegion= shops.filter(s=>s.region==="1");
    expect(shopsInRegion).toHaveLength(0);

    await act( async()=>{
        await fireEvent.change(region, { target: { value: '' } });
        await new Promise(resolve => setImmediate(resolve));
        expect(region).toHaveValue("")
    })
    //changed region to empty string, which is not valid
    expect(page.queryByTestId("no-shops")).not.toBeNull();
    shopsInRegion= shops.filter(s=>s.region==="");
    expect(shopsInRegion).toHaveLength(0);

    await act( async()=>{
        await fireEvent.change(region, { target: { value: 'sth' } });
        await new Promise(resolve => setImmediate(resolve));
        expect(region).toHaveValue("sth")
    })
    //changed region to "sth", which is not valid
    expect(page.queryByTestId("no-shops")).not.toBeNull();
    shopsInRegion= shops.filter(s=>s.region==="sth");
    expect(shopsInRegion).toHaveLength(0);

    await act( async()=>{
        await fireEvent.change(region, { target: { value: '4' } });
        await new Promise(resolve => setImmediate(resolve));
        expect(region).toHaveValue("4")
    })
    //changed region to 4, that 2 shops have
    expect(page.queryByTestId("no-shops")).toBeNull();
    shopsInRegion= shops.filter(s=>s.region==="4");
    expect(shopsInRegion).toHaveLength(2);
    for (let j in [1, 2]) {
        let i = shopsInRegion[j].id;
        expect(page.queryByTestId('shop' + i)).not.toBeNull();
        expect(page.queryByTestId("shop-title-" + i)).toHaveTextContent(shopsInRegion[j].title);
        expect(page.queryByTestId("shop-address-" + i)).toHaveTextContent(shopsInRegion[j].address);
        expect(page.queryByTestId("shop-rate-count" + i)).toHaveTextContent(shopsInRegion[j].rate_count)
    }
    fetchMock.mockReset();
});