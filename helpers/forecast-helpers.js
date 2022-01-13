const axios = require('axios');

const fetchForecast = (stationID) => {
  return axios.get(`http://bcrfc.env.gov.bc.ca/freshet/clever/${stationID}.CSV`)
    .then((response) => {
      //parse off the header
      let rawData = response.data.split('\r\n');
      let currentDay = ''

      const endOfHeaderIndex = rawData.indexOf('DATE,HOUR,FORECAST_DISCHARGE,LOWER_BOUND,UPPER_BOUND') + 1;
      let streamflowData = {}
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
    .catch(err => console.log(err.message))

};

module.exports = fetchForecast;
