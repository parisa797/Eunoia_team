import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ItemsListPage from './ItemsListPage';
import '@testing-library/jest-dom';
import ServerURL from './Constants'
const fetchMock = require('fetch-mock-jest');


let container = null;

let shopNames = ["فروشگاه", "348928342", "kjjkjiufgfh", "kjنتمم879*^", "*&()#$kkkkkkhممممممماای شاپ نت "];
let photos = [null, "", "98098.png", "hggg46.jpg", "عکسpict ure.png"];
let dates = ["1400-03-04","1399-12-29", ""];
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
var items = [];
let i=0;
let randomItemCount = 1 + Math.floor(Math.random() * 3); //FIX THIS 10 and 20
while(i!=randomItemCount){
    let shop_id = Math.floor(Math.random()*5);
    items.push({
        ItemShop:{title:shopNames[Math.floor(Math.random() * 5)], online:(Math.floor(Math.random() * 2)===1), id:shop_id},
        name: shopNames[Math.floor(Math.random() * 5)], price:Math.floor(Math.random() * 1000)*1000,
        discount:Math.floor(Math.random() * 100), count:Math.floor(Math.random() * 200), photo:photos[Math.floor(Math.random() * 5)],
        Expiration_jalali:dates[Math.floor(Math.random() * 3)], manufacture_jalali:dates[Math.floor(Math.random() * 3)],
        category:Object.keys(categories)[Math.floor(Math.random() * 13)], id:items.length, shop_id:shop_id
    })
    i+=1;
}
// const items = [
//     {
//     ItemShop:{
//         title:"فروشگاه است", online:"true"
//     }, price: 200000, discount: 0, photo: "/sth.png", Expiration_jalali: "1400-03-09", manufacture_jalali: "1400-02-31", category: 'Dairy'
// },
// {
//     ItemShop:{
//         title:"فروشگاه است", online:"true"
//     }, price: 0, discount: 0, photo: null, manufacture_jalali: "1403-02-31", Expiration_jalali: "1403-03-09", category: 'Dairy'
// },
// {
//     ItemShop:{
//         title:"", online:"true"
//     }, price: 60000, discount: 99, photo: "/عکس جدید.png", manufacture_jalali: "1399-02-31", Expiration_jalali: "1400-03-09", category: 'Dairy'
// },
// ];

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    global.window = Object.create(window);
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
    fetchMock
        .get("http://eunoia-bshop.ir:8000/items/new/", items)
    await act(async () => {
        page = await render(<ItemsListPage />);
        await new Promise(resolve => setImmediate(resolve));
        await new Promise(resolve => setImmediate(resolve));
    });
    expect(page.queryByTestId("header")).toHaveTextContent("همه کالاها");
    expect(page.queryByTestId("no-items")).toBeNull();
    await new Promise(resolve => setImmediate(resolve));
    items.forEach((item, i)=>{
        if(!!item.photo){
            console.log("item-img"+(item.id))
            expect(page.queryByTestId("item-img"+(item.id))).toHaveAttribute('src',ServerURL+item.photo)
        }
    })
});
