import './ItemCard.css'
import ServerURL from './Constants'
import { useEffect, useState } from 'react';

function ItemCard(props){
    const [discountedPrice, setDiscountedPrice] = useState(null);

    useEffect(()=>{
        console.log(props.item)
        if(props.item?.discount){
            if(props.item.discount>0){
                setDiscountedPrice(Math.round((100-props.item.discount) * props.item.price / 100))
            }
        }
    },[props.item])

    return(
    // <div className="item-card">
    <div className="item-card" onClick={() => window.location.href="/store/"+props.item.shop_id+"/items/"+props.item.id}>
    <div className="card-img-container">
    <img className="card-img-top" src={props.item?.photo? (props.item.photo.includes(ServerURL)?props.item.photo: ServerURL + props.item.photo):"../../1.png"} alt="Card image cap" />
    </div>
    <div className="item-card-body">
        <h5 className="item-card-title">{props.item.name}</h5>
        <div>
         {/* {props.item.manufacture_Date && <p className="item-card-date"> </p>}  */}
        {props.item.Expiration_Date && <p className="item-card-date">{props.item.manufacture_Date.replace(/-/g,'/')} تا {props.item.Expiration_Date.replace(/-/g,'/')}</p>} 
        </div>
        {!!discountedPrice?
        <div className="item-card-price">
        <div style={{display:"inline-flex"}}><p className="item-card-real-price">{props.item.price}</p><div className="item-card-discount">{props.item.discount}%</div></div>
        <p className="item-card-price-text">{discountedPrice} ریال</p>
        
        </div>
        :<p className="item-card-price item-card-price-text">{!!props.item.price? props.item.price + "ریال":"قیمت نامشخص"}</p>}
        {<p className="item-card-count"> {props.item.count} عدد مانده </p>}

        {/* {!!props.item.onlineShop &&<div className="card-add-to-cart"> 
            <div className="btn cart-btn"></div>
            <div className="count"></div>
            </div>} */}
        {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
    </div>
{/* </div> */}
</div>)
}

export default ItemCard;