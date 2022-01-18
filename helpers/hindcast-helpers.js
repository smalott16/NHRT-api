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
      })
    });

}

const downloadRealtimeHindcast = (stationID) => {

  return axios.get(`https://dd.weather.gc.ca/hydrometric/csv/BC/hourly/BC_${stationID}_hourly_hydrometric.csv`)
    .then((response) => {
      
      //so far most of the data has been 5 minute interval despite being called hourly
      //I expect some data may actually be hourly this
      const rawStreamflowData = response.data.split('\n').slice(1);

      //check the time interval using the first two time readings
      timeIntervalMins = findTimeInterval(rawStreamflowData.slice(0, 2));
      console.log(`Hindcast detected at a ${timeIntervalMins} minute interval`)

      if (timeIntervalMins > 60) {
        throw new Error("time interval is greater than 60 minutes, averaging will not work")
      }

      let streamflowData = {};
      rawStreamflowData.forEach((record) => {
        let recordDate = record.split(',')[1];
        streamflowData[recordDate] = "test";
      })
      return streamflowData;
    
    })
    .catch((error) => {
      console.log(error.message)
    });
}

//downloadRealtimeHindcast('08NL038')

/**
 * Function used to determine what the time interval of the downloaded dataset is
 * Very specifc as it relates to the format of the downloaded data
 * @param {array} timeArray  
 * @returns a number in minutes based on the difference between the two time readings
 */
const findTimeInterval = (timeArray) => {
  //return the time interval in minutes
  
  const interval = timeArray.map((timeRecord) => {
    //parse through the time record to access the actual time interval data
    let parsedTime = timeRecord.split(',')[1].split('T')[1].split(':');
    console.log(parsedTime)
    return Number(parsedTime[0]) * 60 + Number(parsedTime[1]);
  })
  
  return interval[1] + interval[0];
}

module.exports = downloadRealtimeHindcast;