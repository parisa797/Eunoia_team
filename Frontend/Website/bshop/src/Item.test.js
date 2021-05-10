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



    test("name and description Item test", async () => {
    localStorage.setItem('username', 'abc')
    global.window = Object.create(window);
    const url = "/store/1/item/1";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url 
        }
    });

   
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
        json: () => fakeItem 
        })
);
        var page;
        var description;
        await act(async () => {
            page = await render(<Item />); 
            await new Promise(resolve => setImmediate(resolve));

            description = await page.getByTestId("item");
        });
        expect(page.queryByTestId("item-name")).not.toBeNull();
        expect(page.queryByTestId("item-description")).toBeNull();

    });

    test(" have description Item test", async () => {
        localStorage.setItem('username', 'abc')
        global.window = Object.create(window);
        const url = "/store/1/item/1";
        Object.defineProperty(window, 'location', {
            value: {
                href: url,
                pathname: url 
            }
        });
    
        const fakeItem = {
            name:"itemmm",
            Expiration_jalali: "1400-03-03",
            manufacture_jalali: "1400-02-13",
            price: "90000",
            discount: "5",
            count: 30,
            description:"khoshmaze"
     }
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
            status: 200,
            json: () => fakeItem 
            })
    );
            var page;
            var description;
            await act(async () => {
                page = await render(<Item />); 
                await new Promise(resolve => setImmediate(resolve));

                description = await page.getByTestId("item");
            });
            expect(page.queryByTestId("item-description")).not.toBeNull();
            expect(page.queryByTestId("item-name")).toHaveTextContent(fakeItem.name);

        });
        
        test(" have not date Item test", async () => {
            localStorage.setItem('username', 'abc')
            global.window = Object.create(window);
            const url = "/store/1/item/1";
            Object.defineProperty(window, 'location', {
                value: {
                    href: url,
                    pathname: url 
                }
            });

            const fakeItem = {
                name:"itemmm",
                price: "90000",
                discount: "5",
                count: 30,
                description:"khoshmaze"
         }
            jest.spyOn(global, "fetch").mockImplementation(() =>
                Promise.resolve({
                status: 200,
                json: () => fakeItem 
                })
        );
        var page;
        var description;
        await act(async () => {
            page = await render(<Item />); 
            await new Promise(resolve => setImmediate(resolve));
            description = await page.getByTestId("item");
        });
        expect(page.queryByTestId("item-manufacture_jalali")).toBeNull();
        expect(page.queryByTestId("item-Expiration_jalali")).toBeNull();
    
            });

        
        test(" have text Item test", async () => {
            localStorage.setItem('username', 'abc')
            global.window = Object.create(window);
            const url = "/store/1/item/1";
            Object.defineProperty(window, 'location', {
                value: {
                    href: url,
                    pathname: url 
                }
            });

            const fakeItem = {
                name:"itemmm",
                price: "90000",
                discount: "5",
                count: 30,
                description:"khoshmaze"
         }
            jest.spyOn(global, "fetch").mockImplementation(() =>
                Promise.resolve({
                status: 200,
                json: () => fakeItem 
                })
        );
        var page;
        await act(async () => {
            page = await render(<Item />); 
            await new Promise(resolve => setImmediate(resolve));

        });

        expect(page.queryByTestId("item-name")).toHaveTextContent(fakeItem.name);
        expect(page.queryByTestId("item")).toHaveTextContent(fakeItem.description);
            });


            test(" have date Item test", async () => {
                localStorage.setItem('username', 'abc')
                global.window = Object.create(window);
                const url = "/store/1/item/1";
                Object.defineProperty(window, 'location', {
                    value: {
                        href: url,
                        pathname: url 
                    }
                });
    
                const fakeItem = {
                    name:"itemmm",
                    Expiration_jalali: "1400-03-03",
                    manufacture_jalali: "1400-02-13",
                    price: "90000",
                    discount: "5",
                    count: 30,
                    description:"khoshmaze"
             }
                jest.spyOn(global, "fetch").mockImplementation(() =>
                    Promise.resolve({
                    status: 200,
                    json: () => fakeItem 
                    })
            );
            var page;
            var description;
            await act(async () => {
                page = await render(<Item />); 
                await new Promise(resolve => setImmediate(resolve));

                description = await page.getByTestId("item");
            });
            expect(page.queryByTestId("item-manufacture_jalali")).not.toBeNull();
            expect(page.queryByTestId("item-Expiration_jalali")).not.toBeNull();
        
                });