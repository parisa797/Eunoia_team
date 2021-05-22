
import { useEffect, useState } from "react";
import "./ItemsList.css";
import ItemCard from "./ItemCard";
import ShopSideBar from "./ShopSideBar";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

function Itemslist(props) {
    const [items, setItems] = useState([]);
    const [shopInfo, setShopInfo] = useState({});
    let shopID = window.location.pathname.match(/[^\/]+/g)[1]
    useEffect(() => {
        fetch("http://eunoia-bshop.ir:8000/shops/" + shopID + "/items/", {
            method: "GET",
        }).then((res) => {
            if (res.status === 200) {
                return res.json();
            }
        }).then(res => {
            setItems(res);
        })
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
            });
    }, [props.triggerReload])

    return (
        <div style={{ direction: "rtl", padding: "5vh 5vw", fontFamily:"Vazir" }}>
            <ShopSideBar />
            <div className="page-contents" style={{ position: "relative" }}>
                <div className="Items_list-header">
                    <h1>فروشگاه {shopInfo.title}</h1>
                    <a href={"/store/" + shopID}>بازگشت به فروشگاه<ArrowBackIosIcon /></a>
                </div>
                <div className="Items_list container-fluid row your-shops" data-testid="myitems" style={{ width: "100%", zIndex: "0", margin: "0 0 20vh 0", padding: "10" }}  >
                    {items.map((item) => {
                        if (!!item) return (
                            <div /*class="card col-12 col-sm-6 col-md-4 col-lg-3"*/ className="col-12 col-sm-6 col-md-4 col-lg-3" style={{ padding: "5px" }}>
                                <ItemCard item={item} id={props.id} onlineShop={shopInfo.online} showDeleteItemModal={props.showDeleteItemModal} userState={props.userState}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
export default Itemslist;