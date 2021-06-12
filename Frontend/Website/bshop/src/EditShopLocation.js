import React, { useRef, useEffect, useState } from 'react';
import EditMapLocation from './EditMapLocation';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import './Map.css';

function EditShopLocation(props){
    const [point, setPoint] = useState([35.7007,51.4268]) //lat lng
    useEffect(()=>{
        if(props.type==="s"){
            if(props.userState!=="m")
                window.location.href="/store/"+props.shopID;
        }
        else{

        }
    },[])

    function submitLocation(){
        console.log("boop")
        console.log(point)
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