import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import SearchResults from './SearchResults';
import SearchBar from './SearchBar';
import ServerURL from './Constants';
import '@testing-library/jest-dom';
const fetchMock = require('fetch-mock-jest');
import * as Snackbar from 'notistack';

const enqueueSnackbarMock = jest.fn()
const closeSnackbarMock = jest.fn()

let container = null;
const items = [
    { name: "items", description: "the first item", ItemShop:{title:"shop1", id:1},price:0, shop_id: 1, id: 1 },
    { name: "جدیدددد", description: "این کالا جدید است", ItemShop:{title:"shop1", id:1},price:10000, shop_id: 1, id: 2 },
    { name: "2048205498", description: "2349810 منبمنس", ItemShop:{title:"shop1", id:1},price:"129800", shop_id: 1, id: 3 },
    { name: "2048205498", description: "2349810 منبمنس", ItemShop:{title:"شهروند@", id:4},price:0, shop_id: 4, id: 3 },
    { name: "#@$@#^!ینتب", description: "مشخصات 543", ItemShop:{title:"shop1 @$21* سیب", id:3},price:"690", shop_id: 3, id: 4 },
    { name: "nothingهیچ چیز", description: "سلام the description is...", ItemShop:{title:"shop1 @$21* سیب", id:3},price:99900, shop_id: 3, id: 5 },
]
const shops = [{ title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "" },
    { title: "فروشگاه جدییییییییید", rate_value: 4.5, rate_count: 1, id: 2, address: "ناکجا آباااا029380182د", logo: "sth.png" },
    { title: "shop1 @$21* سیب", rate_value: 0, rate_count: 0, id: 3, address: "یه place ای که نمیدانم 34 کجاست", logo: "عکس.jpg" },
    { title: "شهروند@", rate_value: 4, rate_count: 1, id: 4, address: "", logo: "sth?df.png" },
    { title: "382490100", rate_value: "3", rate_count: "32", id: 5, address: "بیتسمsdfjlsjد", logo: "243.png" },
    ]
    var page;
    let searchedShops = {
        "sh": shops.filter(s => s.title.includes("sh") || s.address.includes("sh")),
        "": [],
        "شهر": shops.filter(s => s.title.includes("شهر") || s.address.includes("شهر")),
        "2": shops.filter(s => s.title.includes("2") || s.address.includes("2")),
        "و": shops.filter(s => s.title.includes("و") || s.address.includes("و")),
        "ناکجا آبااا": shops.filter(s => s.title.includes("ناکجا آبااا") || s.address.includes("ناکجا آبااا")),
    }
    let searchedItems = (str) => items.filter(i => i.name.includes(str) || i.description.includes(str))
    let searchedItemsInOneShop = (str,id) => items.filter(i => i.shop_id===id && (i.name.includes(str) || i.description.includes(str)))
    
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    global.window = Object.create(window);
    localStorage.setItem("shops", JSON.stringify([1]))
    fetchMock
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/search?q=sh", searchedShops["sh"])
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/search?q=", searchedShops[""])
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/search?q=شهر", searchedShops[""])
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/search?q=2", searchedShops["2"])
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/search?q=و", searchedShops["و"]) 
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/search?q=ناکجا آبااا", searchedShops["ناکجا آبااا"])
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/search?q=10ندارد", [])
        .get("http://eunoia-bshop.ir:8000/items/search?q=", [])
        .get("http://eunoia-bshop.ir:8000/items/search?q=the", searchedItems("the"))
        .get("http://eunoia-bshop.ir:8000/items/search?q=54", searchedItems("54"))
        .get("http://eunoia-bshop.ir:8000/items/search?q=^!ی", searchedItems("^!ی"))
        .get("http://eunoia-bshop.ir:8000/items/search?q=وجود ندارد", [])
        .get("http://eunoia-bshop.ir:8000/shops/1/items/search/?q=", [])
        .get("http://eunoia-bshop.ir:8000/shops/1/items/search/?q=item", searchedItemsInOneShop("item",1))
        .get("http://eunoia-bshop.ir:8000/shops/4/items/search/?q=item", searchedItemsInOneShop("item",4))
        .get("http://eunoia-bshop.ir:8000/shops/1/items/search/?q=810 من", searchedItemsInOneShop("810 من",1))
        .get("http://eunoia-bshop.ir:8000/shops/4/items/search/?q=810 من", searchedItemsInOneShop("810 من",4))

            
    //mocking snackbar
  jest.spyOn(Snackbar, 'useSnackbar').mockImplementation(() => ({enqueueSnackbar:enqueueSnackbarMock, closeSnackbar:closeSnackbarMock}))

});

