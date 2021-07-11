import ReactStars from "react-rating-stars-component";
import ServerURL from "./Constants";
import "./ShopCard.css"
function ShopCard(props){
    return <div className="shop-container" onClick={() => window.location.href = "/store/" + props.shop.id} key={props.shop.id}  data-testid={"shop" + props.shop.id}>
    <div className="shop-upper">
        <div className="img-outer-container"><div className="img-container"><img data-testid={props.id+"shop-img-" + props.shop.id} src={props.shop?.logo?(props.shop.logo.includes(ServerURL)?props.shop.logo:ServerURL+props.shop.logo) : "/shop-default-logo.png"} alt={props.shop.title} /></div></div>
        <h4 data-testid={props.id+"shop-title-" + props.shop.id} >{props.shop.title}</h4>
        <div className="shop-stars">
            <ReactStars
                edit={false}
                value={props.shop.rate_value ? Number(props.shop.rate_value) : 0}
                isHalf={true}
                classNames="stars"
                size={20}
                activeColor={"var(--primary-color)"}
            />
            <p data-testid={props.id+"shop-rate-count" + props.shop.id}>({props.shop.rate_count})</p>
        </div>
    </div>
    <div className="shop-lower">
        <p data-testid={props.id+"shop-address-" + props.shop.id}>{props.shop.address}</p>
    </div>
</div>
}

export default ShopCard;