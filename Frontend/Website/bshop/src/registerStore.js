import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import { createStore } from "./api";
import snack from "./libs/snack";
import {isPhoneValid} from './libs/utils'
// import RegisterStore from './registerStore';

const RegisterStore = () => {
  const [values, setValues] = useState({
    // email: "",
    // password: "",
    storeName: "",
    src: "",
    ownerName: "",
    address: "",
    code: "",
    phone: "",
  });
  const handleChange = (n, v) => {
    setValues((prev) => ({
      ...prev,
      [n]: v,
    }));
  };
  const imageInsert = (item) => {
    if (item.target.files[0]) {
      setValues({
        ...values,
        src: item.target.files[0],
      });
    }
    const tempItem = item;
    tempItem.target.value = null;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", values.storeName);
    fd.append("manager", values.ownerName);
    fd.append("logo", values.src);
    fd.append("address", values.address);
    // theme is not selected!
    fd.append("online", true);
    fd.append("theme", 2);
    fd.append("mantaghe", "12");
    fd.append("shomare_sabt", values.code);
    fd.append("phone", values.phone);
    //code bishtar az 4 ragham farz shode
    if (isPhoneValid(values.phone) && values.address.length > 6 && values.src && values.ownerName > 4 && values.storeName > 4  && values.code.length > 4 ) {
      if (localStorage.getItem("role") !== "seller") {
        var email = "";
        fetch("http://127.0.0.1:8000/users/profile", {
          method: "GET",
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        })
          .then((res) => {
            if (res.status === 200) {
              return res.json();
            }
            return {};
          })
          .then((res) => {
            email = res.email;
            var fd = new FormData();
            fd.append("role", "seller");
            fd.append("email", email);
            console.log(email);
            var requestOptions = {
              method: "PUT",
              headers: {
                Authorization: "Token " + localStorage.getItem("token"),
              },
              body: fd,
            };
            fetch("http://127.0.0.1:8000/users/profile", requestOptions)
              .then(async (response) => {
                if (response.status === 200) {
                  localStorage.setItem("role", "seller");
                  createStore(fd)
                    .then((resp) => {
                      if (resp.status === 201) {
                        window.location.replace("/");
                      }
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }
              })
              .catch((error) => {
                console.log("error", error);
                snack.error("اشتباهی رخ داده است...");
              });
          })
          .catch((e) => {
            console.log(e);
            snack.error("اشتباهی رخ داده است...");
          });
      } else {
        createStore(fd)
          .then((resp) => {
            if (resp.status === 201) {
              window.location.replace("/");
            }
          })
          .catch((e) => {
            console.log(e);
            snack.error("اشتباهی رخ داده است...");
          });
      }
    } else {
      // inja bayad snack biad
      snack.error('تمامی اطلاعات را به درستی وارد نمایید.')
    }
  };
  return (
    <div className="homepage">
      <form
        style={{ maxWidth: "768px", margin: "20px auto", padding: "20px" }}
        className="form-signin"
      >
        <img className="mb-4" src={logo} alt="" style={{height:"40vh",width:"40vh",objectFit:"cover"}}/>
        <h1 className="h3 mb-3 font-weight-normal">ساخت حساب فروشگاه</h1>
        <label for="storeName" className="sr-only">
          نام فروشگاه
        </label>
        <input
        data-testid="register-shop-name"
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="text"
          value={values.storeName}
          onChange={(e) => handleChange("storeName", e.target.value)}
          id="storeName"
          className="form-control"
          placeholder="نام فروشگاه خود را وارد کنید"
          required
          autofocus
        />
        <label for="userName" className="sr-only">
          نام مدیر فروشگاه
        </label>
        <input
        data-testid="register-shop-ownername"
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="text"
          value={values.ownerName}
          onChange={(e) => handleChange("ownerName", e.target.value)}
          id="userName"
          className="form-control"
          placeholder="نام مدیر را وارد کنید"
          required
          autofocus
        />
        {/* <label for="inputEmail" className="sr-only">
          ایمیل
        </label>
        <input
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="email"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          id="inputEmail"
          className="form-control"
          placeholder="ایمیل خود را وارد کنید"
          required
          autofocus
        /> */}
        <label for="phone" className="sr-only">
          شماره موبایل
        </label>
        <input
        data-testid="register-shop-phone"
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="text"
          value={values.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          id="phone"
          className="form-control"
          placeholder="شماره موبایل خود را وارد کنید"
          required
          autofocus
        />
        {/* <label for="inputPassword" className="sr-only">
          پسورد
        </label>
        <input
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="password"
          value={values.password}
          onChange={(e) => handleChange("password", e.target.value)}
          id="inputPassword"
          className="form-control"
          placeholder="پسورد خود را وارد کنید"
          required
        /> */}
        <label for="address" className="sr-only">
          آدرس
        </label>
        <input
        data-testid="register-shop-address"
          style={{ textAlign: "right", marginBottom: "10px" }}
          value={values.address}
          onChange={(e) => handleChange("address", e.target.value)}
          id="address"
          className="form-control"
          placeholder="آدرس خود را وارد کنید"
          required
        />
        <label for="code" className="sr-only">
          کد فروشگاه
        </label>
        <input
        data-testid="register-shop-code"
          style={{ textAlign: "right", marginBottom: "10px" }}
          value={values.code}
          onChange={(e) => handleChange("code", e.target.value)}
          id="code"
          className="form-control"
          placeholder="کد فروشگاه خود را وارد کنید"
          required
        />
        <div class="custom-file">
          <input
            type="file"
            onChange={imageInsert}
            class="custom-file-input"
            id="customInput"
            required
          />
          <label class="custom-file-label" htmlFor="customInput">
            {values.src ? "عکس شما انتخاب شده است" : "Choose file..."}
          </label>
        </div>
        <div className="checkbox mb-3"></div>
        <button
          onClick={handleSubmit}
          className="btn btn-lg btn-primary btn-block"
          type="submit"
          style={{backgroundColor: 'var(--primary-color)',border: "none"}}
        >
          ورود
        </button>
        {/* <p className="mt-5 mb-3 text-muted">
          اگر قبلا اکانت ساخته اید
          <Link to="/loginstore"> وارد شوید </Link>
        </p> */}
      </form>
    </div>
  );
};

export default RegisterStore;