afterEach(() => {
    // cleanup on exiting
    fetchMock.mockReset();
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

test("searched shops", async () => {
    const url = "/store/search?q=sh";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    await act(async () => {
        page = await render(<SearchResults />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.getByTestId("search-header")).toHaveTextContent("نتایج جستجو برای sh");
        expect(page.queryByTestId("no-results")).toBeNull();
        searchedShops["sh"].forEach(async (shop, i) => {
            expect(await page.queryByTestId('shop' + shop.id)).not.toBeNull();
            expect(page.queryByTestId("shop-title-" + shop.id)).toHaveTextContent(shop.title);
            expect(page.queryByTestId("shop-img-" + shop.id)).toHaveAttribute('src', shop.logo? ServerURL + shop.logo : "/shop-default-logo.png");
            expect(page.queryByTestId("shop-address-" + shop.id)).toHaveTextContent(shop.address);
            expect(page.queryByTestId("shop-rate-count" + shop.id)).toHaveTextContent(shop.rate_count)
        })
    });
    
});

test("searched shops2", async () => {
    const url = "/store/search?q=ناکجا آبااا";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    await act(async () => {
        window.location.href = url;
        window.location.pathname = url;
        page = await render(<SearchResults />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.getByTestId("search-header")).toHaveTextContent("نتایج جستجو برای ناکجا آبااا");
        expect(page.queryByTestId("no-results")).toBeNull();
        searchedShops["ناکجا آبااا"].forEach(async (shop, i) => {
            expect(await page.queryByTestId('shop' + shop.id)).not.toBeNull();
            expect(page.queryByTestId("shop-title-" + shop.id)).toHaveTextContent(shop.title);
            expect(page.queryByTestId("shop-img-" + shop.id)).toHaveAttribute('src', shop.logo? ServerURL + shop.logo : "/shop-default-logo.png");
            expect(page.queryByTestId("shop-address-" + shop.id)).toHaveTextContent(shop.address);
            expect(page.queryByTestId("shop-rate-count" + shop.id)).toHaveTextContent(shop.rate_count)
        })
    });
    
});

test("shops search with no shops", async () => {
    const url = "/store/search?q=10ندارد";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    
    var page;
    await act(async () => {
        window.location.href = "/store/search?q=10ندارد";
        window.location.pathname = "/store/search?q=10ندارد";
        page = await render(<SearchResults />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.getByTestId("search-header")).toHaveTextContent("نتایج جستجو برای 10ندارد");
        expect(page.queryByTestId("no-results")).not.toBeNull();
    });
});

test("items search with no items", async () => {
    const url = "/items/search/?q=وجود ندارد";
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
        page = await render(<SearchResults />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.getByTestId("search-header")).toHaveTextContent("نتایج جستجو برای وجود ندارد");
        expect(page.queryByTestId("no-results")).not.toBeNull();
    });
});


