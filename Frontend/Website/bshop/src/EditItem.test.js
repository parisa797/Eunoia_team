import { render as Render, unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import EditItem from './EditItem';
import '@testing-library/jest-dom';
import DeleteItem from "./DeleteItem";


let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    const url = "/store/1/item/2";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
    //   jest.mock("./DeleteItem").mockImplementation(()=><div></div>)
    localStorage.setItem('username', 'uwu')
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

test("edit item page", async () => {
    const item = {
        name: "شیر دامداران",
        count: 20,
        price: 200000,
        discount: 0,
        description: "هیچی",
        photo: "/sth.png",
        Expiration_jalali: "1400-03-09",
        manufacture_jalali: "1400-02-31",
        category: 'Dairy'
    };
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            status: 200,
            json: () => item
        })
    );
    await act(async () => {

        Render(<EditItem deleteItemModal={{ show: false }} />, container);
    });
    expect(
        container.querySelector('[data-testid="edit-item-name"]').getAttribute('value')
    ).toEqual(item.name);
    expect(
        container.querySelector('[data-testid="edit-item-category"]').getAttribute('value')
    ).toEqual('لبنیات');
    expect(
        container.querySelector('[data-testid="edit-item-manufacture-date-year"]').getAttribute('value')
    ).toEqual("1400");
    expect(
        container.querySelector('[data-testid="edit-item-manufacture-date-month"]').getAttribute('value')
    ).toEqual("02");
    expect(
        container.querySelector('[data-testid="edit-item-manufacture-date-day"]').getAttribute('value')
    ).toEqual("31");
    expect(
        container.querySelector('[data-testid="edit-expiration-date-year"]').getAttribute('value')
    ).toEqual("1400");
    expect(
        container.querySelector('[data-testid="edit-expiration-date-month"]').getAttribute('value')
    ).toEqual("03");
    expect(
        container.querySelector('[data-testid="edit-expiration-date-day"]').getAttribute('value')
    ).toEqual("09");
    expect(
        container.querySelector('[data-testid="edit-item-description"]').textContent
    ).toEqual(item.description);
    expect(
        container.querySelector('[data-testid="edit-item-count"]').getAttribute('value')
    ).toEqual("" + item.count);
    expect(
        container.querySelector('[data-testid="edit-item-price"]').getAttribute('value')
    ).toEqual("" + item.price);
    expect(
        container.querySelector('[data-testid="edit-item-discount"]').getAttribute('value')
    ).toEqual("" + item.discount);
});

test("name input in all possible ways", async () => {
    const item = {
        count: 20,
        price: 200000,
        discount: 0,
        description: "هیچی",
        photo: "/sth.png",
        Expiration_jalali: "1400-03-09",
        manufacture_jalali: "1400-02-31",
        category: 'Dairy'
    };
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            status: 200,
            json: () => item
        })
    );
    var page;
    var name;
    await act(async () => {
        page = await render(<EditItem deleteItemModal={{ show: false }} />);
        name = await page.getByTestId("edit-item-name");
    });
    expect(name).toHaveValue("نام کالا را وارد کنید...");

    await act(async () => {
        await name.focus();
        expect(name).toHaveValue("");
        await fireEvent.change(name, { target: { value: 's' } });
        expect(name).toHaveValue("s");
        await fireEvent.change(name, { target: { value: 'lsjfaiejfailejiajfeijflaeij' } });
        expect(name).toHaveValue('lsjfaiejfailejiajfeijflaeij');
        await fireEvent.change(name, { target: { value: '' } });
        expect(name).toHaveValue('');
        await name.blur();
        expect(name).toHaveValue("نام کالا را وارد کنید...");
        await name.focus();
        expect(name).toHaveValue("");
        await fireEvent.change(name, { target: { value: 'سلام' } });
        expect(name).toHaveValue("سلام");
        await name.blur();
        expect(name).toHaveValue("سلام");
        await name.focus();
        expect(name).toHaveValue("سلام");
        await fireEvent.change(name, { target: { value: 'سلام این اسم من است 248903284 ^$%^@#$' } });
        expect(name).toHaveValue('سلام این اسم من است 248903284 ^$%^@#$');
        await fireEvent.change(name, { target: { value: 38479283 } });
        expect(name).toHaveValue("38479283");
        await name.blur();
        expect(name).toHaveValue("38479283");
    })
});


