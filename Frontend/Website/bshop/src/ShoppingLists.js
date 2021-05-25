import { useEffect, useState } from "react";
import './ShoppingList.css';

function ShoppingLists(props) {
    const [lists, setLists] = useState([]);
    useEffect(() => {
        fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/user/" + (props.type === "history" ? "buys/" : "shoppinglists/"), {
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
                        let totalPrice;
                        if (e.item?.discount && parseInt(e.item.discount) > 0) {
                            totalPrice = parseInt(Math.round((100 - e.item.discount) * e.item.price / 100))
                        }
                        else {
                            totalPrice = e.item.price
                        }
                        e.totalPrice = totalPrice * e.number;
                        e.rawTotalPrice = e.item.price * e.number;
                    })
                    r.shopping_list_items = [...templist]
                }
                r.totalPrice = r.shopping_list_items.map(e => e.totalPrice).reduce((a, b) => a + b, 0)
                r.rawTotalPrice = r.shopping_list_items.map(e => e.rawTotalPrice).reduce((a, b) => a + b, 0)
            })
            console.log(res)
            setLists(res);
        }).catch(err => console.error(err))
    }, [])
    return <div className="shoppinglists">
        <div className="row">
            {!lists || lists.length === 0 ?
                <div>لیستی وجود ندارد</div>
                :
                    lists.map(l =>
                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="list-holder" onClick={()=>window.location.href="/store/"+l.shop+"/shopping-list"}>
                                <div className="list-upper">
                                    <h3>فروشگاه شهروند</h3>
                                    
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