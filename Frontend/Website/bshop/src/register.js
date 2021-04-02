import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUser } from "./api";
import logo from "./assets/logo.png";

const Register = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    username: ""
  });
  const handleChange = (n, v) => {
    setValues((prev) => ({
      ...prev,
      [n]: v,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault()
    const {email, password, username } = values
    createUser({
      email,
      password1: password,
      password2: password,
      username
    }).then((res) => res.data)
    .then(res=>{
      console.log(res)
      if(!!res && res.key)
      {
        localStorage.setItem("token",res.key);
        window.location.replace("/");
      }
    }).catch((e) => {console.log(e)})
  }
  return (
    <div className="homepage">
      <form
        style={{ maxWidth: "768px", margin: "20px auto", padding: "20px" }}
        className="form-signin"
      >
        <img className="mb-4" src={logo} alt="" width="72" height="72" />
        <h1 className="h3 mb-3 font-weight-normal">ساخت حساب کاربری</h1>
        <label for="storeName" className="sr-only">
          نام فروشگاه
        </label>
        <input
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="text"
          value={values.username}
          onChange={(e) => handleChange("username", e.target.value)}
          id="storeName"
          className="form-control"
          placeholder="یوزرنیم خود را وارد کنید"
          required
          autofocus
        />
        <label for="inputEmail" className="sr-only">
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
        />
        <label for="inputPassword" className="sr-only">
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
        />
        <div className="checkbox mb-3">
        </div>
        <button onClick={handleSubmit} className="btn btn-lg btn-primary btn-block" type="submit">
          ورود
        </button>
        <p className="mt-5 mb-3 text-muted">
          اگر قبلا اکانت ساخته اید
          <Link to="/login"> وارد شوید </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
