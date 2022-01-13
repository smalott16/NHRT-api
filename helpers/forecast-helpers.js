const axios = require('axios');

/**
 * @param {string} stationID Water service of canada station id number 
 * IMPORTANT - this only works for station ids in the BC RIVER FORECAST CENTRE list of real time monitoring stations
 */
const fetchForecast = (stationID) => {
  return axios.get(`http://bcrfc.env.gov.bc.ca/freshet/clever/${stationID}.CSV`)
    .then((response) => {
      //parse off the header
      let rawData = response.data.split('\r\n');
      let currentDay = ''

      const endOfHeaderIndex = rawData.indexOf('DATE,HOUR,FORECAST_DISCHARGE,LOWER_BOUND,UPPER_BOUND') + 1;
      let streamflowData = {}

      //parce through the csv file and build a data object 
      rawData.splice(endOfHeaderIndex, rawData.length - endOfHeaderIndex - 1).forEach((data, index) => {
        let hourlyData = data.split(',');
        let hour = hourlyData[1];
        let streamflow = hourlyData.splice(2);
        hourlyData[0] !== '' ? currentDay = hourlyData[0]: currentDay = currentDay
        //console.log(currentDay, hour, streamflow);
        
        if (streamflowData[currentDay]) {
          streamflowData[currentDay][hour] = streamflow;
        } else {
          streamflowData[currentDay] = {[hour] : streamflow};
        }

      });
      
      return streamflowData;
    })
    .catch(err => console.log(err.message, "make sure your station id is a valid real time station within the list of BCRFC stations"))

};

module.exports = fetchForecast;
