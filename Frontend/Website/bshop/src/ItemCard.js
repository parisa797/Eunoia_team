import './ItemCard.css'
import ServerURL from './Constants'
import { useEffect, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useSnackbar } from 'notistack';

function ItemCard(props) {
    const [overallPrice, setOverallPrice] = useState(null);
    const [cartPrice,setCartPrice] = useState(0)
    const [cartCount,setCartCount] = useState(1)
    const [hideOptions,setHideOptions] = useState(true);
    const [id,setId] = useState((props.id? props.id : "")+props.item.shop_id +props.item.id);
    const [bought,setBought] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    useEffect(()=>{
        setId((props.id? props.id : "")+"-"+props.item.shop_id+"-" +props.item.id);
    },[props.item,props.id])

    const changeCartCount = (count)=>{
        if(count<1)
            count=1
        if(props.item.count<count)
            count = props.item.count
        setCartCount(count)
    }

    useEffect(() => {
        if (props.item?.discount && parseInt(props.item.discount) > 0) {
            setOverallPrice(Math.round((100 - props.item.discount) * props.item.price / 100)) ///MAKE ALL OF THEM INT
        }
        else{
            setOverallPrice(props.item.price)
        }

    }, [props.item])

    useEffect(()=>{
        setCartPrice(cartCount * overallPrice);
    },[overallPrice,cartCount])

    const ToggleOptions=(e)=>{
        e.stopPropagation(); 
        if(!localStorage.getItem("token"))
        {
            window.location.href = "/login"
            return;
        }
        var el = document.getElementById("add-to-cart"+id); 
        setHideOptions(!hideOptions); 
        el.style.visibility = el.style.visibility==="hidden"?"visible":"hidden";
        el.style.opacity = 1- el.style.opacity;
        // el.hidden=!el.hidden
    }

    function addToCart(){
        if(!JSON.parse(localStorage.getItem("shoplists"))[props.item.shop_id]){
            //create shopppinglist
            let fd = new FormData();
            fd.append("shop",props.item.shop_id)
            fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/create/",{
                method:"POST",
                headers: {
                    "Authorization": "Token " + localStorage.getItem('token')
                },
                body: fd
            }).then(res=>{
                if(res.ok)
                    return res.json();
                return {};
            }).then(r=>{
                if(!r)
                    return;
                let list = JSON.parse(localStorage.getItem("shoplists"));
                list[r.shop] = r.id;
                localStorage.setItem("shoplists",JSON.stringify(list));
                fd =new FormData();
                fd.append("item",props.item.id)
                fd.append("number",cartCount)
                fd.append("shopping_list",r.id)
                fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/",{
                    method:"POST",
                    headers: {
                        "Authorization": "Token " + localStorage.getItem('token')
                    },
                    body: fd 
                }).then(async res => {
                    if (res.ok) {
                        setBought(true);
                        await timeout(3000);
                        setBought(false);
                    }
                    else if (res.status===400)
                        return res.json()
                }).then(res => {
                        if (res === "sum_price should be smaller than max_cost")
                            enqueueSnackbar("به محدودیت قیمت سبد خرید رسیده‌اید", { variant: "error" })
                        else if (res === "The number of itmes should be less than the total number")
                            enqueueSnackbar("این تعداد از کالا (همراه با تعداد اضافه شده در سبد) در فروشگاه وجود ندارد", { variant: "error" })
                    })
                    .catch(err => console.error(err))
            })
                .catch(err => console.error(err))
        }else{
            let shopping_id=JSON.parse(localStorage.getItem("shoplists"))[props.item.shop_id];
            fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/list/"+shopping_id,{
                method:"GET",
                headers: {
                    "Authorization": "Token " + localStorage.getItem('token')
                }
            }).then(res=>{
                if(res.ok)
                    return res.json();
                return {};
            }).then(r=>{
                let list_id = null;
                let number = null;
                if(!r)
                    return;
                r.forEach(element => {
                    if(element.item.id === props.item.id)
                    {
                        list_id = element.id;
                        number = element.number
                    }
                });
                if(list_id===null){
                    let fd = new FormData()
                    fd.append("item",props.item.id)
                    fd.append("number",cartCount)
                    fd.append("shopping_list",shopping_id)
                    fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/",{
                    method:"POST",
                    headers: {
                        "Authorization": "Token " + localStorage.getItem('token')
                    },
                    body: fd
                }).then(async res=>{
                    if(res.ok)
                        {
                            setBought(true);
                            await timeout(3000);
                            setBought(false);
                        }
                    else if (res.status===400)
                        return res.json()
                }).then(res => {
                        if (res === "sum_price should be smaller than max_cost")
                            enqueueSnackbar("به محدودیت قیمت سبد خرید رسیده‌اید", { variant: "error" })
                        else if (res === "The number of itmes should be less than the total number")
                            enqueueSnackbar("این تعداد از کالا (همراه با تعداد اضافه شده در سبد) در فروشگاه وجود ندارد", { variant: "error" })
                    })
                    .catch(err => console.error(err))
                }
                else{
                    let fd = new FormData()
                    fd.append("number",cartCount+number)
                    fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/item/"+list_id,{
                    method:"PUT",
                    headers: {
                        "Authorization": "Token " + localStorage.getItem('token')
                    },
                    body: fd
                }).then(async res=>{
                    if(res.ok)
                        {
                            setBought(true);
                            await timeout(1000);
                            setBought(false);
                        }
                    else if (res.status===400)
                        return res.json()
                }).then(res => {
                        if (res === "sum_price should be smaller than max_cost")
                            enqueueSnackbar("به محدودیت قیمت سبد خرید رسیده‌اید", { variant: "error" })
                        else if (res === "The number of itmes should be less than the total number")
                            enqueueSnackbar("این تعداد از کالا (همراه با تعداد اضافه شده در سبد) در فروشگاه وجود ندارد", { variant: "error" })
                    })
                    .catch(err => console.error(err))
                }
                
            })
            .catch(err=>console.error(err))
        }
    }

    return (
        <div className="item-card" >
            <div id={"add-to-cart"+id} className="add-to-cart-card" style={{visibility:"hidden",opacity:"0"}} /*hidden="true"*/>
            <h5 className="item-card-title" >{props.item.name}</h5>
            {props.userState !== "m"?<><div><h1 className="cart-price">{cartPrice}</h1><p>ریال</p></div>
            <div className="count-div">
                <div className="count-btn btn" onClick={()=>changeCartCount(cartCount+1)}>+</div>
                <input type="text" value={cartCount} onChange={(e)=>changeCartCount(e.target.value)} />
                <div className="count-btn btn" onClick={()=>changeCartCount(cartCount-1)}>-</div>
            </div>
            {!bought?<div className="btn add-to-cart-btn" data-testid="add-to-cart-btn" onClick={()=>addToCart()} >افزودن به سبد خرید</div>:
                <div className="btn add-to-cart-btn" data-testid="added-btn" >اضافه شد!</div>
            }</>
            :
            <div className="manager-btns">
                {/* <div className="btn add-to-cart-btn">ویرایش اطلاعات</div>
                <div className="btn add-to-cart-btn">حذف کالا</div> */}
                </div>}
            </div>
            <div className="item-card-main" onClick={() =>
            window.location.href = "/store/" + props.item.shop_id + "/items/" + props.item.id + (props.userState === "m" ? "/edit" : "")
        }>
            <div className="card-img-container">
                <img className="card-img-top" data-testid={"item-img"+id} src={props.item?.photo ? (props.item.photo.includes(ServerURL) ? props.item.photo : ServerURL + props.item.photo) : "/no-image-icon-0.jpg"} alt="Card image cap" />
                {props.showShopName && <p className="shop-name" data-testid={"item-shop-name"+id}>{props.item.ItemShop.title}</p>}
            </div>
            <div className="item-card-body">
                <h5 className="item-card-title" data-testid={"item-name"+id}>{props.item.name}</h5>
                <div>
                    {props.item.Expiration_jalali ? <p className="item-card-date" data-testid={"item-manufacture"+id}>{props.item.manufacture_jalali.replace(/-/g, '/')} تا {props.item.Expiration_jalali.replace(/-/g, '/')}</p> :
                        props.item.manufacture_jalali && <p className="item-card-date" data-testid={"item-expiration"+id}>{props.item.manufacture_jalali.replace(/-/g, '/')}</p>
                    }
                </div>
                {!!props.item?.discount && props.item.discount>0 ?
                    <div className="item-card-price">
                        <div style={{ display: "inline-flex" }}><p className="item-card-real-price" data-testid={"item-price"+id}>{props.item.price}</p><div className="item-card-discount" data-testid={"item-discount"+id}>{props.item.discount}%</div></div>
                        <p className="item-card-price-text" data-testid={"item-overallprice"+id}>{overallPrice} ریال</p>

                    </div>
                    : <p className="item-card-price item-card-price-text" data-testid={"item-price-without-discount"+id}>{!!props.item.price ? props.item.price + "ریال" : "قیمت نامشخص"}</p>}
                {<p className="item-card-count" data-testid={"item-count"+id}> {props.item?.count? props.item.count + " عدد مانده " : "ناموجود"}</p>}


            </div>
                   <div className="card-add-to-cart">
                        {props.userState === "m"?
                        <div className="cart-btn cart-btn-1">
                            <div className="cart-btn-1" style={{backgroundColor: "var(--primary-color)",color:"white",borderRadius:"5px"}}><SettingsIcon /></div>
                            {props.showDeleteItemModal && <div className="cart-btn-1" style={{backgroundColor: "red",color:"white",borderRadius:"5px"}} onClick={(e)=>{e.stopPropagation(); props.showDeleteItemModal(props.item.id,props.item.name)}}><DeleteForeverIcon /></div>}
                            <div className="cart-btn-1" style={{backgroundColor: "cadetblue",color:"white",borderRadius:"5px"}} onClick={(e)=>{e.stopPropagation(); window.location.href = "/store/" + props.item.shop_id + "/items/" + props.item.id }}><VisibilityIcon /></div>
                            </div>
                            :
                            props.onlineShop && !!overallPrice && overallPrice!==0 && props.item.count!==0 && <div className="btn cart-btn cart-btn-1" data-testid="add-to-cart-switch-btn" style={hideOptions? {backgroundColor: "var(--primary-color)",color:"white"}:{backgroundColor: "transparent",color:"var(--primary-color)"}} onClick={(e)=>ToggleOptions(e)}>
                            {hideOptions?<ShoppingCartIcon/>:<CloseIcon />}
                            </div>
}                   

                    <div className="count"></div>
                    </div>
                    </div>
        </div>)
}

export default ItemCard;