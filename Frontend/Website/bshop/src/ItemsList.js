
// import { useEffect ,useState } from "react";
// import "./ItemsList.css";

// function Itemslist(props){
//     const [items,setItems] = useState([]);
//     useEffect(()=>{
//         fetch("http://127.0.0.1:8000/shops/1/items/",{
//         method: "GET",
//         headers: {
//             "Authorization" : "Token " + localStorage.getItem("token")
//         }
//         }).then((res)=>{
//             if(res.status === 200){
//                 return res.json();
//             }
//         }).then(res =>{
//             res=[{name:"پنیر", description:"پنیر خیلی خوبه برا بدن مفیده ولی نه زیادیش.", manufacture_Date:"2000-02-01",Expiration_Date:"2000-03-01",count:3, price:2000 , photo:"https://media.mehrnews.com/d/2020/06/05/3/3468748.jpg"}
//         ,{name:"کره", description:"کرههههههههه خیلی خوبه برا بدن مفیده ولی نه زیادیش.", manufacture_Date:"2000-01-01",Expiration_Date:"2000-03-01",count:3 ,price:2000, photo:"https://cdn.tezolmarket.com/media/products/large/1361405_191.jpg"},
//         {name:"شییییر دامداران", description:"شیر دامداران بهترین است. حرف ندارد", manufacture_Date:"2000-02-01",Expiration_Date:"2000-03-01",count:3 ,price:2000, photo:"https://rahak.com/wp-content/uploads/2018/12/%D8%B4%DB%8C%D8%B1-%DA%A9%D8%A7%D9%85%D9%84-%D8%AF%D8%A7%D9%85%D8%AF%D8%A7%D8%B1%D8%A7%D9%86.jpg"},
//         {name:"پنیر", description:"پنیر خیلی خوبه برا بدن مفیده ولی نه زیادیش.", manufacture_Date:"2000-02-01",Expiration_Date:"2000-03-01",count:3 ,price:2000, photo:"https://media.mehrnews.com/d/2020/06/05/3/3468748.jpg"}
//         ,{name:"کره", description:"کرههههههههه خیلی خوبه برا بدن مفیده ولی نه زیادیش.", manufacture_Date:"2000-01-01",Expiration_Date:"2000-03-01",count:3 ,price:2000, photo:"https://cdn.tezolmarket.com/media/products/large/1361405_191.jpg"},
//         {name:"شییییر دامداران", description:"شیر دامداران بهترین است. حرف ندارد", manufacture_Date:"2000-02-01",Expiration_Date:"2000-03-01",count:3 ,price:2000, photo:"https://rahak.com/wp-content/uploads/2018/12/%D8%B4%DB%8C%D8%B1-%DA%A9%D8%A7%D9%85%D9%84-%D8%AF%D8%A7%D9%85%D8%AF%D8%A7%D8%B1%D8%A7%D9%86.jpg"},
//         {name:"پنیر", description:"پنیر خیلی خوبه برا بدن مفیده ولی نه زیادیش.", manufacture_Date:"2000-02-01",Expiration_Date:"2000-03-01",count:3, price:2000 , photo:"https://media.mehrnews.com/d/2020/06/05/3/3468748.jpg"}
//         ,{name:"کره", description:"کرههههههههه خیلی خوبه برا بدن مفیده ولی نه زیادیش.", manufacture_Date:"2000-01-01",Expiration_Date:"2000-03-01",count:3 ,price:2000, photo:"https://cdn.tezolmarket.com/media/products/large/1361405_191.jpg"},
//         {name:"شییییر دامداران", description:"شیر دامداران بهترین است. حرف ندارد", manufacture_Date:"2000-02-01",Expiration_Date:"2000-03-01",count:3 ,price:2000, photo:"https://rahak.com/wp-content/uploads/2018/12/%D8%B4%DB%8C%D8%B1-%DA%A9%D8%A7%D9%85%D9%84-%D8%AF%D8%A7%D9%85%D8%AF%D8%A7%D8%B1%D8%A7%D9%86.jpg"},
//         {name:"پنیر", description:"پنیر خیلی خوبه برا بدن مفیده ولی نه زیادیش.", manufacture_Date:"2000-02-01",Expiration_Date:"2000-03-01",count:3, price:2000 , photo:"https://media.mehrnews.com/d/2020/06/05/3/3468748.jpg"}
//         ,{name:"کره", description:"کرههههههههه خیلی خوبه برا بدن مفیده ولی نه زیادیش.", manufacture_Date:"2000-01-01",Expiration_Date:"2000-03-01",count:3 ,price:2000, photo:"https://cdn.tezolmarket.com/media/products/large/1361405_191.jpg"},
//         {name:"شییییر دامداران", description:"شیر دامداران بهترین است. حرف ندارد", manufacture_Date:"2000-02-01",Expiration_Date:"2000-03-01",count:3 ,price:2000, photo:"https://rahak.com/wp-content/uploads/2018/12/%D8%B4%DB%8C%D8%B1-%DA%A9%D8%A7%D9%85%D9%84-%D8%AF%D8%A7%D9%85%D8%AF%D8%A7%D8%B1%D8%A7%D9%86.jpg"},
//     ]
//             setItems(res);
//         })
//     },[])

//     return(
//        // <div className="Items_list">
//         <div className="Items_list container-fluid justify-content-center row your-shops" data-testid="myitems" style={{ width: "100%", zIndex: "0", margin: "0 0 20vh 0", padding: "10" }}  >    
//         {items.map((item)=>{
//             if(!!item) return(
//                // <div className="item-outer-container col-12 col-sm-6 col-md-4 col-xl-3" key={item.name} data-testid={"firstItem" + item.name}>
//                 <div class="card col-12 col-sm-6 col-md-4 col-lg-3">
//                 <div class="card-body">
//                 <h5 class="btn btn-primary" style={{backgroundColor :"var(--secondary-color)",width: "100%" }}>{item.name} </h5>

//                 {item.photo && /*<div className="container-fluid justify-content-center row your-shops">*/<img data-testid={"myitemس-img-"} src={item.photo} />/*</div>*/}
//                 <p class="card-text">موجودی  :{item.count} عدد </p>
//                 <p class="card-text"> قیمت: {item.price} تومان </p>
//                 {/* <p class="card-text">  توضیحات</p>
//                 <p class = "card_description">{item.description}</p> */}

//                 <a href="#" class="btn btn-primary" style={{backgroundColor :"var(--primary-color)" }} >مشاهده محصول</a>
//                 </div>
//                 </div>
//             )
//             })}
//         </div>
//     )
// }
// export default Itemslist;


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
        fetch("http://127.0.0.1:8000/shops/" + shopID + "/items/", {
            method: "GET",
        }).then((res) => {
            if (res.status === 200) {
                return res.json();
            }
        }).then(res => {
            setItems(res);
        })
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
            });
    }, [props.triggerReload])

    return (
        <div style={{ direction: "rtl", padding: "5vh 5vw" }}>
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
                                {/* <div class="card-body">
                <h5 class="btn btn-primary" style={{backgroundColor :"var(--secondary-color)",width: "100%" }}>{item.name} </h5>
                {item.photo && <img data-testid={"myitem-img-"} src={item.photo} />}
                <p class="card-text">موجودی  :{item.count} عدد </p>
                <p class="card-text"> قیمت: {item.price} تومان </p>
                <a href="#" class="btn btn-primary" style={{backgroundColor :"var(--primary-color)" }} >مشاهده محصول</a>
                </div> */}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
export default Itemslist;