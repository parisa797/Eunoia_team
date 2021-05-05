import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ShopComments from './ShopComments';
import '@testing-library/jest-dom';
const fetchMock = require('fetch-mock-jest');



let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

test("shop comments section for unsigned users", async () => {

    const comments = [
    {user:{user_name:"someone_else"}, date_jalali:"1404-04-03 13:03", text:"?8$#230@$&%)@!" , id:1},
    {user:{user_name:"someone"}, date_jalali:"1400-11-03 13:03", text:"این فروشگاه عالیه!", id:2},
    {user:{user_name:"another_one"}, date_jalali:"1402-12-29 13:03", text:"i love this shop و فارسی هم بلدم", id:3},
    {user:{user_name:"another_person"}, date_jalali:"1401-12-29 13:03", text:"i love this shop", id:4},
]
    var page;
    //2 is for comments
    fetchMock
        .get("https://iust-bshop.herokuapp.com/api/v1/shops/comment/list/1", comments)
        .put("https://iust-bshop.herokuapp.com/api/v1/shops/comment/2", {status:200})
        .post("https://iust-bshop.herokuapp.com/api/v1/shops/comment/create/", {status:201})
        .delete("https://iust-bshop.herokuapp.com/api/v1/shops/comment/2", {status:204})
    await act(async () => {
        // const flushPromises = () => new Promise(setImmediate);
        page = await render(<ShopComments userState="u" shopID={1}/>);
        //await jest.runAllTimers()
    });
    fetchMock.mockReset();
    for (let i in comments) {
    expect(page.queryByTestId("comment-username"+i)).toHaveTextContent(comments[i].user.user_name);
    console.log(comments[i].date_jalali)
    expect(page.queryByTestId("comment-datetime"+i)).toHaveTextContent(comments[i].date_jalali);
    expect(page.queryByTestId("comment-edit-delete-options"+i)).toBeNull();
    expect(page.queryByTestId("comment-text"+i)).toHaveTextContent(comments[i].text);
    expect(page.queryByTestId("comment"+i)).not.toBeNull();
    }
    expect(page.queryByTestId("comment-nocomment")).toBeNull();
});