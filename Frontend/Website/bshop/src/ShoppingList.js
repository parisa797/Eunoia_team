import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { useEffect, useState } from 'react';
import './ShoppingList.css';
import { useSnackbar } from 'notistack';
function ShoppingList(props) {
    const [shoppingList, setShoppingList] = useState({});
    const shopID = window.location.pathname.match(/[^\/]+/g)[1];
    const [shopInfo, setShopInfo] = useState({});
    const [reload, setReload] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [limitEdit, setLimitEdit] = useState(false);

    useEffect(() => {
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

    useEffect(() => {
        if (props.userState !== "l")
            window.location.href = "/store/" + shopID;
        console.log(JSON.parse(localStorage.getItem("shoplists")))
        if (!props.completed && (!JSON.parse(localStorage.getItem("shoplists")) || !(JSON.parse(localStorage.getItem("shoplists"))[shopID]))) {
            setShoppingList(null);
            return;
        }
        let shopping_id;
        if(props.completed)
            shopping_id = window.location.pathname.match(/[^\/]+/g)[3];
        else
            shopping_id = JSON.parse(localStorage.getItem("shoplists"))[shopID];
            console.log(shopping_id)
        fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/" + shopping_id, {
            method: "GET",
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.ok)
                return res.json();
        }).then(r => {
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
                    if (!e.item.photo)
                        e.item.photo = "/no-image-icon-0.jpg";
                })
                r.shopping_list_items = [...templist]
            }
            r.totalPrice = r.shopping_list_items.map(e => e.totalPrice).reduce((a, b) => a + b, 0)
            r.rawTotalPrice = r.shopping_list_items.map(e => e.rawTotalPrice).reduce((a, b) => a + b, 0)
            if(props.completed){
                console.log(r)
                let str = r.date_delivery.split(" ").join("-").split("-");
                const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]
                str[1] = months[parseInt(str[1]) - 1]
                let intervalsStart = parseInt(str[3].split(":")[0]);
                let intervalsEnd = intervalsStart + 3;
                str[3] = "ساعت " + intervalsStart + " تا " + intervalsEnd;
                str = [str[2],str[1],str[0]+"،",str[3]];
                str = str.join(" ");
                r.date_delivery = str;
            }
            console.log(r)
            setShoppingList(r);
        }).catch(err => console.error(err))

    }, [reload])

    useEffect(()=>{
        if(props.completed){
            
        }
    },[props.completed])

    function hideSubmitCancel(id, val) {
        document.getElementById("count-btns" + id).hidden = val;
    }

    function changeCount(id, true_num, count, op) {
        let input = document.getElementById("item-input" + id);
        if (!parseInt(input.value)) {
            return;
        }
        if (op === "+")
        {
            if(parseInt(count)>parseInt(input.value))
                input.value = parseInt(input.value) + 1;
        }
        else if (op === "-") {
            if (parseInt(input.value) === 1)
                return;
            input.value = parseInt(input.value) - 1;
        }
        hideSubmitCancel(id, true_num === parseInt(input.value))
    }

    function submitCountChange(id, idx, count) {
        let input = document.getElementById("item-input" + id);
        if (!parseInt(input.value) || parseInt(input.value)>parseInt(count)) {
            cancelCountChange(id, idx);
            return;
        }
        let fd = new FormData();
        fd.append("number", parseInt(input.value));
        fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/" + id, {
            method: 'PUT',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            },
            body: fd
        }).then(res => {
            if (res.ok) {
                setReload(!reload);
                hideSubmitCancel(id, true)
            }
        }).catch(err => console.error(err))
    }

    const cancelCountChange = (id, idx) => {
        document.getElementById("item-input" + id).value = shoppingList.shopping_list_items[idx].number;
        hideSubmitCancel(id, true)
    }

    function deleteItem(id, name) {
        fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/" + id, {
            method: 'DELETE',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.ok) {
                setReload(!reload);
                enqueueSnackbar("!" + name + " حذف شد")
            }
        })
    }

    function putPriceLimit(val, id) {
        let fd = new FormData();
        fd.append("max_cost", parseInt(val))
        fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/maxcost/" + id, {
            method: 'PUT',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            },
            body: fd
        }).then(res => {
            if (res.ok) {
                setLimitEdit(false);
                setReload(!reload);
            }
        }).catch(err => console.error(err))
    }

    function setPriceLimit() {
        let val = document.getElementById("price-limit-in").value;
        if (!val || val.match(/^\d+$/) === null) {
            enqueueSnackbar("لطفا محدودیت قیمت را به درستی وارد کنید", { variant: "error" })
            return;
        }
        else if (parseInt(val) < shoppingList?.sum_price) {
            enqueueSnackbar("محدودیت قیمت نباید کمتر از قیمت کل سبد خرید باشد", { variant: "error" })
            return;
        }

        if (shoppingList === null) {
            let fd = new FormData();
            fd.append("shop", shopID)
            fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/create/", {
                method: "POST",
                headers: {
                    "Authorization": "Token " + localStorage.getItem('token')
                },
                body: fd
            }).then(res => {
                if (res.ok)
                    return res.json();
                return {};
            }).then(r => {
                if (!r)
                    return;
                let list = JSON.parse(localStorage.getItem("shoplists"));
                list[r.shop] = r.id;
                localStorage.setItem("shoplists", JSON.stringify(list));
                putPriceLimit(val, r.id);
            }).catch(err => console.log(err))
        }
        else {
            putPriceLimit(val, shoppingList.id);
        }
    }

    return (
        <div className="one-shopping-list">
            <div className=" row">
                <div className="col-12 col-md-4 order-md-2">
                    <div className="right-content">
                        <h1 onClick={() => window.location.href = "/store/" + shopID}>فروشگاه {shopInfo.title}</h1>
                        {limitEdit ?
                            <form className="limit-form">
                                <label>تنظیم محدودیت قیمت (ریال)</label>
                                <input type="text" id="price-limit-in" data-testid="shopping-price-limit-input" defaultValue={shoppingList?.max_cost ? shoppingList.max_cost : ""} />
                                <div className="btn" onClick={() => setPriceLimit()} data-testid="shopping-price-limit-submit" type="button">ذخیره</div>
                            </form>
                            :
                            !!shoppingList?.max_cost ?
                                <div className="max-price">
                                    <p data-testid="shopping-price-limit">محدودیت قیمت: {shoppingList.max_cost}ریال</p>
                                    {!props.completed && <div className="btn max-price-btn" data-testid="shopping-price-limit-edit" onClick={() => setLimitEdit(true)}>تغییر محدودیت قیمت</div>}
                                </div>
                                :
                                <div className="max-price">
                                    <p className="no-max-price" data-testid="shopping-no-price-limit">محدودیت قیمت ندارد</p>
                                    {!props.completed && <div className="btn max-price-btn" data-testid="shopping-price-limit-edit" onClick={() => setLimitEdit(true)}>ایجاد محدودیت قیمت</div>}
                                </div>
                        }
                        <div className="price">
                            {!!shoppingList && (shoppingList.rawTotalPrice !== shoppingList.totalPrice) && <h6 data-testid="shopping-raw-total">{shoppingList.rawTotalPrice} ریال</h6>}
                            {!!shoppingList && <h3 data-testid="shopping-total">{shoppingList.totalPrice} ریال</h3>}
                        </div>
                        {!!shoppingList && !!shoppingList.shopping_list_items && shoppingList.shopping_list_items.length > 0 && !props.completed && <div className="btn submit-btn" onClick={()=>window.location.href = "/store/"+shopID+"/shopping-list/complete-order"}>ثبت خرید<ChevronLeftIcon /></div>}
                        {!!shoppingList && props.completed && <div className="history-info">
                            <p>بازه تحویل: </p>
                            <p style={{fontWeight: "bold", color: "var(--font-color2)"}} data-testid="completed-delivery-date">{shoppingList.date_delivery}</p>
                            <p style={{marginTop:"10px"}}>محل تحویل سفارش: </p>
                            <p style={{fontWeight: "bold", color: "var(--font-color2)", whiteSpace:"pre-wrap"}} data-testid="completed-address" >{shoppingList.address}</p>
                            <p style={{marginTop:"10px"}}>شماره تماس: </p>
                            <p style={{fontWeight: "bold", color: "var(--font-color2)"}} data-testid="completed-phone">{shoppingList.phone}</p>
                            <p style={{fontSize:"0.9rem",color:"var(--primary-color)", marginTop:"10px"}} data-testid="completed-online">{shoppingList.online?"خرید آنلاین":"خرید حضوری"}</p>
                        </div>}
                    </div>
                </div>
                <div className="col-12 col-md-8 order-md-1">
                    <div className="left-content">
                        {
                            !shoppingList || !shoppingList.shopping_list_items || shoppingList.shopping_list_items.length === 0 ?
                                <h1 className="no-items-added" data-testid="shopping-no-items">کالایی در لیست خرید شما وجود ندارد</h1>
                                :
                                <div className="shopping-items-holder">
                                    {shoppingList.shopping_list_items.map((el, idx) =>
                                            <div className="shopping-item" key={idx}>
                                                <div className="shopping-img-holder">
                                                    <img data-testid={`shopping-item-photo-${el.item.id}`} alt={el.item.name} src={el.item.photo} />
                                                </div>
                                                <div className="shopping-item-info">
                                                    <h5 data-testid={`shopping-item-name-${el.item.id}`} onClick={() => window.location.href = "/store/" + el.item.shop_id + "/items/" + el.item.id}>{el.item.name}</h5>
                                                    <div className="shopping-count">
                                                        <p data-testid={`shopping-item-number-${el.item.id}`}>تعداد: {el.number}</p>
                                                    </div>
                                                    {!!el.item?.discount && el.item.discount > 0 ?
                                                        <div className="shopping-price">
                                                            <div style={{ display: "inline-flex" }}><p className="item-card-real-price">{el.rawTotalPrice}</p><div className="item-card-discount">{el.item.discount}%</div></div>
                                                            <p className="item-card-price-text" data-testid={`shopping-item-price-${el.item.id}`}>{el.totalPrice} ریال</p>

                                                        </div>
                                                        : <p className="shopping-price item-card-price-text" data-testid={`shopping-item-price-${el.item.id}`}>{el.rawTotalPrice + "ریال"}</p>}
                                                    {!props.completed && <form inline="true" className="count-form">
                                                        <div className="count-changer btn" data-testid={`shopping-item-plus-${el.item.id}`} onClick={() => changeCount(el.id, el.number, el.item.count, "+")}>+</div>
                                                        <input type="text" defaultValue={el.number} id={"item-input" + el.id} data-testid={`shopping-item-number-input-${el.item.id}`} onChange={() => changeCount(el.id, el.number, el.item.count, "")} />
                                                        <div className="count-changer btn" data-testid={`shopping-item-minus-${el.item.id}`} onClick={() => changeCount(el.id, el.number, el.item.count, "-")}>-</div>
                                                        <div id={"count-btns" + el.id} hidden={true} style={{ display: "contents" }}><div className="count-submit btn" onClick={() => submitCountChange(el.id, idx, el.item.count)} data-testid={`shopping-item-number-submit-${el.item.id}`}>ذخیره</div>
                                                            <div className="count-cancel btn" data-testid={`shopping-item-number-cancel-${el.item.id}`} onClick={() => cancelCountChange(el.id, idx)}>لغو</div></div>
                                                    </form>}
                                                    {!props.completed && <p className="delete-item btn" data-testid={`shopping-item-delete-${el.item.id}`} onClick={() => deleteItem(el.id, el.item.name)}>حذف از سبد</p>}
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                        }
                    </div>
                </div>

            </div>
            {/* <ul>
                <li className="active">1</li>
                <li>2</li>
                <li>3</li>
                <li >4</li>
            </ul> */}
        </div>
    )
}

export default ShoppingList;