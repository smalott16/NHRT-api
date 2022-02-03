//lod in the .env data into process.env
require("dotenv").config();
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(morgan("dev"));

//separate the two types of streamflow data routes
const forecastRoutes = require("./routes/forecast");
const hindcastRoutes = require("./routes/hindcast");

app.use("/forecast", forecastRoutes());
app.use("/hindcast", hindcastRoutes());

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})

module.exports = app;