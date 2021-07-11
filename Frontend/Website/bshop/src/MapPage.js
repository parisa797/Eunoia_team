
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
  // @ts-ignore
  // eslint-disable-next-line import/no-webpack-loader-syntax
  mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default
  mapboxgl.accessToken = 'pk.eyJ1IjoiZXVub2lhNnRlYW0iLCJhIjoiY2twaW1pc29oMGc5NjJ1b2ZmMGdiNWkweCJ9.6KH84Su77toujLB9IU4wTQ';
  const [stores, setStores] = useState({ features: [] })
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
      method: 'GET'
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json()
        }
        return [];
      }
      )
      .then((d) => {
        let storesCopy = {
          "type": "FeatureCollection",
          "features": [
          ]
        };
        if (Array.isArray(d)) {
          console.log(d)
          d.forEach(shop => {
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
          console.log(storesCopy.features)
          let stores_with_location = storesCopy;
          stores_with_location.features = storesCopy.features.filter(x => !!x.geometry.coordinates[0] && x.geometry.coordinates[1]);
          setStores(stores_with_location)
          map.current.on('load', function (e) {
            map.current.addSource('places', {
              'type': 'geojson',
              'data': stores_with_location
            });
            addMarkers(stores_with_location);
            if (!!localStorage.getItem("token"))
              locateUser();
            if (window.location.href.includes("shop")) {
              let q = decodeURI(window.location.href.match(/[^\=]+/g)[1]);
              let shop = stores_with_location.features.filter(x => x.properties.id === parseInt(q))[0]
              if (!!shop.geometry.coordinates[0] && !!shop.geometry.coordinates[1])
                flyToStore(shop)
            }
          });
        }
      });
  }, []);

  function locateUser() {
    fetch("http://eunoia-bshop.ir:8000/users/profile", {
      method: 'GET',
      headers: {
        "Authorization": "Token " + localStorage.getItem('token')
      }
    }).then(
      res => {
        if (res.status === 200) {
          return res.json()
        }
        return null;
      }
    ).then(
      res => {
        if (res === null)
          return;

        if (res.latitude && res.longitude) {
          let marker = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                res.latitude,
                res.longitude
              ]
            },
            "properties": res
          }
          var el = document.createElement('div');
          el.id = 'user-marker';
          el.className = 'marker user-marker';
          el.innerHTML = `<img src=${res.urls && res.urls.length > 0 ? res.urls[0].uploaded_file : "/profile.png"}>`

          new mapboxgl.Marker(el, { offset: [0, -23] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map.current);
        }
      }
    )
      .catch(e => console.log(e));
  }

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
    if (!!currentFeature.geometry.coordinates[0] && !!currentFeature.geometry.coordinates[1])
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
            <div data-testid="one-shop">
              <div className='map-go-back'>
                <h1 onClick={() => setClickedShop(null)} data-testid="go-back-btn" ><ChevronLeftIcon />بازگشت</h1>
              </div>
              <div className="map-shop">
                <div className="map-shop-header">
                  <div className="img-container">
                    <img data-testid="shop-logo" src={clickedShop.properties.logo ? clickedShop.properties.logo : "/shop-default-logo.png"} alt="logo" />
                  </div>
                  <h2 data-testid="shop-title" onClick={() => window.location.href = `/store/${clickedShop.properties.id}/`}>{clickedShop.properties.title}</h2>
                </div>
                {clickedShop.properties.online ? <p data-testid="shop-online" style={{ color: "green", fontSize: "0.9rem", alignSelf: "center" }}>امکان خرید آنلاین دارد</p> : <p data-testid="shop-not-online" style={{ color: "red", fontSize: "0.9rem", alignSelf: "center" }}>امکان خرید آنلاین ندارد</p>}
                {clickedShop.properties.address && <p data-testid="shop-address" className="address"><LocationOnIcon className="icon" />{clickedShop.properties.address}</p>}
                {clickedShop.properties.shop_phone && <p data-testid="shop-phone" className="phone"><CallIcon className="icon" />{clickedShop.properties.shop_phone}</p>}
                <h3>نظرات</h3>
                <div className="shop-page">
                  <ShopComments shopID={clickedShop.properties.id} userState={"u"} noLikes="true"/>
                </div>
              </div>
            </div>
            :
            <><div className='heading'>
              <h1>فروشگاه‌ها</h1>
            </div>
              <div id='listings' className='listings' data-testid="all-shops-list">
                {stores.features.map(store => {
                  return (
                    <div className="map-list-item" key={store.properties.id} data-testid={"fly-to-shop-"+store.properties.id} onClick={() => flyToStore(store)}>
                      <h2 data-testid={"shop-title-"+store.properties.id}>{store.properties.title}</h2>
                      {!!store.properties.mantaghe && <p data-testid={"shop-mantaghe-"+store.properties.id} className="map-desc">{store.properties.mantaghe} منطقه</p>}
                      <div className="shop-stars">
                        <ReactStars
                          edit={false}
                          value={store.properties.rate_value ? store.properties.rate_value : 0}
                          isHalf={true}
                          classNames="stars"
                          data-testid={"shop-ratings-"+store.properties.id}
                          size={22}
                          activeColor={"var(--primary-color)"}
                        />
                        <p data-testid={"shop-rate-count-"+store.properties.id}>({store.properties.rate_count})</p>
                      </div>
                    </div>
                  )
                })}
                <p className="list-info">تنها فروشگاه‌هایی که مکانشان در نقشه مشخص است در این لیست وجود دارند</p>
              </div></>}
      </div>
      <div ref={mapContainer} className="map" />
    </div>
  )
}

export default MapPage;