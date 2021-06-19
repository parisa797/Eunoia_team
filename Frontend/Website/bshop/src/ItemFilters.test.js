import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ItemsListPage from './ItemsListPage';
import '@testing-library/jest-dom';
import ServerURL from './Constants'
const fetchMock = require('fetch-mock-jest');
import * as Snackbar from 'notistack';

const enqueueSnackbarMock = jest.fn()
const closeSnackbarMock = jest.fn()

let container = null;
const items = [
    { name: "items", description: "the first item", ItemShop: { title: "shop1", id: 1 }, price: 0, discount: 0, shop_id: 1, id: 1, Expiration_Date: "1400-02-20", manufacture_Date: "1400-02-02", category: 'Spices and condiments and food side dishes' },
    { name: "جدیدددد", description: "این کالا جدید است", ItemShop: { title: "shop1", id: 1 }, price: 10000, discount: 10, shop_id: 1, id: 2, category: 'Junk Food', Expiration_Date: "1400-02-31", manufacture_Date: "1400-02-31" },
    { name: "2048205498", description: "2349810 منبمنس", ItemShop: { title: "shop1", id: 1 }, price: "129800", discount: "5", shop_id: 1, id: 3, category: 'Junk Food', Expiration_Date: "1401-12-20", manufacture_Date: "1399-02-02" },
    { name: "2048205498", description: "2349810 منبمنس", ItemShop: { title: "شهروند@", id: 4 }, price: 0, shop_id: 4, discount: 90, id: 3, category: 'others', Expiration_Date: "1400-12-29", manufacture_Date: "1400-10-02" },
    { name: "#@$@#^!ینتب", description: "مشخصات 543", ItemShop: { title: "shop1 @$21* سیب", id: 3 }, price: "690", discount: 0, shop_id: 3, id: 4, category: 'others', Expiration_Date: "1400-03-23", manufacture_Date: "1400-03-01" },
    { name: "nothingهیچ چیز", description: "سلام the description is...", ItemShop: { title: "shop1 @$21* سیب", id: 3 }, price: 99900, discount: "0", shop_id: 3, id: 5, category: 'Dairy', Expiration_Date: "1400-06-31", manufacture_Date: "1400-02-30" },
]
const categories = {
    'Spices and condiments and food side dishes': 'ادویه، چاشنی و مخلفات غذا',
    'Cosmetics': 'بهداشت و مراقبت پوست',
    'Makeup and trimming': 'آرایش و پیرایش',
    'Protein': 'پروتئینی',
    'Junk Food': "تنقلات",
    'Nuts': 'خشکبار',
    'Sweets and desserts': 'شیرینیجات و دسرها',
    'perfume': 'عطر، ادکلن و اسپری',
    'Fruits and vegetables': 'غذا، کنسرو و سبزیجات',
    'Dairy': 'لبنیات',
    'Drinks': 'نوشیدنیها',
    'Washing and Cleaning Equipment': 'وسایل شستشو و نظافت',
    'others': 'متفرقه'
}

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    global.window = Object.create(window);
    localStorage.setItem("shops", JSON.stringify([1]))
    localStorage.setItem("token", "ldksjfkle")
    //mocking snackbar
  jest.spyOn(Snackbar, 'useSnackbar').mockImplementation(() => ({enqueueSnackbar:enqueueSnackbarMock, closeSnackbar:closeSnackbarMock}))

    fetchMock
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/1", { title: "shop1", id: 1 })
        .get("http://eunoia-bshop.ir:8000/items/new/", items.sort((a, b) => a.manufacture_Date > b.manufacture_Date))
        .get("http://eunoia-bshop.ir:8000/items/cheap/", items.sort((a, b) => a.price - b.price))
        .get("http://eunoia-bshop.ir:8000/items/expensive/", items.sort((a, b) => b.price - a.price))
        .get("http://eunoia-bshop.ir:8000/items/discount/", items.filter(i => !!i.discount))
        .get("http://eunoia-bshop.ir:8000/items/category/discount/?q=Junk Food", items.filter(i => !!i.discount && i.category === "Junk Food"))
        .get("http://eunoia-bshop.ir:8000/items/category/?q=Spices and condiments and food side dishes", items.filter(i => i.category === "Spices and condiments and food side dishes"))
        .get("http://eunoia-bshop.ir:8000/items/category/?q=Makeup and trimming", [])
        .get("http://eunoia-bshop.ir:8000/items/discount/1", items.filter(i => !!i.discount && i.shop_id === 1))
        .get("http://eunoia-bshop.ir:8000/items/category/1?q=Spices and condiments and food side dishes", items.filter(i => i.category === "Spices and condiments and food side dishes" && i.shop_id === 1))
});

