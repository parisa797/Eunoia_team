import './HomePage.css';
import { useEffect, useState } from 'react';
import ReactStars from "react-rating-stars-component";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';

function ShopList(props) {
    const [shops, setShops] = useState([]);
    const [myshops, setMyShops] = useState([]);
    useEffect(() => {
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/user/", {
            method: 'GET',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    console.log("my shops is 200")
                    console.log("my role is "+localStorage.getItem("role"))
                    return res.json()
                }
                return [];
            }
            )
            .then((d) => {
                console.log("my shops are")
                console.log(d)
                setMyShops(d);
            });
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/", {
            method: 'GET',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    return res.json()
                }
                return [];
            }
            )
            .then((d) => {
                console.log(d)
                if (d)
                    setShops(d.slice(0, 15));
            });
    }, [])

    return (<div className="all-shops-list-container">
        {!!myshops && myshops.length>0 && <>
            <h3>فروشگاه های شما</h3>
            <div className=" container-fluid row your-shops" data-testid="myshops" style={{ width: "100%", direction: "rtl"/*, position: "absolute", top: "200px", left: "0px"*/, zIndex: "1", margin: "0 0 5vh 0" }}  >
                {myshops?.map((shop) => {
                    if (shop) return (
                        <div className="shop-outer-container col-12 col-sm-6 col-md-4 col-xl-3" key={shop.id} data-testid={"myshop-" + shop.id}>
                            <div className="shop-container" onClick={() => window.location.href = "/store/" + shop.id}>
                                <div className="shop-upper">
                                    <div className="img-outer-container"><div className="img-container"><img data-testid={"myshop-img-" + shop.id} src={shop?.logo?shop.logo : "/shop-default-logo.png"} alt={shop.title} /></div></div>
                                    {/* <div style={{ display: "flex", flexDirection: "column" }}> */}
                                    {/* <div style={{ margin: "auto 0" }}> */}
                                    <h4 data-testid={"myshop-title-" + shop.id} >{shop.title}</h4>
                                    <div className="shop-stars">
                                        <ReactStars
                                            edit={false}
                                            value={shop.rate_value ? shop.rate_value : 0}
                                            isHalf={true}
                                            classNames="stars"
                                            size={20}
                                            activeColor={"var(--primary-color)"}
                                        />
                                        <p data-testid={"myshop-rate-count" + shop.id}>({shop.rate_count})</p>
                                    </div>
                                    {/* </div> */}
                                    {/* </div> */}

                                </div>
                                <div className="shop-lower">
                                    <p data-testid={"myshop-address-" + shop.id}>{shop.address}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
        }
        <h3>فروشگاه های برگزیده</h3>
        <div className=" container-fluid row" data-testid="shops" style={{ width: "100%", direction: "rtl"/*, position: "absolute", top: "200px", left: "0px"*/, zIndex: "1", margin: "0" }}  >
            {shops?.map((shop) => {
                if (shop) return (
                    <div className="shop-outer-container col-12 col-sm-6 col-md-4 col-xl-3" key={shop.id} data-testid={"shop-" + shop.id}>
                        <div className="shop-container" onClick={() => window.location.href = "/store/" + shop.id}>
                            <div className="shop-upper">
                                <div className="img-outer-container"><div className="img-container"><img data-testid={"shop-img-" + shop.id} src={shop?.logo?shop.logo : "/shop-default-logo.png"} alt={shop.title} /></div></div>
                                {/* <div style={{ display: "flex", flexDirection: "column" }}> */}
                                {/* <div style={{ margin: "auto 0" }}> */}
                                <h4 data-testid={"shop-title-" + shop.id} >{shop.title}</h4>
                                <div className="shop-stars">
                                    <ReactStars
                                        edit={false}
                                        value={shop.rate_value ? shop.rate_value : 0}
                                        isHalf={true}
                                        classNames="stars"
                                        size={20}
                                        activeColor={"var(--primary-color)"}
                                    />
                                    <p data-testid={"shop-rate-count" + shop.id}>({shop.rate_count})</p>
                                </div>
                                {/* </div> */}
                                {/* </div> */}

                            </div>
                            <div className="shop-lower">
                                <p data-testid={"shop-address-" + shop.id}>{shop.address}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
        <h3>4 فروشگاه های منطقه</h3>
        <div className=" container-fluid row" data-testid="region-shops" style={{ width: "100%", direction: "rtl"/*, position: "absolute", top: "200px", left: "0px"*/, zIndex: "1", margin: "0" }}  >
            {shops?.map((shop) => {
                if (shop) return (
                    <div className="shop-outer-container col-12 col-sm-6 col-md-4 col-xl-3" key={shop.id} data-testid={"region-shop-" + shop.id}>
                        <div className="shop-container" onClick={() => window.location.href = "/store/" + shop.id}>
                            <div className="shop-upper">
                                <div className="img-outer-container"><div className="img-container"><img data-testid={"region-shop-img-" + shop.id} src={shop?.logo?shop.logo : "/shop-default-logo.png"} alt={shop.title} /></div></div>
                                {/* <div style={{ display: "flex", flexDirection: "column" }}> */}
                                {/* <div style={{ margin: "auto 0" }}> */}
                                <h4 data-testid={"region-shop-title-" + shop.id} >{shop.title}</h4>
                                <div className="shop-stars">
                                    <ReactStars
                                        edit={false}
                                        value={shop.rate_value ? shop.rate_value : 0}
                                        isHalf={true}
                                        classNames="stars"
                                        size={20}
                                        activeColor={"var(--primary-color)"}
                                    />
                                    <p data-testid={"region-shop-rate-count" + shop.id}>({shop.rate_count})</p>
                                </div>
                                {/* </div> */}
                                {/* </div> */}

                            </div>
                            <div className="shop-lower">
                                <p data-testid={"region-shop-address-" + shop.id}>{shop.address}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>)
}

export default ShopList;