import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ItemCard from "./ItemCard";
import ShoppingList from "./ShoppingList";
import ShoppingListCompletion from './ShoppingListCompletion';
import '@testing-library/jest-dom';
const fetchMock = require('fetch-mock-jest');
import * as Snackbar from 'notistack';

const enqueueSnackbarMock = jest.fn()
const closeSnackbarMock = jest.fn()
var shoppinglist = { "id": 1, "shopping_list_items": [ 
    {"id": 1,"item": {"photo": "sdjfl.png","name": "mast","shop_id": 1,"description": "","manufacture_jalali": "2642-06-22","Expiration_jalali": "2642-07-09","count": 6,
    "category": "others","id": 1,"discount": 0,"price": 10000},"number": 3,"shopping_list": 3},
    {"id": 2,"item": {"photo": "sdjfl_سنبیسمب.png","name": "کالا","shop_id": 1,"description": "","manufacture_jalali": "2642-06-24","Expiration_jalali": "2642-07-11",
    "count": 10,"category": "others","id": 2,"discount": "40","price": 345600},"number": 6,"shopping_list": 3},
    {"id": 3,"item": {"photo": "2398948.png","name": "ماست؟","shop_id": 1,"description": "","manufacture_jalali": "2642-06-24","Expiration_jalali": "2642-07-11",
    "count": 20,"category": "others","id": 3,"discount": 10,"price": 45000},"number": 6,"shopping_list": 3},
    ],
    "date_jalali": "None", "date": null, "sabt": false, "address": null, "phone": null, 
    "online": false, "max_cost": null, "delivery_time": null ,"user": 1, "shop": 1, "sum_price":1517160}

let completedShoppingList = { "id": 2, "shopping_list_items": [ 
    {"id": 1,"item": {"photo": "sdjfl.png","name": "mast","shop_id": 1,"description": "","manufacture_jalali": "2642-06-22","Expiration_jalali": "2642-07-09","count": 6,
    "category": "others","id": 1,"discount": 0,"price": 10000},"number": 3,"shopping_list": 3},
    {"id": 2,"item": {"photo": "sdjfl_سنبیسمب.png","name": "کالا","shop_id": 1,"description": "","manufacture_jalali": "2642-06-24","Expiration_jalali": "2642-07-11",
    "count": 10,"category": "others","id": 2,"discount": "40","price": 345600},"number": 6,"shopping_list": 3},
    {"id": 3,"item": {"photo": "2398948.png","name": "ماست؟","shop_id": 1,"description": "","manufacture_jalali": "2642-06-24","Expiration_jalali": "2642-07-11",
    "count": 20,"category": "others","id": 3,"discount": 10,"price": 45000},"number": 6,"shopping_list": 3},
    ],
    "date_jalali": "1400-03-19 21:55:25.242218", "date": "2021-06-09T21:55:25.242218+04:30", "sabt": true, "address": "یه جایی از دنیا", "phone": "09122323233", 
    "online": true, "max_cost": null, "delivery_time": "2021-06-16T12:00:00+04:30","user": 1, "shop": 1, "sum_price":1517160, "date_delivery":"1400-03-26 12:00:00"}

let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    const url = "/store/1";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    
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

test("adding to a shopping list", async () => {
    localStorage.setItem("shoplists","{}")
    const item = { name: "items", description: "the first item",
     ItemShop: { title: "shop1", id: 1 }, price: 20000, discount: 0, shop_id: 1, id: 1, count: 10,
     Expiration_Date: "1400-02-20", manufacture_Date: "1400-02-02", category: 'Spices and condiments and food side dishes' }
     const item2 = { name: "کالای دیگر", description: "کالایی دیگر",
     ItemShop: { title: "shop1", id: 1 }, price: 7000, discount: 10, shop_id: 1, id: 1, count: 1,
     Expiration_Date: "1400-02-20", manufacture_Date: "1400-02-02", category: 'Cosmetics' }
     var page;
    fetchMock
        .post("http://eunoia-bshop.ir:8000/api/v1/shoppings/create/", {shop: 1, id: 1})
        .post("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/", 200)
        .get("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/list/1", [{item:item2, number:2, id: 2}])
        .put("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/2", 200)
    await act(async () => {
        page = await render(<ItemCard item={item} id={1} onlineShop={true} userState={"l"} />);
        await new Promise(resolve => setImmediate(resolve));
        await page.getByTestId("add-to-cart-btn").click();
        await new Promise(resolve => setImmediate(resolve));
        expect(JSON.parse(localStorage.getItem("shoplists"))["1"]).toBe(1);
        expect(page.getByTestId("added-btn")).not.toBeNull();
    });
});

