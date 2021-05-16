import { useEffect, useState, useRef } from 'react';
import './Shop.css';
import ShopSideBar from './ShopSideBar';
import ReactStars from "react-rating-stars-component";
import Carousel from 'react-bootstrap/Carousel';
import EditIcon from '@material-ui/icons/Edit';
import ItemCard from './ItemCard';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ShopComments from './ShopComments'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import SearchBar from './SearchBar';
import Itemslist from './ItemsList';


function Shop(props) {
    const [board, setBoard] = useState([{ image: "/special-offer.jpg" }, { image: "/پیشنهاد-ویزه-وجین-Copy.jpg" }])
    const [shopInfo, setShopInfo] = useState({})
    const [allItems, setAllItem] = useState([])
    const [discountedItems, setDiscountedItem] = useState([])
    const [rated, setRated] = useState(false)
    const [rateID, setRateId] = useState(null)
    // const [triggerReload, setTriggerReload] = useState(false)
    let shopID = window.location.pathname.match(/[^\/]+/g)[1]
    let commentsRef = useRef();

    useEffect(() => {
        console.log(props.userState)
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/rate/list/" + shopID, {
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
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/" + shopID, {
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
                // document.title = "فروشگاه "+d.title + " | بی‌شاپ"
                console.log(d)
            });
        fetch("http://eunoia-bshop.ir:8000/shops/" + shopID + "/items/", {
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
            fetch("http://eunoia-bshop.ir:8000/api/v1/shops/rate/" + rateID, {
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

    function scrollToComments(){
        window.scrollTo({
            behavior: "smooth",
            top: commentsRef.current.offsetTop
          });
    }

    return (
        <div className="shop-page">
            <ShopSideBar shopID={shopID} />
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
                            <> <p style={{ direction: "ltr" }} data-testid={"shop-rate-value"}>امتیاز: {shopInfo.rate_value?Math.round(shopInfo.rate_value * 10) / 10 :0} </p>
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
                                <p className="comment-info" onClick={scrollToComments} data-testid={"shop-comment-count"}>نظرات: {shopInfo.comment_count} </p>
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
                                <p> (منطقه {shopInfo.mantaghe}) </p>
                                <a href="/">نمایش در نقشه<LocationOnIcon className="location-icon" /></a>
                            </div>}
                        </div>
                    </div>

                </div>
                <div className="search" >
                <SearchBar thisShop={shopID}  id="shop"/>
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
                {(allItems?.length > 0) && <><h4 className="header"><span className="header-span">همه کالاها</span></h4>
                    {/* <div className="page-contents-item"> */}
                        <Itemslist url={"/store/"+shopID+"/items"} items={allItems} listType="horizontal" online={shopInfo.online} itemHolderClass="col-12 col-sm-6 col-md-4 col-lg-3" id="all-items" userState={props.userState} showDeleteItemModal={props.showDeleteItemModal}/>
                    {/* </div> */}
                    </>}
                {(discountedItems.length > 0) && <> <h4 className="header"><span className="header-span">تخفیف‌دارها</span></h4>
                    <Itemslist url={"/store/"+shopID+"/items/discounted"} items={discountedItems} listType="horizontal" online={shopInfo.online} itemHolderClass="col-12 col-sm-6 col-md-4 col-lg-3" id="discounted-items" userState={props.userState} showDeleteItemModal={props.showDeleteItemModal} />
                    </>}
                {(allItems.length > 0) && <><h4 className="header"><span className="header-span">محبوب‌ترین‌ کالاها</span></h4>
                    <Itemslist url={"/store/"+shopID+"/items"} items={allItems} listType="horizontal" online={shopInfo.online} itemHolderClass="col-12 col-sm-6 col-md-4 col-lg-3" id="loved-items" userState={props.userState} showDeleteItemModal={props.showDeleteItemModal} />
                    </>}
                <h4 className="header" ref={commentsRef}><span className="header-span">نظرات</span></h4>
                <div className="page-contents-item">
                    <ShopComments shopID={shopID} userState={props.userState}/>
                </div>

            </div>
        </div>
    )
}

export default Shop;