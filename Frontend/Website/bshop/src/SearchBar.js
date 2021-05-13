import { useEffect, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import './Search.css';
import { propTypes } from 'react-bootstrap/esm/Image';
function SearchBar(props){
    const [type, setType] = useState("فروشگاه")
    const [shopName,setShopName] = useState("");
    const [itemName,setItemName] = useState("");
    const SearchDropDownToggle = () => {
        document.getElementById("shop-search-dropdown"+props.id).classList.toggle("show");
    }

    useEffect(()=>{
      if(props.thisShop)
        setType("کالا")
    },[props.thisShop])

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

    return <div className="searchbar" >
    <form inline="true" className="input-group input-group-lg" onSubmit={submitSearch}>
    <button className="btn search-btn input-group-btn" type="submit"><SearchIcon /></button>
      
      {type=="فروشگاه"?
      <input type="text" className="form-control input-lg" placeholder="نام یا آدرس فروشگاه" onChange={(e)=>setShopName(e.target.value)} />
    :
    // <div className="item-search-holder">
    <input type="text" className="form-control input-lg" placeholder={props.thisShop?"جستجوی کالا در این فروشگاه":"نام یا مشخصات کالا"} onChange={(e)=>setItemName(e.target.value)} style={{borderRadius:props.thisShop?"0 5px 5px 0":0}} />
    /* <input type="text" className="form-control input-lg" placeholder="در همه فروشگاه‌ها" onChange={(e)=>setShopName(e.target.value)} />
    </div> */
    }
      {!props.thisShop && <div className="dropdown">
        <button className="btn dropdown-toggle input-group-btn" data-testid="shop-filterby-button" onClick={(e) => { e.preventDefault(); SearchDropDownToggle() }}>
          {type}
</button>
        <div className="dropdown-menu" id={"shop-search-dropdown"+props.id} data-testid="shop-dropdown-menu">
          <div className="dropdown-item" onClick={()=>setType("کالا")}>کالا</div>
          <div className="dropdown-item" onClick={()=>setType("فروشگاه")}>فروشگاه</div>
        </div>
      </div>}
    </form>
  </div>
}

export default SearchBar;