import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from './assets/logo.png'

const Register = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    userName: ''
  })
  const handleChange = (n, v) => {
    setValues((prev) => ({
      ...prev,
      [n]: v
    }))
  }
  return (
    <div className="homepage">
      <form
        style={{ maxWidth: "768px", margin: "20px auto", padding: "20px" }}
        className="form-signin"
      >
        <img
          className="mb-4"
          src={logo}
          alt=""
          width="72"
          height="72"
        />
        <h1 className="h3 mb-3 font-weight-normal">ساخت حساب کاربری</h1>
        <label for="userName" className="sr-only">
          نام کاربری
        </label>
        <input
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="text"
          value={values.userName}
          onChange={(e) => handleChange('userName', e.target.value)}
          id="userName"
          className="form-control"
          placeholder="نام کاربری خود را وارد کنید"
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
          onChange={(e) => handleChange('email', e.target.value)}
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
          onChange={(e) => handleChange('password', e.target.value)}
          id="inputPassword"
          className="form-control"
          placeholder="پسورد خود را وارد کنید"
          required
        />
        <div className="checkbox mb-3">
          {/* <label>
          <input type="checkbox" value="remember-me"`> Remember me
        </label> */}
        </div>
        <button className="btn btn-lg btn-primary btn-block" type="submit">
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