test("adding to a shoppinglist causing price limit warning", async () => {
    localStorage.setItem("shoplists",JSON.stringify({"1":"1"}))
     const item2 = { name: "کالای دیگر", description: "کالایی دیگر",
     ItemShop: { title: "shop1", id: 1 }, price: 7000, discount: 10, shop_id: 1, id: 1, count: 1,
     Expiration_Date: "1400-02-20", manufacture_Date: "1400-02-02", category: 'Cosmetics' }
     var page;
    fetchMock
        .post("http://eunoia-bshop.ir:8000/api/v1/shoppings/create/", {shop: 1, id: 1})
        .post("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/", {status:400, body: JSON.stringify("sum_price should be smaller than max_cost")})
        .get("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/list/1", [{item:item2, number:2, id: 2}])
        .put("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/2", {status:400, body: JSON.stringify("sum_price should be smaller than max_cost")})
    await act(async () => {
        console.log(JSON.parse(localStorage.getItem("shoplists"))[item2.shop_id])
        page = await render(<ItemCard item={item2} id={2} onlineShop={true} userState={"l"} />);
        await new Promise(resolve => setImmediate(resolve));
        await page.getByTestId("add-to-cart-btn").click();
        await new Promise(resolve => setImmediate(resolve));
        expect(enqueueSnackbarMock).toBeCalledTimes(1);
        expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("به محدودیت قیمت سبد خرید رسیده‌اید", { variant: 'error',})
    });
});

test("shopping list with no items and price limit", async () => {
    localStorage.setItem("shoplists",JSON.stringify({}))
    let shop = { title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "", comment_count: 0, online: "True" };
     var page;
    fetchMock
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/1", shop)
    await act(async () => {
        page = await render(<ShoppingList userState={"l"} />);
        await new Promise(resolve => setImmediate(resolve));
        expect(page.getByTestId("shopping-no-items")).not.toBeNull();
        expect(page.getByTestId("shopping-no-items")).toHaveTextContent("کالایی در لیست خرید شما وجود ندارد");
        expect(page.getByTestId("shopping-no-price-limit")).toHaveTextContent("محدودیت قیمت ندارد");
    });
});

