import React, { useState, useEffect } from "react";
import './Item.css'
function Item(props) {
    // console.log("Token "+localStorage.getItem("token"))
    const [items, setItems] = useState({});
    var shopID = window.location.pathname.match(/[^\/]+/g)[1]
    var itemID = window.location.pathname.match(/[^\/]+/g)[3]
    // let itemId = window.location.pathname.match.items(/[^\/]+/g)[3]
    // let shopID = window.location.pathname.match(/[^\/]+/g)[1]
    useEffect(() => {
        fetch("http://127.0.0.1:8000/shops/"+shopID+"/items/"+itemID, {
            method: 'GET',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
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
    // fetch("http://127.0.0.1:8000/shops/"+shopID+"/items/"+itemId, {
    //     method: 'GET',
    //     headers: {
    //         "Authorization": "Token " + localStorage.getItem('token')
    //     }
    // }).then((res) => {
    //         if (res.status === 200) {
    //             return res.json()
    //         }
    //         return [];
    //     } )        
    //     console.log("Hello");
    console.log(items);
    return (

        <div className="item-page" >


            
            <div className="sub-container">
                
                <img src={items.photo} class="w3-hover-sepia" alt=""></img>
                
                
                <div className="description" data-testid="item" style={{ width: "50%", direction: "rtl", zIndex: "1", margin: "0" }}>
                    <div className="column">
                    <h1 class="item-title">{items.name}</h1>
                        <h3>ویژگی های کالا : </h3>
                        <div>{items.description}</div>
                        <div>تاریخ تولید : {items.manufacture_Date}</div>
                        <div>تاریخ انقضا : {items.Expiration_Date}</div>
                        <div> موجودی : {items.count}</div>
                        <div>شماره فروشگاه : {items.ItemShop?.phone}</div>
                        <a href="#" className="btn btn-primary" >خرید</a>
                    </div>
                </div>
            </div>
        </div>


    )
}
export default Item;

{/* {items.ItemShop && items.ItemShop.phone} */ }