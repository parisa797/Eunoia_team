import "./ProfilePage.css";
import './EditShop.css';
import { useEffect, useState } from 'react';
import EditShopLogo from './EditShopLogo';
import { Modal, Toast } from "react-bootstrap";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';


function EditShop(props) {
    const [profile, setProfile] = useState({});
    const [title, setTitle] = useState("");
    const [manager, setManager] = useState("");
    const [shop_phone, setShopPhone] = useState("");
    const [shop_phoneErr, setShopPhoneErr] = useState("");
    const [mantaghe, setMantaghe] = useState("1");
    const [phone, setPhone] = useState("");
    const [phoneErr, setPhoneErr] = useState("");
    const [address, setAddress] = useState("");
    const [online, setOnline] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [proPic, setProPic] = useState("/supermarket.jpg");
    const [proLogo, setProLogo] = useState("/shop-default-logo.png");
    const [newPicInfo, setNewPicInfo] = useState(null);
    const [newLogoInfo, setNewLogoInfo] = useState(null);
    const [reloadProfile, setReloadProfile] = useState(false);
    const [openToast, SetToastState] = useState({ show: false })
    let shopID = window.location.pathname.match(/[^\/]+/g)[1]

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
            .then((res) => {
                console.log(res)
                prof = res;
                if (!prof.title)
                    prof.title = "عنوان فروشگاه را وارد کنید...";
                if (!prof.manager)
                    prof.manager = "نام مدیر فروشگاه را وارد کنید...";
                if (!prof.shop_phone)
                    prof.shop_phone = "شماره تلفن فروشگاه را وارد کنید...";
                if (!prof.mantaghe)
                    prof.mantaghe = "منطقه فروشگاه را وارد کنید...";
                if (!prof.phone)
                    prof.phone = "شماره تلفن همراه مدیر را وارد کنید...";
                if (!prof.address)
                    prof.address = "آدرس را وارد کنید...";
                if (!prof.logo)
                    prof.logo = "/shop-default-logo.png";
                if (!prof.picture)
                    prof.picture = "/supermarket.jpg";
                if (!prof.online)
                    prof.online = false;
                //set prof in profile and other state variables
                setProfile(prof)
                setTitle(prof.title);
                setManager(prof.manager);
                setShopPhone(prof.shop_phone)
                setMantaghe(prof.mantaghe)
                setPhone(prof.phone);
                setOnline(prof.online)
                setAddress(prof.address);
                setProPic(prof.picture);
                setProLogo(prof.logo);

            }).catch((e) => {
                console.log(e);
            });

    }, [reloadProfile])

    function validatePhone(p, whose) {
        if (!p || p === "0") {
            if (whose === "m") {
                setPhone(profile.phone);
                setPhoneErr("");
            }
            else {
                setShopPhone(profile.shop_phone);
                setShopPhoneErr("");
            }
            return;
        }

        let userError = "";
        if (p.match(/^\d+$/) === null) {
            userError = "تنها عدد وارد کنید";
        }
        else if (p.length !== 11) {
            userError = "شماره درست نیست!";
        }

        if (whose === "m") {
            setPhone(p);
            setPhoneErr(userError);
        }
        else {
            setShopPhone(p);
            setShopPhoneErr(userError);
        }
    }

    function cancelChanges() {
        setTitle(profile.title);
        setManager(profile.manager);
        setShopPhone(profile.shop_phone);
        setMantaghe(profile.mantaghe)
        setPhone(profile.phone);
        setOnline(profile.online)
        setAddress(profile.address);
        setProPic(profile.picture);
        setProLogo(profile.logo);

        setPhoneErr("");
        setShopPhoneErr("");
    }

    async function submitChanges() {
        await document.getElementById("prof-page-fname").blur()
        await document.getElementById("prof-page-lname").blur()
        await document.getElementById("prof-page-mantaghe").blur()
        await document.getElementById("prof-page-shop-phone").blur()
        await document.getElementById("prof-page-phone").blur()
        await document.getElementById("prof-page-online").blur()
        await document.getElementById("prof-page-address").blur()

        if (shop_phoneErr || phoneErr)
            return;

        let fd = new FormData();
        let sthChanged = false;
        if (title !== profile.title && title) {
            fd.append("title", title);
            sthChanged = true;
        }
        if (manager !== profile.manager && manager) {
            fd.append("manager", manager)
            sthChanged = true;
        }
        if (shop_phone !== profile.shop_phone && shop_phone !== "0" && shop_phone) {
            fd.append("shop_phone", shop_phone);
            sthChanged = true;
        }
        if (mantaghe !== profile.mantaghe && mantaghe) {
            fd.append("mantaghe", mantaghe)
            sthChanged = true;
        }
        if (phone !== profile.phone && phone !== "0" && phone) {
            fd.append("phone", phone);
            sthChanged = true;
        }
        if (online !== profile.online) {
            fd.append("online", online ? "True" : "False")
            sthChanged = true;
        }
        if (address !== profile.address && address) {
            fd.append("address", address)
            sthChanged = true;
        }
        if (newPicInfo) {
            fd.append("picture", proPic)
            sthChanged = true;
        }

        if (!!newLogoInfo) {
            fd.append("logo", newLogoInfo)
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
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/update/" + shopID, requestOptions)
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
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/delete/" + shopID, {
            method: 'DELETE',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(
            res => {
                if (res.status === 204) {
                    localStorage.removeItem("role");
                    localStorage.removeItem("shops")
                    localStorage.removeItem("shoplists")
                    window.location.replace("/");
                }
                return null;
            }
        )
            .catch(e => console.log(e));
    }

    return (
        <div className="profile-page shop-profile">
            <div className=" flexbox-container container-fluid row">

                <div className="col-12 col-sm-8 col-md-9 order-sm-1 left-content">
                    <div className="custom-container ">
                        <EditShopLogo pic={proPic} setPic={setProPic} logo={proLogo} setLogo={setProLogo} newPicInfo={newPicInfo} setNewPicInfo={setNewPicInfo} newLogoInfo={newLogoInfo} setNewLogoInfo={setNewLogoInfo} />
                        <div style={{ display: 'flex', direction: "rtl" }}>
                            <h4>اطلاعات فروشگاه</h4>
                        </div>
                        <form>
                            <div className="row">
                                <div className=" form-group input-container col-12 col-md-6">
                                    <label>عنوان</label>
                                    <input id="prof-page-fname" type="text" className="input" value={title} data-testid="edit-shop-title" maxLength={30}
                                        onFocus={() => { if (title === "عنوان فروشگاه را وارد کنید...") setTitle("") }}
                                        onChange={(e) => setTitle(e.target.value)}
                                        onBlur={(e) => { if (!e.target.value) setTitle(profile.title); }}
                                    />
                                </div>
                                <div className=" form-group input-container col-12 col-md-6">
                                    <label>شماره تلفن فروشگاه</label>
                                    <input id="prof-page-shop-phone" type="text" className="input" value={shop_phone} data-testid="edit-shop-shop-phone" maxLength="11"
                                        style={{ direction: shop_phone.match(/^\d+$/) !== null ? "ltr" : "rtl" }}
                                        onFocus={() => { if (shop_phone[0] !== "0") setShopPhone("0") }}
                                        onChange={(e) => setShopPhone(e.target.value ? e.target.value : "0")}
                                        onBlur={(e) => validatePhone(e.target.value, "s")}
                                    />
                                    {!!shop_phoneErr && <p className="feedback-text" data-testid="edit-shop-shop-phone-err">{shop_phoneErr}</p>}
                                </div>

                                <div className=" form-group input-container col-12 col-md-6">
                                    <label>نام مدیر</label>
                                    <input id="prof-page-lname" type="text" className="input" value={manager} data-testid="edit-shop-manager" maxLength={30}
                                        onFocus={() => { if (manager === "نام مدیر فروشگاه را وارد کنید...") setManager("") }}
                                        onChange={(e) => setManager(e.target.value)}
                                        onBlur={(e) => { if (!e.target.value) setManager(profile.manager) }}
                                    />
                                </div>
                                <div className=" form-group input-container col-12 col-md-6">
                                    <label>شماره تلفن همراه</label>
                                    <input id="prof-page-phone" type="text" className="input" value={phone} data-testid="edit-shop-phone" maxLength="11"
                                        style={{ direction: phone.match(/^\d+$/) !== null ? "ltr" : "rtl" }}
                                        onFocus={() => { if (phone[0] !== "0") setPhone("0") }}
                                        onChange={(e) => setPhone(e.target.value ? e.target.value : "0")}
                                        onBlur={(e) => validatePhone(e.target.value, "m")}
                                    />
                                    {!!phoneErr && <p className="feedback-text" data-testid="edit-shop-phone-err">{phoneErr}</p>}
                                </div>

                                <div className=" form-group input-container col-12">
                                    <label>آدرس فروشگاه</label>
                                    <textarea id="prof-page-address" type="text" className="input" value={address} data-testid="edit-shop-address"
                                        onFocus={() => { if (address === "آدرس را وارد کنید...") setAddress("") }}
                                        onChange={(e) => setAddress(e.target.value)}
                                        onBlur={(e) => { if (!e.target.value) setAddress(profile.address) }}
                                    />
                                </div>

                                <div className=" form-group input-container col-6 col-md-3">
                                    <label>شهر</label>
                                    <input id="prof-page-city" type="text" className="input" defaultValue={"تهران"} data-testid="edit-shop-city" maxLength={20} readOnly="true"
                                    />
                                </div>

                                <div className=" form-group input-container col-6 col-md-3">
                                    <label>منطقه</label>
                                    <input id="prof-page-mantaghe" type="text" className="input" value={mantaghe} data-testid="edit-shop-mantaghe" maxLength={20}
                                        onFocus={() => { if (mantaghe === "منطقه فروشگاه را وارد کنید...") setMantaghe("") }}
                                        onChange={(e) => setMantaghe(e.target.value)}
                                        onBlur={(e) => { if (!e.target.value) setMantaghe(profile.mantaghe) }}
                                    />
                                </div>

                                <div className="checkbox-prof col-12 col-md-6">
                                    <input id="prof-page-online" type="checkbox" data-testid="edit-shop-checkbox" checked={online} onChange={() => setOnline(!online)} />
                                    <label>قابلیت خرید آنلاین</label>
                                </div>

                                <div style={{ margin: "auto" }}>
                                    <div className="save btn" onClick={() => submitChanges()} data-testid="edit-shop-save-button" >ذخیره</div>
                                    <div className="cancel btn" onClick={() => cancelChanges()} data-testid="edit-shop-cancel-button" >لغو تغییرات</div>
                                </div>

                            </div>

                        </form>
                    </div>
                </div>

                <div className="col-12 col-sm-4 col-md-3 order-sm-3 right-content">
                    <div className="custom-container">
                    <div className="custom-box-container">
                        <div className="btn custom-box-btn">کارکنان فروشگاه</div>
                        <div className="btn custom-box-btn">تنظیمات</div>
                        <div className="btn custom-box-btn" onClick={() => setShowDeleteModal(true)} >حذف فروشگاه</div>
                        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} style={{ display: "flex" }} className="profile-outer-modal">
                            <Modal.Header closeButton className="profile-modal">
                                <Modal.Title>حذف فروشگاه</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="profile-modal">
                                <div style={{ direction: "rtl" }}>
                                    <p>آیا از حذف فروشگاه اطمینان دارید؟</p>
                                    <p>در صورت حذف تمام اطلاعات، سابقه خریدها، محصولات و... پاک میشوند.
                    </p>
                                    <div className="justify-content-center" style={{ width: "100%", display: "flex" }}>
                                        <div className="btn delete-button" onClick={() => deleteShop()}>تایید و حذف فروشگاه</div>
                                    </div>
                                </div>
                            </Modal.Body>

                        </Modal>

                    </div>
                    <a href={"/store/" + shopID} className="back-to-shop">بازگشت به فروشگاه<ArrowBackIosIcon /></a>
                    </div>
                </div>

            </div>
            <div className="aroundToast">
                <Toast show={openToast.show} style={{ textAlign: "center", fontWeight: "bold", fontSize: "20px", backgroundColor: "var(--bg-color2)", position: "fixed", bottom: "5vh", zIndex: 10 }}>
                    <Toast.Body style={{ color: "var(--font-color2)" }} >{openToast.text}</Toast.Body>
                </Toast>
            </div>
        </div>
    )
}

export default EditShop;
