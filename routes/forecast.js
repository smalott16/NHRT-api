//forecast hits the 10 day CLEVER forecast csv url
//http://bcrfc.env.gov.bc.ca/freshet/map_clever.html

const express = require('express');
const router = express.Router();
const fetchForecast = require ('../helpers/forecast-helpers');

module.exports = () => {

  //display the forecast data - currently there is no path for retrieving all data, only works for specific id
  router.get("/:id", (req, res) => {

    const stationID = req.params.id;
    console.log(`fetching 10 day CLEVER forecast for ${stationID}\n`)

    fetchForecast(stationID)
      .then((forecast) => {
        //data is made up of 10 days worth of streamflow data each containing 24 hourly projections
        res.send(forecast);
      })

  })

  return router;
}
