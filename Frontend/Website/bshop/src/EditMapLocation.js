
import React, { useRef, useEffect, useState } from 'react';
import mapPointer from './medias/pointer.jpg';
import './Map.css';
function EditMapLocation(props) {
  var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

  mapboxgl.accessToken = 'pk.eyJ1IjoiZXVub2lhNnRlYW0iLCJhIjoiY2twaW1pc29oMGc5NjJ1b2ZmMGdiNWkweCJ9.6KH84Su77toujLB9IU4wTQ';

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(35.7007);
  const [lat, setLat] = useState(51.4268);
  const [zoom, setZoom] = useState(9);
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

  useEffect(() => {
    if (!map.current) return;
    map.current.on('load', function (e) {
      map.current.on('click', function(e) {
        var coordinates = [...e.lngLat.toArray()];
        console.log(coordinates);
        props.setPoint(coordinates);
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`<p class="popup-text">این نقطه انتخاب شد</p><div class="popup-btn" id="popupbtn">ذخیره و بازگشت</div>`)
          .addTo(map.current);

        let btn = document.getElementById("popupbtn");
        btn.onclick = ()=>props.submitLocation();
        btn.removeAttribute('id');

      });
    });
  }, []);

  return (
      <div ref={mapContainer} className="map" />
  )
}

export default EditMapLocation;