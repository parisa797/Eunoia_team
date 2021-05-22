import React, { useState, useEffect } from "react";
import "./Item.css";
import ReactStars from "react-rating-stars-component";
import ShopSideBar from "./ShopSideBar";
function Item(props) {
  // console.log("Token "+localStorage.getItem("token"))
  const [items, setItems] = useState({});
  const [itemInfo, setItemInfo] = useState({})
  const [rated, setRated] = useState(false)
  const [rateID, setRateId] = useState(null)
  var shopID = window.location.pathname.match(/[^\/]+/g)[1];
  var itemID = window.location.pathname.match(/[^\/]+/g)[3];
  // let itemId = window.location.pathname.match.items(/[^\/]+/g)[3]
  // let shopID = window.location.pathname.match(/[^\/]+/g)[1]
  useEffect(() => {
    fetch("http://eunoia-bshop.ir:8000/shops/" + shopID + "/items/" + itemID, {
      method: "GET",
      // headers: {
      //     "Authorization": "Token " + localStorage.getItem('token')
      // }
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((res) => {
        setItems(res);
      });
  }, []);
  useEffect(() => {}, []);
  function ratingChanged(new_rating) {
    let fd = new FormData()
    console.log(rated)
    fd.append("rate", new_rating)
    if (!rated) {
        fd.append("item", itemID)
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/rate/create/", {
            method: 'POST',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
            ,
            body: fd
        }).then(res => {
            if (res.status === 201) {

                return res.json()
            }
            console.log(res.status)
            return null
        }).then(res => {
            if (res) {
                setRateId(res.id)
                setRated(true)
                props.setTriggerReload(!props.triggerReload)
            }

        })
    }
    else {
        fetch("http://eunoia-bshop.ir:8000/api/v1/items/rate/" + rateID, {
            method: 'PUT',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
            ,
            body: fd
        }).then(res => {
            if (res.status === 200) {
                setRated(true)
                props.setTriggerReload(!props.triggerReload)
            }
            console.log(res.status)
        })
    }

}

  console.log(items);
  return (
    <div style={{ padding: "5vh 2vw" }}>
      <ShopSideBar />
      <div className="page-contents" data-testid="item">
        <div className="item-page">
          <div className="sub-container">
            <div className="col-12 d-flex flex-wrap">
              <div className="col-sm-12 col-md-5">
                <img style={{ width: "100%", height: "100%" }} src={items.photo} alt="" />
              </div>
              <div className="lead text-right col-sm-12 col-md-6">
                <h1 className="my-3" data-testid="item-name">{items.name}</h1>
                <hr></hr>
                {!!items.description && (
                  <>
                    <h3 className="text-right mb-3">ویژگی های کالا:</h3>
                    <p className="lead text-right" data-testid="item-description">{items.description}</p>
                  </>
                )}
                <div className="rating-item">
                            <> <p style={{ direction: "ltr" }} data-testid={"item-rate-value"}>امتیاز: {itemInfo.rate_value?Math.round(itemInfo.rate_value * 10) / 10 :0} </p>
                                    {!!itemInfo.rate_value && <ReactStars
                                        edit={props.userState!=="u"}
                                        value={Math.round(itemInfo.rate_value)}
                                        isHalf={false}
                                        classNames="stars"
                                        data-testid="item-rate-stars"
                                        size={25}
                                        onChange={ratingChanged}
                                        activeColor={"var(--primary-color)"}
                                    />}
                                    {!itemInfo.rate_value && <ReactStars
                                        edit={!!localStorage.getItem("token")}
                                        value={0}
                                        isHalf={false}
                                        classNames="stars"
                                        data-testid="shop-rate-stars"
                                        size={25}
                                        onChange={ratingChanged}
                                        activeColor={"var(--primary-color)"}
                                    /> }
                                    <p data-testid={"item-rate-count"}>‌({itemInfo.rate_count})</p>
                                </>
                            </div>
                 {/* <div className="items-stars">
                                    <ReactStars
                                        edit={false}
                                        value={items.rate_value ? items.rate_value : 0}
                                        isHalf={true}
                                        classNames="stars"
                                        size={20}
                                        activeColor={"var(--primary-color)"}
                                    />
                                    <p data-testid={"region-items-rate-count" + items.id}>({items.rate_count})</p>
                                </div> */}
                {!!items.count && (
                  <div className="col-12 d-flex flex-justify-between p-0 my-2">
                    <div className="col-6 p-0 text-right">موجودی:</div>
                    <div className="col-6 p-0 ">{items.count}</div>
                  </div>
                )}
                {!!items.price && (
                  <div className="col-12 d-flex flex-justify-between p-0 my-2">
                    <div className="col-6 p-0 text-right">قیمت:</div>
                    <div className="col-6 p-0 ">{items.price} ریال</div>
                  </div>
                )}
                {!!items.manufacture_jalali && (
                  <div className="col-12 d-flex flex-justify-between p-0 my-2">
                    <div className="col-6 p-0 text-right">تاریخ تولید:</div>
                    <div className="col-6 p-0 " data-testid="item-manufacture_jalali">{items.manufacture_jalali}</div>
                  </div>
                )}
                 {!!items.Expiration_jalali && (
                  <div className="col-12 d-flex flex-justify-between p-0 my-2">
                    <div className="col-6 p-0 text-right">تاریخ انقضا:</div>
                    <div className="col-6 p-0 " data-testid="item-Expiration_jalali">{items.Expiration_jalali}</div>
                  </div>
                )}

              {props.userState !== "m" && <a href="#" className="btn btn-lg btn-primary my-3" >افزودن به سبد خرید</a>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Item;

{
  /* {items.ItemShop && items.ItemShop.phone} */
}