import React, { useState, useEffect } from "react";
import './Item.css'
import ShopSideBar from './ShopSideBar';
function Item(props) {
    // console.log("Token "+localStorage.getItem("token"))
    const [items, setItems] = useState({});
    var shopID = window.location.pathname.match(/[^\/]+/g)[1]
    var itemID = window.location.pathname.match(/[^\/]+/g)[3]
    // let itemId = window.location.pathname.match.items(/[^\/]+/g)[3]
    // let shopID = window.location.pathname.match(/[^\/]+/g)[1]
    useEffect(() => {
        fetch("https://iust-bshop.herokuapp.com/shops/"+shopID+"/items/"+itemID, {
            method: 'GET',
            // headers: {
            //     "Authorization": "Token " + localStorage.getItem('token')
            // }
        }).then((res) => {
            if (res.status === 200) {
                return res.json();
            }
        }).then(res => {
            setItems(res);
        })
    }, [])
    useEffect(() => {

    }, [])
  
    console.log(items);
    return (
        <div style={{padding: "5vh 2vw" }}>
            <ShopSideBar />
            <div className="page-contents">
        <div className="item-page" >
            
            <div className="sub-container">
                
                <img src={items.photo} class="w3-hover-sepia" alt=""></img>
                
                
                <div className="description" data-testid="item" style={{ width: "50%", direction: "rtl", zIndex: "1", margin: "0" }}>
                    <div className="column">
                    <h1 data-testid="item-name" class="item-title">{items.name}</h1>
                       {!!items.description &&<><h3 data-testid="item-description">ویژگی های کالا : </h3>
                        <div>{items.description}</div></>}
                        {!!items.manufacture_jalali &&<><div className="manufacture_jalali" data-testid="item-manufacture_jalali">تاریخ تولید : {items.manufacture_jalali}</div></>}
                        {!!items.Expiration_jalali&&<><div className="Expiration_jalali"  data-testid="item-Expiration_jalali" >تاریخ انقضا : {items.Expiration_jalali}</div></>}
                        {!!items.count&&<><div data-testid="item-count"> موجودی : {items.count}</div></>}
                        {!!items.phone&&<><div data-testid="item-phone">شماره فروشگاه : {items.ItemShop?.phone}</div></>}
                        {props.userState !== "m" && <a href="#" className="btn btn-primary" >خرید</a>}
                    </div>
                </div>
            </div>
        </div>
        </div>
        </div>

    )
}
export default Item;

{/* {items.ItemShop && items.ItemShop.phone} */ }