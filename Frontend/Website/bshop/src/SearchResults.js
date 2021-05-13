import { useEffect, useState } from "react";
import ShopCard from "./ShopCard";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ItemCard from "./ItemCard";
import './ItemsList.css';
import './Search.css';
import SearchBar from "./SearchBar";

function SearchResults(props) {
    const [type, setType] = useState("s") //s or i for store or item
    const [shopID, setShopID] = useState("");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        //parsing url
        let shop = null, q = null, t = null,url="";
        q = decodeURI(window.location.href.match(/[^\=]+/g)[1]);
        console.log(q)
        if (!q || q==="undefined")
        {
            window.location.pathname="/";
        }
        setQuery(q);
        if (window.location.pathname.includes("items")) {
            setType("i");
            t = "i";
            if (window.location.pathname.includes("store")) {
                shop = decodeURI(window.location.pathname.match(/[^\/]+/g)[1]);
                setShopID(shop);
                url="http://eunoia-bshop.ir:8000/shops/"+shop+"/items/search/?q="+q;
            }
            else
                url="http://eunoia-bshop.ir:8000/items/search?q="+q;
        }
        else {
            setType("s");
            t = "s";
            url="http://eunoia-bshop.ir:8000/api/v1/shops/search?q="+q;
        }
        let requestOptions = {
            //     headers: {
            //         "Authorization":"Token "+localStorage.getItem("token"),
            // }
            method:"GET"
        }
        fetch(url, requestOptions)
                .then(res => {
                    if (res.ok) 
                        return res.json();
                    setResults([]);
                    setLoading(false);
                }).then(res=>{
                    console.log(res)
                    if(!!res)
                        setResults(res);
                    setLoading(false);
                })
    }, [])
    return <div className="search-results">
        
        <div className="Items_list-header">
            <h1>نتایج جستجو برای {query} </h1>
            {type==="i" && !!shopID &&<a href={"/store/" + shopID}>بازگشت به فروشگاه<ArrowBackIosIcon /></a>}
        </div>
        {type==="i" && shopID && <div className="search"><SearchBar thisShop={shopID}  id="search"/></div>}
        {!loading && <div className="container-fluid row" data-testid="results" style={{ width: "100%", zIndex: "0", margin: "0 0 20vh 0", padding: "10" }}  >
            {!results || results.length===0?
            <p style={{margin:"auto"}}>نتیجه‌ای یافت نشد! لطفا عبارات دیگری را امتحان کنید.</p>
            :  results.map((result) => {
                if (!!result) return (
                    type==="s"?
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3" style={{ padding: "5px" }}>
                        <ShopCard shop={result}/>
                    </div>
                    :
                    <div className="col-12 col-sm-4 col-md-3 col-lg-2" style={{ padding: "5px" }}>
                        <ItemCard item={result}/>
                    </div>
                )
            })}
        </div>}
</div>
}

export default SearchResults;