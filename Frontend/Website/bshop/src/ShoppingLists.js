import { useEffect, useState } from "react";
import './ShoppingList.css';

function ShoppingLists(props) {
    const [lists, setLists] = useState([]);
    const [buys,setBuys] = useState([]);
    useEffect(() => {
        fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/user/shoppinglists/" /*+ (props.type === "history" ? "buys/" : "shoppinglists/")*/, {
            method: "GET",
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.ok)
                return res.json();
        }).then(res => {
            res.forEach(r => {
                if (!!r && !!r.shopping_list_items) {
                    let templist = [...r.shopping_list_items];
                    templist.forEach(e => {
                        if (!e.item.photo)
                        e.item.photo = "/no-image-icon-0.jpg";
                    })
                    r.shopping_list_items = [...templist]
                }
            })
            console.log(res)
            setLists(res.filter(x=>!!x.sum_price || x.max_price || (!!x.shopping_list_items && x.shopping_list_items.length>0)));
        }).catch(err => console.error(err))

        fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/user/buys/", {
            method: "GET",
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.ok)
                return res.json();
        }).then(res => {
            res.forEach(r => {
                if (!!r && !!r.shopping_list_items) {
                    let templist = [...r.shopping_list_items];
                    templist.forEach(e => {
                        if (!e.item.photo)
                        e.item.photo = "/no-image-icon-0.jpg";
                    })
                    r.shopping_list_items = [...templist]
                }
            })
            console.log(res)
            setBuys(res.filter(x=>!!x.sum_price || x.max_price || (!!x.shopping_list_items && x.shopping_list_items.length>0)));
        }).catch(err => console.error(err))
    }, [])

    return <div className="shoppinglists">
        <h2>لیست خریدهای فعلی</h2>
        <div className="row">
            {!lists || lists.length === 0 ?
                <div className="no-shoppings">لیستی وجود ندارد</div>
                :
                    lists.map(l =>
                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="list-holder" onClick={()=>window.location.href="/store/"+l.shop.id+"/shopping-list"}>
                                <div className="list-upper">
                                    <h3>فروشگاه {l.shop.title}</h3>
                                    <p className="price">{l.sum_price} ریال</p>
                                    <p style={{textAlign:"left"}}>{l.max_cost? "محدودیت قیمت: "+l.max_cost: "محدودیت قیمت ندارد."}</p>
                                </div>
                                <div className="list-lower">
                                    {
                                        !l.shopping_list_items || l.shopping_list_items.length===0?
                                        <p>.کالایی وجود ندارد</p>
                                        :
                                        l.shopping_list_items.map(el=>
                                        <img className="item-img" alt={el.item.name} src={el.item.photo} />
                                        )
}
                                </div>
                            </div>
                        </div>
                    )
            }
        </div>

        <h2>سابقه سفارش‌ها</h2>
        <div className="row">
            {!buys || buys.length === 0 ?
                <div className="no-shoppings">لیستی وجود ندارد</div>
                :
                    buys.map(l =>
                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="list-holder" onClick={()=>window.location.href="/store/"+l.shop.id+"/shopping-history/"+l.id}>
                                <div className="list-upper">
                                    <h3>فروشگاه {l.shop.title}</h3>
                                    <p className="price">{l.sum_price} ریال</p>
                                    <p style={{textAlign:"left"}}>{l.max_cost? "محدودیت قیمت: "+l.max_cost: "محدودیت قیمت ندارد."}</p>
                                </div>
                                <div className="list-lower">
                                    {
                                        !l.shopping_list_items || l.shopping_list_items.length===0?
                                        <p>.کالایی وجود ندارد</p>
                                        :
                                        l.shopping_list_items.map(el=>
                                        <img className="item-img" alt={el.item.name} src={el.item.photo} />
                                        )
}
                                </div>
                            </div>
                        </div>
                    )
            }
        </div>
    </div>
}

export default ShoppingLists;