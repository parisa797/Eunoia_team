import "./ProfilePage.css";
import './EditItem.css';
import { useEffect, useState } from 'react';
import EditItemPhoto from './EditItemPhoto';
import { Toast } from "react-bootstrap";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DeleteItem from "./DeleteItem";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';


function EditItem(props) {
    const [profile, setProfile] = useState({});
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [manufacture_Date, setManufactureDate] = useState("");
    const [count, setCount] = useState(1);
    const [price, setPrice] = useState(1);
    const [discount, setDiscount] = useState(1);
    const [Expiration_Date, setExpirationDate] = useState("");
    const [DateErr, setDateErr] = useState({ "m": ["", "", "", ""], "e": ["", "", "", ""], "a": [""] });
    const [OtherErrs, setOtherErrs] = useState(["", "", ""])
    const [hasPrice, setHasPrice] = useState(true);
    const [description, setDescription] = useState("");

    const [proPic, setProPic] = useState("/no-image-icon-0.jpg");
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

    function swapCategories() {
        var ret = {};
        for (var key in categories) {
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
        //fetch item info for the owner
        let prof = {};
        fetch("http://eunoia-bshop.ir:8000/shops/" + shopID + "/items/" + itemID, {
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
                if (!prof.count)
                    prof.count = "تعداد موجودی کالا را وارد کنید...";
                if (!prof.price) {
                    prof.price = "قیمت کالا را وارد کنید...";
                    prof.hasPrice = false;
                }
                else prof.hasPrice = true;
                if (!prof.discount)
                    prof.discount = "تخفیف کالا را وارد کنید...";
                if (!prof.description)
                    prof.description = "توضیحات مربوط به کالا را وارد کنید...";
                if (!prof.photo)
                    prof.photo = "/no-image-icon-0.jpg";
                prof.category = categories[prof.category]
                if(prof.Expiration_jalali)
                    prof.Expiration_Date = prof.Expiration_jalali.split("-")
                else if(prof.Expiration_Date)
                prof.Expiration_Date = prof.Expiration_Date.split("-")
                if(prof.manufacture_jalali)
                    prof.manufacture_Date = prof.manufacture_jalali.split("-")
                else if(prof.manufacture_Date)
                    prof.manufacture_Date = prof.manufacture_Date.split("-")
                //set prof in profile and other state variables
                setProfile(prof)
                setName(prof.name);
                setCategory(prof.category);
                setManufactureDate(prof.manufacture_Date)
                setCount(prof.count)
                setPrice(prof.price);
                setHasPrice(prof.hasPrice);
                setDiscount(prof.discount);
                setExpirationDate(prof.Expiration_Date);
                setDescription(prof.description);
                setProPic(prof.photo);

            }).catch((e) => {
                console.log(e);
            });

    }, [reloadProfile])

    function changeManufactureDate(value, idx) {
        let date = [...manufacture_Date];
        date[idx] = value;
        setManufactureDate(date)
        return date;
    }

    function changeExpirationDate(value, idx) {
        let date = [...Expiration_Date];
        date[idx] = value;
        setExpirationDate(date)
        return date;
    }

    function changeDateErr(val, MorE, pos_num) {
        var errs = DateErr;
        let err = [...errs[MorE]];
        err[pos_num] = val;
        errs[MorE] = [...err];
        setDateErr(errs);
    }

    function arrayElementsEmpty(arr){
        for(let i in arr){
            if(!!arr[i])
                return false;
        }
        return true;
    }

    function validate_Date(val, pos, pos_num, whose, true_length) {
        let new_date = null;
        if (whose === "e") {
            new_date = [...changeExpirationDate(val, pos_num)];
        }
        else {
            new_date = [...changeManufactureDate(val, pos_num)];
        }
        if (!val) {
            if (whose === "e")
                changeExpirationDate(profile.Expiration_Date[pos_num], pos_num);
            else
                changeManufactureDate(profile.manufacture_Date[pos_num], pos_num);
            changeDateErr("", whose, pos_num);
            return;
        }

        let userError = "";
        if (val.match(/^\d+$/) === null) {
            userError = "تنها عدد برای "+pos+" وارد کنید ";
        }
        else if (val.length !== true_length) {
            userError = pos + " باید " + true_length + "رقمی باشد ";
        }
        
        if (arrayElementsEmpty(DateErr[whose].slice(0,3).filter((e,i)=>i!=pos_num)) && !userError && (! /^[1-4]\d{3}\/((0[1-6]\/((3[0-1])|([1-2][0-9])|(0[1-9])))|((1[0-2]|(0[7-9]))\/(30|([1-2][0-9])|(0[1-9]))))$/.test(new_date.join("/")))) {
            changeDateErr("تاریخ وارد شده وجود ندارد", whose, 3);
        } else changeDateErr("", whose, 3);


        changeDateErr(userError, whose, pos_num)

        if (arrayElementsEmpty(DateErr['m']) && arrayElementsEmpty(DateErr['e']) && Expiration_Date.join("") < manufacture_Date.join(""))
            userError = "تاریخ انقضا باید پس از تاریخ تولید باشد";
        else userError = ""

        changeDateErr(userError, "a", 0)

    }

    function validate_Numerical_Fields(val, which) {
        switch (which) {
            case 0: setCount(!!val ? val : profile.count);
                break;
            case 1:
                if (!val) {
                    setPrice(profile.price);
                    setHasPrice(profile.hasPrice);
                } else {
                    setPrice(val);
                }
                break;
            case 2: setDiscount(!!val ? val : profile.discount);
        }
        if (!val) {
            let errs = [...OtherErrs]
            errs[which] = "";
            setOtherErrs(errs)
            return;
        }

        let userError = ""
        if (val.match(/^\d+$/) === null) {
            userError = "تنها عدد وارد کنید";
        }
        if(which ===2 && val>100){
            userError="تخفیف را به درصد وارد کنید"
        }

        let errs = [...OtherErrs]
        errs[which] = userError;
        setOtherErrs(errs)

        if (which === 1) {
            if (!!userError || parseInt(val) === 0)
                setHasPrice(false);
            else
                setHasPrice(true);
        }


    }

    function cancelChanges() {
        setName(profile.name);
        setCategory(profile.category);
        setManufactureDate(profile.manufacture_Date);
        setCount(profile.count)
        setPrice(profile.price);
        setHasPrice(profile.hasPrice);
        setDiscount(profile.discount);
        setExpirationDate(profile.Expiration_Date);
        setDescription(profile.description);
        setProPic(profile.photo);

        setDateErr({ "m": ["", "", ""], "e": ["", "", ""], "a": [""] });
        setOtherErrs(["", "", ""])
    }

    async function submitChanges() {
        await document.getElementById("prof-page-name").blur()
        await document.getElementById("prof-page-category").blur()
        await document.getElementById("prof-page-count").blur()
        await document.getElementById("prof-page-price").blur()
        await document.getElementById("prof-page-discount").blur()
        await document.getElementById("prof-page-manufacture-date-year").blur()
        await document.getElementById("prof-page-manufacture-date-month").blur()
        await document.getElementById("prof-page-manufacture-date-day").blur()
        await document.getElementById("prof-page-expiration-date-year").blur()
        await document.getElementById("prof-page-expiration-date-month").blur()
        await document.getElementById("prof-page-expiration-date-day").blur()
        await document.getElementById("prof-page-description").blur()

        if (!!DateErr.a[0] || DateErr.m.some(el => !!el) || DateErr.e.some(el => !!el) 
            || OtherErrs.some(el => !!el))
            {
                return;
            }
            

        let fd = new FormData();
        let sthChanged = false;
        if (name !== profile.name && name) {
            fd.append("name", name);
            sthChanged = true;
        }
        else {
            fd.append("name", profile.name)
        }
        if (category !== profile.category && category) {
            fd.append("category", swapCategories()[category])
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
            if(!hasPrice){
                fd.append("discount", 0)
                sthChanged = true;
            }
        }
        if (hasPrice && discount !== profile.discount && discount) {
            fd.append("discount", discount)
            sthChanged = true;
        }
        if (Expiration_Date !== profile.Expiration_Date) {
            fd.append("Expiration_Date", Expiration_Date.join("-"));
            sthChanged = true;
        }
        if (description !== profile.description && description) {
            fd.append("description", description)
            sthChanged = true;
        }
        if (newPicInfo) {
            fd.append("photo", newPicInfo)
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
        fetch("http://eunoia-bshop.ir:8000/shops/" + shopID + "/items/" + itemID, requestOptions)
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

    return (
        <div className="profile-page item-profile">
            <div className="custom-container ">
            <div style={{ display: 'flex', direction: "rtl", marginBottom:"5vh" }} className="edit-header">
                    <h4>اطلاعات کالا</h4>
                    <div className="delete-item btn" onClick={() => props.showDeleteItemModal(profile.id,profile.name)} data-testid="edit-shop-delete-button" ><DeleteForeverIcon /></div>
                    <DeleteItem url={"/store/"+shopID} showDeleteModal={props.deleteItemModal} setShowDeleteModal={props.setDeleteItemModal} shopID={shopID} setTriggerReload={props.setTriggerReload}  triggerReload={props.triggerReload} />
                    <a href={"/store/" + shopID}>بازگشت به فروشگاه<ArrowBackIosIcon /></a>
                </div>
                <EditItemPhoto pic={proPic} setPic={setProPic} newPicInfo={newPicInfo} setNewPicInfo={setNewPicInfo} />
                <form>
                    <div className="row">
                        <div className=" form-group input-container col-12 col-md-6">
                            <label>نام کالا</label>
                            <input id="prof-page-name" type="text" className="input" value={name} data-testid="edit-item-name" maxLength={20}
                                onFocus={() => { if (name === "نام کالا را وارد کنید...") setName("") }}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={(e) => { if (!e.target.value) setName(profile.name); }}
                            />
                        </div>
                        <div className=" form-group input-container col-12 col-md-6">
                            <label>دسته بندی</label>
                            <input id="prof-page-category" type="text" className="input dropdown-toggle" defaultValue={category} data-testid="edit-item-category" placeholder={category}
                                onFocus={(e) => document.getElementById("category-dropdown").classList.toggle("show")}
                            />
                            <div className="dropdown-menu" id="category-dropdown" style={{ right: 0, top: "calc(100% - 10px)" }}>
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
                            <div className="input-group" style={{ direction: "ltr", justifyContent: "space-evenly" }}>

                                <input id="prof-page-manufacture-date-year" type="text" className="input" value={manufacture_Date[0]} data-testid="edit-item-manufacture-date-year" maxLength="4"
                                    style={{ width: "calc( 33% - 0.3rem)" }}
                                    onChange={(e) => changeManufactureDate(e.target.value, 0)}
                                    onBlur={(e) => validate_Date(e.target.value, "سال", 0, "m", 4, 3000)}
                                />
                            /
                            <input id="prof-page-manufacture-date-month" type="text" className="input" value={manufacture_Date[1]} data-testid="edit-item-manufacture-date-month" maxLength="2"
                                    style={{ width: "calc( 34% - 0.5rem)" }}
                                    onChange={(e) => changeManufactureDate(e.target.value, 1)}
                                    onBlur={(e) => validate_Date(e.target.value, "ماه", 1, "m", 2, 12)}
                                />
                            /
                            <input id="prof-page-manufacture-date-day" type="text" className="input" value={manufacture_Date[2]} data-testid="edit-item-manufacture-date-day" maxLength="2"
                                    style={{ width: "calc( 33% - 0.3rem)" }}
                                    onChange={(e) => changeManufactureDate(e.target.value, 2)}
                                    onBlur={(e) => validate_Date(e.target.value, "روز", 2, "m", 2, 31)}
                                />
                            </div>
                            {!!DateErr.m && DateErr.m.map((err,i) => {
                                if (err)
                                    return <p className="feedback-text" data-testid={"edit-item-manufacture-err"+i}> {err}</p>
                            })}
                            {!!DateErr.a && !!DateErr.a[0] && <p className="feedback-text" data-testid="edit-item-overall-date-err">{DateErr.a[0]}</p>}
                        </div>


                        <div className=" form-group input-container col-12 col-md-6">
                            <label>تاریخ انقضا</label>
                            <div className="input-group" style={{ direction: "ltr", justifyContent: "space-evenly" }}>
                                <input id="prof-page-expiration-date-year" type="text" className="input" value={Expiration_Date[0]} data-testid="edit-item-expiration-date-year" maxLength="4"
                                    style={{ width: "calc( 33% - 0.3rem)" }}
                                    onChange={(e) => changeExpirationDate(e.target.value, 0)}
                                    onBlur={(e) => validate_Date(e.target.value, "سال", 0, "e", 4, 3000)}
                                />
                            /
                            <input id="prof-page-expiration-date-month" type="text" className="input" value={Expiration_Date[1]} data-testid="edit-item-expiration-date-month" maxLength="2"
                                    style={{ width: "calc( 34% - 0.5rem)" }}
                                    onChange={(e) => changeExpirationDate(e.target.value, 1)}
                                    onBlur={(e) => validate_Date(e.target.value, "ماه", 1, "e", 2)}
                                />
                            /
                            <input id="prof-page-expiration-date-day" type="text" className="input" value={Expiration_Date[2]} data-testid="edit-item-expiration-date-day" maxLength="2"
                                    style={{ width: "calc( 33% - 0.3rem)" }}
                                    onChange={(e) => changeExpirationDate(e.target.value, 2)}
                                    onBlur={(e) => validate_Date(e.target.value, "روز", 2, "e", 2)}
                                />
                            </div>
                            {!!DateErr.e && DateErr.e.map((err,i) => {
                                if (err)
                                    return <p className="feedback-text" data-testid={"edit-item-expiration-err"+i}> {err}</p>
                            })}
                        </div>


                        <div className=" form-group input-container col-12">
                            <label>مشخصات کالا</label>
                            <textarea id="prof-page-description" type="text" className="input" value={description} data-testid="edit-item-description"
                                onFocus={() => { if (description === "توضیحات مربوط به کالا را وارد کنید...") setDescription("") }}
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={(e) => { if (!e.target.value) setDescription(profile.description) }}
                            />
                        </div>

                        <div className=" form-group input-container col-12 col-md-4">
                            <label>تعداد</label>
                            <input id="prof-page-count" type="text" className="input" value={count} data-testid="edit-item-count" maxLength={20}
                                onFocus={() => { if (count === "تعداد موجودی کالا را وارد کنید...") setCount("") }}
                                onChange={(e) => setCount(e.target.value)}
                                onBlur={(e) => validate_Numerical_Fields(e.target.value, 0)}
                            />
                            {OtherErrs[0] && <p className="feedback-text" data-testid="edit-item-count-err"> {OtherErrs[0]}</p>}
                        </div>

                        <div className=" form-group input-container col-12 col-sm-6 col-md-4">
                            <label>قیمت کالا (به ریال)</label>
                            <input id="prof-page-price" type="text" className="input" value={price} data-testid="edit-item-price" maxLength={20}
                                onFocus={() => { if (price === "قیمت کالا را وارد کنید...") setPrice("") }}
                                onChange={(e) => setPrice(e.target.value)}
                                onBlur={(e) => validate_Numerical_Fields(e.target.value, 1)}
                            />
                            {OtherErrs[1] && <p className="feedback-text" data-testid="edit-item-price-err"> {OtherErrs[1]}</p>}
                        </div>
                        <div className=" form-group input-container col-12 col-sm-6 col-md-4">
                            <label>درصد تخفیف</label>
                            <input id="prof-page-discount" type="text" className="input" value={hasPrice ? discount : "ابتدا قیمت کالا را مشخص کنید"} data-testid="edit-item-discount" maxLength={20} readOnly={!hasPrice}
                                onFocus={() => { if (discount === "تخفیف کالا را وارد کنید...") setDiscount("") }}
                                onChange={(e) => setDiscount(e.target.value)}
                                onBlur={(e) => {if(hasPrice)validate_Numerical_Fields(e.target.value, 2)}}
                            />
                            {OtherErrs[2] && <p className="feedback-text" data-testid="edit-item-discount-err"> {OtherErrs[2]}</p>}
                        </div>

                        <div style={{ margin: "auto" }}>
                            <div className="save btn" onClick={() => submitChanges()} data-testid="edit-item-save-button" >ذخیره</div>
                            <div className="cancel btn" onClick={() => cancelChanges()} data-testid="edit-item-cancel-button" >لغو تغییرات</div>
                        </div>

                    </div>

                </form>
            </div>
            <div className="aroundToast">
                <Toast show={openToast.show} style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px", backgroundColor: "var(--bg-color2)", position: "fixed", bottom: "5vh", zIndex: 10 }}>
                    <Toast.Body style={{ color: "var(--font-color2)" }} >{openToast.text}</Toast.Body>
                </Toast>
            </div>
        </div>
    )
}

export default EditItem;