test("description input in all possible ways", async () => {
    const item = {
        count: 20,
        price: 200000,
        discount: 0,
        photo: "/sth.png",
        Expiration_jalali: "1400-03-09",
        manufacture_jalali: "1400-02-31",
        category: 'Dairy'
    };
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            status: 200,
            json: () => item
        })
    );
    var page;
    var description;
    await act(async () => {
        page = await render(<EditItem deleteItemModal={{ show: false }} />);
        description = await page.getByTestId("edit-item-description");
    });
    expect(description).toHaveTextContent("توضیحات مربوط به کالا را وارد کنید...");

    await act(async () => {
        await description.focus();
        expect(description).toHaveTextContent("");
        await fireEvent.change(description, { target: { value: 'هیچی ...' } });
        expect(description).toHaveTextContent("هیچی ...");
        await fireEvent.change(description, { target: { value: 'sm' } });
        expect(description).toHaveTextContent("sm");
        await fireEvent.change(description, { target: { value: 'چه توضیحات بلندیییییییییییییییییییییییییییییییییییییی' } });
        expect(description).toHaveTextContent('چه توضیحات بلندیییییییییییییییییییییییییییییییییییییی');
        await fireEvent.change(description, { target: { value: '' } });
        expect(description).toHaveTextContent('');
        await description.blur();
        expect(description).toHaveTextContent("توضیحات مربوط به کالا را وارد کنید...");
        await description.focus();
        expect(description).toHaveTextContent("");
        await fireEvent.change(description, { target: { value: 's' } });
        expect(description).toHaveTextContent("s");
        await description.blur();
        expect(description).toHaveTextContent("s");
        await description.focus();
        expect(description).toHaveTextContent("s");
        await fireEvent.change(description, { target: { value: '039489203849' } });
        expect(description).toHaveTextContent("039489203849");
        await fireEvent.change(description, { target: { value: '#@$%&)!@' } });
        expect(description).toHaveTextContent('#@$%&)!@');
    })
});

test("category input in all possible ways", async () => {
    const item = {
        count: 20,
        price: 200000,
        discount: 0,
        photo: "/sth.png",
        Expiration_jalali: "1400-03-09",
        manufacture_jalali: "1400-02-31",
        category: 'Dairy'
    };
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            status: 200,
            json: () => item
        })
    );
    var page;
    var category;
    await act(async () => {
        page = await render(<EditItem deleteItemModal={{ show: false }} />);
        category = await page.getByTestId("edit-item-category");
    });
    expect(category).toHaveValue('لبنیات');

    await act(async () => {
        await category.focus();
        await page.getByText('ادویه، چاشنی و مخلفات غذا').click();
        expect(category).toHaveValue('ادویه، چاشنی و مخلفات غذا')
        await page.getByText('بهداشت و مراقبت پوست').click();
        expect(category).toHaveValue('بهداشت و مراقبت پوست')
        await page.getByText('آرایش و پیرایش').click();
        expect(category).toHaveValue('آرایش و پیرایش')
        await page.getByText('پروتئینی').click();
        expect(category).toHaveValue('پروتئینی')
        await page.getByText('تنقلات').click();
        expect(category).toHaveValue('تنقلات')
        await page.getByText('خشکبار').click();
        expect(category).toHaveValue('خشکبار')
        await page.getByText('شیرینیجات و دسرها').click();
        expect(category).toHaveValue('شیرینیجات و دسرها')
        await page.getByText('عطر، ادکلن و اسپری').click();
        expect(category).toHaveValue('عطر، ادکلن و اسپری')
        await page.getByText('غذا، کنسرو و سبزیجات').click();
        expect(category).toHaveValue('غذا، کنسرو و سبزیجات')
        await page.getByText('لبنیات').click();
        expect(category).toHaveValue('لبنیات')
        await page.getByText('نوشیدنیها').click();
        expect(category).toHaveValue('نوشیدنیها')
        await page.getByText('وسایل شستشو و نظافت').click();
        expect(category).toHaveValue('وسایل شستشو و نظافت')
        await page.getByText('متفرقه').click();
        expect(category).toHaveValue('متفرقه')
    })
});

