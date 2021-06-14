import React, { useRef, useEffect, useState } from 'react';
import EditMapLocation from './EditMapLocation';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import './Map.css';

function EditShopLocation(props){
    const [point, setPoint] = useState([35.7007,51.4268]) //[lat lng]
    useEffect(()=>{
        if(props.type==="s" && props.userState!=="m"){
            window.location.href="/store/"+props.shopID;
        }
    },[])

    function submitLocation(){
        if(props.type==="s")
            submitShopLocation()
        else
            submitUserLocation()
    }

    function submitShopLocation(){
        let fd = new FormData();
        fd.append("latitude",point[0]);
        fd.append("longitude",point[1]);
        var requestOptions = {
            method: 'PUT',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            },
            body: fd,
        };
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/update/" + props.shopID, requestOptions)
            .then((response) => {
                console.log(response)
                if(response.ok)
                    window.location.href= `/maps/shop?id=${props.shopID}`
            })
            .catch(error => {
                console.log('error', error)
            });
    }

    function submitUserLocation(){

    }

    return(
        <div className="map-page">
            <div className="edit">
            <div className="edit-popup">
                <p>با کلیک روی نقشه نقطه موردنظر خود را انتخاب کنید.</p>
                <a href={props.type==="p"?"/profile/info":`/store/${props.shopID}/edit-info`}>بازگشت<ChevronLeftIcon /></a>
            </div>
            <EditMapLocation point={point} setPoint={setPoint} submitLocation={submitLocation}/>
            </div>
        </div>
    )
}

export default EditShopLocation;