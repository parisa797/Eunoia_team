import { useEffect, useState } from "react";
import ShopCard from "./ShopCard";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ItemCard from "./ItemCard";
import './ItemsList.css';
import './Search.css';
import SearchBar from "./SearchBar";

function ShopsListPage(props) {
    const [type, setType] = useState("r") //r for shops based on region
    // const [shopID, setShopID] = useState("");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        //parsing url
        let shop = null, q = null, t = null, url = "";
        if(window.location.pathname.includes("region")){
            t="r";
            q = decodeURI(window.location.href.match(/[^\=]+/g)[1])
            if(!q || q==="undefined")
                q="";
            url = "http://eunoia-bshop.ir:8000/api/v1/shops/region/?q="+q;
        }
        else{
            t="t";
            url = "http://eunoia-bshop.ir:8000/api/v1/shops/top/";
        }
        setType(t)
        setQuery(q);
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
    }, [])

    function changeRegion(val){
        setQuery(val)
        // setLoading(true);
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/region/?q="+val, {method: "GET"})
            .then(res => {
                if (res.ok)
                    return res.json();
                setResults([]);
                // setLoading(false);
            }).then(res => {
                console.log(res)
                if (!!res)
                    setResults(res);
                // setLoading(false);
            })
    }

    return <div className="search-results">

        <div className="Items_list-header">
            {type==="t"?
            <h1 data-testid="top-shops-header" >فروشگاه‌های برگزیده </h1>
            :
            <h1 data-testid="a-region-shops-header" > فروشگاه های منطقه <input data-testid="region-input" value={query} onChange={(e)=>changeRegion(e.target.value)} style={{width:"2.5rem", color:"var(--font-color2)",direction:"ltr"}} /></h1>
}
        </div>
        {!loading && <div className="container-fluid row" style={{ width: "100%", zIndex: "0", margin: "0 0 20vh 0", padding: "10" }}  >
            {!results || results.length === 0 ?
                <p data-testid="no-shops" style={{ margin: "auto" }}>نتیجه‌ای یافت نشد!</p>
                : results.map((result,i) => {
                    if (!!result) return (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3" style={{ padding: "5px" }} key={"shop-holder"+i} >
                            <ShopCard id="" shop={result} />
                        </div>
                    )
                })}
        </div>}
    </div>
}

export default ShopsListPage;