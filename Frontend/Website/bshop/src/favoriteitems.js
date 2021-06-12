import { setRef } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Itemslist from './ItemsList'
import ShopCard from './ShopCard'
const FavoriteItems = () => {
    const [results, setresults] = useState([])
    useEffect(() => {
        fetch(`http://eunoia-bshop.ir:8000/users/profile/likeditems`,{
            method: 'GET',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(res => res.json())
        .then(res => {
            if (res?.length) setresults(res)
        })
    }, [])
    return (
        <div className="col-12 d-flex flex-wrap justify-content-end">
            {results?.length > 0 && (
            <h1 className="col-12" data-testid="top-shops-header" >محصولات مورد علاقه شما </h1>
            )}
            <Itemslist dontshowmore url={"/"} id="fruits" items={results} listType="horizontal" itemHolderClass="col-12 col-sm-4 col-md-3 col-lg-2" showShopName={true}/>
            {!results || results.length === 0 ?
            <p data-testid="no-shops" style={{ margin: "auto" }}>نتیجه‌ای یافت نشد!</p>
            : results.map((result, i) => {
                if (!!result) return (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3" style={{ padding: "5px" }} key={"shop-holder" + i} >
                        {/* <ShopCard id="" shop={result} /> */}
                    </div>
                )
            })}</div>

    )
}

export default FavoriteItems
