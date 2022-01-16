const axios = require('axios');

/**
 * @param {string} stationID Water service of canada station id number 
 * @param {string} timeInterval optional argument used to determine how data are aggregated, undefined/default = no averaging, h = hourly average, d = daily average
 */
const fetchRealtimeHindcast = (stationID, timeInterval) => {

  if (timeInterval && (timeInterval !== 'h' || timeInterval !== 'd')) {
    console.log('invalid timeInterval argument, must be undefined, h or d.')
    return;
  }

  let streamflowData= {};

  axios.get(`https://api.weather.gc.ca/collections/hydrometric-realtime/items/?STATION_NUMBER=${stationID}`)
    .then((response) => {
      //array of objects representing data points every five minutes
      let fiveMinuteDataArray = response.data.features;

      //build a data object for 
      fiveMinuteDataArray.forEach((element) => {
        let dateTimeInfo = element.id.split('.');
        console.log(dateTimeInfo[1], dateTimeInfo[2]);
        //console.log(element.properties.DISCHARGE)
      })
    });

}

const downloadRealtimeHindcast = (stationID) => {

  axios.get(`https://dd.weather.gc.ca/hydrometric/csv/BC/hourly/BC_${stationID}_hourly_hydrometric.csv`)
    .then((response) => {
      
      //so far most of the data has been 5 minute interval despite being called hourly
      //I expect some data may actually be hourly this
      const rawStreamflowData = response.data.split('\n').slice(1);

      let streamflowData = {};

      
      console.log(rawStreamflowData); 
    });

}

downloadRealtimeHindcast('08NL038')

const findtimeInterval = (time1, time2) => {
  //return the time interval in minutes

}

module.exports = fetchRealtimeHindcast;