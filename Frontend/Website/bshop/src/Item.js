// import React, { useState, useEffect } from "react";
// import './Item.css'
// import ShopSideBar from './ShopSideBar';
// function Item(props) {
//     // console.log("Token "+localStorage.getItem("token"))
//     const [items, setItems] = useState({});
//     var shopID = window.location.pathname.match(/[^\/]+/g)[1]
//     var itemID = window.location.pathname.match(/[^\/]+/g)[3]
//     // let itemId = window.location.pathname.match.items(/[^\/]+/g)[3]
//     // let shopID = window.location.pathname.match(/[^\/]+/g)[1]
//     useEffect(() => {
//         fetch("http://eunoia-bshop.ir:8000/shops/"+shopID+"/items/"+itemID, {
//             method: 'GET',
//             // headers: {
//             //     "Authorization": "Token " + localStorage.getItem('token')
//             // }
//         }).then((res) => {
//             if (res.status === 200) {
//                 return res.json();
//             }
//         }).then(res => {
//             setItems(res);
//         })
//     }, [])
//     useEffect(() => {

//     }, [])
  
//     console.log(items);
//     return (
//         <div style={{padding: "5vh 2vw" }}>
//             <ShopSideBar />
//             <div className="page-contents">
//         <div className="item-page" >
            
//             <div className="sub-container">
                
//                 <img src={items.photo} class="w3-hover-sepia" alt=""></img>
//                 {!!items.manufacture_jalali &&<><div className="manufacture_jalali" data-testid="item-manufacture_jalali">تاریخ تولید : {items.manufacture_jalali}</div></>}
//                         {!!items.Expiration_jalali&&<><div className="Expiration_jalali"  data-testid="item-Expiration_jalali" >تاریخ انقضا : {items.Expiration_jalali}</div></>}
                
//                 <div className="description" data-testid="item" style={{ width: "50%", direction: "rtl", zIndex: "1", margin: "0" }}>
//                  <div className="column">
                
//                     <h1 data-testid="item-name" class="item-title">{items.name}</h1>
//                     {!!items.description &&<><h3 data-testid="item-description">ویژگی های کالا : </h3>
//                         <div>{items.description}</div></>}
                        
//                         {!!items.count&&<><div data-testid="item-count"> موجودی : {items.count}</div></>}
//                         {!!items.phone&&<><div data-testid="item-phone">شماره فروشگاه : {items.ItemShop?.phone}</div></>}
//                         {props.userState !== "m" && <a href="#" className="btn btn-primary" >خرید</a>}
//                     </div>
//                 </div>
//             </div>
//         </div>
//         </div>
//         </div>

//     )
// }
// export default Item;

// {/* {items.ItemShop && items.ItemShop.phone} */ }

import React, { useState, useEffect } from "react";
import "./Item.css";
import ShopSideBar from "./ShopSideBar";
function Item(props) {
  // console.log("Token "+localStorage.getItem("token"))
  const [items, setItems] = useState({});
  var shopID = window.location.pathname.match(/[^\/]+/g)[1];
  var itemID = window.location.pathname.match(/[^\/]+/g)[3];
  // let itemId = window.location.pathname.match.items(/[^\/]+/g)[3]
  // let shopID = window.location.pathname.match(/[^\/]+/g)[1]
  useEffect(() => {
    fetch("http://eunoia-bshop.ir:8000/shops/" + shopID + "/items/" + itemID, {
      method: "GET",
      // headers: {
      //     "Authorization": "Token " + localStorage.getItem('token')
      // }
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((res) => {
        setItems(res);
      });
  }, []);
  useEffect(() => {}, []);

  console.log(items);
  return (
    <div style={{ padding: "5vh 2vw" }}>
      <ShopSideBar />
      <div className="page-contents">
        <div className="item-page">
          <div className="sub-container">
            <div className="col-12 d-flex flex-wrap">
              <div className="col-sm-12 col-md-5">
                <img style={{ width: "110%" }} src={items.photo} alt="" />
              </div>
              <div className="lead text-right col-sm-12 col-md-6">
                <h1 className="my-3">{items.name}</h1>
                <hr></hr>
                {!!items.description && (
                  <>
                    <h3 className="text-right mb-3">ویژگی های کالا:</h3>
                    <p className="lead text-right">{items.description}</p>
                  </>
                )}
                {!!items.count && (
                  <div className="col-12 d-flex flex-justify-between p-0 my-2">
                    <div className="col-6 p-0 text-right">موجودی:</div>
                    <div className="col-6 p-0 ">{items.count}</div>
                  </div>
                )}
                {!!items.price && (
                  <div className="col-12 d-flex flex-justify-between p-0 my-2">
                    <div className="col-6 p-0 text-right">قیمت:</div>
                    <div className="col-6 p-0 ">{items.price} ریال</div>
                  </div>
                )}
                {!!items.manufacture_jalali && (
                  <div className="col-12 d-flex flex-justify-between p-0 my-2">
                    <div className="col-6 p-0 text-right">تاریخ تولید:</div>
                    <div className="col-6 p-0 ">{items.manufacture_jalali}</div>
                  </div>
                )}
                 {!!items.Expiration_jalali && (
                  <div className="col-12 d-flex flex-justify-between p-0 my-2">
                    <div className="col-6 p-0 text-right">تاریخ انقضا:</div>
                    <div className="col-6 p-0 ">{items.Expiration_jalali}</div>
                  </div>
                )}

              {props.userState !== "m" && <a href="#" className="btn btn-lg btn-primary my-3" >افزودن به سبد خرید</a>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Item;

{
  /* {items.ItemShop && items.ItemShop.phone} */
}