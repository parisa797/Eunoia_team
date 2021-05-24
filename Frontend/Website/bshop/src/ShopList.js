import './HomePage.css';
import { useEffect, useState } from 'react';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import ShopCard from './ShopCard';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

function ShopList(props) {
    const [shops, setShops] = useState([]);
    const [myshops, setMyShops] = useState([]);
    const [regionalShops, setRegionalShops] = useState([]);
    const [region,setRegion] = useState(12);
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
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/top/", {
            method: 'GET',
            /*headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }*/
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
                    setShops(d.slice(0, 10));
            });
    }, [])

    useEffect(()=>{
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/region/?q="+region, {
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
                    setRegionalShops(d.slice(0, 10));
            });
    },[region])

    function changeRegion(e){
        let val = e.target.value;
        // if(val.match(/^\d+$/) !== null && val>0 && val<23){
            setRegion(val)
        // }
    }

    return (<div className="all-shops-list-container">
        {!!myshops && myshops.length>0 && <>
            <h3>فروشگاه های شما</h3>
            <div className=" container-fluid row your-shops" data-testid="myshops" style={{ width: "100%", direction: "rtl"/*, position: "absolute", top: "200px", left: "0px"*/, zIndex: "1", margin: "0 0 5vh 0" }}  >
                {myshops?.map((shop) => {
                    if (shop) return (
                        <div className="shop-outer-container col-12 col-sm-6 col-md-4 col-xl-3" key={shop.id} data-testid={"myshop-" + shop.id}>
                            <ShopCard id={"my"} shop={shop} />
                        </div>
                    )
                })}
            </div>
        </>
        }
        <h3><a className="header-list-link" href="/stores/top"><ChevronLeftIcon />موارد بیشتر</a>فروشگاه های برگزیده</h3>
        <div className=" container-fluid row" data-testid="shops" style={{ width: "100%", direction: "rtl"/*, position: "absolute", top: "200px", left: "0px"*/, zIndex: "1", margin: "0" }}  >
            {shops?.map((shop) => {
                if (shop) return (
                    <div className="shop-outer-container col-12 col-sm-6 col-md-4 col-xl-3" key={shop.id} data-testid={"shop-" + shop.id}>
                        <ShopCard id="" shop={shop} />
                    </div>
                )
            })}
        </div>
        <h3><a className="header-list-link" href={"/stores/region?="+region}><ChevronLeftIcon />موارد بیشتر</a><input value={region} onChange={changeRegion} style={{width:"3rem", color:"var(--primary-color)"}} /> فروشگاه های منطقه </h3>
        <div className=" container-fluid row" data-testid="region-shops" style={{ width: "100%", direction: "rtl"/*, position: "absolute", top: "200px", left: "0px"*/, zIndex: "1", margin: "0" }}  >
            {!regionalShops || regionalShops.length===0?
            <p style={{margin:"2vh auto"}}>نتیجه‌ای وجود ندارد!</p>
            :
            regionalShops?.map((shop) => {
                if (shop) return (
                    <div className="shop-outer-container col-12 col-sm-6 col-md-4 col-xl-3" key={shop.id} data-testid={"region-shop-" + shop.id}>
                        <ShopCard id="regional" shop={shop} />
                    </div>
                )
            })}
        </div>
    </div>)
}

export default ShopList;