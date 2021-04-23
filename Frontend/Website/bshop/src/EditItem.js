import "./ProfilePage.css";
import './EditItem.css';
import { useEffect, useState } from 'react';
import EditItemPhoto from './EditItemPhoto';
import { Toast } from "react-bootstrap";
// import {Calendar,DatePicker } from 'react-persian-datepicker';

function EditItem(props) {
    const [profile, setProfile] = useState({});
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [manufacture_Date, setManufactureDate] = useState("");
    const [manufacture_DateErr, setManufactureDateErr] = useState("");
    const [count, setCount] = useState(1);
    const [price, setPrice] = useState(1);
    const [discount, setDiscount] = useState(1);
    const [Expiration_Date, setExpirationDate] = useState("");
    const [Expiration_DateErr, setExpirationDateErr] = useState("");
    const [description, setDescription] = useState("");
    const [onlineShop, setOnline] = useState(false);

    const [proPic, setProPic] = useState("/supermarket.jpg");
    const [newPicInfo, setNewPicInfo] = useState(null);
    const [reloadProfile, setReloadProfile] = useState(false);
    const [openToast, SetToastState] = useState({ show: false })

    const categories = {
        'Spices and condiments and food side dishes': 'ادویه، چاشنی و مخلفات غذا',
        'Cosmetics': 'بهداشت و مراقبت پوست',
        'Makeup and trimming': 'آرایش و پیرایش',
        'Protein': 'پروتئینی',
        'Junk Food': "تنقلات",
        'Nuts': 'خشکبار',
        'Sweets and desserts': 'شیرینیجات و دسرها',
        'perfume': 'عطر، ادکلن و اسپری',
        'Fruits and vegetables': 'غذا، کنسرو و سبزیجات',
        'Dairy': 'لبنیات',
        'Drinks': 'نوشیدنیها',
        'Washing and Cleaning Equipment': 'وسایل شستشو و نظافت',
        'others': 'متفرقه'
    }

    function swapCategories(){
        var ret = {};
        for(var key in categories){
          ret[categories[key]] = key;
        }
        return ret;
      }

    let shopID = window.location.pathname.match(/[^\/]+/g)[1]
    let itemID = window.location.pathname.match(/[^\/]+/g)[3]
    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    useEffect(() => {
        //if not signed in, redirect to home page
        if (!localStorage.getItem('username')) {
            window.location.replace("/store/" + shopID);
            return;
        }
        //fetch all shops of this user, if he's not the owner of the shop with the url's shopID, go back to shop
        let prof = {};
        console.log(itemID)
        console.log(shopID)
        fetch("http://127.0.0.1:8000/shops/" + shopID + "/items/" + itemID, {
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
            .then((res) => {
                console.log(res)
                prof = res;
                if (!prof.name)
                    prof.name = "نام کالا را وارد کنید...";
                // if (!prof.category)
                //     prof.category = "نام مدیر فروشگاه را وارد کنید...";
                // if (!prof.manufacture_Date)
                //     prof.manufacture_Date = "تاریخ تولید کالا را وارد کنید";
                if (!prof.count)
                    prof.count = "تعداد موجودی کالا را وارد کنید...";
                if (!prof.price)
                    prof.price = "قیمت کالا را وارد کنید...";
                if (!prof.discount)
                    prof.discount = "تخفیف کالا را وارد کنید...";
                // if (!prof.Expiration_Date)
                //     prof.Expiration_Date = "تاریخ انقضای کالا را وارد کنید...";
                if (!prof.description)
                    prof.description = "توضیحات مربوط به کالا را وارد کنید...";
                if (!prof.photo)
                    prof.photo = "/supermarket.jpg";
                if (!prof.onlineShop)
                    prof.onlineShop = false;
                prof.category = categories[prof.category]
                // prof.Expiration_Date = prof.Expiration_Date.split("-")
                prof.manufacture_Date = prof.manufacture_Date.split("-")
                //set prof in profile and other state variables
                setProfile(prof)
                setName(prof.name);
                setCategory(prof.category);
                setManufactureDate(prof.manufacture_Date)
                setCount(prof.count)
                setPrice(prof.price);
                setDiscount(prof.discount);
                setExpirationDate(prof.Expiration_Date);
                setOnline(prof.onlineShop)
                setDescription(prof.description);
                setProPic(prof.photo);

            }).catch((e) => {
                console.log(e);
            });

    }, [reloadProfile])

    function changeManufactureDate(value,idx){
        let date = manufacture_Date;
        date[idx] = value;
        console.log(date)
        setManufactureDate(date)
        console.log(manufacture_Date)
    }

    function changeExpirationDate(value,idx){
        let date = Expiration_Date;
        date[idx] = value;
        setExpirationDate(date)
    }

    function validateExpiration_Date(p, whose) {
        if (!p || p === "0") {
            if (whose === "m") {
                setExpirationDate(profile.Expiration_Date);
                setExpirationDateErr("");
            }
            else {
                setManufactureDate(profile.manufacture_Date);
                setManufactureDateErr("");
            }
            return;
        }

        let userError = "";
        if (p.match(/^\d+$/) === null) {
            userError = "تنها عدد وارد کنید";
        }
        else if (p.length !== 11) {
            userError = "شماره همراه درست نیست!";
        }

        if (whose === "m") {
            setExpirationDate(p);
            setExpirationDateErr(userError);
        }
        else {
            setManufactureDate(p);
            setManufactureDateErr(userError);
        }
    }

    function cancelChanges() {
        setName(profile.name);
        setCategory(profile.category);
        setManufactureDate(profile.manufacture_Date);
        setCount(profile.count)
        setPrice(profile.price);
        setDiscount(profile.discount);
        setExpirationDate(profile.Expiration_Date);
        setOnline(profile.onlineShop)
        setDescription(profile.description);
        setProPic(profile.photo);

        setExpirationDateErr("");
        setManufactureDateErr("");
    }

    async function submitChanges() {
        await document.getElementById("prof-page-fname").blur()
        await document.getElementById("prof-page-lname").blur()
        await document.getElementById("prof-page-count").blur()
        await document.getElementById("prof-page-price").blur()
        await document.getElementById("prof-page-discount").blur()
        await document.getElementById("prof-page-manufacture-date").blur()
        await document.getElementById("prof-page-Expiration_Date").blur()
        await document.getElementById("prof-page-online").blur()
        await document.getElementById("prof-page-description").blur()

        if (manufacture_DateErr || Expiration_DateErr)
            return;

        let fd = new FormData();
        let sthChanged = false;
        if (name !== profile.name && name) {
            fd.append("name", name);
            sthChanged = true;
        }
        else{
            fd.append("name",profile.name)
        }
        if (category !== profile.category && category) {
            fd.append("category",swapCategories()[category])
            sthChanged = true;
        }
        if (manufacture_Date !== profile.manufacture_Date) {
            fd.append("manufacture_Date", manufacture_Date.join("-"));
            sthChanged = true;
        }
        if (count !== profile.count && count) {
            fd.append("count", count)
            sthChanged = true;
        }
        if (price !== profile.price && price) {
            fd.append("price", price)
            sthChanged = true;
        }
        if (discount !== profile.discount && discount) {
            fd.append("discount", discount)
            sthChanged = true;
        }
        if (Expiration_Date !== profile.Expiration_Date) {
            fd.append("Expiration_Date", Expiration_Date.join("-"));
            sthChanged = true;
        }
        if (onlineShop !== profile.onlineShop) {
            fd.append("onlineShop", onlineShop ? "True" : "False")
            sthChanged = true;
        }
        if (description !== profile.description && description) {
            fd.append("description", description)
            sthChanged = true;
        }
        if (newPicInfo) {
            fd.append("photo", proPic)
            sthChanged = true;
        }

        if (!sthChanged) {
            cancelChanges();
            return;
        }

        var requestOptions = {
            method: 'PUT',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            },
            body: fd,
        };
        fetch("http://127.0.0.1:8000/shops/" + shopID + "/items/" + itemID, requestOptions)
            .then(async (response) => {

                if (response.status === 200) {
                    setReloadProfile(!reloadProfile);
                    props.setTriggerReload(!props.triggerReload)
                    SetToastState({ text: "اطلاعات جدید ذخیره شد", show: true })
                    await timeout(4000)
                    SetToastState({ show: false })
                }
                return response.json()
            })
            .catch(error => {
                console.log('error', error)
            });
    }

    const deleteShop = () => {
        fetch("http://127.0.0.1:8000/api/v1/shops/delete/" + shopID, {
            method: 'DELETE',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(
            res => {
                if (res.status === 204) {
                    window.location.replace("/");
                }
                return null;
            }
        )
            .catch(e => console.log(e));
    }

    return (
        <div className="profile-page item-profile">
            {/* <div className=" flexbox-container container-fluid row">

                <div className="col-12 col-sm-8 col-md-9 order-sm-1 left-content"> */}
            <div className="custom-container ">
                <EditItemPhoto pic={proPic} setPic={setProPic} newPicInfo={newPicInfo} setNewPicInfo={setNewPicInfo} />
                <div style={{ display: 'flex', direction: "rtl" }}>
                    <h4>اطلاعات کالا</h4>
                </div>
                <form>
                    <div className="row">
                        <div className=" form-group input-container col-12 col-md-6">
                            <label>نام کالا</label>
                            <input id="prof-page-fname" type="text" className="input" value={name} data-testid="edit-item-name" maxLength={20}
                                onFocus={() => { if (name === "نام کالا را وارد کنید...") setName("") }}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={(e) => { if (!e.target.value) setName(profile.name); }}
                            />
                        </div>
                        <div className=" form-group input-container col-12 col-md-6">
                            <label>دسته بندی</label>
                            <input id="prof-page-lname" type="text" className="input dropdown-toggle" defaultValue={category} data-testid="edit-shop-category" placeholder={category}
                                onFocus={(e) => document.getElementById("category-dropdown").classList.toggle("show")}
                            />
                            <div className="dropdown-menu" id="category-dropdown" style={{ right: 0,top: "calc(100% - 10px)" }}>
                                <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setCategory('ادویه، چاشنی و مخلفات غذا') }}>ادویه، چاشنی و مخلفات غذا</button>
                                <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setCategory('بهداشت و مراقبت پوست') }}>بهداشت و مراقبت پوست</button>
                                <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setCategory('آرایش و پیرایش') }}>آرایش و پیرایش</button>
                                <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setCategory('پروتئینی') }}>پروتئینی</button>
                                <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setCategory('تنقلات') }}>تنقلات</button>
                                <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setCategory('خشکبار') }}>خشکبار</button>
                                <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setCategory('شیرینیجات و دسرها') }}>شیرینیجات و دسرها</button>
                                <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setCategory('عطر، ادکلن و اسپری') }}>عطر، ادکلن و اسپری</button>
                                <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setCategory('غذا، کنسرو و سبزیجات') }}>غذا، کنسرو و سبزیجات</button>
                                <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setCategory('لبنیات') }}>لبنیات</button>
                                <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setCategory('نوشیدنیها') }}>نوشیدنیها</button>
                                <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setCategory('وسایل شستشو و نظافت') }}>وسایل شستشو و نظافت</button>
                                <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setCategory('متفرقه') }}>متفرقه</button>

                            </div>
                        </div>
                        <div className=" form-group input-container col-12 col-md-6">
                            <label>تاریخ تولید کالا</label>
                            <div className="input-group" style={{direction:"ltr"}}>
                                
                            <input id="prof-page-manufacture-date-year" type="text" className="input col-3" value={manufacture_Date[0]} data-testid="edit-manufacture-date-year" maxLength="4"
                                // onFocus={() => { if (manufacture_Date[0] !== "0") setManufactureDate("0") }}
                                onChange={(e) => changeManufactureDate(e.target.value,0)}
                                // onBlur={(e) => validateExpiration_Date(e.target.value, "s")}
                            />
                            /
                            <input id="prof-page-manufacture-date-month" type="text" className="input col-3" value={manufacture_Date[1]} data-testid="edit-manufacture-date-month" maxLength="2"
                                // onFocus={() => { if (manufacture_Date[0] !== "0") setManufactureDate("0") }}
                                onChange={(e) => changeManufactureDate(e.target.value,1)}
                                // onBlur={(e) => validateExpiration_Date(e.target.value, "s")}
                            />
                            /
                            <input id="prof-page-manufacture-date-day" type="text" className="input col-3" value={manufacture_Date[2]} data-testid="edit-manufacture-date-day" maxLength="2"
                                // onFocus={() => { if (manufacture_Date[0] !== "0") setManufactureDate("0") }}
                                onChange={(e) => changeManufactureDate(e.target.value,2)}
                                // onBlur={(e) => validateExpiration_Date(e.target.value, "s")}
                            />
                            </div>
                            {!!manufacture_DateErr && <p className="feedback-text" data-testid="edit-manufacture-date-err">{manufacture_DateErr}</p>}
                        </div>


                        <div className=" form-group input-container col-12 col-md-6">
                            <label>تاریخ انقضا</label>
                            {/* <DatePicker id="prof-page-Expiration_Date"
        value={Expiration_Date}
        onChange={value => setExpirationDate(value)}
        data-testid="edit-shop-Expiration_Date"
      /> */}
                            {/* <input id="prof-page-Expiration_Date" type="date" className="input" value={Expiration_Date} data-testid="edit-shop-Expiration_Date" maxLength="11"
                                // style={{ direction: Expiration_Date.match(/^\d+$/) !== null ? "ltr" : "rtl" }}
                                onFocus={() => { if (Expiration_Date[0] !== "0") setExpirationDate("0") }}
                                onChange={(e) => setExpirationDate(e.target.value ? e.target.value : "0")}
                                onBlur={(e) => validateExpiration_Date(e.target.value, "m")}
                            /> */}
                            {!!Expiration_DateErr && <p className="feedback-text" data-testid="edit-shop-Expiration_Date-err">{Expiration_DateErr}</p>}
                        </div>

                        <div className=" form-group input-container col-12">
                            <label>مشخصات کالا</label>
                            <textarea id="prof-page-description" type="text" className="input" value={description} data-testid="edit-shop-description"
                                onFocus={() => { if (description === "توضیحات مربوط به کالا را وارد کنید...") setDescription("") }}
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={(e) => { if (!e.target.value) setDescription(profile.description) }}
                            />
                        </div>

                        {/* <div className=" form-group input-container col-6 col-md-3">
                                    <label>شهر</label>
                                    <input id="prof-page-city" type="text" className="input" defaultValue={"تهران"} data-testid="edit-shop-city" maxLength={20}
                                    />
                                </div> */}

                        <div className=" form-group input-container col-12 col-sm-6 col-md-3">
                            <label>تعداد</label>
                            <input id="prof-page-count" type="text" className="input" value={count} data-testid="edit-shop-count" maxLength={20}
                                onFocus={() => { if (count === "تعداد موجودی کالا را وارد کنید...") setCount("") }}
                                onChange={(e) => setCount(e.target.value)}
                                onBlur={(e) => { if (!e.target.value) setCount(profile.count) }}
                            />
                        </div>

                        <div className=" form-group input-container col-12 col-sm-6 col-md-3">
                            <label>قیمت کالا</label>
                            <input id="prof-page-price" type="text" className="input" value={price} data-testid="edit-shop-price" maxLength={20}
                                onFocus={() => { if (price === "قیمت کالا را وارد کنید...") setPrice("") }}
                                onChange={(e) => setPrice(e.target.value)}
                                onBlur={(e) => { if (!e.target.value) setPrice(profile.price) }}
                            />
                        </div>
                        <div className=" form-group input-container col-12 col-sm-6 col-md-3">
                            <label>درصد تخفیف</label>
                            <input id="prof-page-discount" type="text" className="input" value={discount} data-testid="edit-shop-discount" maxLength={20}
                                onFocus={() => { if (discount === "تخفیف کالا را وارد کنید...") setDiscount("") }}
                                onChange={(e) => setDiscount(e.target.value)}
                                onBlur={(e) => { if (!e.target.value) setDiscount(profile.discount) }}
                            />
                        </div>

                        <div className="checkbox-prof col-12 col-sm-6 col-md-3">
                            <input id="prof-page-online" type="checkbox" data-testid="edit-shop-checkbox" checked={onlineShop} onChange={() => setOnline(!onlineShop)} />
                            <label>قابلیت خرید آنلاین</label>
                        </div>

                        <div style={{ margin: "auto" }}>
                            <div className="save btn" onClick={() => submitChanges()} data-testid="edit-shop-save-button" >ذخیره</div>
                            <div className="cancel btn" onClick={() => cancelChanges()} data-testid="edit-shop-cancel-button" >لغو تغییرات</div>
                        </div>

                    </div>

                </form>
            </div>
            {/* </div>

                
            </div> */}
            <div className="aroundToast">
                <Toast show={openToast.show} style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px", backgroundColor: "var(--bg-color2)", position: "fixed", bottom: "5vh", zIndex: 10 }}>
                    <Toast.Body style={{ color: "var(--font-color2)" }} >{openToast.text}</Toast.Body>
                </Toast>
            </div>
        </div>
    )
}

export default EditItem;