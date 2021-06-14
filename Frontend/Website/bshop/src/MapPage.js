
import React, { useRef, useEffect, useState } from 'react';
import ReactStars from "react-rating-stars-component";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CallIcon from '@material-ui/icons/Call';
import mapPointer from './medias/pointer.jpg';
import './Map.css';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ShopComments from './ShopComments';
function MapPage(props) {
  var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

  mapboxgl.accessToken = 'pk.eyJ1IjoiZXVub2lhNnRlYW0iLCJhIjoiY2twaW1pc29oMGc5NjJ1b2ZmMGdiNWkweCJ9.6KH84Su77toujLB9IU4wTQ';
  const [stores, setStores] = useState({
    "type": "FeatureCollection",
    "features": [
    ]
  })
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(35.7007);
  const [lat, setLat] = useState(51.4268);
  const [zoom, setZoom] = useState(9);
  const [clickedShop, setClickedShop] = useState(null);
  useEffect(() => {
    if (map.current) return;
    var center = [lat, lng];
    
    if (mapboxgl.getRTLTextPluginStatus() !== "loaded")
      mapboxgl.setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
        null,
        true
      );
    if (!mapboxgl.supported()) {
        alert('Your browser does not support Mapbox GL');
      }
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11', //document.querySelectorAll('[data-theme="d0"]')?'mapbox://styles/mapbox/streets-v11':'mapbox://mapbox-light-v9',
      center: center,
      zoom: zoom
    });
  }, []);

  // useEffect(()=>{
  //   if(!map.current) return;
  //   if(!stores?.features?.length===0) return;
  //   if(window.location.href.includes("shop")){
  //     console.log(stores)
  //     let q = decodeURI(window.location.href.match(/[^\=]+/g)[1]);
  //     console.log(q)
  //     let shop = stores.features.filter(x=>x.properties.id === parseInt(q))
  //     flyToStore(shop[0])
  //   }
  // },[stores])

  useEffect(() => {
    if (!map.current) return;

    fetch("http://eunoia-bshop.ir:8000/api/v1/shops/top/", {
            method: 'GET',
            // headers: {
            //     "Authorization": "Token " + localStorage.getItem('token')
            // }
        })
            .then((res) => {
                if (res.status === 200) {
                    return res.json()
                }
                return [];
            }
            )
            .then((d) => {
              let storesCopy = stores;
              if(Array.isArray(d))
              {
                console.log(d)
                d.forEach(shop =>{
                  storesCopy.features.push(
                      {
                        "type": "Feature",
                        "geometry": {
                          "type": "Point",
                          "coordinates": [
                            shop.latitude,
                            shop.longitude
                          ]
                        },
                        "properties": shop
                      }
                  )
                })
                setStores(storesCopy)
                console.log(storesCopy.features)
                let stores_with_location = storesCopy;
                stores_with_location.features = storesCopy.features.filter(x=>!!x.geometry.coordinates[0] && x.geometry.coordinates[1]);
                map.current.on('load', function (e) {
                  map.current.addSource('places', {
                    'type': 'geojson',
                    'data': stores_with_location
                  });
                  addMarkers(stores_with_location);
                  if(window.location.href.includes("shop")){
                    console.log(stores)
                    let q = decodeURI(window.location.href.match(/[^\=]+/g)[1]);
                    console.log(q)
                    let shop = stores.features.filter(x=>x.properties.id === parseInt(q))
                    flyToStore(shop[0])
                  }
                  
            });
          }
    });
  }, []);

  function addMarkers(stores_with_location) {
    stores_with_location.features.forEach(function (marker) {
      var el = document.createElement('div');
      el.id = 'marker-' + marker.properties.id;
      el.className = 'marker';
      el.innerHTML = `<img src=${mapPointer}><p>${marker.properties.title}</p>`
      new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map.current);
        
      el.addEventListener('click', function (e) {
        flyToStore(marker);
      });
    });
  }

  function flyToStore(currentFeature) {
    setClickedShop(currentFeature);
    map.current.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15
    });
  }

  return (
    <div className="map-page">
      <div className='sidebar'>
        {
          clickedShop ?
            <div>
              <div className='map-go-back'>
                <h1 onClick={() => setClickedShop(null)}><ChevronLeftIcon />بازگشت</h1>
              </div>
              <div className="map-shop">
                <div className="map-shop-header">
                  <div className="img-container">
                    <img src={clickedShop.properties.logo ? clickedShop.properties.logo : "/shop-default-logo.png"} alt="logo" />
                  </div>
                  <h2 onClick={()=>window.location.href=`/store/${clickedShop.properties.id}/`}>{clickedShop.properties.title}</h2>
                </div>
                {clickedShop.properties.online ? <p style={{ color: "green", fontSize:"0.9rem", alignSelf:"center" }}>امکان خرید آنلاین دارد</p> : <p style={{ color: "red", fontSize:"0.9rem", alignSelf:"center" }}>امکان خرید آنلاین ندارد</p>}
                {clickedShop.properties.address && <p className="address"><LocationOnIcon className="icon" />{clickedShop.properties.address}</p>}
                {clickedShop.properties.shop_phone && <p className="phone"><CallIcon className="icon"/>{clickedShop.properties.shop_phone}</p>}
                <h3>نظرات</h3>
                <div className="shop-page">
                <ShopComments shopID={clickedShop.properties.id} userState={"u"}/>
                </div>
              </div>
            </div>
            :
            <><div className='heading'>
              <h1>فروشگاه‌ها</h1>
            </div>
              <div id='listings' className='listings'>
                {stores.features.map(store => {
                  return (
                    <div className="map-list-item" onClick={() => flyToStore(store)}>
                      <h2>{store.properties.title}</h2>
                      <p className="map-desc">{store.properties.mantaghe} منطقه</p>
                      <div className="shop-stars">
                        <ReactStars
                          edit={false}
                          value={store.properties.rate_value ? store.properties.rate_value : 0}
                          isHalf={true}
                          classNames="stars"
                          size={22}
                          activeColor={"var(--primary-color)"}
                        />
                        <p>({store.properties.rate_count})</p>
                      </div>
                    </div>
                  )
                })}
              </div></>}
      </div>
      <div ref={mapContainer} className="map" />
    </div>
  )
}

export default MapPage;