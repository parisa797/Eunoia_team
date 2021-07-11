import React, { useState, useEffect } from "react";
import "./Item.css";
import ReactStars from "react-rating-stars-component";
import ShopSideBar from "./ShopSideBar";
import Itemcomment from "./Itemcomment";
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { useSnackbar } from 'notistack';
import { IconButton } from "@material-ui/core";
function Item(props) {
  // console.log("Token "+localStorage.getItem("token"))
  const [items, setItems] = useState({});
  const [rated, setRated] = useState(false)
  const [rateID, setRateId] = useState(null)
  const[triggerReload,setTriggerReload] = useState(false)
  var shopID = window.location.pathname.match(/[^\/]+/g)[1];
  var itemID = window.location.pathname.match(/[^\/]+/g)[3];

  //Item shopping
    const { enqueueSnackbar } = useSnackbar();
    function timeout(delay) {
      return new Promise(res => setTimeout(res, delay));
  }
    const [cartCount,setCartCount] = useState(1)
    const [bought,setBought] = useState(false);
  //End of Item shopping

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
        document.title = res.name + " فروشگاه " + (!!res.ItemShop && res.ItemShop.title) + " | بی‌شاپ"
      });
  }, [triggerReload]);
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
                if (!!res[i].user && res[i].user.user_name === username) {
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
  const [isLikedByUser, setisLikedByUser] = useState(false)
  useEffect(() => {
      fetch(`http://eunoia-bshop.ir:8000/shops/${shopID}/items/${itemID}/likes`,{
          method: 'GET',
          headers: {
              "Authorization": "Token " + localStorage.getItem('token')
          }
      }).then(res => res.json())
      .then(res => {
        const username = localStorage.getItem("username")
        const resp = res[0]?.Liked_By.findIndex(i => i.username === username)
        if(resp > -1) setisLikedByUser(true)
        else setisLikedByUser(false)
      })
  }, [])
  const handleLikeItem = async () => {
      await fetch(`http://eunoia-bshop.ir:8000/shops/${shopID}/items/${itemID}/likes`,{
          method: 'POST',
          headers: {
              "Authorization": "Token " + localStorage.getItem('token')
          }
      })
      fetch(`http://eunoia-bshop.ir:8000/shops/${shopID}/items/${itemID}/likes`,{
        method: 'GET',
        headers: {
            "Authorization": "Token " + localStorage.getItem('token')
        }
    }).then(res => res.json())
    .then(res => {
      const username = localStorage.getItem("username")
      const resp = res[0]?.Liked_By.findIndex(i => i.username === username)
      if(resp > -1) setisLikedByUser(true)
      else setisLikedByUser(false)
    })
  }
  // const handleLikeItem = () => {

  // }
  // const checkIsLikedByUserOrNot = () => {
  //   return true
  // }

  //Adding to cart
  function addToCart(){
    if(!JSON.parse(localStorage.getItem("shoplists"))[shopID]){
        //create shopppinglist
        let fd = new FormData();
        fd.append("shop",shopID)
        fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/create/",{
            method:"POST",
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            },
            body: fd
        }).then(res=>{
            if(res.ok)
                return res.json();
            return {};
        }).then(r=>{
            if(!r)
                return;
            let list = JSON.parse(localStorage.getItem("shoplists"));
            list[r.shop] = r.id;
            localStorage.setItem("shoplists",JSON.stringify(list));
            fd =new FormData();
            fd.append("item",items.id)
            fd.append("number",cartCount)
            fd.append("shopping_list",r.id)
            fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/",{
                method:"POST",
                headers: {
                    "Authorization": "Token " + localStorage.getItem('token')
                },
                body: fd 
            }).then(async res => {
                if (res.ok) {
                    setBought(true);
                    await timeout(3000);
                    setBought(false);
                }
                else if (res.status===400)
                    return res.json()
            }).then(res => {
                    if (res === "sum_price should be smaller than max_cost")
                        enqueueSnackbar("به محدودیت قیمت سبد خرید رسیده‌اید", { variant: "error" })
                    else if (res === "The number of itmes should be less than the total number")
                        enqueueSnackbar("این تعداد از کالا (همراه با تعداد اضافه شده در سبد) در فروشگاه وجود ندارد", { variant: "error" })
                })
                .catch(err => console.error(err))
        })
            .catch(err => console.error(err))
    }else{
        let shopping_id=JSON.parse(localStorage.getItem("shoplists"))[shopID];
        fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/list/"+shopping_id,{
            method:"GET",
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(res=>{
            if(res.ok)
                return res.json();
            return {};
        }).then(r=>{
            let list_id = null;
            let number = null;
            if(!r)
                return;
            r.forEach(element => {
                if(element.item.id === items.id)
                {
                    list_id = element.id;
                    number = element.number
                }
            });
            if(list_id===null){
                let fd = new FormData()
                fd.append("item",items.id)
                fd.append("number",cartCount)
                fd.append("shopping_list",shopping_id)
                fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/",{
                method:"POST",
                headers: {
                    "Authorization": "Token " + localStorage.getItem('token')
                },
                body: fd
            }).then(async res=>{
                if(res.ok)
                    {
                        setBought(true);
                        await timeout(3000);
                        setBought(false);
                    }
                else if (res.status===400)
                    return res.json()
            }).then(res => {
                    if (res === "sum_price should be smaller than max_cost")
                        enqueueSnackbar("به محدودیت قیمت سبد خرید رسیده‌اید", { variant: "error" })
                    else if (res === "The number of itmes should be less than the total number")
                        enqueueSnackbar("این تعداد از کالا (همراه با تعداد اضافه شده در سبد) در فروشگاه وجود ندارد", { variant: "error" })
                })
                .catch(err => console.error(err))
            }
            else{
                let fd = new FormData()
                fd.append("number",cartCount+number)
                fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/"+list_id,{
                method:"PUT",
                headers: {
                    "Authorization": "Token " + localStorage.getItem('token')
                },
                body: fd
            }).then(async res=>{
                if(res.ok)
                    {
                        setBought(true);
                        await timeout(1000);
                        setBought(false);
                    }
                else if (res.status===400)
                    return res.json()
            }).then(res => {
                    if (res === "sum_price should be smaller than max_cost")
                        enqueueSnackbar("به محدودیت قیمت سبد خرید رسیده‌اید", { variant: "error" })
                    else if (res === "The number of itmes should be less than the total number")
                        enqueueSnackbar("این تعداد از کالا (همراه با تعداد اضافه شده در سبد) در فروشگاه وجود ندارد", { variant: "error" })
                })
                .catch(err => console.error(err))
            }
            
        })
        .catch(err=>console.error(err))
    }
}
const changeCartCount = (count)=>{
  if(count<1)
      count=1
  if(items.count<count)
      count = items.count
  setCartCount(count)
}

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
                <p className="shop-comment-date">
                    <IconButton onClick={() => handleLikeItem()} style={{ color: 'red', padding: '0' }}> 
                        {isLikedByUser ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>

                </p>
                <hr></hr>
                {!!items.description && (
                  <>
                    <h3 className="text-right mb-3">ویژگی های کالا:</h3>
                    <p className="lead text-right" data-testid="item-description">{items.description}</p>
                  </>
                )}
                {!!items.brand && (
                  <>
                    <p className="lead text-right" data-testid="item-description">برند {items.brand}</p>
                  </>
                )}
                <div className="rating-item">
                            <> <p style={{ direction: "ltr" }} data-testid={"item-rate-value"}>امتیاز: {items.rate_value?Math.round(items.rate_value * 10) / 10 :0} </p>
                                    {!!items.rate_value && <ReactStars
                                        edit={props.userState==="l"}
                                        value={Math.round(items.rate_value)}
                                        isHalf={false}
                                        classNames="stars"
                                        data-testid="item-rate-stars"
                                        size={25}
                                        onChange={ratingChanged}
                                        activeColor={"var(--primary-color)"}
                                    />}
                                    {!items.rate_value && <ReactStars
                                        edit={props.userState==="l"}
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
                {(!!items.price || !!items.price_with_discount) && (
                  <div className="col-12 d-flex flex-justify-between p-0 my-2">
                    <div className="col-6 p-0 text-right">قیمت:</div>
                    <div className="col-6 p-0 ">{items.price_with_discount?items.price_with_discount:items.price} ریال</div>
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

              {props.userState !== "m" && 
              // <a href="#" className="btn btn-lg btn-primary my-3" >افزودن به سبد خرید</a>
              <>
            <div className="count-div">
                <div className="count-btn btn" onClick={()=>changeCartCount(cartCount+1)}>+</div>
                <input type="text" value={cartCount} onChange={(e)=>changeCartCount(e.target.value)} />
                <div className="count-btn btn" onClick={()=>changeCartCount(cartCount-1)}>-</div>
            </div>
              {!bought?<div className="btn btn-lg cart-btn" onClick={()=>addToCart()} >افزودن به سبد خرید</div>:
                <div className="btn btn-lg cart-btn" >اضافه شد!</div>
                 }</>
              }
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