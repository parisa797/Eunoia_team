import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ShopComments from './ShopComments';
import '@testing-library/jest-dom';
const fetchMock = require('fetch-mock-jest');

const flushPromises = () => new Promise(setImmediate);
let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    const url = "/store/1/items/1";
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
            pathname: url
        }
    });
});

afterEach(() => {
    // cleanup on exiting
    fetchMock.mockReset();
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

test("shop comments section for unsigned users", async () => {
//     const comments = [
//     {user:{user_name:"someone_else"}, date_jalali:"1404-04-03 13:03", text:"?8$#230@$&%)@!" , id:1},
//     {user:{user_name:"someone"}, date_jalali:"1400-11-03 13:03", text:"این فروشگاه عالیه!", id:2},
//     {user:{user_name:"another_one"}, date_jalali:"1402-12-29 13:03", text:"i love this shopو فارسی هم بلدم", id:3},
//     {user:{user_name:"another_person"}, date_jalali:"1401-12-29 13:03", text:"i love this shop", id:4},
// ]
//     var page;
//     //2 is for comments
//     fetchMock
//         .post("http://eunoia-bshop.ir:8000/shops/${shopID}/items/${itemID}/comments/${comment.id}/likes", {status:201})
//         .post("http://eunoia-bshop.ir:8000/shops/${shopID}/items/${itemID}/comments/${commentid}/replies/${reply.id}/likes", {status:204})
//     await act(async () => {
//         page = await render(<ShopComments userState={"u"} shopID={"1"}/>);
//         await new Promise(resolve => setImmediate(resolve));
//         // await flushPromises()
//         // page.debug()
//     });
//     for (let i in [1, 2, 3, 4]) {
//     let j= parseInt(i)+1;
//     expect(page.queryByTestId("comment-username"+j)).toHaveTextContent(comments[i].user.user_name);
//     expect(page.queryByTestId("comment-datetime"+j)).not.toBeNull()
//     expect(page.queryByTestId("comment-edit-delete-options"+j)).toBeNull();
//     expect(page.queryByTestId("comment-text"+j)).toHaveTextContent(comments[i].text);
//     expect(page.queryByTestId("comment"+j)).not.toBeNull();
//     }
//     expect(page.queryByTestId("comment-nocomment")).toBeNull();
//     //can't write comments without logging in
//     expect(page.queryByTestId("write-comment")).toBeNull();
});

// test("shop comments section for the owner", async () => {
//     localStorage.setItem('username',"the owner")
//     const comments = [
//     {user:{user_name:"someone_else"}, date_jalali:"1404-04-03 13:03", text:"?8$#230@$&%)@!" , id:1},
//     {user:{user_name:"someone"}, date_jalali:"1400-11-03 13:03", text:"این فروشگاه عالیه!", id:2},
//     {user:{user_name:"another_one"}, date_jalali:"1402-12-29 13:03", text:"i love this shop و فارسی هم بلدم", id:3},
//     {user:{user_name:"another_person"}, date_jalali:"1401-12-29 13:03", text:"i love this shop", id:4},
// ]
//     var page;
//     //2 is for comments
//     fetchMock
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis", comments)
//         .put("http://eunoia-bshop.ir:8000/api/v1/shops/comment/2", {status:200})
//         .post("http://eunoia-bshop.ir:8000/api/v1/shops/comment/create/", {status:201})
//         .delete("http://eunoia-bshop.ir:8000/api/v1/shops/comment/2", {status:204})
//     await act(async () => {
//         page = await render(<ShopComments userState={"m"} shopID={"1"}/>);
//         await new Promise(resolve => setImmediate(resolve));
//     });
//     for (let i in [1, 2, 3, 4]) {
//     let j= parseInt(i)+1;
//     expect(page.queryByTestId("comment-username"+j)).toHaveTextContent(comments[i].user.user_name);
//     expect(page.queryByTestId("comment-datetime"+j)).not.toBeNull()
//     expect(page.queryByTestId("comment-edit-delete-options"+j)).toBeNull();
//     expect(page.queryByTestId("comment-text"+j)).toHaveTextContent(comments[i].text);
//     expect(page.queryByTestId("comment"+j)).not.toBeNull();
//     }
//     expect(page.queryByTestId("comment-nocomment")).toBeNull();
//     //owner should not be able to comment like a normal user
//     expect(page.queryByTestId("write-comment")).toBeNull();
// });

// test("shop comments section for logged in users", async () => {
//     localStorage.setItem('username',"someone")
//     const comments = [
//     {user:{user_name:"someone_else"}, date_jalali:"1404-04-03 13:03", text:"?8$#230@$&%)@!" , id:1},
//     {user:{user_name:"someone"}, date_jalali:"1400-11-03 13:03", text:"این فروشگاه عالیه!", id:2}, //this comment is for the user
//     {user:{user_name:"another_one"}, date_jalali:"1402-12-29 13:03", text:"i love this shop و فارسی هم بلدم", id:3},
//     {user:{user_name:"another_person"}, date_jalali:"1401-12-29 13:03", text:"i love this shop", id:4},
//     {user:{user_name:"someone"}, date_jalali:"1400-11-03 13:03", text:"idk** what# else to type", id:5}, //this comment is for the user
// ]
//     var page;
//     //2 is for comments
//     fetchMock
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis", comments)
//         .put("http://eunoia-bshop.ir:8000/api/v1/shops/comment/2", {status:200})
//         .post("http://eunoia-bshop.ir:8000/api/v1/shops/comment/create/", {status:201})
//         .delete("http://eunoia-bshop.ir:8000/api/v1/shops/comment/2", {status:204})
//     await act(async () => {
//         page = await render(<ShopComments userState={"l"} shopID={"1"}/>);
//         await new Promise(resolve => setImmediate(resolve));
//     });
//     for (let i in [1, 2, 3, 4, 5]) {
//     let j= parseInt(i)+1;
//     expect(page.queryByTestId("comment-username"+j)).toHaveTextContent(comments[i].user.user_name);
//     expect(page.queryByTestId("comment-datetime"+j)).not.toBeNull()
//     if(j==2 || j==5) //should be able to delete or edit their own comments, which is comments with id 2 and 5
//         expect(page.queryByTestId("comment-edit-delete-options"+j)).not.toBeNull();
//     else
//         expect(page.queryByTestId("comment-edit-delete-options"+j)).toBeNull();
//     expect(page.queryByTestId("comment-text"+j)).toHaveTextContent(comments[i].text);
//     expect(page.queryByTestId("comment"+j)).not.toBeNull();
//     }
//     expect(page.queryByTestId("comment-nocomment")).toBeNull();
//     //normal user must be able to comment
//     expect(page.queryByTestId("write-comment")).not.toBeNull();
// });

// test("shop with no comments", async () => {
//     localStorage.setItem('username',"someone")
//     const comments = []
//     var page;
//     //2 is for comments
//     fetchMock
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis", comments)
//         .put("http://eunoia-bshop.ir:8000/api/v1/shops/comment/2", {status:200})
//         .post("http://eunoia-bshop.ir:8000/api/v1/shops/comment/create/", {status:201})
//         .delete("http://eunoia-bshop.ir:8000/api/v1/shops/comment/2", {status:204})
//     await act(async () => {
//         page = await render(<ShopComments userState={"l"} shopID={"1"}/>);
//         await new Promise(resolve => setImmediate(resolve));
//     });
//     expect(page.queryByTestId("comment-nocomment")).not.toBeNull();
// });

// test("edit comment", async () => {
//     localStorage.setItem('username',"someone")
//     let comments = [
//     {user:{user_name:"someone_else"}, date_jalali:"1404-04-03 13:03", text:"?8$#230@$&%)@!" , id:1},
//     {user:{user_name:"someone"}, date_jalali:"1400-11-03 13:03", text:"این فروشگاه عالیه!", id:2}, //this comment is for the user
//     {user:{user_name:"another_one"}, date_jalali:"1402-12-29 13:03", text:"i love this shop و فارسی هم بلدم", id:3},
//     {user:{user_name:"another_person"}, date_jalali:"1401-12-29 13:03", text:"i love this shop", id:4},
//     {user:{user_name:"someone"}, date_jalali:"1400-11-03 13:03", text:"idk** what# else to type", id:5}, //this comment is for the user
// ]
//     var page;
//     //2 is for comments
//     fetchMock
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis", comments)
//         .put("http://eunoia-bshop.ir:8000/api/v1/shops/comment/2", (url,options)=>{
//             let c = [...comments]
//             c[1].text = options.body.get('text');
//             comments = [...c]
//             return 200;
//         })
//         .post("http://eunoia-bshop.ir:8000/api/v1/shops/comment/create/", (url,options)=>{
//             comments.push({user:{user_name:"someone"}, date_jalali:"1400-03-20 13:03", text: options.body.get('text')})
//             return 201;
//         })
//         .delete("http://eunoia-bshop.ir:8000/api/v1/shops/comment/*", {status:204})
//     await act(async () => {
//         page = await render(<ShopComments userState={"l"} shopID={"1"}/>);
//         await new Promise(resolve => setImmediate(resolve));
//     });
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent("");
//     expect(page.queryByTestId("comment-edit-delete-options2")).not.toBeNull();
//     expect(page.queryByTestId("comment-edit-delete-options5")).not.toBeNull();
//     expect(page.queryByTestId("stop-editing-btn")).toBeNull();
//     await act(async () => {
//     //wants to edit their comment with id 2
//     await page.queryByTestId("comment-edit-options2").click();
//     //editing starts
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent(comments[1].text);
//     expect(page.queryByTestId("stop-editing-btn")).not.toBeNull();
//     //suddenly wants to edit their comment with id 5
//     await page.queryByTestId("comment-edit-options5").click();
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent(comments[4].text);
//     expect(page.queryByTestId("stop-editing-btn")).not.toBeNull();
//     //starts editting comment's text
//     await fireEvent.change(page.queryByTestId("write-comment-input"), { target: { value: '039489203849' } });
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent('039489203849');
//     //hasn't clicked the send button, decides that they better go back to comment with id 2, so this comment remains unchanged
//     await page.queryByTestId("comment-edit-options2").click();
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent(comments[1].text);
//     expect(page.queryByTestId("stop-editing-btn")).not.toBeNull();
//     expect(page.queryByTestId("comment-text5")).toHaveTextContent(comments[4].text);
//     //edits the comment, but cancels editing
//     await fireEvent.change(page.queryByTestId("write-comment-input"), { target: { value: '039489203849' } });
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent('039489203849');
//     await page.queryByTestId("stop-editing-btn").click(); 
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent('');
//     expect(page.queryByTestId("comment-text2")).toHaveTextContent(comments[1].text);
//     //edits and submits
//     await page.queryByTestId("comment-edit-options2").click();
//     await fireEvent.change(page.queryByTestId("write-comment-input"), { target: { value: '039489203849' } });
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent('039489203849');
//     await page.queryByTestId("send-comment-button").click();
//     await new Promise(resolve => setImmediate(resolve));
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent('');
//     expect(page.queryByTestId("comment-text2")).toHaveTextContent('039489203849');
//     });
// });

// test("create new comment", async () => {
//     localStorage.setItem('username',"someone")
//     let comments = [
//     {user:{user_name:"someone_else"}, date_jalali:"1404-04-03 13:03", text:"?8$#230@$&%)@!" , id:1},
//     {user:{user_name:"someone"}, date_jalali:"1400-11-03 13:03", text:"این فروشگاه عالیه!", id:2}, //this comment is for the user
//     {user:{user_name:"another_one"}, date_jalali:"1402-12-29 13:03", text:"i love this shop و فارسی هم بلدم", id:3},
//     {user:{user_name:"another_person"}, date_jalali:"1401-12-29 13:03", text:"i love this shop", id:4}
// ]
//     let last_id = 4;
//     var page;
//     //2 is for comments
//     fetchMock
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis", comments)
//         .put("http://eunoia-bshop.ir:8000/api/v1/shops/comment/2", (url,options)=>{
//             let c = [...comments]
//             c[1].text = options.body.get('text');
//             comments = [...c]
//             return 200;
//         })
//         .post("http://eunoia-bshop.ir:8000/api/v1/shops/comment/create/", (url,options)=>{
//             last_id += 1;
//             comments.push({user:{user_name:"someone"}, date_jalali:"1400-03-20 13:03", text: options.body.get('text'), id:last_id})
//             return 201;
//         })
//         .delete("http://eunoia-bshop.ir:8000/api/v1/shops/comment/*", {status:204})
//     await act(async () => {
//         page = await render(<ShopComments userState={"l"} shopID={"1"}/>);
//         await new Promise(resolve => setImmediate(resolve));
//     });
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent("");
//     await act(async () => {
//     //submits a comment
//     await fireEvent.change(page.queryByTestId("write-comment-input"), { target: { value: 'من یک کامنت جدیدم!' } });
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent('من یک کامنت جدیدم!');
//     await page.queryByTestId("send-comment-button").click();
//     await new Promise(resolve => setImmediate(resolve));
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent('');
//     expect(page.queryByTestId("comment-text5")).toHaveTextContent('من یک کامنت جدیدم!');

//     //submits another comment
//     await fireEvent.change(page.queryByTestId("write-comment-input"), { target: { value: 'sth newww9824028#@$%^*&^@' } });
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent('sth newww9824028#@$%^*&^@');
//     await page.queryByTestId("send-comment-button").click();
//     await new Promise(resolve => setImmediate(resolve));
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent('');
//     expect(page.queryByTestId("comment-text6")).toHaveTextContent('sth newww9824028#@$%^*&^@');

//     //an empty comment won't get submitted
//     await fireEvent.change(page.queryByTestId("write-comment-input"), { target: { value: '' } });
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent('');
//     await page.queryByTestId("send-comment-button").click();
//     await new Promise(resolve => setImmediate(resolve));
//     expect(page.queryByTestId("write-comment-input")).toHaveTextContent('');
//     //no new comment
//     expect(page.queryByTestId("comment-text7")).toBeNull();
//     });
// });

