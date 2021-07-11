import { useEffect, useState } from "react";
import ShopCard from "./ShopCard";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Itemslist from "./ItemsList";
import './ItemsList.css';
import './Search.css';
import ShopSideBar from './ShopSideBar';

function ItemsListPage(props) {
    const [shopID, setShopID] = useState("");
    const [filter, setFilter] = useState("");
    const [category, setCategory] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shopInfo, setShopInfo] = useState(null);

    const categories = {
        'Spices and condiments and food side dishes': 'ادویه، چاشنی و مخلفات غذا',
        'Cosmetics': 'بهداشت و مراقبت پوست',
        'Makeup and trimming': 'آرایش و پیرایش',
        'Protein': 'پروتئینی',
        'Junk Food': "تنقلات",
        'Nuts': 'خشکبار',
        'Sweets and desserts': 'شیرینیجات و دسرها',
        'perfume': 'عطر، ادکلن و اسپری',
        'Fruits and vegetables': 'غذا، کنسرو و سبزیجات',
        'Dairy': 'لبنیات',
        'Drinks': 'نوشیدنیها',
        'Washing and Cleaning Equipment': 'وسایل شستشو و نظافت',
        'others': 'متفرقه'
    }

    useEffect(() => {
        //parsing url
        let shop = null, q = null, f = null,c= null ,url = "";
        c = decodeURI(window.location.href.match(/[^\=]+/g)[1]);
        if(c==="undefined")
            c= null;
        setCategory(c);

        if (window.location.pathname.includes("store")) {
            shop = decodeURI(window.location.pathname.match(/[^\/]+/g)[1]);
            f = decodeURI(window.location.pathname.match(/[^\/]+/g)[4]);
            if(f.includes("category"))
                f=null;
            setFilter(f);
            setShopID(shop);
            url = "http://eunoia-bshop.ir:8000/shops/"
        }
        else
        {
            f = decodeURI(window.location.pathname.match(/[^\/]+/g)[1]);
            if(f.includes("category"))
                f=null;
            setFilter(f);
        }
        if(f==="undefined"){
            f=null;
        }
        if((!f) && !c && !shop)
        {
            f = "newest"
            setFilter(f);
        }
        url = "http://eunoia-bshop.ir:8000/"
        
        url = url + "items/"
        if(c){
            url = url + "category/"
        }
        let ffa = "";
        if(f){
            switch(f){
                case "discounted": url = url + "discount/"
                ffa = "تخفیف‌دارهای "
                break;
                case "newest" : url = url + "new/"
                ffa = "جدیدترین‌های "
                break;
                case "mostexpensive" : url = url + "expensive/"
                ffa = "‌گران‌ترین‌‌های "
                break;
                case "cheapest": url = url + "cheap/"
                ffa = "ارزان‌ترین‌های "
                break;
                default:
            }
            console.log(f)
            document.getElementById(f+"-btn").className += " active";
        }
        setFilter(ffa);
        if(shop){
            url = url + shop;
        }
        if(c)
            url = url + "?q=" + c
        console.log(url)
        let requestOptions = {
            method: "GET"
        }
        fetch(url, requestOptions)
            .then(res => {
                if (res.ok)
                    return res.json();
                setResults([]);
                setLoading(false);
            }).then(res => {
                console.log(res)
                if (!!res)
                    setResults(res);
                setLoading(false);
            })
    }, [props.triggerReload])

    useEffect(()=>{
        if(!shopID)
            return;
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
    },[shopID])

    useEffect(()=>{
        if(shopInfo){
            document.title =filter + (!category? ("کالاهای فروشگاه ") : ("دسته " + categories[category] +" فروشگاه "))+shopInfo.title + " | بی‌شاپ"
        }
        else{
            document.title =filter + (!category?("کالاها "):(categories[category])) + " | بی‌شاپ"
        }
    },[shopInfo, category, filter])

    function changeFilter(f){
        let newLocation = "";
        if(shopID){
            newLocation += "/store/" + shopID + "/items/list/" + f;
        }
        else
            newLocation += "/items/"+ f;
        if(category)
            newLocation += "/category?="+category;
        window.location.href= newLocation;
    }

    return <div className="search-results filtered-items">
        <div style={{ direction: "rtl"/*, padding: "5vh 5vw"*/, fontFamily: "Vazir" }}>
            <ShopSideBar shopID={shopID}/>
            <div className="page-contents" style={{ position: "relative" }}>
                <div className="Items_list-header">
                    <div className="Items_list-header-upper">
                    <h1 data-testid="header">{!category?"همه کالاها":categories[category]} </h1>
                    {!!shopID && <a href={"/store/" + shopID}>بازگشت به فروشگاه<ArrowBackIosIcon /></a>}
                    </div>
                    <div className="filters">
                        <button className="filter-btn" id="newest-btn" data-testid="newest-btn" onClick={()=>changeFilter("newest")}>جدیدترین‌ها</button>
                        <button className="filter-btn" id="discounted-btn" data-testid="discounted-btn" onClick={()=>changeFilter("discounted")}>تخفیف‌دارها</button>
                        <button className="filter-btn" id="cheapest-btn" data-testid="cheapest-btn" onClick={()=>changeFilter("cheapest")}>ارزان‌ترین‌ها</button>
                        <button className="filter-btn" id="mostexpensive-btn" data-testid="mostexpensive-btn" onClick={()=>changeFilter("mostexpensive")}>گران‌ترین‌ها</button>
                    </div>
                </div>
                {!loading &&
                    <div className="container-fluid row" style={{ width: "100%", zIndex: "0", margin: "0 0 20vh 0", padding: "10" }}  >
                        {!results || results.length === 0 ?
                            <p style={{ margin: "auto" }} data-testid="no-items">نتیجه‌ای یافت نشد!</p>
                            : 
                            <Itemslist url={"/store/"+shopID+"/itemslist"} items={results}
                             online={shopInfo?.online} itemHolderClass="col-12 col-sm-6 col-md-4 col-lg-3"
                             listType="page"  id="filtered" userState={props.userState?props.userState:null}
                              showDeleteItemModal={props.showDeleteItemModal} showShopName={!shopID}/>
                            }
                    </div>}
            </div>
        </div>
    </div>
}

export default ItemsListPage;