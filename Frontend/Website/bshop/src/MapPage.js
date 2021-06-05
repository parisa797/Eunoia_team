
import React, { useRef, useEffect, useState } from 'react';
import './Map.css';
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
                51.534356,
                35.742913
              ]
            },
            "properties": {
              "phoneFormatted": "(202) 234-7336",
              "phone": "2022347336",
              "address": "1471 P St NW",
              "city": "Washington DC",
              "country": "United States",
              "crossStreet": "at 15th St NW",
              "postalCode": "20005",
              "state": "D.C."
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                -77.043929,
                38.910525
              ]
            },
            "properties": {
              "phoneFormatted": "(202) 387-9338",
              "phone": "2023879338",
              "address": "1512 Connecticut Ave NW",
              "city": "Washington DC",
              "country": "United States",
              "crossStreet": "at Dupont Circle",
              "postalCode": "20036",
              "state": "D.C."
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                -76.933492720127,
                38.99225245786
              ]
            },
            "properties": {
              "address": "8204 Baltimore Ave",
              "city": "College Park",
              "country": "United States",
              "postalCode": "20740",
              "state": "MD"
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                -77.097083330154,
                38.980979
              ]
            },
            "properties": {
              "phoneFormatted": "(301) 654-7336",
              "phone": "3016547336",
              "address": "4831 Bethesda Ave",
              "cc": "US",
              "city": "Bethesda",
              "country": "United States",
              "postalCode": "20814",
              "state": "MD"
            }
          }
        ]
      })
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(35.7007);
    const [lat, setLat] = useState(51.4268);
    const [zoom, setZoom] = useState(9);
    useEffect(() => {
        if (map.current) return; // initialize map only once
        stores.features.forEach(function (store, i) {
            store.properties.id = i;
          });
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style:'mapbox://styles/mapbox/streets-v11', //document.querySelectorAll('[data-theme="d0"]')?'mapbox://styles/mapbox/streets-v11':'mapbox://mapbox-light-v9',
            center: [lat, lng],
            zoom: zoom
        });
    }, []);

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        // map.current.on('move', () => {
        //     setLng(map.current.getCenter().lng.toFixed(4));
        //     setLat(map.current.getCenter().lat.toFixed(4));
        //     setZoom(map.current.getZoom().toFixed(2));
        // });
        map.current.on('load', function (e) {
            /* Add the data to your map as a layer */
            // map.current.addLayer({
            //   "id": "locations",
            //   "type": "circle",
            //   /* Add a GeoJSON source containing place coordinates and information. */
            //   "source": {
            //     "type": "geojson",
            //     "data": stores
            //   }
            // });
            map.current.addSource('places', {
                'type': 'geojson',
                'data': stores
              });
            addMarkers();
          });
    }, []);

    function addMarkers() {
        /* For each feature in the GeoJSON object above: */
        stores.features.forEach(function (marker) {
          /* Create a div element for the marker. */
          var el = document.createElement('div');
          /* Assign a unique `id` to the marker. */
          el.id = 'marker-' + marker.properties.id;
          /* Assign the `marker` class to each marker for styling. */
          el.className = 'marker';
          el.textContent = marker.properties.address
          /**
           * Create a marker using the div element
           * defined above and add it to the map.
           **/
          new mapboxgl.Marker(el, { offset: [0, -23] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map.current);

          /**
           * Listen to the element and when it is clicked, do three things:
           * 1. Fly to the point
           * 2. Close all other popups and display popup for clicked store
           * 3. Highlight listing in sidebar (and remove highlight for all other listings)
           **/
          el.addEventListener('click', function (e) {
            /* Fly to the point */
            flyToStore(marker);
            /* Close all other popups and display popup for clicked store */
            // createPopUp(marker);
            /* Highlight listing in sidebar */
            // var activeItem = document.getElementsByClassName('active');
            // e.stopPropagation();
            // if (activeItem[0]) {
            //   activeItem[0].classList.remove('active');
            // }
            // var listing = document.getElementById(
            //   'listing-' + marker.properties.id
            // );
            // listing.classList.add('active');
          });
        });
      }

    function flyToStore(currentFeature) {
        map.current.flyTo({
          center: currentFeature.geometry.coordinates,
          zoom: 15
        });
      }

    //   function createPopUp(currentFeature) {
    //     var popUps = document.getElementsByClassName('mapboxgl-popup');
    //     /** Check if there is already a popup on the map and if so, remove it */
    //     if (popUps[0]) popUps[0].remove();
      
    //     var popup = new mapboxgl.Popup({ closeOnClick: false })
    //       .setLngLat(currentFeature.geometry.coordinates)
    //       .setHTML('<h3>Sweetgreen</h3>' +
    //         '<h4>' + currentFeature.properties.address + '</h4>')
    //       .addTo(map.current);
    //   }

    return (
        <div className="map-page">
            <div class='sidebar'>
                <div class='heading'>
                    <h1>Our locations</h1>
                </div>
                <div id='listings' class='listings'>
                    {stores.features.map(store=>{
                        return(
                            <div onClick={()=>flyToStore(store)}>{store.properties.phone}</div>
                        )
                    })}
                </div>
            </div>
            <div ref={mapContainer} className="map" />
        </div>
    )
}

export default MapPage;