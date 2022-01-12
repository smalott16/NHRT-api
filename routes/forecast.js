const express = require('express');
const router = express.Router();
const axios = require('axios');
const fetchForecast = require ('../helpers/forecast-helpers');

module.exports = () => {

  //display the forecast data
  router.get("/:id", (req, res) => {

    const stationID = req.params.id;
    console.log(`fetching 10 day CLEVER forecast for ${stationID}\n`)
    fetchForecast(stationID)
      .then((forecast) => {
        console.log(forecast.data);
      })

  })

  return router;
}
