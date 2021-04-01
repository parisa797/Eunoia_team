import "./ProfilePage.css";
import { useEffect, useState } from 'react';
import ProfilePictureSelector from './ProfilePictureSelector';
import { Modal } from "react-bootstrap";

function ProfilePage(props) {
    const [profile, setProfile] = useState({});
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneErr, setPhoneErr] = useState("");
    const [address, setAddress] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [proPic, setProPic] = useState("./../profile.png");
    const [newPicInfo, setNewPicInfo] = useState(null);
    const [proPicID, setProPicID] = useState(0);
    const [reloadProfile, setReloadProfile] = useState(false);
    const [edit, setEdit] = useState(false);
    // var whichChanged = [0,0,0,0,0]; //there are 5 fields, any of them that is changed will be set to 1;
    // function checkIsChanged(num, newval, oldval){
    //     if(!newval){
    //         whichChanged[num] = 0;
    //     }
    //     // else if(oldval === "نام خود را وارد کنید..." ||
    //     //     oldval === "نام خانوادگی خود را وارد کنید..." ||
    //     //     oldval === "شماره تلفن همراه را وارد کنید..." ||
    //     //     oldval === "آدرس را وارد کنید..." ){
    //     //     if(newval !== oldval)
    //     //         whichChanged = '1';
    //     // }
    //     else if(newval !== oldval){
    //         whichChanged[num] = 1;
    //     }
    //     else
    //         whichChanged[num] = 0;

    //     if(whichChanged !== [0,0,0,0,0] ){
    //         setEdit(true);
    //     }
    //     else
    //         setEdit(false);
    // }

    // let prof = {
    //     files: null, username: "ShMob", role: "buyer",
    //     email: "mobashers313@gmail.com", FirstName: "ششششششش", LastName: null, phone: "", address: ""
    // };

    useEffect(() => {
        //if not signed in, redirect to home page
        if (!localStorage.getItem('username')) {
            window.location.replace("/");
            return;
        }
        //fetch profile and set it in "prof" variable

        let prof = {};
        fetch("http://127.0.0.1:8000/users/profile", {
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
                prof = res;
                if (!prof.FirstName)
                    prof.FirstName = "نام خود را وارد کنید...";
                if (!prof.LastName)
                    prof.LastName = "نام خانوادگی خود را وارد کنید...";
                if (!prof.phone)
                    prof.phone = "شماره تلفن همراه را وارد کنید...";
                if (!prof.address)
                    prof.address = "آدرس را وارد کنید...";
                if (!(prof?.urls?.length > 0)) {
                    prof.urls = [{ uploaded_file: "./../profile.png" }];
                    prof.files = [-1];
                }

                //set prof in profile and other state variables
                setProfile(prof)
                setFname(prof.FirstName);
                setLname(prof.LastName);
                setEmail(prof.email);
                setPhone(prof.phone);
                setAddress(prof.address);
                setProPic(prof.urls[0].uploaded_file);
                setProPicID(prof.files[0]);

            }).catch((e) => {
                console.log(e);
            });

    }, [reloadProfile])

    const emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //saves email and checks if the email is in a valid format
    function validateEmail(e) {
        //checkIsChanged(2, e, profile.email)
        if (!e) {
            setEmail(profile.email);
            setEmailErr("");
            return;
        }
        let userError = ""
        if (!emailregex.test(String(e).toLowerCase())) {
            userError = "ایمیل به درستی وارد نشده است!";
        }
        setEmailErr(userError);
    }

    function validatePhone(p) {
        //checkIsChanged(3, p, profile.phone)
        if (!p || p === "0") {
            setPhone(profile.phone);
            setPhoneErr("");
            return;
        }
        setPhone(p);
        let userError = "";
        if (p.match(/^\d+$/) === null) {
            userError = "تنها عدد وارد کنید";
        }
        else if (p.length !== 11) {
            userError = "شماره همراه درست نیست!";
        }
        setPhoneErr(userError);
    }

    function cancelChanges() {
        setFname(profile.FirstName);
        setLname(profile.LastName);
        setEmail(profile.email);
        setPhone(profile.phone);
        setAddress(profile.address);
        setProPic(profile.urls[0].uploaded_file);
        setProPicID(profile.files[0]);

        setEmailErr("");
        setPhoneErr("");

        setEdit(false);
    }

    function DeleteLastProfilePic() {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Token " + localStorage.getItem('token'));
        let fd = new FormData();
        fd.append('files', profile.files[0]);
        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: fd
        };
        fetch("http://127.0.0.1:8000/users/profile/delete-file", requestOptions)
            .then(response => {
                console.log("deleted file's status: " + response.status);
                if (response.status === 200) {
                    return response.json()
                }
                //it wasn't successfull!
                return {}
            })
            .catch(error => console.log('error', error));
    }

    async function submitChanges() {
        await document.getElementById("prof-page-fname").blur()
        await document.getElementById("prof-page-lname").blur()
        await document.getElementById("prof-page-email").blur()
        await document.getElementById("prof-page-phone").blur()
        await document.getElementById("prof-page-address").blur()

        let fd = new FormData();
        let sthChanged = false;
        if (fname !== profile.FirstName && fname) {
            fd.append("FirstName", fname);
            sthChanged = true;
        }
        if (lname !== profile.LastName && lname) {
            fd.append("LastName", lname)
            sthChanged = true;
        }
        if (!emailErr) {
            fd.append("email", email)
            if (email !== profile.email)
                sthChanged = true;
        }
        else
            fd.append("email", profile.email)

        if (!phoneErr && phone !== profile.phone && phone !== "0" && phone) {
            fd.append("phone", phone);
            sthChanged = true;
        }
        if (address !== profile.address && address) {
            fd.append("address", address)
            sthChanged = true;
        }
        if (newPicInfo) {


            //delete last profile pic if exists
            if (profile.files[0] != -1) {
                DeleteLastProfilePic();
            }

            //upload new pic
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Token " + localStorage.getItem('token'));
            let fdimg = new FormData();
            fdimg.append('uploaded_file', newPicInfo);
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: fdimg
            };
            await fetch("http://127.0.0.1:8000/users/profile/upload-file", requestOptions)
                .then(response => {
                    console.log("file's status: " + response.status);
                    if (response.status === 201) {
                        return response.json()
                    }
                    //it wasn't successfull!
                    return {}
                })
                .then(result => {
                    fd.append("files", result.id)
                    sthChanged = true;

                })
                .catch(error => console.log('error', error));
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
        fetch("http://127.0.0.1:8000/users/profile", requestOptions)
            .then(async (response) => {

                if (response.status === 200) {
                    setReloadProfile(!reloadProfile);
                    props.setTriggerNavUpdate(false)
                    props.setTriggerNavUpdate(true)
                }
                return response.json()
            }).then((res) => {
                if (Array.isArray(res.email) && res.email[0] === "user with this email already exists.")
                    setEmailErr("حسابی با این ایمیل وجود دارد، لطفا ایمیل دیگری را امتحان کنید")
            })
            .catch(error => {
                console.log('error', error)
            });
        setEdit(false);
    }

    const deleteProfile = () => {
        fetch("http://127.0.0.1:8000/users/profile", {
            method: 'DELETE',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(
            res => {
                if (res.status === 204) {
                    localStorage.removeItem("username")
                    localStorage.removeItem("token")
                    localStorage.removeItem("roller")
                    window.location.replace("/");
                }
                return null;
            }
        )
            .catch(e => console.log(e));
    }

    return (
        <div className="profile-page">
            <div className=" flexbox-container container-fluid row">
                <div className="col-12 col-sm-4 col-md-3 order-sm-3 right-content">
                    <ProfilePictureSelector pic={proPic} setPic={setProPic} newPicInfo={newPicInfo} setNewPicInfo={setNewPicInfo} setEdit={setEdit} />
                    <div className="custom-container custom-box-container">
                        <div className="btn custom-box-btn">تغییر رمز عبور</div>
                        <div className="btn custom-box-btn">تنظیمات</div>
                        <div className="btn custom-box-btn" onClick={() => setShowDeleteModal(true)} >حذف حساب</div>
                        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} style={{ display: "flex" }} className="profile-outer-modal">
                            <Modal.Header closeButton className="profile-modal">
                                <Modal.Title>حذف حساب کاربری</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="profile-modal">
                                <div style={{ direction: "rtl" }}>
                                    <p>آیا از حذف حسابتان اطمینان دارید؟</p>
                                    <p>در صورت حذف حساب کاربری تمام اطلاعات، خریدها و... پاک میشوند.
                    </p>
                                    <div className="justify-content-center" style={{ width: "100%", display: "flex" }}>
                                        <div className="btn delete-button" onClick={() => deleteProfile()}>تایید و حذف حساب</div>
                                    </div>
                                </div>
                            </Modal.Body>

                        </Modal>
                    </div>
                </div>
                <div className="col-12 col-sm-8 col-md-9 order-sm-1 left-content">
                    <div className="custom-container ">
                        <div style={{ display: 'flex', direction: "rtl" }}>
                            <h4>اطلاعات کاربری</h4>
                            {/* <div className="edit-button btn">ویرایش پروفایل</div> */}
                        </div>
                        <form>
                            <div className="row">
                                <div className=" form-group input-container col-12 col-md-6">
                                    <label>نام</label>
                                    <input id="prof-page-fname" type="text" className="input" value={fname} data-testid="first-name" maxLength={20}
                                        onFocus={() => { setEdit(true); if (fname === "نام خود را وارد کنید...") setFname("") }}
                                        onChange={(e) => setFname(e.target.value)}
                                        onBlur={(e) => {/*checkIsChanged(0, e.target.value, profile.FirstName);*/ if (!e.target.value) setFname(profile.FirstName); }}
                                    />
                                </div>

                                <div className=" form-group input-container col-12 col-md-6">
                                    <label>نام خانوادگی</label>
                                    <input id="prof-page-lname" type="text" className="input" value={lname} data-testid="last-name" maxLength={20}
                                        onFocus={() => { setEdit(true); if (lname === "نام خانوادگی خود را وارد کنید...") setLname("") }}
                                        onChange={(e) => setLname(e.target.value)}
                                        onBlur={(e) => { /*checkIsChanged(1, e.target.value, profile.LastName);*/ if (!e.target.value) setLname(profile.LastName) }}
                                    />
                                </div>

                                <div className=" form-group input-container col-12 col-md-6">
                                    <label>ایمیل</label>
                                    <input id="prof-page-email" type="text" className="input" value={email} data-testid="email" maxLength={320}
                                        style={{ direction: "ltr" }}
                                        onFocus={() => { setEdit(true) }}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={(e) => validateEmail(e.target.value)}
                                    />
                                    {!!emailErr && <p className="feedback-text" data-testid="email-err" >{emailErr}</p>}
                                </div>

                                <div className=" form-group input-container col-12 col-md-6">
                                    <label>شماره تلفن همراه</label>
                                    <input id="prof-page-phone" type="text" className="input" value={phone} data-testid="phone" maxLength="11"
                                        style={{ direction: phone.match(/^\d+$/) !== null ? "ltr" : "rtl" }}
                                        onFocus={() => { setEdit(true); if (phone[0] !== "0") setPhone("0") }}
                                        onChange={(e) => setPhone(e.target.value ? e.target.value : "0")}
                                        onBlur={(e) => validatePhone(e.target.value)}
                                    />
                                    {!!phoneErr && <p className="feedback-text" data-testid="phone-err">{phoneErr}</p>}
                                </div>

                                <div className=" form-group input-container col-12">
                                    <label>آدرس</label>
                                    <textarea id="prof-page-address" type="text" className="input" value={address} data-testid="address"
                                        onFocus={() => { setEdit(true); if (address === "آدرس را وارد کنید...") setAddress("") }}
                                        onChange={(e) => setAddress(e.target.value)}
                                        onBlur={(e) => {/*checkIsChanged(4, e.target.value, profile.address);*/ if (!e.target.value) setAddress(profile.address) }}
                                    />
                                </div>
                                {!!edit &&
                                    <div style={{ margin: "auto" }}>
                                        <div className="save btn" onClick={() => submitChanges()} data-testid="save-button" >ذخیره تغییرات</div>
                                        <div className="cancel btn" onClick={() => cancelChanges()} data-testid="cancel-button" >لغو</div>
                                    </div>
                                }
                            </div>

                        </form>
                    </div>
                    {profile.role === "buyer" && <a href="/sth" className="be-admin-notif" data-testid="become-a-seller"> میخواهید فروشگاه خود را ثبت کنید؟</a>}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;
