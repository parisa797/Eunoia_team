import { setRef } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import ShopCard from './ShopCard'
const FavouriteShop = () => {
    const [results, setresults] = useState([])
    useEffect(() => {
        fetch(`http://eunoia-bshop.ir:8000/users/profile/likedshops`,{
            method: 'GET',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(res => res.json())
        .then(res => {
            if (res?.length) setresults(res)
        }).catch(err=> console.log(err))
    }, [])
    return (
        <div className="col-12 d-flex flex-wrap justify-content-end">
            <h1 className="col-12" data-testid="fav-shops-header" >فروشگاه‌های مورد علاقه شما </h1>
            {!results || results.length === 0 ?
            <p data-testid="no-shops" style={{ margin: "auto" }}>نتیجه‌ای یافت نشد!</p>
            : results.map((result, i) => {
                if (!!result) return (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3" style={{ padding: "5px" }} key={"shop-holder" + i} >
                        <ShopCard id="" shop={result} />
                    </div>
                )
            })}</div>

    )
}

export default FavouriteShop
