const express = require('express');
const axios = require('axios');
const router = express.Router();

module.exports = () => {

  //display the forecast data
  router.get("/:id", (req, res) => {

    const stationID = req.params.id;
    

  })
}