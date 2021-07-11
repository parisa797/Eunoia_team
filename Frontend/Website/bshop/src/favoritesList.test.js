import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import FavoriteItems from './favoriteitems';
import FavoriteShops from './favoriteShop';
import '@testing-library/jest-dom';
import ServerURL from './Constants'
const fetchMock = require('fetch-mock-jest');
import * as Snackbar from 'notistack';

const enqueueSnackbarMock = jest.fn()
const closeSnackbarMock = jest.fn()
let container = null;

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    global.window = Object.create(window);
    //mocking snackbar
    jest.spyOn(Snackbar, 'useSnackbar').mockImplementation(() => ({enqueueSnackbar:enqueueSnackbarMock, closeSnackbar:closeSnackbarMock}))
    localStorage.setItem("shops", JSON.stringify([1]))
    localStorage.setItem("token", "ldksjfkle")
});

afterEach(() => {
    // cleanup on exiting
    fetchMock.mockReset();
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

test("favorites list with some items", async () => {
    const items = [
        { name: "items", description: "the first item", ItemShop: { title: "shop1", id: 1 }, price: 0, discount: 0, shop_id: 1, id: 1, Expiration_Date: "1400-02-20", manufacture_Date: "1400-02-02", category: 'Spices and condiments and food side dishes' },
        { name: "جدیدددد", description: "این کالا جدید است", ItemShop: { title: "shop1", id: 1 }, price: 10000, discount: 10, shop_id: 1, id: 2, category: 'Junk Food', Expiration_Date: "1400-02-31", manufacture_Date: "1400-02-31" },
        { name: "2048205498", description: "2349810 منبمنس", ItemShop: { title: "shop1", id: 1 }, price: "129800", discount: "5", shop_id: 1, id: 3, category: 'Junk Food', Expiration_Date: "1401-12-20", manufacture_Date: "1399-02-02" },
        { name: "2048205498", description: "2349810 منبمنس", ItemShop: { title: "شهروند@", id: 4 }, price: 0, shop_id: 4, discount: 90, id: 3, category: 'others', Expiration_Date: "1400-12-29", manufacture_Date: "1400-10-02" },
        { name: "#@$@#^!ینتب", description: "مشخصات 543", ItemShop: { title: "shop1 @$21* سیب", id: 3 }, price: "690", discount: 0, shop_id: 3, id: 4, category: 'others', Expiration_Date: "1400-03-23", manufacture_Date: "1400-03-01" },
        { name: "nothingهیچ چیز", description: "سلام the description is...", ItemShop: { title: "shop1 @$21* سیب", id: 3 }, price: 99900, discount: "0", shop_id: 3, id: 5, category: 'Dairy', Expiration_Date: "1400-06-31", manufacture_Date: "1400-02-30" },
    ]
    jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(items)
    })
  );
    var page;
    await act(async () => {
        page = await render(<FavoriteItems />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        await page.debug()
        expect(await page.queryByTestId("fav-items-header")).toHaveTextContent("محصولات مورد علاقه شما");
        expect(page.queryByTestId("no-items")).toBeNull();
        items.forEach(async (item, i) => {
            console.log(item.shop_id + "-" + item.id)
            expect(await page.queryByTestId("item-imgfavorites-" + item.shop_id + "-" + item.id)).toHaveAttribute('src', item.photo ? ServerURL + item.photo : "/no-image-icon-0.jpg")
            expect(page.getByTestId("item-namefavorites-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.name);
            if (!item.discount || item.discount === "0")
                expect(page.getByTestId("item-price-without-discountfavorites-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price ? item.price : "قیمت نامشخص");
            else {
                expect(page.getByTestId("item-pricefavorites-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price);
                expect(page.getByTestId("item-discountfavorites-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.discount);
            }
            expect(page.getByTestId("item-shop-namefavorites-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.ItemShop.title);
        })
    });
});

test("no items in favorites", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve([])
    })
  );
    var page;
    await act(async () => {
        page = await render(<FavoriteItems />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.queryByTestId("fav-items-header")).toHaveTextContent("محصولات مورد علاقه شما");
        expect(page.queryByTestId("no-items")).not.toBeNull();
        expect(page.queryByTestId("no-items")).toHaveTextContent("نتیجه‌ای یافت نشد!");
    });

});

test("no shops in favorites", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve([])
    })
  );
    var page;
    await act(async () => {
        page = await render(<FavoriteShops />);
        await new Promise(resolve => setImmediate(resolve));
    });
    expect(page.queryByTestId("fav-shops-header")).toHaveTextContent("فروشگاه‌های مورد علاقه شما");
    expect(page.queryByTestId("no-shops")).not.toBeNull();
    expect(page.queryByTestId("no-shops")).toHaveTextContent("نتیجه‌ای یافت نشد!");
});

test("favorite shops list", async () => {
    const shops = [
        { title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "", region: "12" },
        { title: "فروشگاه جدییییییییید", rate_value: 4.5, rate_count: 1, id: 2, address: "ناکجا آباااا029380182د", logo: "sth.png", region: "12" },
        { title: "shop1 @$21* سیب", rate_value: 0, rate_count: 0, id: 3, address: "یه place ای که نمیدانم 34 کجاست", logo: "عکس.jpg", region: "4" },
        { title: "234289058", rate_value: 5, rate_count: 20, id: 4, address: "somewhere", logo: "", region: "12" },
        { title: "a very nice* shopp", rate_value: 4.009, rate_count: 200, id: 5, address: "nowhere", logo: "", region: "4" },
        { title: "فروشforoush", rate_value: "2", rate_count: 3, id: 6, address: "نبش خیابان sth و 394*", logo: "", region: "6" },
    ]
    jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(shops)
    })
  );
    var page;
    await act(async () => {
        page = await render(<FavoriteShops />);
        await new Promise(resolve => setImmediate(resolve));
    });
    expect(page.queryByTestId("fav-shops-header")).toHaveTextContent("فروشگاه‌های مورد علاقه شما");
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