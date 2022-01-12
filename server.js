//lod in the .env data into process.env
require("dotenv").config();
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 8080;
const app = express();

//separate the two types of streamflow data routes
const forecastRoutes = require("./routes/forecast");
const hindcastRoutes = require("./routes/hindcast");

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})