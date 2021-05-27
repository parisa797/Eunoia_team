import { useEffect, useState } from "react";
import "./ItemsList.css";
import ItemCard from "./ItemCard";
import ShopSideBar from "./ShopSideBar";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { PinDropSharp } from "@material-ui/icons";

function Itemslist(props) {
    const usersShops = JSON.parse(localStorage.getItem("shops"));

    return (
        <div className="items-list-component">
            {props.listType === "page" ?
                <>
                    {/* <div className="Items_list-header">
                        <h1>فروشگاه {props.shopInfo.title}</h1>
                        <a href={"/store/" + props.shopInfo.id}>بازگشت به فروشگاه<ArrowBackIosIcon /></a>
                    </div> */}
                    <div className="Items_list container-fluid row your-shops" data-testid="myitems" style={{ width: "100%", zIndex: "0"/*, margin: "0 0 20vh 0"*/,margin:"0", padding: "10" }}  >
                        {props.items.map((item) => {
                            let userState = "u";
                            if(props.userState)
                                userState = props.userState;
                            else if(!localStorage.getItem("token")){
                                userState = "u"
                            }
                            else if(!!usersShops && usersShops.includes(item.shop_id))
                                userState = "m"
                            else
                                userState = "l"
                            if (!!item) return (
                                <div className={props.itemHolderClass} style={{ padding: "5px" }} key={item.shop_id+"-"+item.id}>
                                    <ItemCard item={item} id={props.id} onlineShop={props.online?props.online:item.ItemShop?.online} showDeleteItemModal={props.showDeleteItemModal} userState={userState} showShopName={props.showShopName} />
                                </div>
                            )
                        })}
                    </div>
                </>
                :
                <div className="horizontal-list ">
                    {!props.items || props.items.length === 0 ?
                        <p>کالایی وجود ندارد!</p>
                        :
                        <>
                            {props.items?.map((item, i) => {
                                let userState = "u";
                                if(props.userState)
                                    userState = props.userState;
                                else if(!localStorage.getItem("token")){
                                    userState = "u"
                                }
                                else if(!!usersShops && usersShops.includes(item.shop_id))
                                    userState = "m"
                                else
                                    userState = "l"
                                if (item)
                                    return (
                                        <div key={props.id+item.shop_id+item.id} data-testid={"shop-all-items-" + i} className={props.itemHolderClass}>
                                            <ItemCard item={item} id={props.id} onlineShop={props.online?props.online:item.ItemShop?.online} showDeleteItemModal={props.showDeleteItemModal} userState={userState} showShopName={props.showShopName} />
                                        </div>
                                    )
                            })}
                            <div className="see-more" >
                                <a href={props.url}>
                                    موارد بیشتر
                            <ChevronLeftIcon />
                                </a>
                            </div>
                        </>
                    }
                </div>}
        </div>
    )
}
export default Itemslist;