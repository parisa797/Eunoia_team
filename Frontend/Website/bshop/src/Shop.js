import { useEffect, useState } from 'react';
import './Shop.css';
import ShopSideBar from './ShopSideBar';
import ReactStars from "react-rating-stars-component";
import Carousel from 'react-bootstrap/Carousel';
import EditIcon from '@material-ui/icons/Edit';
import ItemCard from './ItemCard';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SendIcon from '@material-ui/icons/Send';

function Shop(props) {
    const [board, setBoard] = useState([{ image: "/special-offer.jpg" }, { image: "/پیشنهاد-ویزه-وجین-Copy.jpg" }])
    const [shopInfo, setShopInfo] = useState({})
    const [allItems, setAllItem] = useState([])
    const [discountedItems, setDiscountedItem] = useState([])
    const [rated, setRated] = useState(false)
    const [rateID, setRateId] = useState(null)
    const [comments, setComments] = useState([{ title: "شلوغ!", user: { user_name: "KhaRidAr" }, date: "20 فروردین 1400", text: "خیلی شلوغ بود\n حتی سبد خرید هم پیدا نمیشد:|" }, { title: "شلوغ!", user: { user_name: "اسمم خریداره", }, date: "23 اسفند 1399", text: "کارمندان بسیار خوشرو بودند." }, { title: "شلوغ!", user: { user_name: "یک خریدار دیگر" }, date: "1 اردیبهشت 1400", text: "هر چی میخواستم داشت:)" }])
    // const [triggerReload, setTriggerReload] = useState(false)
    let shopID = window.location.pathname.match(/[^\/]+/g)[1]

    useEffect(() => {
        console.log(props.userState)
        fetch("http://127.0.0.1:8000/api/v1/shops/rate/list/" + shopID, {
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

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/v1/shops/" + shopID, {
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
            .then((d) => {
                setShopInfo(d);
                console.log(d)
            });
        fetch("http://127.0.0.1:8000/shops/" + shopID + "/items/", {
            method: 'GET'
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }
        }).then((res) => {
            console.log(res)
            setAllItem(res)
            setDiscountedItem(res.filter(r => !!r.discount && r.discount > 0))
        })

    }, [props.triggerReload])

    function ratingChanged(new_rating) {
        let fd = new FormData()
        console.log(rated)
        fd.append("rate", new_rating)
        if (!rated) {
            fd.append("shop", shopID)
            fetch("http://127.0.0.1:8000/api/v1/shops/rate/create/", {
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
            fetch("http://127.0.0.1:8000/api/v1/shops/rate/" + rateID, {
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

    const SearchDropDownToggle = () => {
        document.getElementById("shop-search-dropdown").classList.toggle("show");
    }

    return (
        <div className="shop-page">
            <ShopSideBar />
            <div className="page-contents">
                <div className="page-contents-item">
                    <div className="shop-profile">
                        <div className="shop-info">
                            <div className="logo-container-2">
                                <div className="logo-container">
                                    <img className="shop-logo" data-testid="shop-logo" src={shopInfo.logo ? shopInfo.logo : "/shop-default-logo.png"} alt="logo" />
                                </div>
                            </div>
                            <div className="title-buttons">
                                <h3 data-testid={"shop-title"}>{shopInfo.title}</h3>
                                {props.userState === "m" && <div className="edit-info" data-testid={"shop-edit-buttons"}><div className="btn" onClick={() => window.location.href += "/edit-info"}>ویرایش اطلاعات<EditIcon /></div>
                                    <div className="btn" onClick={() => window.location.href += "/AddItem"}>کالای جدید<AddIcon /></div></div>}
                            </div>
                            <div className="rating-comment">
                                 <><p style={{ direction: "ltr" }} data-testid={"shop-rate-value"}>امتیاز: {Math.round(shopInfo.rate_value * 10) / 10}  </p>
                                    {!!shopInfo.rate_value && <ReactStars
                                        edit={props.userState!=="u"}
                                        value={Math.round(shopInfo.rate_value)}
                                        isHalf={false}
                                        classNames="stars"
                                        data-testid="shop-rate-stars"
                                        size={25}
                                        onChange={ratingChanged}
                                        activeColor={"var(--primary-color)"}
                                    />}
                                    {!shopInfo.rate_value && <ReactStars
                                        edit={!!localStorage.getItem("token")}
                                        value={0}
                                        isHalf={false}
                                        classNames="stars"
                                        data-testid="shop-rate-stars"
                                        size={25}
                                        onChange={ratingChanged}
                                        activeColor={"var(--primary-color)"}
                                    />}
                                    <p data-testid={"shop-rate-count"}>‌({shopInfo.rate_count})</p>
                                </>
                                <p className="comment-info" data-testid={"shop-comment-count"}>نظرات: {shopInfo.comment_count} </p>
                            </div>
                            <div className="options">
                                {shopInfo.online ? <p style={{ color: "green" }} data-testid={"shop-online"}>امکان خرید آنلاین دارد</p> : <p style={{ color: "red" }}>امکان خرید آنلاین ندارد</p>}
                            </div>
                        </div>
                        <div className="shop-more-info">
                            {shopInfo.shop_phone && <div className="phone">
                                <p >تلفن:</p>
                                <p data-testid="shop-phone">{shopInfo.shop_phone}</p>
                            </div>}
                            {shopInfo.address && <div className="address">
                                <p data-testid="shop-address">{shopInfo.address}</p>
                                <a href="/">نمایش در نقشه</a>
                            </div>}
                        </div>
                    </div>

                </div>
                <div className="searchbar" >
                    <form inline="true" className="input-group input-group-lg">
                        <div className="dropdown">
                            <button className="btn dropdown-toggle input-group-btn" data-testid="shop-filterby-button" onClick={(e) => { e.preventDefault(); SearchDropDownToggle() }}>
                                فیلتر براساس
  </button>
                            <div className="dropdown-menu" id="shop-search-dropdown" data-testid="shop-dropdown-menu">
                                <a className="dropdown-item" href="#">جدیدترین‌ها</a>
                                <a className="dropdown-item" href="#">ارزان‌ترین‌ها</a>
                                <a className="dropdown-item" href="#">محبوب‌ترین‌ها</a>
                            </div>
                        </div>
                        <input type="text" className="form-control input-lg" placeholder="جستجو در این فروشگاه" />
                        <div className="btn search-btn input-group-btn" type="submit"><SearchIcon /></div>

                    </form>
                </div>
                <div className="page-contents-item">
                    <Carousel interval={null} className="carousel">
                        {board.map((item, i) => {
                            if (item)
                                return (<Carousel.Item key={i} className="board-item">
                                    <div className="img-container">
                                        <img src={item.image} alt="board item" />
                                    </div>
                                    <Carousel.Caption>
                                        <h5>{item.title}</h5>
                                        <p>{item.description}</p>
                                    </Carousel.Caption>
                                </Carousel.Item>)
                        })}
                    </Carousel>
                    {props.userState === "m" && <a className="edit-board" href="">{!!board && board.length === 0 ? "بورد شما خالی است. ساخت بورد" : "ویرایش بورد"}</a>}
                </div>
                {(allItems.length > 0) && <><h4 className="header"><span className="header-span">همه کالاها</span></h4>
                    <div className="page-contents-item">
                        <div className="horizontal-list ">
                            {allItems.map((item, i) => {
                                if (item)
                                    return (
                                        <div key={"all-items" + i} data-testid={"shop-all-items-" + i} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                            <ItemCard item={item} id={"all-items-"+item.id} onlineShop={shopInfo.online}  showDeleteItemModal={props.showDeleteItemModal} userState={props.userState}/>
                                        </div>
                                    )
                            })}
                            <div className="see-more" >
                                <a href={"/store/" + shopID + "/itemslist"}>
                                    موارد بیشتر
                            <ChevronLeftIcon />
                                </a>
                            </div>
                        </div>
                    </div></>}
                {(discountedItems.length > 0) && <> <h4 className="header"><span className="header-span">تخفیف‌دارها</span></h4>
                    <div className="page-contents-item">
                        <div className="horizontal-list ">
                            {discountedItems.map((item, i) => {
                                if (item)
                                    return (
                                        <div key={"discount-items" + i} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                            <ItemCard item={item} id={"discount-items-"+item.id} onlineShop={shopInfo.online}  showDeleteItemModal={props.showDeleteItemModal} userState={props.userState}/>
                                        </div>
                                    )
                            })}
                            <div className="see-more" >
                                <a href="/">
                                    موارد بیشتر
                            <ChevronLeftIcon />
                                </a>
                            </div>
                        </div>
                    </div></>}
                {(allItems.length > 0) && <><h4 className="header"><span className="header-span">محبوب‌ترین‌ کالاها</span></h4>
                    <div className="page-contents-item">
                        <div className="horizontal-list ">
                            {allItems.map((item, i) => {
                                if (item)
                                    return (
                                        <div key={"popular-items" + i} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                            <ItemCard item={item} id={"loved-items-"+item.id} onlineShop={shopInfo.online} showDeleteItemModal={props.showDeleteItemModal} userState={props.userState} />
                                        </div>
                                    )
                            })}
                            <div className="see-more" >
                                <a href={"/store/" + shopID + "/itemslist"}>
                                    موارد بیشتر
                            <ChevronLeftIcon />
                                </a>
                            </div>
                        </div>
                    </div></>}
                <h4 className="header"><span className="header-span">نظرات</span></h4>
                <div className="page-contents-item">
                    <div className="shop-comments">
                        {comments.map(comment => {
                            if (comment) return (
                                <div className="shop-comment">
                                    {/* <h3 className="shop-comment-title">{comment.title}</h3> */}
                                    <div style={{ display: "inline-flex", borderBottom: "1px solid var(--bg-color3)" }}>
                                        <p className="shop-comment-author">{comment.user.user_name}</p>
                                        <p className="shop-comment-date">{comment.date}</p>
                                    </div>
                                    <p className="shop-comment-desc">{comment.text}</p>
                                </div>
                            )
                        })}
                        {(props.userState !== "u") && <div className="shop-comment write-comment">
                            <SendIcon />
                            <textarea type="text" placeholder="نظر خود را بنویسید..." style={{ border: "none", height: "calc(20vh - 20px)" }}></textarea>
                        </div>}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Shop;