test("count input in all possible ways", async () => {
    const item = {
        price: 200000,
        discount: 0,
        photo: "/sth.png",
        Expiration_jalali: "1400-03-09",
        manufacture_jalali: "1400-02-31",
        category: 'Dairy'
    };
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            status: 200,
            json: () => item
        })
    );
    var page;
    var count;
    await act(async () => {
        page = await render(<EditItem deleteItemModal={{ show: false }} />);
        count = await page.getByTestId("edit-item-count");
    });
    expect(count).toHaveValue("تعداد موجودی کالا را وارد کنید...");
    expect(page.queryByTestId("edit-item-count-err")).toBeNull();

    await act(async () => {
        await count.focus();
        expect(page.queryByTestId("edit-item-count-err")).toBeNull();
        expect(count).toHaveValue("");

        await fireEvent.change(count, { target: { value: 'من' } });
        expect(count).toHaveValue("من");
        await count.blur();
        expect(page.queryByTestId("edit-item-count-err")).not.toBeNull();
        expect(page.queryByTestId("edit-item-count-err")).toHaveTextContent("تنها عدد وارد کنید");

        await count.focus();
        await fireEvent.change(count, { target: { value: '50.5' } });
        expect(count).toHaveValue("50.5");
        await count.blur();
        expect(page.queryByTestId("edit-item-count-err")).not.toBeNull();
        expect(page.queryByTestId("edit-item-count-err")).toHaveTextContent("تنها عدد وارد کنید");

        await count.focus();
        await fireEvent.change(count, { target: { value: '0sm1' } });
        expect(count).toHaveValue("0sm1");
        await count.blur();
        expect(page.queryByTestId("edit-item-count-err")).not.toBeNull();
        expect(page.queryByTestId("edit-item-count-err")).toHaveTextContent("تنها عدد وارد کنید");

        await count.focus();
        await fireEvent.change(count, { target: { value: '' } });
        expect(count).toHaveValue('');
        await count.blur();
        expect(page.queryByTestId("edit-item-count-err")).toBeNull();
        expect(count).toHaveValue("تعداد موجودی کالا را وارد کنید...");

        await count.focus();
        expect(count).toHaveValue("");
        await fireEvent.change(count, { target: { value: '100' } });
        expect(count).toHaveValue("100");
        await count.blur();
        expect(page.queryByTestId("edit-item-count-err")).toBeNull();
        expect(count).toHaveValue("100");

        await count.focus();
        await fireEvent.change(count, { target: { value: 100 } });
        expect(count).toHaveValue("100");
        await count.blur();
        expect(page.queryByTestId("edit-item-count-err")).toBeNull();
        expect(count).toHaveValue("100");

        await count.focus();
        await fireEvent.change(count, { target: { value: 0 } });
        expect(count).toHaveValue("0");
        await count.blur();
        expect(page.queryByTestId("edit-item-count-err")).toBeNull();
        expect(count).toHaveValue("0");
    })
});


