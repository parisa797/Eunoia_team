import { setRef } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Itemslist from './ItemsList'

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
        }).catch(err=> console.log(err))
    }, [])
    return (
        <div className="col-12 d-flex flex-wrap">
            {/* {results?.length > 0 && ( */}
            <h1 className="col-12" data-testid="fav-items-header" >محصولات مورد علاقه شما </h1>
            {/* )} */}
            <div className="container-fluid row" style={{ width: "100%", zIndex: "0", margin: "0 0 20vh 0", padding: "10", direction:"rtl" }}  >
            {!results || results.length === 0 ?
                            <p style={{ margin: "auto" }} data-testid="no-items">نتیجه‌ای یافت نشد!</p>
                            : 
            <Itemslist dontshowmore url={"/"} id="favorites" items={results} listType="page" itemHolderClass="col-12 col-sm-4 col-md-3 col-lg-2" showShopName={true}/>
}
            </div>
            </div>

    )
}

export default FavoriteItems
