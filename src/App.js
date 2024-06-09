import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

function App(){
   const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 0,
    longitude: 0,
    zoom: 2
  });

  return(
    <>
     <div className="header">
        <div className="navbar navbar-dark bg-dark">
            <div className="container-fluid">
              <h6 className="mx-auto navbar-brand">
                Global Vaccination Tracker
              </h6>
            </div>
          </div>
     </div>
     <ReactMapGL
    {...viewport}
    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
    onViewportChange={nextViewport => setViewport(nextViewport)}     
    mapStyle="<<your_map_style>>"
    >   
    {dataCountries && Object.values(dataCountries).map((country, index) => {
          return(
            <Marker key={index} latitude={country.countryInfo.lat} longitude={country.countryInfo.long}>
              <div 
              style={{height: country.size, width: country.size}}
              className="map-marker" 
              > 
              </div>
            </Marker>
          )
        })}
 </ReactMapGl>

    </>
    )
  
const url_cases = "https://disease.sh/v3/covid-19/countries"
const url_vaccinations = "https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=1&fullData=false"

const [dataCountries, setDataCountries] = useState({})

useEffect(async() => {
    let full_data =  {}

    let res_items = await Promise.all([ fetch(url_cases), fetch(url_vaccinations) ])

    let data_cases = await res_items[0].json()
    data_cases.map((item) => {
      const {country, countryInfo, cases, deaths, population} = item

      full_data[country] = {country, countryInfo, cases, deaths, population}
    })

    let data_vaccinations = await res_items[1].json()
    data_vaccinations.map((item, index) => {
     if(full_data[item.country]){
       full_data[item.country]['total_vaccinations'] = Object.values(item.timeline)[0]
     }
    })

}, [])

  
    
}


export default App;
