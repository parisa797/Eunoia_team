
import { useEffect, useState } from 'react';
import './ShoppingList.css'
function ShoppingList(props) {
    const [shoppingList, setShoppingList] = useState([]);
    const shopID = window.location.pathname.match(/[^\/]+/g)[1];
    useEffect(() => {
        setShoppingList(
            {
                price_limit: 0,
                items: [
                    { item: { name: "items", description: "the first item", id: 1, photo: "/no-image-icon-0.jpg" }, count: 3, price: 32000 },
                    { item: { name: "جدیدددد", description: "این کالا جدید است", id: 2, photo: "/no-image-icon-0.jpg" }, count: 4, price: 32000 },
                    { item: { name: "2048203498", description: "2349810 میتبمنس", id: 3, photo: "/no-image-icon-0.jpg" }, count: 3, price: 32000 },
                    { item: { name: "#@$@#^!ینتب", description: "مشخصات 543", id: 4, photo: "/no-image-icon-0.jpg" }, count: 1, price: 32000 },
                    { item: { name: "nothingهیچ چیز", description: "سلام the description is...", id: 5, photo: "/no-image-icon-0.jpg" }, count: 3, price: 32000 }
                ]
            })
    }, [])

    return (
        <div className="one-shopping-list">
            <div className=" row">
            <div className="col-12 col-md-4 order-md-2">
                <div className="right-content">
                    </div>
                </div>
                <div className="col-12 col-md-8 order-md-1 left-content">
                </div>
                
            </div>
        </div>
    )
}

export default ShoppingList;