test("searched items", async () => {
    const url = "/items/search/?q=^!ی";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    await act(async () => {
        window.location.href = url;
        window.location.pathname = url;
        page = await render(<SearchResults />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.getByTestId("search-header")).toHaveTextContent("نتایج جستجو برای ^!ی");
        expect(page.queryByTestId("no-results")).toBeNull();
        searchedItems("^!ی").forEach(async (item, i) => {
            expect(await page.getByTestId("item-img-"+item.shop_id+"-"+item.id)).toHaveAttribute("src",item.photo?ServerURL+item.photo:"/no-image-icon-0.jpg")
            expect(page.getByTestId("item-name-"+item.shop_id+"-"+item.id)).toHaveTextContent(item.name);
            expect(page.getByTestId("item-price-without-discount-"+item.shop_id+"-"+item.id)).toHaveTextContent(item.price);
            expect(page.getByTestId("item-shop-name-"+item.shop_id+"-"+item.id)).toHaveTextContent(item.ItemShop.title);
        })
    });
    
});

test("searched items in a shop", async () => {
    const url = "/store/1/items/search/?q=810 من";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    await act(async () => {
        window.location.href = url;
        window.location.pathname = url;
        page = await render(<SearchResults />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await page.getByTestId("search-header")).toHaveTextContent("نتایج جستجو برای 810 من");
        expect(page.queryByTestId("no-results")).toBeNull();
        searchedItemsInOneShop("810 من").forEach(async (item, i) => {
            expect(await page.getByTestId("item-img-"+item.shop_id+"-"+item.id)).toHaveAttribute("src",item.photo?ServerURL+item.photo:"/no-image-icon-0.jpg")
            expect(page.getByTestId("item-name-"+item.shop_id+"-"+item.id)).toHaveTextContent(item.name);
            expect(page.getByTestId("item-price-without-discount-"+item.shop_id+"-"+item.id)).toHaveTextContent(item.price);
            expect(page.getByTestId("item-shop-name-"+item.shop_id+"-"+item.id)).toHaveTextContent(item.ItemShop.title);
        })
    });
    
});

