import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "./assets/logo.png";
import snack from "./libs/snack";
import { useSnackbar } from 'notistack';
// import { AddItem } from "./api";



const AddItem = () => {
  // const location = useLocation()
  // console.log(location.pathname.split('/'));
  const { enqueueSnackbar } = useSnackbar();
  const [values, setValues] = useState({
    name: "",
    src: "",
    description: "",
    manufacture_Date: "",
    Expiration_Date: "",
    count: "",
    discount: "",
    price: "",
    category:"others"
  });


  let shopID = window.location.pathname.match(/[^\/]+/g)[1]
  let itemID = window.location.pathname.match(/[^\/]+/g)[3]
  // const itemID = location.pathname.split('/')[2]
  
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
        src: item.target.files[0]
      })
    }
    const tempItem = item
    tempItem.target.value = null
  }
  console.log(new Date(values.manufacture_Date));
  const handleSubmit = (e) => {
    console.log('clicked');
    e.preventDefault()
    const d1 = new Date(values.manufacture_Date)
    const d2 = new Date(values.Expiration_Date)
    const diff = d2.getTime() - d1.getTime()
    if (values.name && values.manufacture_Date && values.Expiration_Date && !isNaN(d1.getTime()) && !isNaN(d2.getTime()) && values.count && values.category && values.price && diff > 0 &&  (!values.discount || values.discount < 99 )) {
      const fd = new FormData()
      console.log('if');
      fd.append('name', values.name)
      fd.append('photo', values.src)
      fd.append('description', values.description)
      fd.append('manufacture_Date', values.manufacture_Date)
      fd.append('Expiration_Date', values.Expiration_Date)
      fd.append('count', values.count)
      fd.append('price', values.price)
      fd.append('discount', values.discount)
      fd.append('category', values.category)

      fetch("http://eunoia-bshop.ir:8000/shops/" + shopID + "/items/", {
        method: 'POST',
        headers: {
          "Authorization": "Token " + localStorage.getItem("token")
        }
        , body: fd
      }).then((resp) => {
        if (resp.status === 201) {
          return resp.json()
          }
        }).then(res=>{
          if(!res)
            return;
          console.log(res)
          fetch("http://eunoia-bshop.ir:8000/items/"+res.id+"/qr/", {
            method: 'POST',
            headers: {
              "Authorization": "Token " + localStorage.getItem("token")
            }
          }).then((resp) => {
            if (resp.status === 201) {
              window.location.replace("/store/" + shopID);
            }
          }).catch((e) => { console.log(e.response.data) })
        }).catch((e) => { console.log(e.response.data) })  
    } else {
      console.log('else');
      if (!values.name) enqueueSnackbar('نام محصول را وارد کنید', { 
        variant: 'error',
    })
      if (!values.price) enqueueSnackbar('قیمت محصول را وارد کنید', { 
        variant: 'error',
    })
      if (!values.manufacture_Date) enqueueSnackbar('تاریخ تولید را وارد کنید', { 
        variant: 'error',
    }) 
    else if(isNaN(d1.getTime())) enqueueSnackbar('تاریخ تولید را به فرمت خواسته‌شده وارد کنید', { 
      variant: 'error',
  })
      if (!values.Expiration_Date) enqueueSnackbar('تاریخ انقضا را وارد کنید', { 
        variant: 'error',
    }) 
    else if(isNaN(d2.getTime())) enqueueSnackbar('تاریخ انقضا را به فرمت خواسته‌شده وارد کنید', { 
      variant: 'error',
  })
      if (!values.count) enqueueSnackbar('تعداد محصول را وارد کنید', { 
        variant: 'error',
    })
      if (!values.category) enqueueSnackbar('دسته بندی محصول را وارد کنید', { 
        variant: 'error',
    })
      if (values.discount && values.discount > 99) enqueueSnackbar('درصد تخفیف باید عددی کمتر از ۱۰۰ باشد', { 
        variant: 'error',
    })
      if (diff < 0) enqueueSnackbar('تاریخ انقضا باید بعد از تاریخ تولید باشد', { 
        variant: 'error',
    })
      
    }

  }
  return (
    <div className="homepage">
      <form
        style={{ maxWidth: "768px", margin: "20px auto", padding: "20px" }}
        className="form-signin"
      >
        <img className="mb-4" src={logo} alt="" width="72" height="72" />
        <h1 className="h3 mb-3 font-weight-normal">اضافه کردن یک محصول</h1>
        <label for="name" className="sr-only">
          نام محصول
        </label>
        <input
          data-testid="add-item-name"
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="text"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          id="name"
          className="form-control"
          placeholder="نام محصول خود را وارد کنید"
          required
          autofocus
        />
        <label for="description" className="sr-only">
          توضیحات محصول
        </label>
        <input
          data-testid="add-item-description"
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="text"
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          id="description"
          className="form-control"
          placeholder="توضیحات محصول را وارد کنید"
          required
          autofocus
        />
        <label for="manufacture_Date" className="sr-only">
          تاریخ تولید محصول
        </label>
        <input
          data-testid="add-item-manufacture_Date"
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="text"
          value={values.manufacture_Date}
          onChange={(e) => handleChange("manufacture_Date", e.target.value)}
          id="manufacture_Date"
          className="form-control"
          placeholder="(YYYY-MM-DD)تاریخ تولید محصول را وارد کنید"
          required
          autofocus
        />
        <label for="Expiration_Date" className="sr-only">
          تاریخ انقضا
        </label>
        <input
          data-testid="add-item-Expiration_Date"
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="text"
          value={values.Expiration_Date}
          onChange={(e) => handleChange("Expiration_Date", e.target.value)}
          id="Expiration_Date"
          className="form-control"
          placeholder="(YYYY-MM-DD)تاریخ انقضاء محصول را وارد کنید"
          required
          autofocus
        />
        <label for="count" className="sr-only">
          تعداد محصول
        </label>
        <input
          data-testid="add-item-count"
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="text"
          value={values.count}
          onChange={(e) => handleChange("count", e.target.value)}
          id="count"
          className="form-control"
          placeholder="تعداد محصول را وارد کنید"
          required
          autofocus
        />
        <label for="price" className="sr-only">
          قیمت محصول
        </label>
        <input
        data-testid="add-item-price"
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="text"
          value={values.price}
          onChange={(e) => handleChange("price", e.target.value)}
          id="price"
          className="form-control"
          placeholder="قیمت محصول را وارد کنید(به ریال)"
          required
          autofocus
        />
        <label for="discount" className="sr-only">
          درصد تخفیف محصول
        </label>
        <input
          data-testid="add-item-discount"
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="text"
          value={values.discount}
          onChange={(e) => handleChange("discount", e.target.value)}
          id="discount"
          className="form-control"
          placeholder="درصد تخفیف محصول را وارد کنید"
          required
          autofocus
        />
        <div className="dropdown">
        <label for="category" className="sr-only">
          دسته بندی محصول
        </label>
        <input
          data-testid="add-item-category"
          style={{ textAlign: "right", marginBottom: "10px" }}
          type="text"
          value={values.category}
          
          onFocus={(e) => document.getElementById("category-dropdown").classList.toggle("show")}
          // onBlur ={(e)=>document.getElementById("category-dropdown").classList.toggle("show")}
          id="category"
          className="form-control dropdown-toggle"
          placeholder={values.category}
          required
          autofocus
        />
        <div className="dropdown-menu" id="category-dropdown" style={{right:0}}>
          <button className="dropdown-item" onClick={() => handleChange("category", 'Spices and condiments and food side dishes')}>ادویه، چاشنی و مخلفات غذا</button>
          <button className="dropdown-item" onClick={() => handleChange("category", 'Cosmetics')}>بهداشت و مراقبت پوست</button>
          <button className="dropdown-item" onClick={() => handleChange("category", 'Makeup and trimming')}>آرایش و پیرایش</button>
          <button className="dropdown-item" onClick={() => handleChange("category", 'Protein')}>پروتئینی</button>
          <button className="dropdown-item" onClick={() => handleChange("category", 'Junk Food')}>تنقلات</button>
          <button className="dropdown-item" onClick={() => handleChange("category", 'Nuts')}>خشکبار</button>
          <button className="dropdown-item" onClick={() => handleChange("category", 'Sweets and desserts')}>شیرینیجات و دسرها</button>
          <button className="dropdown-item" onClick={() => handleChange("category", 'perfume')}>عطر، ادکلن و اسپری</button>
          <button className="dropdown-item" onClick={() => handleChange("category", 'Fruits and vegetables')}>غذا، کنسرو و سبزیجات</button>
          <button className="dropdown-item" onClick={() => handleChange("category", 'Dairy')}>لبنیات</button>
          <button className="dropdown-item" onClick={() => handleChange("category", 'Drinks')}>نوشیدنیها</button>
          <button className="dropdown-item" onClick={() => handleChange("category", 'Washing and Cleaning Equipment')}>وسایل شستشو و نظافت</button>
          <button className="dropdown-item" onClick={() => handleChange("category", 'others')}>متفرقه</button>
        </div>
        </div>
        <div class="custom-file" style={{direction: "rtl"}}>
          <input
            type="file"
            onChange={imageInsert}
            class="custom-file-input"
            id="itemInput"
            //required
            />
          <label class="custom-file-label" htmlFor="itemInput">
            {values.src ? "عکس شما انتخاب شده است" : "عکس انتخاب کنید..."}
          </label>
        </div>
        <div className="checkbox mb-3">
        </div>
        <button onClick={(e)=>handleSubmit(e)} className="btn btn-lg btn-primary btn-block" data-testid = "additem-btn">
          ثبت
        </button>
      </form>
    </div>
  );
};

export default AddItem;