import React, { useState } from "react";
import { loginUser } from "./api";
import logo from "./assets/logo.png";
// import snack from "./libs/snack";
import { useSnackbar } from 'notistack';
import { validateEmail } from "./libs/utils";
import errorjson from './errorhandling'

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const handleChange = (n, v) => {
    setValues((prev) => ({
      ...prev,
      [n]: v,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(values.email) && values.password.length > 4) {
      loginUser({
        email: values.email,
        password: values.password,
      })
        .then((res) => res.data)
        .then((res) => {
          console.log(res);
          if (!!res && res.key) {
            localStorage.setItem("token", res.key);
            window.location.replace("/");
          }
        })
        .catch((e) => {
          console.log(e.response.data);
          const msgs = Object.values(e.response.data)
          // snack.error("اشتباهی رخ داده است...");
          msgs.forEach(i => enqueueSnackbar(errorjson[j], { 
            variant: 'error',
        }))
        });
    } else {
      enqueueSnackbar("در پر کردن اطلاعات دقت بیشتری لحاظ نمایید.", { 
        variant: 'error',
    });
    }
  };
  return (
    <div className="homepage" data-testid="login-user">
      <form
        style={{ maxWidth: "768px", margin: "20px auto", padding: "20px" }}
        className="form-signin"
      >
        <img className="mb-4" src={logo} alt="" style={{height:"40vh",width:"40vh",objectFit:"cover"}}/>
        <h1 className="h3 mb-3 font-weight-normal">ورود</h1>
        <label for="inputEmail" className="sr-only">
          Username
        </label>
        <input
         data-testid="login-email"
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="text"
          value={values.username}
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
          data-testid="login-password"
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
          {/* <label>
          <input type="checkbox" value="remember-me"`> Remember me
        </label> */}
        </div>
        <button
          data-testid="login-button"
          onClick={handleSubmit}
          className="btn btn-lg btn-primary btn-block"
          type="submit"
          style={{backgroundColor: 'var(--primary-color)',border: "none"}}
        >
          ورود
        </button>
        <p className="mt-5 mb-3 text-muted">
          اگر تا به الان اکانت نساخته اید!
          <a href="/register"> الان بسازید </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
