import React, { useState, useEffect } from "react";
import "./Item.css";
import ReactStars from "react-rating-stars-component";
import ShopSideBar from "./ShopSideBar";
import Itemcomment from "./Itemcomment";
function Item(props) {
  // console.log("Token "+localStorage.getItem("token"))
  const [items, setItems] = useState({});
  const [rated, setRated] = useState(false)
  const [rateID, setRateId] = useState(null)
  const[triggerReload,setTriggerReload] = useState(false)
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
  useEffect(() => {
    console.log(props.userState)
    fetch("http://eunoia-bshop.ir:8000/shops/"+shopID+"/items/"+itemID+"/rates/" , {
        method: 'GET',
        headers: {
            "Authorization": "Token " + localStorage.getItem('token')
        }
    })
        .then((res) => {
            if (res.status === 200) {
                return res.json()
            }
        }
        ).then((res) => {
            console.log("in list rate")
            console.log(res)
            let username = localStorage.getItem("username")
            for (let i in res) {
                if (res[i].user.user_name === username) {
                    setRated(true)
                    setRateId(res[i].id)
                }
            }
        })
    // })
}, [])

  useEffect(() => {}, []);
  function ratingChanged(new_rating) {
    let fd = new FormData()
    console.log(rated)
    fd.append("rate", new_rating)
    if (!rated) {
        fd.append("item", itemID)
        fetch("http://eunoia-bshop.ir:8000/shops/"+shopID+"/items/"+itemID+"/rates/", {
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
                setTriggerReload(!triggerReload)
            }

        })
    }
    else {
        fetch("http://eunoia-bshop.ir:8000/shops/"+shopID+"/items/"+itemID+"/rates/" + rateID, {
            method: 'PUT',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
            ,
            body: fd
        }).then(res => {
            if (res.status === 200) {
                setRated(true)
                setTriggerReload(!triggerReload)
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
              <div className="col-sm-12 col-md-5 imageWrapper">
              
                <img className=" image " src={items.photo} alt="" />
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
                            <> <p style={{ direction: "ltr" }} data-testid={"item-rate-value"}>امتیاز: {items.rate_value?Math.round(items.rate_value * 10) / 10 :0} </p>
                                    {!!items.rate_value && <ReactStars
                                        edit={props.userState!=="u"}
                                        value={Math.round(items.rate_value)}
                                        isHalf={false}
                                        classNames="stars"
                                        data-testid="item-rate-stars"
                                        size={25}
                                        onChange={ratingChanged}
                                        activeColor={"var(--primary-color)"}
                                    />}
                                    {!items.rate_value && <ReactStars
                                        edit={!!localStorage.getItem("token")}
                                        value={0}
                                        isHalf={false}
                                        classNames="stars"
                                        data-testid="shop-rate-stars"
                                        size={25}
                                        onChange={ratingChanged}
                                        activeColor={"var(--primary-color)"}
                                    /> }
                                    <p data-testid={"item-rate-count"}>‌({items.rate_count})</p>
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
              <div className="col-12 item-comment-container" >
                <Itemcomment userState={props.userState} />
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