test("shopping list items", async () => {
    await localStorage.setItem("shoplists",JSON.stringify({"1":"1"}))
    await new Promise(resolve => setImmediate(resolve));
    let shop = { title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "", comment_count: 0, online: "True" };
     var page;
    fetchMock
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/1", shop)
        .get("http://eunoia-bshop.ir:8000/api/v1/shoppings/1", shoppinglist)
    await act(async () => {
        while(!JSON.parse(localStorage.getItem("shoplists")) || !(JSON.parse(localStorage.getItem("shoplists"))[1])){}
        page = await render(<ShoppingList userState={"l"} />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(page.queryByTestId("shopping-no-price-limit")).toHaveTextContent("محدودیت قیمت ندارد");
        shoppinglist.shopping_list_items.forEach(async (el, i) => {
            await new Promise(resolve => setImmediate(resolve));
            expect(await page.queryByTestId(`shopping-item-photo-${el.item.id}`)).toHaveAttribute('src', el.item.photo)
            expect(page.getByTestId(`shopping-item-name-${el.item.id}`)).toHaveTextContent(el.item.name);
            expect(page.getByTestId(`shopping-item-price-${el.item.id}`)).not.toBeNull();
            expect(page.getByTestId(`shopping-item-number-${el.item.id}`)).toHaveTextContent(`تعداد: ${el.number}`);
        })
    });
});

test("shopping list changing price limit", async () => {
    await localStorage.setItem("shoplists",JSON.stringify({"1":"1"}))
    let shop = { title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "", comment_count: 0, online: "True" };
    var page;
    fetchMock
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/1", shop)
        .get("http://eunoia-bshop.ir:8000/api/v1/shoppings/1", shoppinglist)
        .put("http://eunoia-bshop.ir:8000/api/v1/shoppings/maxcost/1", (url,options)=>{
            shoppinglist.max_cost = options.body.get('max_cost');
            return 200;
        })
    await act(async () => {
        page = await render(<ShoppingList userState={"l"} />);
        await new Promise(resolve => setImmediate(resolve));
        expect(page.queryByTestId("shopping-no-price-limit")).toHaveTextContent("محدودیت قیمت ندارد");
        await page.queryByTestId("shopping-price-limit-edit").click();
        let input = page.queryByTestId("shopping-price-limit-input");
        let btn = page.queryByTestId("shopping-price-limit-submit");
        await fireEvent.change(input, { target: { value: 'lsdfjks' } });
        expect(input).toHaveValue('lsdfjks');
        await btn.click();
        expect(enqueueSnackbarMock).toBeCalledTimes(1);
        expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("لطفا محدودیت قیمت را به درستی وارد کنید", { variant: 'error',})

        await fireEvent.change(input, { target: { value: '123**' } });
        expect(input).toHaveValue('123**');
        await btn.click();
        expect(enqueueSnackbarMock).toBeCalledTimes(2);
        expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("لطفا محدودیت قیمت را به درستی وارد کنید", { variant: 'error',})

        await fireEvent.change(input, { target: { value: 'قیمت!' } });
        expect(input).toHaveValue('قیمت!');
        await btn.click();
        expect(enqueueSnackbarMock).toBeCalledTimes(3);
        expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("لطفا محدودیت قیمت را به درستی وارد کنید", { variant: 'error',})

        await fireEvent.change(input, { target: { value: '6000000' } });
        expect(input).toHaveValue('6000000');
        await btn.click();
        await new Promise(resolve => setImmediate(resolve));
        expect(page.queryByTestId("shopping-price-limit")).toHaveTextContent(`محدودیت قیمت: 6000000ریال`)
        
        await page.queryByTestId("shopping-price-limit-edit").click();
        input = page.getByTestId("shopping-price-limit-input");
        btn = page.getByTestId("shopping-price-limit-submit");
        await fireEvent.change(input, { target: { value: '9000' } });
        expect(input).toHaveValue('9000');
        await btn.click();
        expect(enqueueSnackbarMock).toBeCalledTimes(4);
        expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("محدودیت قیمت نباید کمتر از قیمت کل سبد خرید باشد", { variant: 'error',})

        await fireEvent.change(input, { target: { value: 2000000 } });
        expect(input).toHaveValue('2000000');
        await btn.click();
        await new Promise(resolve => setImmediate(resolve));
        expect(page.queryByTestId("shopping-price-limit")).toHaveTextContent(`محدودیت قیمت: 2000000ریال`)

        shoppinglist.max_cost = null;
    });
});

test("changing number of items in shopping list", async () => {
    await localStorage.setItem("shoplists",JSON.stringify({"1":"1"}))
    await new Promise(resolve => setImmediate(resolve));
    let shop = { title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "", comment_count: 0, online: "True" };
    var page;
    fetchMock
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/1", shop)
        .get("http://eunoia-bshop.ir:8000/api/v1/shoppings/1", shoppinglist)
        .put("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/1", (url,options)=>{
            shoppinglist.shopping_list_items[0].number = options.body.get('number');
            return 200;
        })
    await act(async () => {
        while(!JSON.parse(localStorage.getItem("shoplists")) || !(JSON.parse(localStorage.getItem("shoplists"))[1])){}
        page = await render(<ShoppingList userState={"l"} />);
        await new Promise(resolve => setImmediate(resolve));        
    });

    await act(async ()=>{
        let itemNumber = parseInt(shoppinglist.shopping_list_items[0].number); //it's 3
        let input = await page.getByTestId(`shopping-item-number-input-1`);
        expect(input).toHaveValue(itemNumber.toString());
        let plusBtn = page.getByTestId(`shopping-item-plus-1`);
        let minusBtn = page.getByTestId(`shopping-item-minus-1`);
        await plusBtn.click();
        await plusBtn.click();
        await plusBtn.click();
        expect(input).toHaveValue((itemNumber+3).toString());
        await plusBtn.click();
        expect(input).toHaveValue((itemNumber+3).toString());
        await page.getByTestId(`shopping-item-number-cancel-1`).click();
        expect(input).toHaveValue((itemNumber).toString());
        await minusBtn.click();
        await minusBtn.click();
        await minusBtn.click();
        expect(input).toHaveValue("1");
        await minusBtn.click();
        expect(input).toHaveValue("1");

        await page.getByTestId(`shopping-item-number-submit-1`).click();
        await new Promise(resolve => setImmediate(resolve));        
        expect(shoppinglist.shopping_list_items[0].number).toBe("1");

        itemNumber = parseInt(shoppinglist.shopping_list_items[0].number);
        await fireEvent.change(input, { target: { value: 'lsdfjks' } });
        expect(input).toHaveValue('lsdfjks');
        await page.getByTestId(`shopping-item-number-submit-1`).click();
        await new Promise(resolve => setImmediate(resolve));        
        expect(input).toHaveValue('1');

        await fireEvent.change(input, { target: { value: 'غیر عدد&*' } });
        expect(input).toHaveValue('غیر عدد&*');
        await page.getByTestId(`shopping-item-number-submit-1`).click();
        await new Promise(resolve => setImmediate(resolve));        
        expect(input).toHaveValue('1');

        await fireEvent.change(input, { target: { value: 'lsdfjksنیت - 9238' } });
        expect(input).toHaveValue('lsdfjksنیت - 9238');
        await page.getByTestId(`shopping-item-number-submit-1`).click();
        await new Promise(resolve => setImmediate(resolve));        
        expect(input).toHaveValue('1');

        await fireEvent.change(input, { target: { value: '9' } }); //more than the item's total count which is 6
        expect(input).toHaveValue('9');
        await page.getByTestId(`shopping-item-number-submit-1`).click();
        await new Promise(resolve => setImmediate(resolve));        
        expect(input).toHaveValue('1');

        await fireEvent.change(input, { target: { value: '6' } });
        expect(input).toHaveValue('6');
        await page.getByTestId(`shopping-item-number-submit-1`).click();
        await new Promise(resolve => setImmediate(resolve));        
        expect(input).toHaveValue('6');

        await fireEvent.change(input, { target: { value: 5 } });
        expect(input).toHaveValue('5');
        await page.getByTestId(`shopping-item-number-submit-1`).click();
        await new Promise(resolve => setImmediate(resolve));        
        expect(input).toHaveValue('5');

    })
});

test("shopping list second page", async () => {
    await localStorage.setItem("shoplists",JSON.stringify({"1":"1"}))
    await new Promise(resolve => setImmediate(resolve));
    let shop = { title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "", comment_count: 0, online: "True" };
     var page;
    fetchMock
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/1", shop)
        .get("http://eunoia-bshop.ir:8000/users/profile", {})
        .get("http://eunoia-bshop.ir:8000/api/v1/shoppings/1", shoppinglist)
    await act(async () => {
        while(!JSON.parse(localStorage.getItem("shoplists")) || !(JSON.parse(localStorage.getItem("shoplists"))[1])){}
        page = await render(<ShoppingListCompletion userState={"l"} />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(page.queryByTestId("shopping-price-limit")).toHaveTextContent("محدودیت قیمت ندارد");
        expect(page.queryByTestId("shopping-total")).toHaveTextContent(`${shoppinglist.sum_price} ریال`);
        expect(page.getByTestId("shopping-address-input")).not.toBeNull();
        expect(page.getByTestId("shopping-phone-input")).not.toBeNull();
    });
});

test("shopping list second page address, phone and delivery date", async () => {
    await localStorage.setItem("shoplists",JSON.stringify({"1":"1"}))
    await new Promise(resolve => setImmediate(resolve));
    let shop = { title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "", comment_count: 0, online: "True" };
     var page;
    fetchMock
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/1", shop)
        .get("http://eunoia-bshop.ir:8000/users/profile", {})
        .get("http://eunoia-bshop.ir:8000/api/v1/shoppings/1", shoppinglist)
        .put(`http://eunoia-bshop.ir:8000/api/v1/shoppings/update/1`, 200)
        .put("http://eunoia-bshop.ir:8000/api/v1/shoppings/delivery/1", 200)
        .put("http://eunoia-bshop.ir:8000/api/v1/shoppings/online/1", 200)
        .put("http://eunoia-bshop.ir:8000/api/v1/shoppings/sabt/1", 200)
    await act(async () => {
        while(!JSON.parse(localStorage.getItem("shoplists")) || !(JSON.parse(localStorage.getItem("shoplists"))[1])){}
        page = await render(<ShoppingListCompletion userState={"l"} />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        let address = page.getByTestId("shopping-address-input");
        let phone = page.getByTestId("shopping-phone-input");

        //since the user hasn't set any address, phone and time of delivery, they can't register the shoppinglist
        await page.getByTestId("shopping-sabt").click();
        await new Promise(resolve => setImmediate(resolve));
        expect(enqueueSnackbarMock).toBeCalledTimes(1);
        expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("محل تحویل سفارش را قبل از ثبت وارد کنید", { variant: 'error',})

        //changing address
        await fireEvent.change(address, { target: { value: 'یک آدرس سیبمتننیتبمی سنیتبمستبم؟؟؟؟!' } });
        expect(address).toHaveValue('یک آدرس سیبمتننیتبمی سنیتبمستبم؟؟؟؟!');
        page.getByTestId("shopping-submit-address").click();
        await new Promise(resolve => setImmediate(resolve));
        expect(page.getByTestId("shopping-address")).toHaveTextContent('یک آدرس سیبمتننیتبمی سنیتبمستبم؟؟؟؟!');

        page.getByTestId("shopping-change-address").click();
        address = page.getByTestId("shopping-address-input");
        await fireEvent.change(address, { target: { value: 'somewhere...93*^%&$' } });
        expect(address).toHaveValue('somewhere...93*^%&$');
        page.getByTestId("shopping-submit-address").click();
        await new Promise(resolve => setImmediate(resolve));
        expect(page.getByTestId("shopping-address")).toHaveTextContent('somewhere...93*^%&$');

        page.getByTestId("shopping-change-address").click();
        address = page.getByTestId("shopping-address-input");
        await fireEvent.change(address, { target: { value: '' } });
        expect(address).toHaveValue('');
        page.getByTestId("shopping-submit-address").click();
        await new Promise(resolve => setImmediate(resolve));
        expect(page.queryByTestId("shopping-address")).toBeNull(); //not visible, the input is still placed instead of it
        expect(page.queryByTestId("shopping-address-input")).not.toBeNull();

        await fireEvent.change(address, { target: { value: null } });
        expect(address).toHaveValue("");
        page.getByTestId("shopping-submit-address").click();
        await new Promise(resolve => setImmediate(resolve));
        expect(page.queryByTestId("shopping-address")).toBeNull(); //not visible, the input is still placed instead of it
        expect(page.queryByTestId("shopping-address-input")).not.toBeNull();

        await fireEvent.change(address, { target: { value: undefined } });
        expect(address).toHaveValue("");
        page.getByTestId("shopping-submit-address").click();
        await new Promise(resolve => setImmediate(resolve));
        expect(page.queryByTestId("shopping-address")).toBeNull(); //not visible, the input is still placed instead of it
        expect(page.queryByTestId("shopping-address-input")).not.toBeNull();

        //the user hasn't still set a phone number and delivery date
        await page.getByTestId("shopping-sabt").click();
        await new Promise(resolve => setImmediate(resolve));
        expect(enqueueSnackbarMock).toBeCalledTimes(2);
        expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("برای ثبت سفارش باید شماره تلفنی وارد کنید", { variant: 'error',})

        //changing phone number
        await fireEvent.change(phone, { target: { value: '34289sfljd' } });
        expect(phone).toHaveValue('34289sfljd');
        page.getByTestId("shopping-submit-phone").click();
        await new Promise(resolve => setImmediate(resolve));
        expect(enqueueSnackbarMock).toBeCalledTimes(3);
        expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("تنها عدد وارد کنید", { variant: 'error',})

        await fireEvent.change(phone, { target: { value: '09شماره*' } });
        expect(phone).toHaveValue('09شماره*');
        page.getByTestId("shopping-submit-phone").click();
        await new Promise(resolve => setImmediate(resolve));
        expect(enqueueSnackbarMock).toBeCalledTimes(4);
        expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("تنها عدد وارد کنید", { variant: 'error',})

        await fireEvent.change(phone, { target: { value: '0912' } });
        expect(phone).toHaveValue('0912');
        page.getByTestId("shopping-submit-phone").click();
        await new Promise(resolve => setImmediate(resolve));
        expect(enqueueSnackbarMock).toBeCalledTimes(5);
        expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("شماره همراه درست نیست!", { variant: 'error',})

        await fireEvent.change(phone, { target: { value: '09122222222' } });
        expect(phone).toHaveValue('09122222222');
        page.getByTestId("shopping-submit-phone").click();
        await new Promise(resolve => setImmediate(resolve));
        expect(page.getByTestId("shopping-phone")).toHaveTextContent('09122222222');

        page.getByTestId("shopping-change-phone").click();
        phone = page.getByTestId("shopping-phone-input");
        await fireEvent.change(phone, { target: { value: null } });
        expect(phone).toHaveValue('');
        page.getByTestId("shopping-submit-phone").click();
        expect(enqueueSnackbarMock).toBeCalledTimes(6);
        expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("تنها عدد وارد کنید", { variant: 'error',})

        //the user hasn't still set a delivery date
        await page.getByTestId("shopping-sabt").click();
        await new Promise(resolve => setImmediate(resolve));
        expect(enqueueSnackbarMock).toBeCalledTimes(7);
        expect(enqueueSnackbarMock).toHaveBeenLastCalledWith("زمان تحویل سفارش را مشخص کنید", { variant: 'error',})

        let date = page.getByTestId(`shopping-date-1-1`);
        fireEvent.click(date, { target: { checked: true }});
        page.getByTestId("date-btn").click();
        expect(date.checked).toEqual(true);

        date = page.getByTestId(`shopping-date-3-2`);
        fireEvent.click(date, { target: { checked: true }});
        page.getByTestId("date-btn").click();
        expect(date.checked).toEqual(true);

    });
});

test("completed shopping list", async () => {
    await localStorage.setItem("shoplists",JSON.stringify({"1":"1"}))
    window.location.pathname="/store/1/shopping-history/2";
    await new Promise(resolve => setImmediate(resolve));
    let shop = { title: "shop1", rate_value: 2, rate_count: 20, id: 1, address: "addressssss", logo: "", comment_count: 0, online: "True" };
     var page;
    fetchMock
        .get("http://eunoia-bshop.ir:8000/api/v1/shops/1", shop)
        .get("http://eunoia-bshop.ir:8000/api/v1/shoppings/2", completedShoppingList)
    await act(async () => {
        while(!JSON.parse(localStorage.getItem("shoplists")) || !(JSON.parse(localStorage.getItem("shoplists"))[1])){}
        page = await render(<ShoppingList userState={"l"} completed={true} />);
        await new Promise(resolve => setImmediate(resolve));
    });
    await act(async () => {
        expect(page.queryByTestId("shopping-no-price-limit")).toHaveTextContent("محدودیت قیمت ندارد");
        expect(page.queryByTestId("completed-delivery-date")).toHaveTextContent("26 خرداد 1400، ساعت 12 تا 15");
        expect(page.queryByTestId("completed-address")).toHaveTextContent(completedShoppingList.address);
        expect(page.queryByTestId("completed-phone")).toHaveTextContent(completedShoppingList.phone);
        expect(page.queryByTestId("completed-online")).toHaveTextContent("خرید آنلاین");
        completedShoppingList.shopping_list_items.forEach(async (el, i) => {
            await new Promise(resolve => setImmediate(resolve));
            expect(await page.getByTestId(`shopping-item-photo-${el.item.id}`)).toHaveAttribute('src', el.item.photo)
            expect(page.getByTestId(`shopping-item-name-${el.item.id}`)).toHaveTextContent(el.item.name);
            expect(page.getByTestId(`shopping-item-price-${el.item.id}`)).not.toBeNull();
            expect(page.getByTestId(`shopping-item-number-${el.item.id}`)).toHaveTextContent(`تعداد: ${el.number}`);
        })
    });
});