test("price input in all possible ways", async () => {
    const item = {
        discount: 0,
        photo: "/sth.png",
        Expiration_jalali: "1400-03-09",
        manufacture_jalali: "1400-02-31",
        category: 'Dairy'
    };
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            status: 200,
            json: () => item
        })
    );
    var page;
    var price;
    await act(async () => {
        page = await render(<EditItem deleteItemModal={{ show: false }} />);
        price = await page.getByTestId("edit-item-price");
    });
    expect(price).toHaveValue("قیمت کالا را وارد کنید...");
    expect(page.queryByTestId("edit-item-price-err")).toBeNull();

    await act(async () => {
        await price.focus();
        expect(page.queryByTestId("edit-item-price-err")).toBeNull();
        expect(price).toHaveValue("");

        await fireEvent.change(price, { target: { value: 'من' } });
        expect(price).toHaveValue("من");
        await price.blur();
        expect(page.queryByTestId("edit-item-price-err")).not.toBeNull();
        expect(page.queryByTestId("edit-item-price-err")).toHaveTextContent("تنها عدد وارد کنید");

        await price.focus();
        await fireEvent.change(price, { target: { value: '10.500' } });
        expect(price).toHaveValue("10.500");
        await price.blur();
        expect(page.queryByTestId("edit-item-price-err")).not.toBeNull();
        expect(page.queryByTestId("edit-item-price-err")).toHaveTextContent("تنها عدد وارد کنید");
        
        await price.focus();
        await fireEvent.change(price, { target: { value: '0sm1' } });
        expect(price).toHaveValue("0sm1");
        await price.blur();
        expect(page.queryByTestId("edit-item-price-err")).not.toBeNull();
        expect(page.queryByTestId("edit-item-price-err")).toHaveTextContent("تنها عدد وارد کنید");

        await price.focus();
        await fireEvent.change(price, { target: { value: '' } });
        expect(price).toHaveValue('');
        await price.blur();
        expect(page.queryByTestId("edit-item-price-err")).toBeNull();
        expect(price).toHaveValue("قیمت کالا را وارد کنید...");

        await price.focus();
        expect(price).toHaveValue("");
        await fireEvent.change(price, { target: { value: '100000' } });
        expect(price).toHaveValue("100000");
        await price.blur();
        expect(page.queryByTestId("edit-item-price-err")).toBeNull();
        expect(price).toHaveValue("100000");

        await price.focus();
        await fireEvent.change(price, { target: { value: 100000 } });
        expect(price).toHaveValue("100000");
        await price.blur();
        expect(page.queryByTestId("edit-item-price-err")).toBeNull();
        expect(price).toHaveValue("100000");

        await price.focus();
        await fireEvent.change(price, { target: { value: 0 } });
        expect(price).toHaveValue("0");
        await price.blur();
        expect(page.queryByTestId("edit-item-price-err")).toBeNull();
        expect(price).toHaveValue("0");
    })
});

