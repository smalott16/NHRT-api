//hindcast hits the environment canada weather api for real time streamflow information
//https://api.weather.gc.ca/

const express = require('express');
const router = express.Router();
const downloadRealTimeHindcast = require("../helpers/hindcast-helpers")

module.exports = () => {

  router.get('/:id', (req, res) => {

    const stationID = req.params.id
    console.log(`fetching hourly hindcast for station ${stationID}`)

    downloadRealTimeHindcast(stationID)
      .then((hindcast) => {
        res.send(hindcast);
      })

  })
  return router;
}