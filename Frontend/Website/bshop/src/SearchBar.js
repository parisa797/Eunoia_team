import { useEffect, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import './Search.css';
function SearchBar(props){
    const [type, setType] = useState("فروشگاه")
    const [shopName,setShopName] = useState("");
    const [itemName,setItemName] = useState("");
    // const [url, setUrl] = useState("");
    const [results,setResults] = useState([]);
    const SearchDropDownToggle = () => {
        document.getElementById("shop-search-dropdown"+props.id).classList.toggle("show");
    }

    useEffect(()=>{
      if(props.thisShop)
        setType("کالا")
    },[props.thisShop])

    // useEffect(()=>{
    //   switch(type){
    //     case "فروشگاه":
    //         setUrl("http://eunoia-bshop.ir:8000/api/v1/shops/search?q=");
    //         break;
    //     default:
    //         if(!!props.thisShop)
    //           setUrl("http://eunoia-bshop.ir:8000/shops/"+props.thisShop+"/items/search/?q=");
    //         else
    //           setUrl("http://eunoia-bshop.ir:8000/items/search?q=");
    //         break;
    // }
    // },[type])

    function submitSearch(e){
        e.preventDefault();
        switch(type){
            case "فروشگاه":
                if(!shopName)
                  return;
                window.location.href = "/store/search?q="+shopName;
                break;
            default:
                if(!itemName)
                  return;
                if(!!props.thisShop)
                    window.location.href = "/store/"+props.thisShop+"/items/search/q="+itemName;
                else
                    window.location.href = "/items/search/q="+itemName;
                break;
        }
    }

    function tempSearch(q,t){
      let requestOptions = {
        //     headers: {
        //         "Authorization":"Token "+localStorage.getItem("token"),
        // }
        method:"GET"
    }
    let url = null;
    switch(t){
      case "فروشگاه":
          url = "http://eunoia-bshop.ir:8000/api/v1/shops/search?q=";
          break;
      default:
          if(!!props.thisShop)
            url = "http://eunoia-bshop.ir:8000/shops/"+props.thisShop+"/items/search/?q=";
          else
            url = "http://eunoia-bshop.ir:8000/items/search?q=";
          break;
  }
    fetch(url+q, requestOptions)
            .then(res => {
                if (res.ok) 
                    return res.json();
                setResults([]);
            }).then(res=>{
                if(!!res)
                  {
                    switch(t){
                      case "فروشگاه": setResults(res.slice(0, 10).map(r=>({title:r.title,description:r.address.slice(0,50), id:r.id})));
                      break;
                      default: setResults(res.slice(0, 10).map(r=>({title:r.name,description:r.description.slice(0,50), shop_id:r.shop_id, id:r.id})));
                    }
                  }
            })
    }

    return <div className="searchbar" >
    <form inline="true" className="input-group input-group-lg" onSubmit={submitSearch}>
    <button className="btn search-btn input-group-btn" type="submit" data-testid="submit-btn"><SearchIcon /></button>
      
      {type=="فروشگاه"?
      <input type="text" className="form-control input-lg" data-testid="shop-input" value={shopName} placeholder="نام یا آدرس فروشگاه" onChange={(e)=>{setShopName(e.target.value);tempSearch(e.target.value,"فروشگاه")}} />
    :
    // <div className="item-search-holder">
    <input type="text" className="form-control input-lg" value={itemName} data-testid="item-input" placeholder={props.thisShop?"جستجوی کالا در این فروشگاه":"نام یا مشخصات کالا"} onChange={(e)=>{setItemName(e.target.value);tempSearch(e.target.value,"کالا")}} style={{borderRadius:props.thisShop?"0 5px 5px 0":0}} />
    /* <input type="text" className="form-control input-lg" placeholder="در همه فروشگاه‌ها" onChange={(e)=>setShopName(e.target.value)} />
    </div> */
    }
      {!props.thisShop && <div className="dropdown">
        <button className="btn dropdown-toggle input-group-btn" data-testid="shop-filterby-button" data-testid="search-dropdown-btn" onClick={(e) => { e.preventDefault(); SearchDropDownToggle() }}>
          {type}
</button>
        <div className="dropdown-menu" id={"shop-search-dropdown"+props.id} data-testid="shop-dropdown-menu">
          <div className="dropdown-item" onClick={()=>{setType("کالا");tempSearch(itemName,"کالا")}} data-testid="item-dropdown-btn">کالا</div>
          <div className="dropdown-item" onClick={()=>{setType("فروشگاه");tempSearch(shopName,"فروشگاه")}} data-testid="shop-dropdown-btn">فروشگاه</div>
        </div>
      </div>}
      <div className="search-list">
        {results?.map((r,i)=>{
          if(r)
          return(
            <div className="search-list-item" onClick={()=>{window.location.pathname = (type==="فروشگاه"?"/store/"+r.id : "/store/"+r.shop_id+"/items/"+r.id )}}>
              <p className="title" data-testid={"search-list-title"+i} >{r.title}</p>
              <p className="desc" data-testid={"search-list-desc"+i}>{r.description}</p>
            </div>
          )
        })}
      </div>
    </form>
  </div>
}

export default SearchBar;