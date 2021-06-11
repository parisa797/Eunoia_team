
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
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            51.41815069578285,
            35.73641896371283
          ]
        },
        "properties": {
          address: " سنمتبمن سیمبتمسنیتب سنمیبتمنسیتب مسلم جنوبی 4 - پلاک 228",
          comment_count: 2,
          id: 3,
          logo: "http://eunoia-bshop.ir:8000/media/image/shahrvand_Copy-min_08t0LHf.png",
          manager: "ستاره جون",
          mantaghe: "12",
          online: true,
          phone: "09125588109",
          rate_count: 3,
          rate_value: 3.6666666666666665,
          shomare_sabt: "12345",
          shop_phone: "09732043234",
          theme: 2,
          title: "شهروند",
          user: 6
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            51.534356,
            35.742913
          ]
        },
        "properties": {
          address: "تهران، تهرانپارس",
          comment_count: 11,
          id: 5,
          logo: "http://eunoia-bshop.ir:8000/media/image/ofogh-kourosh_AWqRRDi.png",
          manager: "مدیر مدیری",
          mantaghe: "4",
          online: true,
          phone: "09111111111",
          rate_count: 4,
          rate_value: 3,
          shomare_sabt: "312718",
          shop_phone: null,
          theme: 2,
          title: "کوروش: شعبه تهرانپارس",
          user: 5
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            51.439114468799026, 35.76234661596831
          ]
        },
        "properties": {
          address: "تهران، میرداماد، رودبار غربی",
          comment_count: 2,
          id: 1,
          logo: "http://eunoia-bshop.ir:8000/media/image/ofogh-kourosh_hVcfFRy.png",
          manager: "مدیر مدیری",
          mantaghe: "3",
          online: true,
          phone: "09903131133",
          rate_count: 5,
          rate_value: 4.2,
          shomare_sabt: "289333",
          shop_phone: "09909999999",
          theme: 2,
          title: "افق کوروش: شعبه میرداماد",
          user: 5,
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            51.40383125530524,
            35.71995617539074
          ]
        },
        "properties": {
          address: "خیابان فاطمی-بعد از میدان جهاد-جنب وزارت کشور",
          comment_count: 0,
          id: 8,
          logo: "http://eunoia-bshop.ir:8000/media/image/AZa5R4W1mpPPMGXQRA8iI5Iy8rSFH9L2ToxP7Nhk.png",
          manager: "مدیررر",
          mantaghe: "6",
          online: true,
          phone: "09903131133",
          rate_count: 1,
          rate_value: 2,
          shomare_sabt: "56456465",
          shop_phone: null,
          theme: 2,
          title: "رفاه: شعبه فاطمی",
          user: 5
        }
      }
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

  useEffect(()=>{
    if(!map.current) return;
    if(window.location.href.includes("shop")){
      let q = decodeURI(window.location.href.match(/[^\=]+/g)[1]);
      console.log(q)
      let shop = stores.features.filter(x=>x.properties.id === parseInt(q))
      flyToStore(shop[0])
    }
  },[])

  useEffect(() => {
    if (!map.current) return;
    map.current.on('load', function (e) {
      map.current.addSource('places', {
        'type': 'geojson',
        'data': stores
      });
      addMarkers();
    });
  }, []);

  function addMarkers() {
    stores.features.forEach(function (marker) {
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