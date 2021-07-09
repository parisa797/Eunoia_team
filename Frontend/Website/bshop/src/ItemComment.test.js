import { unmountComponentAtNode } from "react-dom";
import { render, fireEvent, getElementError, getByTestId } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Itemcomment from './Itemcomment';
import '@testing-library/jest-dom';
import { Replay } from "@material-ui/icons";
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

test("Item comments section for unsigned users", async () => {
//     const comments = [
//     {user:{user_name:"Seti123"}, date_jalali:"1404-04-03 13:03", text:"?8$#230@$&%)@!" , id:1, AllPeopleLiked:[{Liked_By:[]}] },
//     {user:{user_name:"setin"}, date_jalali:"1400-11-03 13:03", text:"این فروشگاه خیلییییی عالیه!", id:2, AllPeopleLiked:[{Liked_By:[]}] },
//     {user:{user_name:"Seti1"}, date_jalali:"1402-12-29 13:03", text:"i love this Item فارسی هم بلدم", id:3, AllPeopleLiked:[{Liked_By:[]}] },
//     {user:{user_name:"Seti12"}, date_jalali:"1401-12-29 13:03", text:"i love this Item", id:4, AllPeopleLiked:[{Liked_By:[]}] },
// ]
//     var page;
//     //2 is for comments
//     fetchMock
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis", comments)
//         .post("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/$1/replies",reply)
//         .put("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/1", {status:200})
//         .post("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/", {status:201})
//         .delete("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/1", {status:204})
//     await act(async () => {
//         page = await render(<Itemcomment userState={"u"} ItemID={"1"}/>);
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

// test("Item comments section for the owner", async () => {
//     localStorage.setItem('username',"the owner")
//     const comments = [
//     {user:{user_name:"someone_else"}, date_jalali:"1404-04-03 13:03", text:"?8$#230@$&%)@!" , id:1, AllPeopleLiked:[{Liked_By:[]}] },
//     {user:{user_name:"someone"}, date_jalali:"1400-11-03 13:03", text:"این فروشگاه عالیه!", id:2, AllPeopleLiked:[{Liked_By:[]}] },
//     {user:{user_name:"another_one"}, date_jalali:"1402-12-29 13:03", text:"i love this shop و فارسی هم بلدم", id:3, AllPeopleLiked:[{Liked_By:[]}] },
//     {user:{user_name:"another_person"}, date_jalali:"1401-12-29 13:03", text:"i love this shop", id:4, AllPeopleLiked:[{Liked_By:[]}] },
// ]
//     var page;
//     //2 is for comments
//     fetchMock
//     .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis", comments)
//     .post("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/$1/replies",Replay)
//     .put("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/1", {status:200})
//     .post("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/", {status:201})
//     .delete("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/1", {status:204})
//     await act(async () => {
//         page = await render(<Itemcomment userState={"m"} ItemID={"1"}/>);
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

// test("item with no comments", async () => {
//     localStorage.setItem('username',"someone")
//     const comments = []
//     var page;
//     //2 is for comments
//     fetchMock
//     .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis", comments)
//     .post("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/$1/replies",reply)
//     .put("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/1", {status:200})
//     .post("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/", {status:201})
//     .delete("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/1", {status:204})
//     await act(async () => {
//         page = await render(<Itemcomment userState={"l"} ItemID={"1"}/>);
//         await new Promise(resolve => setImmediate(resolve));
//     });
//     expect(page.queryByTestId("comment-nocomment")).not.toBeNull();
// });

// test("edit comment", async () => {
//     localStorage.setItem('username',"someone")
//     let comments = [
//     {user:{user_name:"someone_else"}, date_jalali:"1404-04-03 13:03", text:"?8$#230@$&%)@!" , id:1, AllPeopleLiked:[{Liked_By:[]}] },
//     {user:{user_name:"someone"}, date_jalali:"1400-11-03 13:03", text:"این فروشگاه عالیه!", id:2, AllPeopleLiked:[{Liked_By:[]}] }, //this comment is for the user
//     {user:{user_name:"another_one"}, date_jalali:"1402-12-29 13:03", text:"i love this shop و فارسی هم بلدم", id:3, AllPeopleLiked:[{Liked_By:[]}] },
//     {user:{user_name:"another_person"}, date_jalali:"1401-12-29 13:03", text:"i love this shop", id:4, AllPeopleLiked:[{Liked_By:[]}] },
//     {user:{user_name:"someone"}, date_jalali:"1400-11-03 13:03", text:"idk** what# else to type", id:5, AllPeopleLiked:[{Liked_By:[]}] }, //this comment is for the user
// ]
//     var page;
//     //2 is for comments
//     fetchMock
//     .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis", comments)
   
//     .put("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/1",(url,options)=>{
//             let c = [...comments]
//             c[1].text = options.body.get('text');
//             comments = [...c]
//             return 200;
//         })

        
//         .post("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/", (url,options)=>{
//             comments.push({user:{user_name:"someone"}, date_jalali:"1400-03-20 13:03", text: options.body.get('text')})
//             return 201;
//         })
//         .delete("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/1/*", {status:204})
//     await act(async () => {
//         page = await render(<Itemcomment userState={"l"} ItemID={"1"}/>);
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
//     {user:{user_name:"someone_else"}, date_jalali:"1404-04-03 13:03", text:"?8$#230@$&%)@!" , id:1, AllPeopleLiked:[{Liked_By:[]}] },
//     {user:{user_name:"someone"}, date_jalali:"1400-11-03 13:03", text:"این فروشگاه عالیه!", id:2, AllPeopleLiked:[{Liked_By:[]}] }, //this comment is for the user
//     {user:{user_name:"another_one"}, date_jalali:"1402-12-29 13:03", text:"i love this shop و فارسی هم بلدم", id:3, AllPeopleLiked:[{Liked_By:[]}] },
//     {user:{user_name:"another_person"}, date_jalali:"1401-12-29 13:03", text:"i love this shop", id:4, AllPeopleLiked:[{Liked_By:[]}] }
// ]
//     let last_id = 4;
//     var page;
//     //2 is for comments
//     fetchMock

//     .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis", comments)

//     .put("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/1", (url,options)=>{
//             let c = [...comments]
//             c[1].text = options.body.get('text');
//             comments = [...c]
//             return 200;
//         })


        
//         .post("http://eunoia-bshop.ir:8000/api/v1/shops/comment/create/", (url,options)=>{
//             last_id += 1;
//             comments.push({user:{user_name:"someone"}, date_jalali:"1400-03-20 13:03", text: options.body.get('text'), id:last_id, AllPeopleLiked:[{Liked_By:[]}]})
//             return 201;
//         })
//         .delete("http://eunoia-bshop.ir:8000/shops/1/items/1/comments/1/*", {status:204})
//     await act(async () => {
//         page = await render(<Itemcomment userState={"l"} ItemID={"1"}/>);
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

// test("showing replies of comments", async () => {
//     localStorage.setItem('username',"manager")
//     let comments = [
//     {user:{user_name:"someone_else"}, date_jalali:"1404-04-03 13:03", text:"?8$#230@$&%)@!" , id:1, AllPeopleLiked:[{Liked_By:[]}] , Replies: [
//         {user:{user_name:"manager"}, date_jalali:"1404-11-03 13:03", text:"تشکر!", id:1, AllPeopleLiked:[{Liked_By:[]}] },
//         {user:{user_name:"manager"}, date_jalali:"1404-06-03 14:04", text:"i know english &#@$*@ سبننسبمت!", id:2, AllPeopleLiked:[{Liked_By:[]}] }
//     ]},
//     {user:{user_name:"someone"}, date_jalali:"1400-11-03 13:03", text:"این فروشگاه عالیه!", id:2, AllPeopleLiked:[{Liked_By:[]}] },
//     {user:{user_name:"another_one"}, date_jalali:"1402-12-29 13:03", text:"i love this shop و فارسی هم بلدم", id:3, AllPeopleLiked:[{Liked_By:[]}] },
//     {user:{user_name:"another_person"}, date_jalali:"1401-12-29 13:03", text:"i love this shop", id:4, AllPeopleLiked:[{Liked_By:[]}], Replies: [
//         {user:{user_name:"manager"}, date_jalali:"1404-11-03 13:03", text:"2943892834adj!", id:1, AllPeopleLiked:[{Liked_By:[]}] }
//     ]}
// ]
//     var page;
//     //2 is for comments
//     fetchMock
//     .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis", comments)
//     await act(async () => {
//         page = await render(<Itemcomment userState={"m"} ItemID={"1"}/>);
//         await new Promise(resolve => setImmediate(resolve));
//     });
//     await act(async () => {
//     comments.forEach(comment=>comment?.Replies?.forEach(reply=>{
//         // expect(page.queryByTestId(`comment-reply-text${comment.id}-${reply.id}`)).toHaveTextContent(reply.text);
//         expect(page.queryByTestId(`comment-reply-username${comment.id}-${reply.id}`)).toHaveTextContent(reply.user.user_name);
//         expect(page.queryByTestId(`comment-reply-datetime${comment.id}-${reply.id}`)).not.toBeNull()
//     }))
//     });
// });

// test("replying to comments", async () => {
//     localStorage.setItem('username',"manager")
//     let comments = [
//     {user:{user_name:"someone_else"}, date_jalali:"1404-04-03 13:03", text:"?8$#230@$&%)@!" , id:1, AllPeopleLiked:[{Liked_By:[]}] , Replies: [
//         {user:{user_name:"manager"}, date_jalali:"1404-11-03 13:03", text:"تشکر!", id:1, AllPeopleLiked:[{Liked_By:[]}] },
//         {user:{user_name:"manager"}, date_jalali:"1404-06-03 14:04", text:"i know english &#@$*@ سبننسبمت!", id:2, AllPeopleLiked:[{Liked_By:[]}] }
//     ]},
//     {user:{user_name:"someone"}, date_jalali:"1400-11-03 13:03", text:"این فروشگاه عالیه!", id:2, AllPeopleLiked:[{Liked_By:[]}] },
//     {user:{user_name:"another_one"}, date_jalali:"1402-12-29 13:03", text:"i love this shop و فارسی هم بلدم", id:3, AllPeopleLiked:[{Liked_By:[]}] },
//     {user:{user_name:"another_person"}, date_jalali:"1401-12-29 13:03", text:"i love this shop", id:4, AllPeopleLiked:[{Liked_By:[]}], Replies: [
//         {user:{user_name:"manager"}, date_jalali:"1404-11-03 13:03", text:"2943892834adj!", id:1, AllPeopleLiked:[{Liked_By:[]}] }
//     ]}
// ]
//     let last_reply_id_for_commentid_1 = 2;
//     var page;
//     //2 is for comments
//     fetchMock
//         .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis", comments)
//         .post(`http://eunoia-bshop.ir:8000/shops/1/items/1/comments/`, (url,options)=>{
//             last_reply_id_for_commentid_1 += 1;
//             comments[0].Replies.push({user:{user_name:"manager"}, date_jalali:"1400-03-20 13:03", text: options.body.get('text'), id:last_reply_id_for_commentid_1, AllPeopleLiked:[{Liked_By:[]}]})
//             return 201;
//         })
//     await act(async () => {
//         page = await render(<Itemcomment userState={"m"} ItemID={"1"}/>);
//         await new Promise(resolve => setImmediate(resolve));
//     });
//     await act(async () => {
//     //replies to comment with id 1
//     await page.getByTestId("comment-reply-to1").click();
//     expect(page.getByTestId("write-reply-comment")).not.toBeNull();
//     await fireEvent.change(page.queryByTestId("write-comment-reply-input"), { target: { value: 'sth newww9824028#@$%^*&^@' } });
//     expect(page.queryByTestId("write-comment-reply-input")).toHaveTextContent('sth newww9824028#@$%^*&^@');
//     await page.queryByTestId("send-comment-reply-button").click();
//     await new Promise(resolve => setImmediate(resolve));
//     expect(page.queryByTestId("write-reply-comment")).toBeNull();
//     // expect(page.queryByTestId("comment-reply-text1")).toHaveTextContent('sth newww9824028#@$%^*&^@');

//     //another reply to comment with id 1
//     await page.getByTestId("comment-reply-to1").click();
//     expect(page.getByTestId("write-reply-comment")).not.toBeNull();
//     await fireEvent.change(page.queryByTestId("write-comment-reply-input"), { target: { value: 'سنتبسمنتبیمت8249873%@#$ 3' } });
//     expect(page.queryByTestId("write-comment-reply-input")).toHaveTextContent('سنتبسمنتبیمت8249873%@#$ 3');
//     await page.queryByTestId("send-comment-reply-button").click();
//     await new Promise(resolve => setImmediate(resolve));
//     expect(page.queryByTestId("write-reply-comment")).toBeNull();
//     // expect(page.queryByTestId("comment-reply-text1-4")).toHaveTextContent('سنتبسمنتبیمت8249873%@#$ 3');

//     });
// });

// test("comment and replies likes", async () => {
//     localStorage.setItem('username',"manager")
//     let comments = [
//     {user:{user_name:"someone_else"}, date_jalali:"1404-04-03 13:03", text:"?8$#230@$&%)@!" , id:1, AllPeopleLiked:[
//         {
//           "likes_count": 3,
//           "Liked_By": [
//             {
//               "username": "manager",
//               "email": "sdfjsldf@gmail.com"
//             },
//             {
//                 "username": "sdkfjlsjf",
//                 "email": "ksdflsjf@gmail.com"
//             },
//             {
//                 "username": "iiwiqeii",
//                 "email": "oqwoeie@gmail.com"
//             },
//           ]
//         }
//       ] , Replies: [
//         {user:{user_name:"manager"}, date_jalali:"1404-11-03 13:03", text:"تشکر!", id:1, AllPeopleLiked:[{
//             "likes_count": 2,
//             "Liked_By": [
//               {
//                 "username": "manager",
//                 "email": "sdfjsldf@gmail.com"
//               },
//               {
//                   "username": "sdkfjlsjf",
//                   "email": "ksdflsjf@gmail.com"
//               }
//             ]
//           }] },
//         {user:{user_name:"manager"}, date_jalali:"1404-06-03 14:04", text:"i know english &#@$*@ سبننسبمت!", id:2, AllPeopleLiked:[{
//             "likes_count": 1,
//             "Liked_By": [
//               {
//                   "username": "iiwiqeii",
//                   "email": "oqwoeie@gmail.com"
//               },
//             ]
//           }] }
//     ]},
//     {user:{user_name:"someone"}, date_jalali:"1400-11-03 13:03", text:"این فروشگاه عالیه!", id:2, AllPeopleLiked:[{Liked_By:[], likes_count:0}] }
// ]
//     var page;
//     //2 is for comments
//     fetchMock
//     .get("http://eunoia-bshop.ir:8000/api/v1/shops/1/commentsreplis", comments)
//     await act(async () => {
//         page = await render(<Itemcomment userState={"m"} ItemID={"1"}/>);
//         await new Promise(resolve => setImmediate(resolve));
//     });
//     await act(async () => {
//     comments.forEach(comment=>{
//         expect(page.queryByTestId(`comment-like-count${comment.id}`)).toHaveTextContent(comment.AllPeopleLiked[0].likes_count)
//     })

//     //first comment is liked by user
//     expect(page.getByTestId(`comment-liked1`)).not.toBeNull();
//     expect(page.queryByTestId(`comment-not-liked1`)).toBeNull();
//     //second comment is not liked by user
//     expect(page.queryByTestId(`comment-liked2`)).toBeNull();
//     expect(page.queryByTestId(`comment-not-liked2`)).not.toBeNull();

//     });
// });