afterEach(() => {
    // cleanup on exiting
    fetchMock.mockReset();
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
    await act(async () => {
        page = await render(<ItemsListPage />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.queryByTestId("header")).toHaveTextContent("همه کالاها");
        expect(page.queryByTestId("no-items")).toBeNull();
        items.forEach(async (item, i) => {
            console.log(item.shop_id + "-" + item.id)
            expect(await page.queryByTestId("item-imgfiltered-" + item.shop_id + "-" + item.id)).toHaveAttribute('src', item.photo ? ServerURL + item.photo : "/no-image-icon-0.jpg")
            expect(page.getByTestId("item-namefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.name);
            if (!item.discount || item.discount === "0")
                expect(page.getByTestId("item-price-without-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price ? item.price : "قیمت نامشخص");
            else {
                expect(page.getByTestId("item-pricefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price);
                expect(page.getByTestId("item-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.discount);
            }
            expect(page.getByTestId("item-shop-namefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.ItemShop.title);
        })
    });
});

test("all shop's items with discount filter", async () => {
    const url = "/items/discounted";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    var page;
    await act(async () => {
        window.location.href = url;
        window.location.pathname = url;
        page = await render(<ItemsListPage />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.queryByTestId("header")).toHaveTextContent("همه کالاها");
        expect(page.queryByTestId("no-items")).toBeNull();
        items.filter(i => !!i.discount).forEach(async (item, i) => {
            console.log(item.shop_id + "-" + item.id)
            expect(await page.queryByTestId("item-imgfiltered-" + item.shop_id + "-" + item.id)).toHaveAttribute('src', item.photo ? ServerURL + item.photo : "/no-image-icon-0.jpg")
            expect(page.getByTestId("item-namefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.name);
            if (!item.discount || item.discount === "0")
                expect(page.getByTestId("item-price-without-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price ? item.price : "قیمت نامشخص");
            else {
                expect(page.getByTestId("item-pricefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price);
                expect(page.getByTestId("item-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.discount);
            }
            expect(page.getByTestId("item-shop-namefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.ItemShop.title);
        })
    });
});

test("all shop's cheapest items filter", async () => {
    const url = "/items/cheapest";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    var page;
    await act(async () => {
        window.location.href = url;
        window.location.pathname = url;
        page = await render(<ItemsListPage />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.queryByTestId("header")).toHaveTextContent("همه کالاها");
        expect(page.queryByTestId("no-items")).toBeNull();
        items.forEach(async (item, i) => {
            console.log(item.shop_id + "-" + item.id)
            expect(await page.queryByTestId("item-imgfiltered-" + item.shop_id + "-" + item.id)).toHaveAttribute('src', item.photo ? ServerURL + item.photo : "/no-image-icon-0.jpg")
            expect(page.getByTestId("item-namefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.name);
            if (!item.discount || item.discount === "0")
                expect(page.getByTestId("item-price-without-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price ? item.price : "قیمت نامشخص");
            else {
                expect(page.getByTestId("item-pricefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price);
                expect(page.getByTestId("item-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.discount);
            }
            expect(page.getByTestId("item-shop-namefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.ItemShop.title);
        })
    });

});

test("all shop's most expensive items filter", async () => {
    const url = "/items/mostexpensive";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    var page;
    await act(async () => {
        window.location.href = url;
        window.location.pathname = url;
        page = await render(<ItemsListPage />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.queryByTestId("header")).toHaveTextContent("همه کالاها");
        expect(page.queryByTestId("no-items")).toBeNull();
        items.forEach(async (item, i) => {
            console.log(item.shop_id + "-" + item.id)
            expect(await page.queryByTestId("item-imgfiltered-" + item.shop_id + "-" + item.id)).toHaveAttribute('src', item.photo ? ServerURL + item.photo : "/no-image-icon-0.jpg")
            expect(page.getByTestId("item-namefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.name);
            if (!item.discount || item.discount === "0")
                expect(page.getByTestId("item-price-without-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price ? item.price : "قیمت نامشخص");
            else {
                expect(page.getByTestId("item-pricefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price);
                expect(page.getByTestId("item-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.discount);
            }
            expect(page.getByTestId("item-shop-namefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.ItemShop.title);
        })
    });
});


test("all shop's items filtered by category and discount", async () => {
    const url = "/items/discounted/category?=Junk Food";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    var page;
    await act(async () => {
        window.location.href = url;
        window.location.pathname = url;
        page = await render(<ItemsListPage />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.queryByTestId("header")).toHaveTextContent("تنقلات");
        expect(page.queryByTestId("no-items")).toBeNull();
        items.filter(i => !!i.discount && i.category === "Junk Food").forEach(async (item, i) => {
            console.log(item.shop_id + "-" + item.id)
            expect(await page.queryByTestId("item-imgfiltered-" + item.shop_id + "-" + item.id)).toHaveAttribute('src', item.photo ? ServerURL + item.photo : "/no-image-icon-0.jpg")
            expect(page.getByTestId("item-namefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.name);
            if (!item.discount || item.discount === "0")
                expect(page.getByTestId("item-price-without-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price ? item.price : "قیمت نامشخص");
            else {
                expect(page.getByTestId("item-pricefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price);
                expect(page.getByTestId("item-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.discount);
            }
            expect(page.getByTestId("item-shop-namefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.ItemShop.title);
        })
    });

});

test("all shop's items filtered by category only", async () => {
    const url = "/items/category?=Spices and condiments and food side dishes";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    var page;
    await act(async () => {
        window.location.href = url;
        window.location.pathname = url;
        page = await render(<ItemsListPage />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.queryByTestId("header")).toHaveTextContent('ادویه، چاشنی و مخلفات غذا');
        expect(page.queryByTestId("no-items")).toBeNull();
        items.filter(i => i.category === "Spices and condiments and food side dishes").forEach(async (item, i) => {
            console.log(item.shop_id + "-" + item.id)
            expect(await page.queryByTestId("item-imgfiltered-" + item.shop_id + "-" + item.id)).toHaveAttribute('src', item.photo ? ServerURL + item.photo : "/no-image-icon-0.jpg")
            expect(page.getByTestId("item-namefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.name);
            if (!item.discount || item.discount === "0")
                expect(page.getByTestId("item-price-without-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price ? item.price : "قیمت نامشخص");
            else {
                expect(page.getByTestId("item-pricefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price);
                expect(page.getByTestId("item-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.discount);
            }
            expect(page.getByTestId("item-shop-namefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.ItemShop.title);
        })
    });

});


test("one shop's items filtered1", async () => {
    const url = "/store/1/items/list/discounted";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    var page;
    await act(async () => {
        window.location.href = url;
        window.location.pathname = url;
        page = await render(<ItemsListPage />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.queryByTestId("header")).toHaveTextContent("همه کالاها");
        expect(page.queryByTestId("no-items")).toBeNull();
        items.filter(i => !!i.discount && i.shop_id === 1).forEach(async (item, i) => {
            console.log(item.shop_id + "-" + item.id)
            expect(await page.queryByTestId("item-imgfiltered-" + item.shop_id + "-" + item.id)).toHaveAttribute('src', item.photo ? ServerURL + item.photo : "/no-image-icon-0.jpg")
            expect(page.getByTestId("item-namefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.name);
            if (!item.discount || item.discount === "0")
                expect(page.getByTestId("item-price-without-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price ? item.price : "قیمت نامشخص");
            else {
                expect(page.getByTestId("item-pricefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price);
                expect(page.getByTestId("item-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.discount);
            }
        })
    });

});

test("one shop's items filtered2", async () => {
    const url = "/store/1/items/list/category?=Spices and condiments and food side dishes";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    var page;
    await act(async () => {
        window.location.href = url;
        window.location.pathname = url;
        page = await render(<ItemsListPage />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.queryByTestId("header")).toHaveTextContent('ادویه، چاشنی و مخلفات غذا');
        expect(page.queryByTestId("no-items")).toBeNull();
        items.filter(i => i.category === "Spices and condiments and food side dishes"&& i.shop_id === 1).forEach(async (item, i) => {
            console.log(item.shop_id + "-" + item.id)
            expect(await page.queryByTestId("item-imgfiltered-" + item.shop_id + "-" + item.id)).toHaveAttribute('src', item.photo ? ServerURL + item.photo : "/no-image-icon-0.jpg")
            expect(page.getByTestId("item-namefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.name);
            if (!item.discount || item.discount === "0")
                expect(page.getByTestId("item-price-without-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price ? item.price : "قیمت نامشخص");
            else {
                expect(page.getByTestId("item-pricefiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.price);
                expect(page.getByTestId("item-discountfiltered-" + item.shop_id + "-" + item.id)).toHaveTextContent(item.discount);
            }
        })
    });

});

test("no items in a category", async () => {
    const url = "/items/category?=Makeup and trimming";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    var page;
    await act(async () => {
        window.location.href = url;
        window.location.pathname = url;
        page = await render(<ItemsListPage />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.queryByTestId("header")).toHaveTextContent('آرایش و پیرایش');
        expect(page.queryByTestId("no-items")).not.toBeNull();
        expect(page.queryByTestId("no-items")).toHaveTextContent("نتیجه‌ای یافت نشد!");
    });

});
