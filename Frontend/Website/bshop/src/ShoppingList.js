
import { useEffect, useState } from 'react';
import './ShoppingList.css'
function ShoppingList(props) {
    const [shoppingList, setShoppingList] = useState({});
    const shopID = window.location.pathname.match(/[^\/]+/g)[1];
    const [shopInfo, setShopInfo] = useState({});
    useEffect(() => {
        if (props.userState !== "l")
            window.location.href = "/store/" + shopID;
        // setShoppingList(
        //     {
        //         price_limit: 0,
        //         items: [
        //             { item: { name: "items", description: "the first item", id: 1, photo: "/no-image-icon-0.jpg" }, count: 3, price: 32000 },
        //             { item: { name: "جدیدددد", description: "این کالا جدید است", id: 2, photo: "/no-image-icon-0.jpg" }, count: 4, price: 32000 },
        //             { item: { name: "2048203498", description: "2349810 میتبمنس", id: 3, photo: "/no-image-icon-0.jpg" }, count: 3, price: 32000 },
        //             { item: { name: "#@$@#^!ینتب", description: "مشخصات 543", id: 4, photo: "/no-image-icon-0.jpg" }, count: 1, price: 32000 },
        //             { item: { name: "nothingهیچ چیز", description: "سلام the description is...", id: 5, photo: "/no-image-icon-0.jpg" }, count: 3, price: 32000 }
        //         ]
        //     })
        if (!JSON.parse(localStorage.getItem("shoplists")) || !JSON.parse(localStorage.getItem("shoplists"))[shopID]) {
            setShoppingList(null);
            return;
        }
        // setShoppingList("not made");
        let shopping_id = JSON.parse(localStorage.getItem("shoplists"))[shopID];
        fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/" + shopping_id, {
            method: "GET",
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.ok)
                return res.json();
        }).then(r => {
            console.log(r)
            setShoppingList(r);
        }).catch(err => console.error(err))
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/" + shopID, {
            method: 'GET',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    return res.json()
                }
                return {};
            }
            )
            .then((d) => {
                setShopInfo(d);
            });

    }, [])

    return (
        <div className="one-shopping-list">
            {
                // shoppingList==="not made"?
                // <div className="make-list">
                //     <h1>کالایی در لیست خرید شما وجود ندارد!</h1>
                //     <p>می‌توانید قبل از اضافه کردن کالاها برای خریدتان از این فروشگاه محدودیت قیمت تعیین کنید.</p>
                // </div>
                // :
                <div className=" row">
                    <div className="col-12 col-md-4 order-md-2">
                        <div className="right-content">
                            <h1>فروشگاه {shopInfo.title}</h1>
                            {!!shoppingList?.max_cost ?
                                <p>محدودیت قیمت: {shoppingList.push.max_cost}</p>
                                :
                                <>
                                    <p>محدودیت قیمت ندارید</p>
                                    <button className="">ایجاد</button>
                                </>
                            }
                        </div>
                    </div>
                    <div className="col-12 col-md-8 order-md-1">
                        <div className="left-content">
                            {
                                !shoppingList || !shoppingList.shopping_list_items || shoppingList.shopping_list_items.length === 0 ?
                                    <h1 className="no-items-added">کالایی در لیست خرید شما وجود ندارد</h1>
                                    :
                                    <div className="shopping-items-holder">
                                        {
                                            shoppingList.shopping_list_items.map(el =>
                                                <div className="shopping-item">
                                                    <div className="shopping-img-holder">
                                                        <img alt={el.item.name} src={el.item.photo} />
                                                    </div>
                                                    <div className="shopping-item-info">
                                                        <h4>{el.item.name}</h4>
                                                        <p className="shopping-count">تعداد: {el.number}</p>
                                                        <p className="shopping-price">{el.item.price}</p>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                            }
                        </div>
                    </div>

                </div>
            }
        </div>
    )
}

export default ShoppingList;