test("discount input in all possible ways", async () => {
    const item = {
        price: 200000,
        photo: "/sth.png",
        Expiration_jalali: "1400-03-09",
        manufacture_jalali: "1400-02-31",
        category: 'Dairy'
    };
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            status: 200,
            json: () => item
        })
    );
    var page;
    var discount;
    var price;
    await act(async () => {
        page = await render(<EditItem deleteItemModal={{ show: false }} />);
        discount = await page.getByTestId("edit-item-discount");
        price = await page.getByTestId("edit-item-price");
    });
    expect(discount).toHaveValue("تخفیف کالا را وارد کنید...");
    expect(page.queryByTestId("edit-item-discount-err")).toBeNull();

    await act(async () => {
        await discount.focus();
        expect(page.queryByTestId("edit-item-discount-err")).toBeNull();
        expect(discount).toHaveValue("");

        await fireEvent.change(discount, { target: { value: 'من' } });
        expect(discount).toHaveValue("من");
        await discount.blur();
        expect(page.queryByTestId("edit-item-discount-err")).not.toBeNull();
        expect(page.queryByTestId("edit-item-discount-err")).toHaveTextContent("تنها عدد وارد کنید");

        await discount.focus();
        await fireEvent.change(discount, { target: { value: '50.5' } });
        expect(discount).toHaveValue("50.5");
        await discount.blur();
        expect(page.queryByTestId("edit-item-discount-err")).not.toBeNull();
        expect(page.queryByTestId("edit-item-discount-err")).toHaveTextContent("تنها عدد وارد کنید");

        await discount.focus();
        await fireEvent.change(discount, { target: { value: '0sm1@#$' } });
        expect(discount).toHaveValue("0sm1@#$");
        await discount.blur();
        expect(page.queryByTestId("edit-item-discount-err")).not.toBeNull();
        expect(page.queryByTestId("edit-item-discount-err")).toHaveTextContent("تنها عدد وارد کنید");

        await discount.focus();
        await fireEvent.change(discount, { target: { value: '-50' } });
        expect(discount).toHaveValue("-50");
        await discount.blur();
        expect(page.queryByTestId("edit-item-discount-err")).not.toBeNull();
        expect(page.queryByTestId("edit-item-discount-err")).toHaveTextContent("تنها عدد وارد کنید");

        await discount.focus();
        await fireEvent.change(discount, { target: { value: '-5' } });
        expect(discount).toHaveValue("-5");
        await discount.blur();
        expect(page.queryByTestId("edit-item-discount-err")).not.toBeNull();
        expect(page.queryByTestId("edit-item-discount-err")).toHaveTextContent("تنها عدد وارد کنید");

        await discount.focus();
        await fireEvent.change(discount, { target: { value: '101' } });
        expect(discount).toHaveValue("101");
        await discount.blur();
        expect(page.queryByTestId("edit-item-discount-err")).not.toBeNull();
        expect(page.queryByTestId("edit-item-discount-err")).toHaveTextContent("تخفیف را به درصد وارد کنید");

        await discount.focus();
        await fireEvent.change(discount, { target: { value: 300 } });
        expect(discount).toHaveValue("300");
        await discount.blur();
        expect(page.queryByTestId("edit-item-discount-err")).not.toBeNull();
        expect(page.queryByTestId("edit-item-discount-err")).toHaveTextContent("تخفیف را به درصد وارد کنید");

        await discount.focus();
        await fireEvent.change(discount, { target: { value: '' } });
        expect(discount).toHaveValue('');
        await discount.blur();
        expect(page.queryByTestId("edit-item-discount-err")).toBeNull();
        expect(discount).toHaveValue("تخفیف کالا را وارد کنید...");

        await discount.focus();
        expect(discount).toHaveValue("");
        await fireEvent.change(discount, { target: { value: '90' } });
        expect(discount).toHaveValue("90");
        await discount.blur();
        expect(page.queryByTestId("edit-item-discount-err")).toBeNull();
        expect(discount).toHaveValue("90");

        await discount.focus();
        await fireEvent.change(discount, { target: { value: null } });
        expect(discount).toHaveValue('');
        await discount.blur();
        expect(page.queryByTestId("edit-item-discount-err")).toBeNull();
        expect(discount).toHaveValue("تخفیف کالا را وارد کنید...");

        await discount.focus();
        await fireEvent.change(discount, { target: { value: 90 } });
        expect(discount).toHaveValue("90");
        await discount.blur();
        expect(page.queryByTestId("edit-item-discount-err")).toBeNull();
        expect(discount).toHaveValue("90");

        await discount.focus();
        await fireEvent.change(discount, { target: { value: 0 } });
        expect(discount).toHaveValue("0");
        await discount.blur();
        expect(page.queryByTestId("edit-item-discount-err")).toBeNull();
        expect(discount).toHaveValue("0");
        expect(discount).not.toHaveAttribute("readonly")

        //when there's no price, there'll be no discount
        await price.focus();
        await fireEvent.change(price, { target: { value: 0 } });
        await price.blur();
        expect(discount).toHaveValue("ابتدا قیمت کالا را مشخص کنید");
        expect(discount).toHaveAttribute("readonly","")

    })
});


