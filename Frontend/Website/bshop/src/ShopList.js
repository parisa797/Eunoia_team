import './HomePage.css';
import { useEffect, useState } from 'react';
import ReactStars from "react-rating-stars-component";

function ShopList(props) {
    const [shops, setShops] = useState([]);
    const [myshops, setMyShops] = useState([]);
    useEffect(() => {

        if (localStorage.getItem("role") === "seller") {
            fetch("http://127.0.0.1:8000/api/v1/shops/user/", {
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
                    setMyShops(d);
                });
        }
        fetch("http://127.0.0.1:8000/api/v1/shops/", {
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
                setShops(d.slice(0, 15));
            });
    }, [])

    return (<div className="all-shops-list-container">
        {(localStorage.getItem("role") === "seller") && <>
            <h3>فروشگاه های شما</h3>
            <div className=" container-fluid justify-content-center row your-shops" data-testid="myshops" style={{ width: "100%"/*, position: "absolute", top: "200px", left: "0px"*/, zIndex: "1", margin: "0 0 10vh 0" }}  >
                {myshops?.map((shop) => {
                    if (shop) return (
                        <div className="shop-outer-container col-12 col-sm-6 col-md-4 col-xl-3" key={shop.id} data-testid={"myshop-" + shop.id}>
                            <div className="shop-container" onClick={() => console.log("clicked" + shop.title)}>
                                <div className="shop-upper">
                                    {shop.logo && <div className="img-outer-container"><div className="img-container"><img data-testid={"myshop-img-" + shop.id} src={shop.logo} alt={shop.title} /></div></div>}
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{ margin: "auto 0" }}>
                                            <h4 data-testid={"myshop-title-" + shop.id} >{shop.title}</h4>
                                            <ReactStars
                                                edit={false}
                                                value={2.5}
                                                isHalf={true}
                                                classNames="stars"
                                                size={20}
                                            />
                                        </div>
                                    </div>
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
        <div className=" container-fluid justify-content-center row" data-testid="shops" style={{ width: "100%"/*, position: "absolute", top: "200px", left: "0px"*/, zIndex: "1", margin: "0" }}  >
            {shops?.map((shop) => {
                if (shop) return (
                    <div className="shop-outer-container col-12 col-sm-6 col-md-4 col-xl-3" key={shop.id} data-testid={"shop-" + shop.id}>
                        <div className="shop-container" onClick={() => console.log("clicked" + shop.title)}>
                            <div className="shop-upper">
                                {shop.logo && <div className="img-outer-container"><div className="img-container"><img data-testid={"shop-img-" + shop.id} src={shop.logo} alt={shop.title} /></div></div>}
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <div style={{ margin: "auto 0" }}>
                                        <h4 data-testid={"myshop-title-" + shop.id}>{shop.title}</h4>
                                        <ReactStars
                                            size={20}
                                            edit={false}
                                            value={2.5}
                                            isHalf={true}
                                            classNames="stars"

                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="shop-lower">
                                <p data-testid={"myshop-address-" + shop.id}>{shop.address}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>)
}

export default ShopList;