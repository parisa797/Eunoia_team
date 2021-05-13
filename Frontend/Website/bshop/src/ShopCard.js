import ReactStars from "react-rating-stars-component";
import "./ShopCard.css"
function ShopCard(props){
    return <div className="shop-container" onClick={() => window.location.href = "/store/" + props.shop.id} key={props.shop.id}>
    <div className="shop-upper">
        <div className="img-outer-container"><div className="img-container"><img data-testid={"myshop-img-" + props.shop.id} src={props.shop?.logo?props.shop.logo : "/shop-default-logo.png"} alt={props.shop.title} /></div></div>
        <h4 data-testid={"myshop-title-" + props.shop.id} >{props.shop.title}</h4>
        <div className="shop-stars">
            <ReactStars
                edit={false}
                value={props.shop.rate_value ? props.shop.rate_value : 0}
                isHalf={true}
                classNames="stars"
                size={20}
                activeColor={"var(--primary-color)"}
            />
            <p data-testid={"myshop-rate-count" + props.shop.id}>({props.shop.rate_count})</p>
        </div>
    </div>
    <div className="shop-lower">
        <p data-testid={"myshop-address-" + props.shop.id}>{props.shop.address}</p>
    </div>
</div>
}

export default ShopCard;