test("search with empty or undefined search query", async () => {
    const url = "/store/search?q=";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    
    var page;
    await act(async () => {
        window.location.href = "/store/search?q=";
        window.location.pathname = "/store/search?q=";
        page = await render(<SearchResults />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(await window.location.pathname).toBe("/");
    });
});

test("searchbar switching between shops and items", async () => {
    
    var page;
    await act(async () => {
        page = await render(<SearchBar />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(page.getByTestId("shop-filterby-button")).toHaveTextContent("فروشگاه")
        expect(page.getByTestId("shop-input")).not.toBeNull();
        expect(page.queryByTestId("item-input")).toBeNull();
        
        await page.getByTestId("shop-filterby-button").click();
        await page.getByTestId("item-dropdown-btn").click();
        expect(page.getByTestId("shop-filterby-button")).toHaveTextContent("کالا")
        expect(page.queryByTestId("shop-input")).toBeNull();
        expect(page.queryByTestId("item-input")).not.toBeNull();
        
        await page.getByTestId("shop-dropdown-btn").click();
        expect(page.getByTestId("shop-filterby-button")).toHaveTextContent("فروشگاه")
        expect(page.getByTestId("shop-input")).not.toBeNull();
        expect(page.queryByTestId("item-input")).toBeNull();
        
    });
});

test("searchbar lists", async () => {
    
    var page;
    await act(async () => {
        page = await render(<SearchBar />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        let shopInput = await page.queryByTestId("shop-input");
        expect(page.getByTestId("shop-filterby-button")).toHaveTextContent("فروشگاه");
        await shopInput.focus();
        await fireEvent.change(shopInput, { target: { value: '' } });
        expect(page.getByTestId("search-list")).toHaveTextContent("")

        await fireEvent.change(shopInput, { target: { value: '2' } });
        await new Promise(resolve => setImmediate(resolve));
        searchedShops["2"].forEach(async (shop, i) => {
            expect(await page.queryByTestId("search-list-img" + i)).toHaveAttribute('src', shop.logo? shop.logo : "/shop-default-logo.png");
            expect(await page.queryByTestId("search-list-title" + i)).toHaveTextContent(shop.title);
            expect(await page.queryByTestId("search-list-desc" + i)).toHaveTextContent(shop.address);
        })

        await fireEvent.change(shopInput, { target: { value: "ناکجا آبااا" } });
        await new Promise(resolve => setImmediate(resolve));
        searchedShops["ناکجا آبااا"].forEach(async (shop, i) => {
            expect(await page.queryByTestId("search-list-img" + i)).toHaveAttribute('src', shop.logo? shop.logo : "/shop-default-logo.png");
            expect(await page.queryByTestId("search-list-title" + i)).toHaveTextContent(shop.title);
            expect(await page.queryByTestId("search-list-desc" + i)).toHaveTextContent(shop.address);
        })

        await fireEvent.change(shopInput, { target: { value: "sh" } });
        await new Promise(resolve => setImmediate(resolve));
        searchedShops["sh"].forEach(async (shop, i) => {
            expect(await page.queryByTestId("search-list-img" + i)).toHaveAttribute('src', shop.logo? shop.logo : "/shop-default-logo.png");
            expect(await page.queryByTestId("search-list-title" + i)).toHaveTextContent(shop.title);
            expect(await page.queryByTestId("search-list-desc" + i)).toHaveTextContent(shop.address);
        })
        
        await page.getByTestId("shop-filterby-button").click();
        await page.getByTestId("item-dropdown-btn").click();
        let itemInput = await page.queryByTestId("item-input");

        await fireEvent.change(itemInput, { target: { value: '^!ی' } });
        await new Promise(resolve => setImmediate(resolve));
        searchedItems("^!ی").forEach(async (item, i) => {
            expect(await page.queryByTestId("search-list-img" + i)).toHaveAttribute('src', item.photo?item.photo:"/no-image-icon-0.jpg");
            expect(await page.queryByTestId("search-list-title" + i)).toHaveTextContent(item.name);
            expect(await page.queryByTestId("search-list-desc" + i)).toHaveTextContent(item.description);
        })

        await fireEvent.change(itemInput, { target: { value: 'the' } });
        await new Promise(resolve => setImmediate(resolve));
        searchedItems("the").forEach(async (item, i) => {
            expect(await page.queryByTestId("search-list-img" + i)).toHaveAttribute('src', item.photo?item.photo:"/no-image-icon-0.jpg");
            expect(await page.queryByTestId("search-list-title" + i)).toHaveTextContent(item.name);
            expect(await page.queryByTestId("search-list-desc" + i)).toHaveTextContent(item.description);
        })
    });
});

test("searchbar for items of one shop", async () => {
    
    var page;
    await act(async () => {
        page = await render(<SearchBar thisShop={1} />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(page.queryByTestId("shop-filterby-button")).toBeNull();
        
        let itemInput = await page.queryByTestId("item-input");

        await fireEvent.change(itemInput, { target: { value: '810 من' } });
        await new Promise(resolve => setImmediate(resolve));
        searchedItemsInOneShop("810 من",1).forEach(async (item, i) => {
            expect(await page.queryByTestId("search-list-img" + i)).toHaveAttribute('src', item.photo?item.photo:"/no-image-icon-0.jpg");
            expect(await page.queryByTestId("search-list-title" + i)).toHaveTextContent(item.name);
            expect(await page.queryByTestId("search-list-desc" + i)).toHaveTextContent(item.description);
        })

        await fireEvent.change(itemInput, { target: { value: 'item' } });
        await new Promise(resolve => setImmediate(resolve));
        searchedItemsInOneShop("item",1).forEach(async (item, i) => {
            expect(await page.queryByTestId("search-list-img" + i)).toHaveAttribute('src', item.photo?item.photo:"/no-image-icon-0.jpg");
            expect(await page.queryByTestId("search-list-title" + i)).toHaveTextContent(item.name);
            expect(await page.queryByTestId("search-list-desc" + i)).toHaveTextContent(item.description);
        })
    });
});

