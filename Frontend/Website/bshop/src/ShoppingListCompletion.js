import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useSnackbar } from 'notistack';
import './ShoppingList.css';
import { useEffect, useState } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function ShoppingListCompletion(props) {
    const [shoppingList, setShoppingList] = useState({});
    const shopID = window.location.pathname.match(/[^\/]+/g)[1];
    const { enqueueSnackbar } = useSnackbar();
    const [shopInfo, setShopInfo] = useState({});
    const [reload, setReload] = useState(false);
    const [address, setAddress] = useState({ edit: false, address: "" });
    const [phone, setPhone] = useState({ edit: false, phone: "" });
    const [deliverDate, setDeliverDate] = useState(null);
    const [dates, setDates] = useState([]);
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
        if (props.userState !== "l") {
            window.location.href = "/store/" + shopID;
            return;
        }
        if (!JSON.parse(localStorage.getItem("shoplists")) || !(JSON.parse(localStorage.getItem("shoplists"))[shopID])) {
            window.location.href = "/store/" + shopID;
            return;
        }
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
            //you can remove these later
            // if (!!r && !!r.shopping_list_items) {
            //     let templist = [...r.shopping_list_items];
            //     templist.forEach(e => {
            //         let totalPrice;
            //         if (e.item?.discount && parseInt(e.item.discount) > 0) {
            //             totalPrice = parseInt(Math.round((100 - e.item.discount) * e.item.price / 100))
            //         }
            //         else {
            //             totalPrice = e.item.price
            //         }
            //         e.totalPrice = totalPrice * e.number;
            //         e.rawTotalPrice = e.item.price * e.number;
            //         if (!e.item.photo)
            //             e.item.photo = "/no-image-icon-0.jpg";
            //     })
            //     r.shopping_list_items = [...templist]
            // }
            // r.totalPrice = r.shopping_list_items.map(e => e.totalPrice).reduce((a, b) => a + b, 0)
            // r.rawTotalPrice = r.shopping_list_items.map(e => e.rawTotalPrice).reduce((a, b) => a + b, 0)
            if (!!r) {
                if (!r.address || !r.phone) {
                    fetch("http://eunoia-bshop.ir:8000/users/profile", {
                        method: 'GET',
                        headers: {
                            "Authorization": "Token " + localStorage.getItem('token')
                        }
                    }).then(
                        res => {
                            if (res.status === 200) {
                                return res.json()
                            }
                            return null;
                        }
                    ).then(
                        res => {
                            if (!!r.address)
                                setAddress({ edit: false, address: r.address })
                            else if (res === null || !res.address)
                                setAddress({ edit: true, address: "" })
                            else
                                setAddress({ edit: true, address: res.address })

                            if (!!r.phone)
                                setPhone({ edit: false, phone: r.phone })
                            else if (res === null || !res.phone)
                                setPhone({ edit: true, phone: "" })
                            else
                                setPhone({ edit: true, phone: res.phone })
                        })
                        .catch(err => console.log(err))
                }
                else {
                    setAddress({ edit: false, address: r.address })
                    setPhone({ edit: false, phone: r.phone })
                }
            }
            console.log(r)
            setShoppingList(r);
        }).catch(err => console.error(err))

    }, [reload])

    useEffect(() => {
        let data = []
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var today = new Date();
        let hour = today.getHours();
        let timeranges = [
            { str: "9 تا 12", num: "09" },
            { str: "12 تا 15", num: "12" },
            { str: "15 تا 18", num: "15" },
            { str: "18 تا 21", num: "18" },
        ];
        data.push({
            day: today.toLocaleDateString('fa-IR', options).replace(/([۰-۹])/g, token => String.fromCharCode(token.charCodeAt(0) - 1728)),
            dayDate: today.toISOString().slice(0, 10),
            timeranges: timeranges.filter(x=>parseInt(x.num)>hour)
        })
        for (let i = 1; i < 7; i++) {
            today = new Date();
            today.setDate(today.getDate() + i);
            let daystr = today.toLocaleDateString('fa-IR', options).replace(/([۰-۹])/g, token => String.fromCharCode(token.charCodeAt(0) - 1728));
            data.push({
                day: daystr,
                dayDate: today.toISOString().slice(0, 10),
                timeranges: timeranges
            })
        }
        setDates(data);
    }, [])

    function submitAddressOrPhone(type) {
        let fd = new FormData();
        let val;
        if (type === "address") {
            val = document.getElementById("shopping-address").value;
            if (!val)
                return;
            fd.append("address", val)
        }
        else {
            val = document.getElementById("shopping-phone").value;
            if (val.match(/^\d+$/) === null) {
                enqueueSnackbar("تنها عدد وارد کنید", { variant: "error" })
                return;
            }
            else if (val.length !== 11) {
                enqueueSnackbar("شماره همراه درست نیست!", { variant: "error" })
                return;
            }
            else {
                fd.append("phone", val)
            }
        }
        fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/update/" + shoppingList.id, {
            method: 'PUT',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            },
            body: fd
        }).then(res => {
            if (res.ok) {
                if (type === "address") {
                    setAddress({ edit: false, address: val })
                }
                else {
                    setPhone({ edit: false, phone: val })
                }
            }
        }).catch(err => console.error(err))

    }

    function sabt() {
        if (!address.address) {
            enqueueSnackbar("محل تحویل سفارش را قبل از ثبت وارد کنید", { variant: "error" })
            return;
        }
        if (!phone.phone) {
            enqueueSnackbar("برای ثبت سفارش باید شماره تلفنی وارد کنید", { variant: "error" })
            return;
        }
        if (!deliverDate) {
            enqueueSnackbar("زمان تحویل سفارش را مشخص کنید", { variant: "error" })
            return;
        }
        let fd = new FormData();
        fd.append("sabt", "True");
        fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/sabt/" + shoppingList.id, {
            method: 'PUT',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            },
            body: fd
        }).then(res => {
            if (res.ok)
            {
                localStorage.removeItem("shoplists")
                window.location.href = "/profile/shoppinglists";
            }
        }).catch(err => console.error(err))
    }

    function handleDateChange(e) {
        let val = e.target.value;
        let fd = new FormData;
        fd.append("delivery", val + ":00")
        fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/delivery/" + shoppingList.id, {
            method: 'PUT',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            },
            body: fd
        }).then(res => {
            console.log(res)
            if (res.ok)
                setDeliverDate(true);
        }).catch(err => console.error(err))
    }

    return (
        <div className="one-shopping-list one-shopping-completion">
            <div className=" row">
                <div className="col-12 col-md-4 order-md-2">
                    <div className="right-content">
                        <h1 onClick={() => window.location.href = "/store/" + shopID}>فروشگاه {shopInfo.title}</h1>
                        {!!shoppingList?.max_cost ?
                            <div className="max-price">
                                <p>محدودیت قیمت: {shoppingList.max_cost}ریال</p>
                            </div>
                            :
                            <div className="max-price">
                                <p className="no-max-price">محدودیت قیمت ندارید</p>
                            </div>
                        }
                        <div className="price">
                            {!!shoppingList && <h3>{shoppingList.sum_price} ریال</h3>}
                        </div>
                        <div className="btn submit-btn" onClick={() => window.location.href = "/store/" + shopID + "/shopping-list"}><ChevronRightIcon />بازگشت</div>
                    </div>
                </div>
                <div className="col-12 col-md-8 order-md-1">
                    <div className="left-content">
                        <h2 >محل تحویل و شماره تلفن</h2>

                        <div className="address-phone-container">
                            <p className="title">محل تحویل سفارش:</p>
                            {address.edit ?
                                <div className="edit-form">
                                    <textarea id="shopping-address" type="text" className="input" defaultValue={address.address} placeholder="محل تحویل سفارش را وارد کنید." />
                                    <div className="btn submit-btn" onClick={() => submitAddressOrPhone("address")}>ذخیره</div>
                                </div>
                                :
                                <div style={{ display: "inline-flex", marginBottom: "10px" }}>
                                    <p className="content">{address.address}</p>
                                    <p className="change-btn" onClick={() => setAddress({ edit: true, address: address.address })} > تغییر آدرس</p>
                                </div>
                            }
                            <p className="title">شماره تماس:</p>
                            {phone.edit ?
                                <div className="edit-form">
                                    <input id="shopping-phone" type="text" className="input" defaultValue={phone.phone} placeholder="شماره تلفنی را برای پیگیری سفارش وارد کنید." />
                                    <div className="btn submit-btn" onClick={() => submitAddressOrPhone("phone")}>ذخیره</div>
                                </div>
                                :
                                <div style={{ display: "inline-flex", marginBottom: "10px" }}>
                                    <p className="content">{phone.phone}</p>
                                    <p className="change-btn" onClick={() => setPhone({ edit: true, phone: phone.phone })} > تغییر شماره</p>
                                </div>
                            }

                        </div>

                        <h2 >زمان تحویل سفارش</h2>

                        <RadioGroup aria-label="delivery-date" name="date" onChange={handleDateChange}>
                            <div className="row">
                                {dates.map(day => {
                                    return (
                                        <div className="col-12 col-sm-6 col-md-4 col-lg-3" id={day.dayDate} key={day.dayDate}>
                                            <div className="date-container">
                                                <h4>
                                                    {day.day}
                                                </h4>
                                                {
                                                    day.timeranges.map(time => {
                                                        return (
                                                            <FormControlLabel key={time.num} className="radio-btn" value={day.dayDate + " " + time.num} control={<Radio />} label={time.str} />
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                        </RadioGroup>
                        <div className="btn sabt-btn" onClick={() => sabt()}>ثبت خرید</div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ShoppingListCompletion;