test("manufacture date input in all possible ways", async () => {
    const item = {
        price: 200000,
        discount: 0,
        photo: "/sth.png",
        Expiration_jalali: "1400-03-09",
        manufacture_jalali: "1400-02-31",
        category: 'Dairy'
    };
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            status: 200,
            json: () => item
        })
    );
    var page;
    var year;
    var month;
    var day;
    await act(async () => {
        page = await render(<EditItem deleteItemModal={{ show: false }} />);
        year = await page.getByTestId("edit-item-manufacture-date-year");
        month = await page.getByTestId("edit-item-manufacture-date-month");
        day = await page.getByTestId("edit-item-manufacture-date-day");
    });
    expect(year).toHaveValue("1400");
    expect(month).toHaveValue("02");
    expect(day).toHaveValue("31");
    for(let i in [...Array(4).keys()])
    {
        expect(page.queryByTestId("edit-item-manufacture-err"+i)).toBeNull();
    }

    await act(async () => {
        //year
        await year.focus();
        expect(year).toHaveValue("1400");

        await year.focus();
        await fireEvent.change(year, { target: { value: '1401' } });
        await year.blur();
        expect(year).toHaveValue("1401");
        expect(page.queryByTestId("edit-item-manufacture-err0")).toBeNull();

        await year.focus();
        await fireEvent.change(year, { target: { value: '' } });
        await year.blur();
        expect(year).toHaveValue("1400");
        expect(page.queryByTestId("edit-item-manufacture-err0")).toBeNull();

        await year.focus();
        await fireEvent.change(year, { target: { value: 'من' } });
        expect(year).toHaveValue("من");
        await year.blur();
        expect(page.queryByTestId("edit-item-manufacture-err0")).not.toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err0")).toHaveTextContent("تنها عدد برای سال وارد کنید");

        await year.focus();
        await fireEvent.change(year, { target: { value: '@#$24' } });
        expect(year).toHaveValue("@#$24");
        await year.blur();
        expect(page.queryByTestId("edit-item-manufacture-err0")).not.toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err0")).toHaveTextContent("تنها عدد برای سال وارد کنید");

        await year.focus();
        await fireEvent.change(year, { target: { value: 140 } });
        expect(year).toHaveValue("140");
        await year.blur();
        expect(page.queryByTestId("edit-item-manufacture-err0")).not.toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err0")).toHaveTextContent("سال باید 4رقمی باشد");

        await year.focus();
        await fireEvent.change(year, { target: { value: 14000 } });
        expect(year).toHaveValue("14000");
        await year.blur();
        expect(page.queryByTestId("edit-item-manufacture-err0")).not.toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err0")).toHaveTextContent("سال باید 4رقمی باشد");

        await year.focus();
        await fireEvent.change(year, { target: { value: "11" } });
        expect(year).toHaveValue("11");
        await year.blur();
        expect(page.queryByTestId("edit-item-manufacture-err0")).not.toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err0")).toHaveTextContent("سال باید 4رقمی باشد");

        await year.focus();
        await fireEvent.change(year, { target: { value: "0000" } });
        expect(year).toHaveValue("0000");
        await year.blur();
        expect(page.queryByTestId("edit-item-manufacture-err3")).not.toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err3")).toHaveTextContent("تاریخ وارد شده وجود ندارد");

        await year.focus();
        await fireEvent.change(year, { target: { value: '1401' } });
        await year.blur();
        expect(page.queryByTestId("edit-item-manufacture-err0")).toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err1")).toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err2")).toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err3")).toBeNull();

        //month
        await month.focus();
        expect(month).toHaveValue("02");

        await month.focus();
        await fireEvent.change(month, { target: { value: '12' } });
        await month.blur();
        expect(month).toHaveValue("12");
        expect(page.queryByTestId("edit-item-manufacture-err1")).toBeNull();

        await month.focus();
        await fireEvent.change(month, { target: { value: '' } });
        await month.blur();
        expect(month).toHaveValue("02");
        expect(page.queryByTestId("edit-item-manufacture-err1")).toBeNull();

        await month.focus();
        await fireEvent.change(month, { target: { value: 'من' } });
        await month.blur();
        expect(month).toHaveValue("من");
        expect(page.queryByTestId("edit-item-manufacture-err1")).not.toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err1")).toHaveTextContent("تنها عدد برای ماه وارد کنید");

        await month.focus();
        await fireEvent.change(month, { target: { value: '@#$24' } });
        expect(month).toHaveValue("@#$24");
        await month.blur();
        expect(page.queryByTestId("edit-item-manufacture-err1")).not.toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err1")).toHaveTextContent("تنها عدد برای ماه وارد کنید");

        await month.focus();
        await fireEvent.change(month, { target: { value: 140 } });
        expect(month).toHaveValue("140");
        await month.blur();
        expect(page.queryByTestId("edit-item-manufacture-err1")).not.toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err1")).toHaveTextContent("ماه باید 2رقمی باشد");

        await month.focus();
        await fireEvent.change(month, { target: { value: "1" } });
        expect(month).toHaveValue("1");
        await month.blur();
        expect(page.queryByTestId("edit-item-manufacture-err1")).not.toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err1")).toHaveTextContent("ماه باید 2رقمی باشد");

        await month.focus();
        await fireEvent.change(month, { target: { value: "30" } });
        expect(month).toHaveValue("30");
        await month.blur();
        expect(page.queryByTestId("edit-item-manufacture-err1")).toBeNull();
        // expect(page.queryByTestId("edit-item-manufacture-err3")).not.toBeNull();
        // expect(page.queryByTestId("edit-item-manufacture-err3")).toHaveTextContent("تاریخ وارد شده وجود ندارد");

        await month.focus();
        await fireEvent.change(month, { target: { value: '05' } });
        await month.blur();
        expect(page.queryByTestId("edit-item-manufacture-err0")).toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err1")).toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err2")).toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err3")).toBeNull();


        //day
        await day.focus();
        expect(day).toHaveValue("31");

        await day.focus();
        await fireEvent.change(day, { target: { value: '12' } });
        await day.blur();
        expect(day).toHaveValue("12");
        expect(page.queryByTestId("edit-item-manufacture-err2")).toBeNull();

        await day.focus();
        await fireEvent.change(day, { target: { value: '' } });
        await day.blur();
        expect(day).toHaveValue("31");
        expect(page.queryByTestId("edit-item-manufacture-err2")).toBeNull();

        await day.focus();
        await fireEvent.change(day, { target: { value: 'من' } });
        await day.blur();
        expect(day).toHaveValue("من");
        expect(page.queryByTestId("edit-item-manufacture-err2")).not.toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err2")).toHaveTextContent("تنها عدد برای روز وارد کنید");

        await day.focus();
        await fireEvent.change(day, { target: { value: '@#$24' } });
        expect(day).toHaveValue("@#$24");
        await day.blur();
        expect(page.queryByTestId("edit-item-manufacture-err2")).not.toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err2")).toHaveTextContent("تنها عدد برای روز وارد کنید");

        await day.focus();
        await fireEvent.change(day, { target: { value: 140 } });
        expect(day).toHaveValue("140");
        await day.blur();
        expect(page.queryByTestId("edit-item-manufacture-err2")).not.toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err2")).toHaveTextContent("روز باید 2رقمی باشد");

        await day.focus();
        await fireEvent.change(day, { target: { value: "1" } });
        expect(day).toHaveValue("1");
        await day.blur();
        expect(page.queryByTestId("edit-item-manufacture-err2")).not.toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err2")).toHaveTextContent("روز باید 2رقمی باشد");

        await day.focus();
        await fireEvent.change(day, { target: { value: "40" } });
        expect(day).toHaveValue("40");
        await day.blur();
        expect(page.queryByTestId("edit-item-manufacture-err2")).toBeNull();
        // expect(page.queryByTestId("edit-item-manufacture-err3")).not.toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err3")).toHaveTextContent("تاریخ وارد شده وجود ندارد");

        await day.focus();
        await fireEvent.change(day, { target: { value: '30' } });
        await day.blur();
        expect(page.queryByTestId("edit-item-manufacture-err0")).toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err1")).toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err2")).toBeNull();
        expect(page.queryByTestId("edit-item-manufacture-err3")).toBeNull();

        //manufacture date as whole
        await year.focus();
        await fireEvent.change(year, { target: { value: '1400' } });
        await year.blur();
        await month.focus();
        await fireEvent.change(month, { target: { value: '07' } });
        await month.blur();
        await day.focus();
        await fireEvent.change(day, { target: { value: '31' } });
        await day.blur();
        expect(page.queryByTestId("edit-item-manufacture-err3")).toHaveTextContent("تاریخ وارد شده وجود ندارد");

        await month.focus();
        await fireEvent.change(month, { target: { value: '11' } });
        await month.blur();
        expect(page.queryByTestId("edit-item-manufacture-err3")).toHaveTextContent("تاریخ وارد شده وجود ندارد");

        await day.focus();
        await fireEvent.change(day, { target: { value: '30' } });
        await day.blur();
        expect(page.queryByTestId("edit-item-manufacture-err3")).toHaveTextContent("تاریخ وارد شده وجود ندارد");
    })
});
